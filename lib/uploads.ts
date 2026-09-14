import "server-only";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { documentsUsing } from "./content";
import { UPLOAD_ROOT, getDb } from "./db";
import { UserError } from "./http";
import { isUpload, mediaUrl, siteImages, uploadWidths } from "./media";

// Images téléversées : converties en WebP (800 et 1600 px) dans
// DATA_DIR/uploads, hors des releases, et servies par app/media/u/[...path].
// Le navigateur a déjà réduit l'image à 2400 px (voir components/admin) : le
// fichier reçu reste sous la limite de 1 Mo de nginx.

const MAX_BYTES = 12 * 1024 * 1024;

const slugify = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";

export type MediaItem = {
  ref: string;
  url: string;
  nom: string;
  largeur: number;
  hauteur: number;
  origine: "televersee" | "site";
  cree_le?: string;
};

export async function saveUpload(file: File, userId: number): Promise<MediaItem> {
  if (file.size > MAX_BYTES) throw new UserError("Image trop lourde (12 Mo maximum).");
  const input = Buffer.from(await file.arrayBuffer());
  let meta: sharp.Metadata;
  try {
    meta = await sharp(input).metadata();
  } catch {
    throw new UserError("Ce fichier n'est pas une image lisible. Formats acceptés : JPEG, PNG, WebP, AVIF.");
  }
  if (!meta.width || !meta.height) throw new UserError("Dimensions de l'image illisibles.");

  const rotated = (meta.orientation ?? 1) >= 5;
  const w = rotated ? meta.height : meta.width;
  const h = rotated ? meta.width : meta.height;
  const now = new Date();
  const ref = `u/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${slugify(file.name)}-${crypto.randomBytes(3).toString("hex")}_${w}x${h}`;

  fs.mkdirSync(path.join(UPLOAD_ROOT, path.dirname(ref)), { recursive: true });
  let bytes = 0;
  for (const width of uploadWidths(w)) {
    const info = await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(UPLOAD_ROOT, `${ref}-${width}.webp`));
    bytes += info.size;
  }

  getDb()
    .prepare("INSERT INTO medias (ref, nom_origine, largeur, hauteur, octets, cree_par) VALUES (?, ?, ?, ?, ?, ?)")
    .run(ref, file.name.slice(0, 200), w, h, bytes, userId);

  return { ref, url: mediaUrl(ref, 800), nom: file.name, largeur: w, hauteur: h, origine: "televersee" };
}

export function listMedia(q = ""): MediaItem[] {
  const needle = q.trim().toLowerCase();
  const uploads = (
    getDb().prepare("SELECT ref, nom_origine, largeur, hauteur, cree_le FROM medias ORDER BY id DESC").all() as {
      ref: string;
      nom_origine: string;
      largeur: number;
      hauteur: number;
      cree_le: string;
    }[]
  ).map<MediaItem>((m) => ({ ref: m.ref, url: mediaUrl(m.ref, 800), nom: m.nom_origine, largeur: m.largeur, hauteur: m.hauteur, origine: "televersee", cree_le: m.cree_le }));
  const site = siteImages()
    .reverse()
    .map<MediaItem>((m) => ({ ref: m.ref, url: mediaUrl(m.ref, 800), nom: m.ref.split("/").pop()!, largeur: m.largeur, hauteur: m.hauteur, origine: "site" }));
  const all = [...uploads, ...site];
  return needle ? all.filter((m) => m.nom.toLowerCase().includes(needle) || m.ref.toLowerCase().includes(needle)) : all;
}

export function deleteUpload(ref: string) {
  if (!isUpload(ref)) throw new UserError("Seules les images téléversées peuvent être supprimées.");
  const used = documentsUsing(ref);
  if (used.length) throw new UserError(`Image utilisée dans : ${used.join(", ")}. Remplacez-la avant de la supprimer.`);
  for (const width of [800, 1600]) fs.rmSync(path.join(UPLOAD_ROOT, `${ref}-${width}.webp`), { force: true });
  getDb().prepare("DELETE FROM medias WHERE ref = ?").run(ref);
}
