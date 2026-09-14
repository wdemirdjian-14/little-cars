import "server-only";
import { getDb } from "./db";

export const STATUTS = ["nouveau", "en_cours", "traite", "archive"] as const;
export type Statut = (typeof STATUTS)[number];

export const STATUT_LABEL: Record<Statut, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  traite: "Traité",
  archive: "Archivé",
};

export const SOURCE_LABEL: Record<string, string> = {
  widget: "Widget de contact",
  contact: "Page contact",
  sav: "Demande de SAV",
  devis: "Demande de devis",
};

export type Message = {
  id: number;
  source: string;
  statut: Statut;
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  corps: string;
  champs: string;
  page: string;
  note: string;
  lu_le: string | null;
  cree_le: string;
  modifie_le: string;
};

export type Reponse = {
  id: number;
  message_id: number;
  auteur: string | null;
  sujet: string;
  corps: string;
  envoyee: number;
  erreur: string | null;
  cree_le: string;
};

export function createMessage(m: Pick<Message, "source" | "nom" | "email" | "telephone" | "sujet" | "corps" | "page"> & { champs: Record<string, string> }) {
  return Number(
    getDb()
      .prepare("INSERT INTO messages (source, nom, email, telephone, sujet, corps, champs, page) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(m.source, m.nom, m.email, m.telephone, m.sujet, m.corps, JSON.stringify(m.champs), m.page).lastInsertRowid,
  );
}

export function listMessages({ statut, q, limit = 50 }: { statut?: Statut | "tous"; q?: string; limit?: number }) {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (statut && statut !== "tous") {
    where.push("m.statut = ?");
    args.push(statut);
  } else {
    where.push("m.statut != 'archive'");
  }
  if (q?.trim()) {
    where.push("(m.nom LIKE ? OR m.email LIKE ? OR m.sujet LIKE ? OR m.corps LIKE ? OR m.telephone LIKE ?)");
    const like = `%${q.trim()}%`;
    args.push(like, like, like, like, like);
  }
  return getDb()
    .prepare(
      `SELECT m.*, (SELECT COUNT(*) FROM reponses r WHERE r.message_id = m.id) AS nb_reponses
       FROM messages m WHERE ${where.join(" AND ")} ORDER BY m.id DESC LIMIT ?`,
    )
    .all(...args, limit) as (Message & { nb_reponses: number })[];
}

export function countByStatut(): Record<Statut, number> {
  const rows = getDb().prepare("SELECT statut, COUNT(*) AS n FROM messages GROUP BY statut").all() as { statut: Statut; n: number }[];
  const out = { nouveau: 0, en_cours: 0, traite: 0, archive: 0 };
  for (const r of rows) out[r.statut] = r.n;
  return out;
}

export function getMessage(id: number) {
  const db = getDb();
  const message = db.prepare("SELECT * FROM messages WHERE id = ?").get(id) as Message | undefined;
  if (!message) return null;
  const reponses = db
    .prepare(
      `SELECT r.*, u.nom AS auteur FROM reponses r LEFT JOIN utilisateurs u ON u.id = r.auteur_id
       WHERE r.message_id = ? ORDER BY r.id`,
    )
    .all(id) as Reponse[];
  return { message, reponses, champs: JSON.parse(message.champs || "{}") as Record<string, string> };
}

export function markRead(id: number) {
  getDb().prepare("UPDATE messages SET lu_le = datetime('now') WHERE id = ? AND lu_le IS NULL").run(id);
}

export function updateMessage(id: number, patch: { statut?: Statut; note?: string }) {
  const db = getDb();
  if (patch.statut) db.prepare("UPDATE messages SET statut = ?, modifie_le = datetime('now') WHERE id = ?").run(patch.statut, id);
  if (patch.note !== undefined) db.prepare("UPDATE messages SET note = ?, modifie_le = datetime('now') WHERE id = ?").run(patch.note, id);
}

export function addReponse(r: { messageId: number; auteurId: number; sujet: string; corps: string; envoyee: boolean; erreur: string | null }) {
  const db = getDb();
  db.transaction(() => {
    db.prepare("INSERT INTO reponses (message_id, auteur_id, sujet, corps, envoyee, erreur) VALUES (?, ?, ?, ?, ?, ?)").run(
      r.messageId,
      r.auteurId,
      r.sujet,
      r.corps,
      r.envoyee ? 1 : 0,
      r.erreur,
    );
    // Répondre fait passer un message nouveau en « en cours ».
    db.prepare("UPDATE messages SET statut = 'en_cours', modifie_le = datetime('now') WHERE id = ? AND statut = 'nouveau'").run(r.messageId);
  })();
}

export function recentUnhandled(limit = 5) {
  return getDb()
    .prepare("SELECT id, source, nom, sujet, corps, cree_le, lu_le FROM messages WHERE statut IN ('nouveau','en_cours') ORDER BY id DESC LIMIT ?")
    .all(limit) as Pick<Message, "id" | "source" | "nom" | "sujet" | "corps" | "cree_le" | "lu_le">[];
}

export function messagesBySource(from: string, to: string) {
  return getDb()
    .prepare(
      `SELECT source AS label, COUNT(*) AS n FROM messages
       WHERE date(cree_le, 'localtime') BETWEEN ? AND ? GROUP BY source ORDER BY n DESC`,
    )
    .all(from, to) as { label: string; n: number }[];
}
