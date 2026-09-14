import manifest from "@/content/media-manifest.json";

// Deux familles d'images, même API :
//  • celles du site d'origine, décrites par content/media-manifest.json
//    (« 2023/04/2-pl-38.jpg ») et servies depuis public/media ;
//  • celles téléversées dans le back-office (« u/2026/09/nom-a1b2c3_1920x1280 »),
//    dont les dimensions sont inscrites dans le nom : aucune lecture de base
//    n'est nécessaire, y compris dans les composants client.

type Entry = { w: number; h: number; widths: number[] };
const entries = manifest as Record<string, Entry>;

const UPLOAD = /^u\/\d{4}\/\d{2}\/[a-z0-9-]+_(\d+)x(\d+)$/;

export const isUpload = (src: string) => UPLOAD.test(src);

export const uploadWidths = (w: number) => (w > 1000 ? [800, 1600] : [800]);

const base = (src: string) => src.replace(/\.(jpe?g|png|webp)$/i, "");

export function mediaInfo(src: string): Entry | undefined {
  if (entries[src]) return entries[src];
  const m = UPLOAD.exec(src);
  if (!m) return undefined;
  const w = Number(m[1]);
  return { w, h: Number(m[2]), widths: uploadWidths(w) };
}

/** URL du WebP le plus proche de la largeur demandée (sans agrandir). */
export function mediaUrl(src: string, width = 1600): string {
  const widths = mediaInfo(src)?.widths ?? [1600];
  const w = widths.find((x) => x >= width) ?? widths[widths.length - 1];
  return `/media/${base(src)}-${w}.webp`;
}

export function mediaSrcSet(src: string): string {
  const widths = mediaInfo(src)?.widths ?? [1600];
  return widths.map((w) => `/media/${base(src)}-${w}.webp ${w}w`).join(", ");
}

export function siteImages() {
  return Object.entries(entries).map(([ref, e]) => ({ ref, largeur: e.w, hauteur: e.h }));
}
