import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, cookieOptions, createSession, destroySession, findUserByEmail, verifyPassword } from "@/lib/auth";
import { clientIp, isRateLimited, json, sameOrigin } from "@/lib/http";

/** Connexion. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json(403, { error: "Requête refusée (origine inattendue)." });
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.motDePasse ?? "");

  if (isRateLimited(`connexion:ip:${clientIp(req)}`, 20, 15 * 60_000) || isRateLimited(`connexion:email:${email}`, 6, 15 * 60_000)) {
    return json(429, { error: "Trop de tentatives de connexion. Réessayez dans 15 minutes." });
  }

  const user = email ? findUserByEmail(email) : undefined;
  if (!user || !user.actif || !verifyPassword(password, user.mot_de_passe_hash)) {
    return json(401, { error: "E-mail ou mot de passe incorrect." });
  }

  const { token, expires } = createSession(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions(req, expires));
  return res;
}

/** Déconnexion. */
export async function DELETE(req: NextRequest) {
  destroySession(req.cookies.get(SESSION_COOKIE)?.value);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", cookieOptions(req, new Date(0)));
  return res;
}
