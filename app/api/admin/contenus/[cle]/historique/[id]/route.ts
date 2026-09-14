import { restoreHistory } from "@/lib/content";
import { adminRoute, json } from "@/lib/http";

type Ctx = { params: Promise<{ cle: string; id: string }> };

/** Restaure une version précédente (la version actuelle part dans l'historique). */
export const POST = adminRoute<Ctx>(async (_req, user, ctx) => {
  const { cle, id } = await ctx.params;
  restoreHistory(cle, Number(id), user.id);
  return json(200, { ok: true });
});
