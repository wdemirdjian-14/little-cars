import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, acceptInvitation, cookieOptions, createSession, passwordProblem } from "@/lib/auth";
import { clientIp, isRateLimited, json, sameOrigin } from "@/lib/http";

/** Activation d'une invitation (ou réinitialisation) : choix du mot de passe. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json(403, { error: "Requête refusée (origine inattendue)." });
  if (isRateLimited(`activation:${clientIp(req)}`, 10, 15 * 60_000)) return json(429, { error: "Trop de tentatives. Réessayez plus tard." });

  const body = await req.json().catch(() => ({}));
  const password = String(body.motDePasse ?? "");
  const problem = passwordProblem(password);
  if (problem) return json(400, { error: problem });

  let userId: number;
  try {
    userId = acceptInvitation(String(body.jeton ?? ""), String(body.nom ?? "").trim().slice(0, 120), password);
  } catch (err) {
    return json(400, { error: (err as Error).message });
  }

  const { token, expires } = createSession(userId);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions(req, expires));
  return res;
}
