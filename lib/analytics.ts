import "server-only";
import crypto from "node:crypto";
import { getDb } from "./db";
import { clientIp } from "./http";

// ─────────────────────────────────────────────────────────────────────────────
// Mesure d'audience maison, sans cookie.
//
//  • visiteur = SHA-256(sel du jour + IP + navigateur), tronqué. Le sel change
//    chaque jour et est supprimé après 48 h : impossible de suivre quelqu'un
//    d'un jour à l'autre ni de retrouver une IP.
//  • conséquence assumée : « visiteurs » sur une période = somme des visiteurs
//    uniques de chaque jour (même méthode que Plausible).
//  • conservation 25 mois, robots et comptes du back-office exclus.
// ─────────────────────────────────────────────────────────────────────────────

const RETENTION_MS = 25 * 30 * 86_400_000;

const dayFormat = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" });

export const parisDay = (ts = Date.now()) => dayFormat.format(ts);

export function dayOffset(day: string, delta: number): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

const BOT = /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|preview|monitor|uptime|pingdom|lighthouse|pagespeed|headless|phantom|curl|wget|python|axios|node-fetch|go-http|java\//i;

export const isBot = (ua: string) => !ua || BOT.test(ua);

function saltFor(day: string): string {
  const db = getDb();
  const row = db.prepare("SELECT sel FROM sels WHERE jour = ?").get(day) as { sel: string } | undefined;
  if (row) return row.sel;
  const sel = crypto.randomBytes(24).toString("hex");
  db.prepare("INSERT OR IGNORE INTO sels (jour, sel) VALUES (?, ?)").run(day, sel);
  db.prepare("DELETE FROM sels WHERE jour < ?").run(dayOffset(day, -1));
  return (db.prepare("SELECT sel FROM sels WHERE jour = ?").get(day) as { sel: string }).sel;
}

function visitorId(req: Request, day: string): string {
  const ua = req.headers.get("user-agent") ?? "";
  return crypto.createHash("sha256").update(`${saltFor(day)}|${clientIp(req)}|${ua}`).digest("hex").slice(0, 20);
}

export function parseUserAgent(ua: string) {
  const appareil = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua) ? "tablette" : /Mobi|iPhone|iPod|Android/i.test(ua) ? "mobile" : "ordinateur";
  const navigateur = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /SamsungBrowser/.test(ua)
        ? "Samsung Internet"
        : /Firefox|FxiOS/.test(ua)
          ? "Firefox"
          : /Chrome|CriOS/.test(ua)
            ? "Chrome"
            : /Safari/.test(ua)
              ? "Safari"
              : "Autre";
  const systeme = /Windows/.test(ua)
    ? "Windows"
    : /iPhone|iPad|iPod/.test(ua)
      ? "iOS"
      : /Mac OS X/.test(ua)
        ? "macOS"
        : /Android/.test(ua)
          ? "Android"
          : /Linux/.test(ua)
            ? "Linux"
            : "Autre";
  return { appareil, navigateur, systeme };
}

