import { resetDocument, saveDocument } from "@/lib/content";
import { UserError, adminRoute, json } from "@/lib/http";

type Ctx = { params: Promise<{ cle: string }> };

/** Enregistrement d'un document (validé contre son schéma). */
export const PUT = adminRoute<Ctx>(async (req, user, ctx) => {
  const { cle } = await ctx.params;
  const raw = await req.text();
  if (raw.length > 2_000_000) throw new UserError("Document trop volumineux.");
  let body: { data?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    throw new UserError("Contenu illisible.");
  }
  saveDocument(cle, body.data, user.id);
  return json(200, { ok: true });
});

/** Retour au contenu d'origine (la version remplacée part dans l'historique). */
export const DELETE = adminRoute<Ctx>(async (_req, user, ctx) => {
  const { cle } = await ctx.params;
  resetDocument(cle, user.id);
  return json(200, { ok: true });
});
