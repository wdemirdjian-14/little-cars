import { UserError, adminRoute, json } from "@/lib/http";
import { deleteUpload, listMedia, saveUpload } from "@/lib/uploads";

export const GET = adminRoute(async (req) => {
  return json(200, { items: listMedia(req.nextUrl.searchParams.get("q") ?? "") });
});

export const POST = adminRoute(async (req, user) => {
  const form = await req.formData().catch(() => null);
  const file = form?.get("fichier");
  if (!(file instanceof File) || file.size === 0) throw new UserError("Aucun fichier reçu.");
  return json(200, { item: await saveUpload(file, user.id) });
});

export const DELETE = adminRoute(async (req) => {
  const body = await req.json().catch(() => ({}));
  deleteUpload(String(body.ref ?? ""));
  return json(200, { ok: true });
});