const cleanPath = (p: unknown) => {
  const s = String(p ?? "").split(/[?#]/)[0].slice(0, 300);
  return s.startsWith("/") ? s : "/";
};

export function recordVisit(req: Request, input: { path: unknown; referrer?: unknown; search?: unknown }) {
  const ts = Date.now();
  const day = parisDay(ts);
  const ua = req.headers.get("user-agent") ?? "";
  const { appareil, navigateur, systeme } = parseUserAgent(ua);

  let referent = "";
  try {
    const host = new URL(String(input.referrer ?? "")).host.replace(/^www\./, "");
    const own = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").replace(/^www\./, "");
    if (host && host !== own) referent = host.slice(0, 120);
  } catch {
    // référent absent ou illisible
  }

  const params = new URLSearchParams(String(input.search ?? "").slice(0, 500));
  const utm = (k: string) => (params.get(k) ?? "").slice(0, 80);

  const db = getDb();
  db.prepare(
    `INSERT INTO visites (ts, jour, visiteur, chemin, referent, utm_source, utm_medium, utm_campagne, appareil, navigateur, systeme)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(ts, day, visitorId(req, day), cleanPath(input.path), referent, utm("utm_source"), utm("utm_medium"), utm("utm_campaign"), appareil, navigateur, systeme);

  if (Math.random() < 0.002) {
    db.prepare("DELETE FROM visites WHERE ts < ?").run(ts - RETENTION_MS);
    db.prepare("DELETE FROM evenements WHERE ts < ?").run(ts - RETENTION_MS);
  }
}

export const EVENT_TYPES = ["demande", "widget_ouvert", "appel", "email", "pdf", "video"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export function recordEvent(req: Request, type: EventType, libelle = "", chemin: unknown = "") {
  const ts = Date.now();
  const day = parisDay(ts);
  getDb()
    .prepare("INSERT INTO evenements (ts, jour, visiteur, type, libelle, chemin) VALUES (?, ?, ?, ?, ?, ?)")
    .run(ts, day, visitorId(req, day), type, String(libelle).slice(0, 160), cleanPath(chemin));
}

/* Lecture pour le tableau de bord ------------------------------------------------ */

export type Period = { from: string; to: string; days: number };

export function periodOf(days: number): { current: Period; previous: Period } {
  const to = parisDay();
  const from = dayOffset(to, -(days - 1));
  return {
    current: { from, to, days },
    previous: { from: dayOffset(from, -days), to: dayOffset(from, -1), days },
  };
}

type Count = { label: string; n: number };

export function audienceTotals(p: Period) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT COUNT(*) AS vues, COUNT(DISTINCT jour || visiteur) AS visiteurs
       FROM visites WHERE jour BETWEEN ? AND ?`,
    )
    .get(p.from, p.to) as { vues: number; visiteurs: number };
  const demandes = (
    db.prepare("SELECT COUNT(*) AS n FROM messages WHERE date(cree_le, 'localtime') BETWEEN ? AND ?").get(p.from, p.to) as { n: number }
  ).n;
  return { ...row, demandes, conversion: row.visiteurs ? demandes / row.visiteurs : 0 };
}

export function dailySeries(p: Period) {
  const rows = getDb()
    .prepare(
      `SELECT jour, COUNT(*) AS vues, COUNT(DISTINCT visiteur) AS visiteurs
       FROM visites WHERE jour BETWEEN ? AND ? GROUP BY jour`,
    )
    .all(p.from, p.to) as { jour: string; vues: number; visiteurs: number }[];
  const byDay = new Map(rows.map((r) => [r.jour, r]));
  return Array.from({ length: p.days }, (_, i) => {
    const jour = dayOffset(p.from, i);
    const r = byDay.get(jour);
    return { jour, vues: r?.vues ?? 0, visiteurs: r?.visiteurs ?? 0 };
  });
}

function top(sql: string, p: Period, limit: number): Count[] {
  return getDb().prepare(sql).all(p.from, p.to, limit) as Count[];
}

export const topPages = (p: Period, limit = 10) =>
  top(
    `SELECT chemin AS label, COUNT(DISTINCT jour || visiteur) AS n FROM visites
     WHERE jour BETWEEN ? AND ? GROUP BY chemin ORDER BY n DESC LIMIT ?`,
    p,
    limit,
  );

export const topSources = (p: Period, limit = 8) =>
  top(
    `SELECT CASE
        WHEN utm_source != '' THEN utm_source || CASE WHEN utm_medium != '' THEN ' / ' || utm_medium ELSE '' END
        WHEN referent != '' THEN referent
        ELSE 'Accès direct' END AS label,
      COUNT(DISTINCT jour || visiteur) AS n
     FROM (SELECT jour, visiteur, referent, utm_source, utm_medium, MIN(ts) FROM visites
           WHERE jour BETWEEN ? AND ? GROUP BY jour, visiteur)
     GROUP BY label ORDER BY n DESC LIMIT ?`,
    p,
    limit,
  );

export const devices = (p: Period) =>
  top(
    `SELECT appareil AS label, COUNT(DISTINCT jour || visiteur) AS n FROM visites
     WHERE jour BETWEEN ? AND ? GROUP BY appareil ORDER BY n DESC LIMIT ?`,
    p,
    3,
  );

export const browsers = (p: Period, limit = 6) =>
  top(
    `SELECT navigateur AS label, COUNT(DISTINCT jour || visiteur) AS n FROM visites
     WHERE jour BETWEEN ? AND ? GROUP BY navigateur ORDER BY n DESC LIMIT ?`,
    p,
    limit,
  );

export function eventCounts(p: Period): Record<EventType, number> {
  const rows = getDb()
    .prepare("SELECT type, COUNT(*) AS n FROM evenements WHERE jour BETWEEN ? AND ? GROUP BY type")
    .all(p.from, p.to) as { type: EventType; n: number }[];
  const out = Object.fromEntries(EVENT_TYPES.map((t) => [t, 0])) as Record<EventType, number>;
  for (const r of rows) out[r.type] = r.n;
  return out;
}

export const topDownloads = (p: Period, limit = 6) =>
  top(
    `SELECT libelle AS label, COUNT(*) AS n FROM evenements
     WHERE jour BETWEEN ? AND ? AND type = 'pdf' GROUP BY libelle ORDER BY n DESC LIMIT ?`,
    p,
    limit,
  );

export const conversionPages = (p: Period, limit = 6) =>
  top(
    `SELECT chemin AS label, COUNT(*) AS n FROM evenements
     WHERE jour BETWEEN ? AND ? AND type = 'demande' GROUP BY chemin ORDER BY n DESC LIMIT ?`,
    p,
    limit,
  );

export function liveVisitors(): number {
  return (
    getDb()
      .prepare("SELECT COUNT(DISTINCT visiteur) AS n FROM visites WHERE ts > ?")
      .get(Date.now() - 5 * 60_000) as { n: number }
  ).n;
}
