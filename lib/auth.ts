import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "./db";

// ─────────────────────────────────────────────────────────────────────────────
// Authentification du back-office.
//
// Session opaque : un jeton aléatoire dans un cookie httpOnly, dont seule
// l'empreinte est en base. Révocable instantanément (déconnexion, compte
// désactivé), sans secret de signature à gérer sur le serveur.
//
// Mots de passe : scrypt (node:crypto), aucune dépendance native de plus.
// Pas de création de compte libre : uniquement par invitation.
// ─────────────────────────────────────────────────────────────────────────────

export const SESSION_COOKIE = "lc_session";
const SESSION_DAYS = 14;
const INVITATION_HOURS = 72;
export const PASSWORD_MIN = 10;

export type Role = "admin" | "editeur";

export type Utilisateur = {
  id: number;
  email: string;
  nom: string;
  role: Role;
  actif: number;
  derniere_connexion_le: string | null;
  cree_le: string;
};

export type Invitation = { email: string; nom: string; role: Role; expire_le: string };

const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
const nowIso = () => new Date().toISOString();

/* Mots de passe -------------------------------------------------------------- */

const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64, SCRYPT);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [algo, N, r, p, salt, hash] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = crypto.scryptSync(password, Buffer.from(salt, "base64"), expected.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
    maxmem: SCRYPT.maxmem,
  });
  return crypto.timingSafeEqual(expected, actual);
}

export function passwordProblem(password: string): string | null {
  if (password.length < PASSWORD_MIN) return `Le mot de passe doit contenir au moins ${PASSWORD_MIN} caractères.`;
  if (password.length > 200) return "Le mot de passe est trop long.";
  return null;
}

/* Sessions --------------------------------------------------------------------- */

export function createSession(userId: number) {
  const token = crypto.randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE expire_le < ?").run(nowIso());
  db.prepare("INSERT INTO sessions (jeton_hash, utilisateur_id, expire_le) VALUES (?, ?, ?)").run(sha256(token), userId, expires.toISOString());
  db.prepare("UPDATE utilisateurs SET derniere_connexion_le = datetime('now') WHERE id = ?").run(userId);
  return { token, expires };
}

export function userFromToken(token: string | undefined): Utilisateur | null {
  if (!token) return null;
  const row = getDb()
    .prepare(
      `SELECT u.id, u.email, u.nom, u.role, u.actif, u.derniere_connexion_le, u.cree_le
       FROM sessions s JOIN utilisateurs u ON u.id = s.utilisateur_id
       WHERE s.jeton_hash = ? AND s.expire_le > ? AND u.actif = 1`,
    )
    .get(sha256(token), nowIso()) as Utilisateur | undefined;
  return row ?? null;
}

export function destroySession(token: string | undefined) {
  if (token) getDb().prepare("DELETE FROM sessions WHERE jeton_hash = ?").run(sha256(token));
}

export function destroyUserSessions(userId: number, exceptToken?: string) {
  getDb()
    .prepare("DELETE FROM sessions WHERE utilisateur_id = ? AND jeton_hash != ?")
    .run(userId, exceptToken ? sha256(exceptToken) : "");
}

/** Utilisateur connecté (pages serveur du back-office). */
export async function currentUser(): Promise<Utilisateur | null> {
  const store = await cookies();
  return userFromToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireUser(): Promise<Utilisateur> {
  const user = await currentUser();
  if (!user) redirect("/admin/connexion/");
  return user;
}

export async function requireAdmin(): Promise<Utilisateur> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin/");
  return user;
}

/** Derrière nginx, la requête arrive en HTTP : on se fie à X-Forwarded-Proto. */
export function cookieOptions(req: Request, expires?: Date) {
  const secure = process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : req.headers.get("x-forwarded-proto") === "https" || new URL(req.url).protocol === "https:";
  return { httpOnly: true, secure, sameSite: "lax" as const, path: "/", expires };
}

/* Comptes ------------------------------------------------------------------------ */

export function findUserByEmail(email: string) {
  return getDb().prepare("SELECT * FROM utilisateurs WHERE email = ?").get(email.trim()) as
    | (Utilisateur & { mot_de_passe_hash: string })
    | undefined;
}

export function listUsers(): Utilisateur[] {
  return getDb()
    .prepare("SELECT id, email, nom, role, actif, derniere_connexion_le, cree_le FROM utilisateurs ORDER BY actif DESC, nom")
    .all() as Utilisateur[];
}

export function setPassword(userId: number, password: string) {
  getDb().prepare("UPDATE utilisateurs SET mot_de_passe_hash = ? WHERE id = ?").run(hashPassword(password), userId);
}

export function checkPassword(userId: number, password: string): boolean {
  const row = getDb().prepare("SELECT mot_de_passe_hash FROM utilisateurs WHERE id = ?").get(userId) as
    | { mot_de_passe_hash: string }
    | undefined;
  return !!row && verifyPassword(password, row.mot_de_passe_hash);
}

export function setUserActive(userId: number, active: boolean) {
  const db = getDb();
  db.prepare("UPDATE utilisateurs SET actif = ? WHERE id = ?").run(active ? 1 : 0, userId);
  if (!active) db.prepare("DELETE FROM sessions WHERE utilisateur_id = ?").run(userId);
}

/* Invitations ---------------------------------------------------------------------- */

export function createInvitation(email: string, nom: string, role: Role, createdBy: number | null): string {
  const token = crypto.randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + INVITATION_HOURS * 3_600_000).toISOString();
  const db = getDb();
  db.prepare("DELETE FROM invitations WHERE email = ? AND utilisee_le IS NULL").run(email.trim());
  db.prepare("INSERT INTO invitations (jeton_hash, email, nom, role, cree_par, expire_le) VALUES (?, ?, ?, ?, ?, ?)").run(
    sha256(token),
    email.trim(),
    nom.trim(),
    role,
    createdBy,
    expires,
  );
  return token;
}

export function findInvitation(token: string | undefined): Invitation | null {
  if (!token) return null;
  const row = getDb()
    .prepare("SELECT email, nom, role, expire_le FROM invitations WHERE jeton_hash = ? AND utilisee_le IS NULL AND expire_le > ?")
    .get(sha256(token), nowIso()) as Invitation | undefined;
  return row ?? null;
}

/** Crée le compte, ou remplace le mot de passe s'il existe déjà. Renvoie l'id. */
export function acceptInvitation(token: string, nom: string, password: string): number {
  const db = getDb();
  const invitation = findInvitation(token);
  if (!invitation) throw new Error("Ce lien n'est plus valable. Demandez une nouvelle invitation.");
  return db.transaction(() => {
    const existing = findUserByEmail(invitation.email);
    let id: number;
    if (existing) {
      db.prepare("UPDATE utilisateurs SET nom = ?, mot_de_passe_hash = ?, actif = 1 WHERE id = ?").run(nom || existing.nom, hashPassword(password), existing.id);
      db.prepare("DELETE FROM sessions WHERE utilisateur_id = ?").run(existing.id);
      id = existing.id;
    } else {
      id = Number(
        db
          .prepare("INSERT INTO utilisateurs (email, nom, mot_de_passe_hash, role) VALUES (?, ?, ?, ?)")
          .run(invitation.email, nom || invitation.nom || invitation.email, hashPassword(password), invitation.role).lastInsertRowid,
      );
    }
    db.prepare("UPDATE invitations SET utilisee_le = datetime('now') WHERE jeton_hash = ?").run(sha256(token));
    return id;
  })();
}
