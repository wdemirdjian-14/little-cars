import type { NextRequest } from "next/server";
import { EVENT_TYPES, isBot, recordEvent, recordVisit, type EventType } from "@/lib/analytics";
import { SESSION_COOKIE } from "@/lib/auth";
import { clientIp, isRateLimited } from "@/lib/http";

/**
 * Collecte d'audience. Répond toujours 204, même en cas de rejet : un
 * robot n'apprend rien, et le site ne dépend jamais de la mesure.
 */
export async function POST(req: NextRequest) {
  const done = () => new Response(null, { status: 204 });
  const ua = req.headers.get("user-agent") ?? "";
  // Robots et membres de l'équipe connectés au back-office ne comptent pas.
  if (isBot(ua) || req.cookies.has(SESSION_COOKIE)) return done();
  if (isRateLimited(`audience:${clientIp(req)}`, 120, 60_000)) return done();

  const raw = await req.text();
  if (raw.length > 2000) return done();
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return done();
  }

  try {
    if (typeof body.e === "string") {
      // « demande » n'est enregistré que par /api/demande, après validation.
      if (body.e !== "demande" && (EVENT_TYPES as readonly string[]).includes(body.e)) {
        recordEvent(req, body.e as EventType, String(body.l ?? ""), body.p);
      }
    } else {
      recordVisit(req, { path: body.p, referrer: body.r, search: body.q });
    }
  } catch (err) {
    console.error("[audience]", err);
  }
  return done();
}
