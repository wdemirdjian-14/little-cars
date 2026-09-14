#!/usr/bin/env node
/**
 * Prépare les médias du site à partir de l'aspiration WordPress (scrape/).
 *
 *  1. repère toutes les références « AAAA/MM/fichier.ext » dans content/
 *  2. produit public/media/AAAA/MM/fichier-{800,1600}.webp (sans agrandir)
 *  3. copie les PDF sous public/wp-content/uploads/ : leurs URLs ne changent pas
 *  4. écrit content/media-manifest.json (dimensions, largeurs produites)
 *     et content/media-redirects.json (ancienne URL d'image → WebP)
 *
 * Relançable : un WebP plus récent que sa source n'est pas régénéré.
 * Usage : npm run media   (SCRAPE_DIR=chemin/vers/scrape, défaut ./scrape)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.resolve(process.env.SCRAPE_DIR || "scrape", "media", "uploads");
const PUBLIC = path.join(ROOT, "public");
const WIDTHS = [800, 1600];
const QUALITY = 74;
const REF = /\b(20\d\d\/\d\d\/[^"'`\s)(]+?\.(?:jpe?g|png|pdf))(?=["'`\s)]|$)/gi;

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return listFiles(p);
    return /\.(ts|tsx|md|json)$/.test(e.name) && !e.name.startsWith("media-") ? [p] : [];
  });
}

const refs = new Set();
for (const file of listFiles(path.join(ROOT, "content"))) {
  for (const m of fs.readFileSync(file, "utf8").matchAll(REF)) refs.add(m[1]);
}

if (!fs.existsSync(SRC)) {
  console.error(`Dossier source introuvable : ${SRC}\nLancez d'abord tools/scrape.py ou précisez SCRAPE_DIR.`);
  process.exit(1);
}

const manifest = {};
const redirects = {};
const missing = [];
let made = 0;

const escapeSource = (s) => s.replace(/[()*+?:]/g, "\\$&");

for (const ref of [...refs].sort()) {
  const source = path.join(SRC, ref);
  if (!fs.existsSync(source)) {
    missing.push(ref);
    continue;
  }

  if (ref.toLowerCase().endsWith(".pdf")) {
    const dest = path.join(PUBLIC, "wp-content", "uploads", ref);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(source, dest);
    }
    continue;
  }

  const meta = await sharp(source).metadata();
  const rotated = (meta.orientation ?? 1) >= 5;
  const w = rotated ? meta.height : meta.width;
  const h = rotated ? meta.width : meta.height;
  const base = ref.replace(/\.(jpe?g|png)$/i, "");
  const widths = WIDTHS.filter((x, i) => i === 0 || x <= w);
  const srcTime = fs.statSync(source).mtimeMs;

  for (const width of widths) {
    const dest = path.join(PUBLIC, "media", `${base}-${width}.webp`);
    if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs > srcTime) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(dest);
    made++;
  }

  manifest[ref] = { w, h, widths };
  redirects[escapeSource(`/wp-content/uploads/${ref}`)] = `/media/${base}-${widths[widths.length - 1]}.webp`;
}

fs.writeFileSync(path.join(ROOT, "content", "media-manifest.json"), JSON.stringify(manifest, null, 1) + "\n");
fs.writeFileSync(path.join(ROOT, "content", "media-redirects.json"), JSON.stringify(redirects, null, 1) + "\n");

console.log(`${refs.size} références, ${Object.keys(manifest).length} images, ${made} WebP générés.`);
if (missing.length) {
  console.warn(`⚠ ${missing.length} fichier(s) absent(s) de l'aspiration :\n  ${missing.join("\n  ")}`);
  process.exitCode = 1;
}
