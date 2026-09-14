import "server-only";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, userFromToken, type Utilisateur } from "./auth";

export function json(status: number, body: object) {
  return Response.json(body, { status });
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "inconnue";
}

// Limitation de débit en mémoire : suffisant pour un process PM2 unique, et
// aucune IP n'est écrite en base.
const compteurs = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recents = (compteurs.get(key) ?? []).filter((t) => t > now - windowMs);
  const limited = recents.length >= limit;
  if (!limited) recents.push(now);
  compteurs.set(key, recents);
  if (compteurs.size > 5000) {
    for (const [k, v] of compteurs) if (!v.some((t) => t > now - windowMs)) compteurs.delete(k);
  }
  return limited;
}

/**
 * Protection CSRF des routes du back-office : le cookie de session est
 * SameSite=Lax, et toute écriture doit en plus venir du même site.
 */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

type Handler<C> = (req: NextRequest, user: Utilisateur, ctx: C) => Promise<Response>;

/** Enveloppe d'une route d'API du back-office : session, rôle, origine. */
export function adminRoute<C>(handler: Handler<C>, options: { role?: "admin" } = {}) {
  return async (req: NextRequest, ctx: C): Promise<Response> => {
    const user = userFromToken(req.cookies.get(SESSION_COOKIE)?.value);
    if (!user) return json(401, { error: "Session expirée : reconnectez-vous." });
    if (options.role && user.role !== options.role) return json(403, { error: "Action réservée aux administrateurs." });
    if (req.method !== "GET" && !sameOrigin(req)) return json(403, { error: "Requête refusée (origine inattendue)." });
    try {
      return await handler(req, user, ctx);
    } catch (err) {
      if (err instanceof UserError) return json(err.status, { error: err.message });
      console.error("[admin]", req.method, req.nextUrl.pathname, err);
      return json(500, { error: "Erreur inattendue côté serveur." });
    }
  };
}

/** Erreur dont le message peut être montré tel quel à l'utilisateur. */
export class UserError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
