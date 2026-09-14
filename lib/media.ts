import manifest from "@/content/media-manifest.json";

type Entry = { w: number; h: number; widths: number[] };
const entries = manifest as Record<string, Entry>;

const base = (src: string) => src.replace(/\.(jpe?g|png|webp)$/i, "");

export function mediaInfo(src: string): Entry | undefined {
  return entries[src];
}

/** URL du WebP le plus proche de la largeur demandée (sans agrandir). */
export function mediaUrl(src: string, width = 1600): string {
  const info = entries[src];
  const widths = info?.widths ?? [1600];
  const w = widths.find((x) => x >= width) ?? widths[widths.length - 1];
  return `/media/${base(src)}-${w}.webp`;
}

export function mediaSrcSet(src: string): string {
  const info = entries[src];
  const widths = info?.widths ?? [1600];
  return widths.map((w) => `/media/${base(src)}-${w}.webp ${w}w`).join(", ");
}
