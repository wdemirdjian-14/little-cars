import { forms, type FormId } from "@/content/forms";
import { recordEvent } from "@/lib/analytics";
import { clientIp, isRateLimited, json } from "@/lib/http";
import { mailConfigured, notificationAddress, sendMail } from "@/lib/mailer";
import { SOURCE_LABEL, createMessage } from "@/lib/messages";
import { SITE_URL } from "@/lib/seo";

/**
 * Réception des formulaires (contact, SAV, devis, widget). Chaque demande
 * valide arrive dans la boîte de réception du back-office, puis une
 * notification est envoyée par e-mail si le SMTP est configuré.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "La demande n'a pas pu être lue." });
  }

  const formId = String(body.formulaire ?? "") as FormId;
  const def = forms[formId];
  if (!def) return json(400, { error: "Formulaire inconnu." });

  // Robots : réponse positive, rien d'enregistré.
  if (String(body.site_web ?? "").trim() || Number(body.duree_ms) < 2500) return json(200, { ok: true });

  if (isRateLimited(`demande:${clientIp(req)}`, 5, 10 * 60_000)) {
    return json(429, { error: "Trop de demandes envoyées en peu de temps. Patientez quelques minutes." });
  }

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

  const page = String(body.page ?? "").slice(0, 200);
  const nom = [values.prenom, values.nom].filter(Boolean).join(" ");

  let id: number;
  try {
    id = createMessage({
      source: formId,
      nom,
      email: values.email ?? "",
      telephone: values.telephone ?? "",
      sujet: values.sujet || values.modele || def.title,
      corps: values.message ?? "",
      champs: values,
      page,
    });
  } catch (err) {
    console.error("[demande] enregistrement impossible", err);
    return json(500, { error: "La demande n'a pas pu être enregistrée." });
  }

  try {
    recordEvent(req, "demande", formId, page);
  } catch (err) {
    console.error("[demande] mesure impossible", err);
  }

  if (mailConfigured()) {
    try {
      const lines = def.fields.map((f) => `${f.label} : ${values[f.name] || "—"}`);
      await sendMail({
        to: notificationAddress(),
        replyTo: values.email,
        subject: `[Site] ${SOURCE_LABEL[formId] ?? def.title} — ${nom}`,
        text: [`Nouvelle demande depuis ${page || "le site"}`, "", ...lines, "", `Traiter la demande : ${SITE_URL}/admin/messages/${id}/`].join("\n"),
      });
    } catch (err) {
      // La demande est déjà dans le back-office : on ne fait pas échouer le visiteur.
      console.error("[demande] notification e-mail impossible", err);
    }
  }

  return json(200, { ok: true });
}
