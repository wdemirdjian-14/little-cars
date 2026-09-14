/** Appel d'une route d'API du back-office ; lève une Error au message affichable. */
export async function api<T = Record<string, unknown>>(method: string, url: string, body?: unknown): Promise<T> {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(url, {
    method,
    headers: isForm || body === undefined ? undefined : { "Content-Type": "application/json" },
    body: isForm ? (body as FormData) : body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Erreur ${res.status}`);
  return data as T;
}

/**
 * Réduit une photo à 2400 px et la réencode en JPEG sous ~950 Ko avant envoi :
 * nginx limite les requêtes à 1 Mo, et les photos HEIC d'iPhone deviennent
 * lisibles par le serveur. Si le navigateur ne sait pas lire le fichier, on
 * l'envoie tel quel et le serveur répondra.
 */
export async function prepareImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 950_000 && /image\/(jpeg|png|webp)/.test(file.type)) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  let blob: Blob | null = null;
  for (const quality of [0.88, 0.8, 0.7, 0.6, 0.5]) {
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size < 950_000) break;
  }
  if (!blob) return file;
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
}

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

/** Les dates SQLite (datetime('now')) sont en UTC, sans fuseau. */
export function formatDate(sqlite: string | null | undefined): string {
  if (!sqlite) return "—";
  const d = new Date(sqlite.includes("T") ? sqlite : `${sqlite.replace(" ", "T")}Z`);
  return Number.isNaN(d.getTime()) ? sqlite : dateTime.format(d);
}
