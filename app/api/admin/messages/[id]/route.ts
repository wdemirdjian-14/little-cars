import { UserError, adminRoute, json } from "@/lib/http";
import { STATUTS, getMessage, updateMessage, type Statut } from "@/lib/messages";

type Ctx = { params: Promise<{ id: string }> };

/** Statut et note interne d'un message. */
export const PATCH = adminRoute<Ctx>(async (req, _user, ctx) => {
  const id = Number((await ctx.params).id);
  if (!getMessage(id)) throw new UserError("Message introuvable.", 404);
  const body = await req.json().catch(() => ({}));
  const patch: { statut?: Statut; note?: string } = {};
  if (body.statut !== undefined) {
    if (!(STATUTS as readonly string[]).includes(body.statut)) throw new UserError("Statut inconnu.");
    patch.statut = body.statut;
  }
  if (body.note !== undefined) patch.note = String(body.note).slice(0, 5000);
  updateMessage(id, patch);
  return json(200, { ok: true });
});
