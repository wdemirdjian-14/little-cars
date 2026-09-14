import fs from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import { forms, type FormId } from "@/content/forms";

/**
 * Réception des formulaires. Chaque demande valide est ajoutée à
 * DATA_DIR/demandes.jsonl (le futur back-office les reprendra) puis envoyée
 * par e-mail si SMTP_HOST est configuré.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(status: number, body: object) {
  return Response.json(body, { status });
}

function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "La demande n'a pas pu être lue." });
  }

  const id = String(body.formulaire ?? "") as FormId;
  const def = forms[id];
  if (!def) return json(400, { error: "Formulaire inconnu." });

  // Robots : on répond comme si tout allait bien, sans rien enregistrer.
  if (String(body.site_web ?? "").trim() || Number(body.duree_ms) < 2500) return json(200, { ok: true });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue";
  if (tooMany(ip)) return json(429, { error: "Trop de demandes envoyées en peu de temps. Patientez quelques minutes." });

  const values: Record<string, string> = {};
  const missing: string[] = [];
  for (const f of def.fields) {
    const v = String(body[f.name] ?? "")
      .trim()
      .slice(0, f.type === "textarea" ? 4000 : 200);
    if (f.required && !v) missing.push(f.label);
    if (f.type === "email" && v && !EMAIL.test(v)) return json(400, { error: "L'adresse e-mail n'est pas valide." });
    if (f.type === "select" && v && f.options && !f.options.includes(v)) return json(400, { error: `Valeur inattendue pour « ${f.label} ».` });
    values[f.name] = v;
  }
  if (missing.length) return json(400, { error: `Merci de renseigner : ${missing.join(", ")}.` });

  const record = { date: new Date().toISOString(), formulaire: id, page: String(body.page ?? "").slice(0, 200), ...values };

  const dir = process.env.DATA_DIR || path.join(process.cwd(), "data");
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(path.join(dir, "demandes.jsonl"), JSON.stringify(record) + "\n", "utf8");
  } catch (err) {
    console.error("[demande] enregistrement impossible", err);
    return json(500, { error: "La demande n'a pas pu être enregistrée." });
  }

  if (process.env.SMTP_HOST) {
    try {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      });
      const lines = def.fields.map((f) => `${f.label} : ${values[f.name] || "—"}`);
      await transport.sendMail({
        from: process.env.MAIL_FROM || "Site Little <no-reply@little-cars.fr>",
        to: process.env.MAIL_TO || "contact@little-cars.fr",
        replyTo: values.email,
        subject: `[Site] ${def.title} — ${values.prenom} ${values.nom}`,
        text: [`Nouvelle demande « ${id} » depuis ${record.page || "le site"}`, "", ...lines, "", `Reçue le ${record.date}`].join("\n"),
      });
    } catch (err) {
      // La demande est déjà enregistrée : on ne fait pas échouer le visiteur.
      console.error("[demande] envoi e-mail impossible", err);
    }
  }

  return json(200, { ok: true });
}
