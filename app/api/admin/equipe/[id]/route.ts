import { setUserActive } from "@/lib/auth";
import { UserError, adminRoute, json } from "@/lib/http";

type Ctx = { params: Promise<{ id: string }> };

/** Désactivation / réactivation d'un compte (ses sessions sont fermées). */
export const PATCH = adminRoute<Ctx>(
  async (req, user, ctx) => {
    const id = Number((await ctx.params).id);
    if (id === user.id) throw new UserError("Vous ne pouvez pas désactiver votre propre compte.");
    const body = await req.json().catch(() => ({}));
    setUserActive(id, Boolean(body.actif));
    return json(200, { ok: true });
  },
  { role: "admin" },
);
