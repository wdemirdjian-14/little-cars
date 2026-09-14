import fs from "node:fs/promises";
import path from "node:path";
import { UPLOAD_ROOT } from "@/lib/db";

// Sert les images téléversées dans le back-office (DATA_DIR/uploads), hors
// du dossier public de la release. Nom strictement contrôlé : aucun parcours
// de répertoire possible.

const NAME = /^\d{4}\/\d{2}\/[a-z0-9-]+_\d+x\d+-\d+\.webp$/;

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  const rel = parts.join("/");
  if (!NAME.test(rel)) return new Response("Introuvable", { status: 404 });
  try {
    const file = await fs.readFile(path.join(UPLOAD_ROOT, "u", rel));
    return new Response(new Uint8Array(file), {
      headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Introuvable", { status: 404 });
  }
}
