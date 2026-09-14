// Planche contact des photos aspirées : node scripts/contact-sheet.mjs sortie.jpg 2023/04/a.jpg ...
import sharp from "sharp";
import fs from "node:fs";
const [out, ...files] = process.argv.slice(2);
const base = "scrape/media/uploads/";
const W = 300, H = 190, COLS = 6;
const tiles = [];
for (const [i, f] of files.entries()) {
  if (!fs.existsSync(base + f)) { console.error("absent", f); continue; }
  const img = await sharp(base + f).resize(W, H - 22, { fit: "cover" }).toBuffer();
  const label = Buffer.from(`<svg width="${W}" height="22"><rect width="100%" height="100%" fill="#111"/><text x="4" y="15" font-size="12" font-family="Menlo" fill="#fff">${i + 1}. ${f.split("/").pop().slice(0, 36)}</text></svg>`);
  const tile = await sharp({ create: { width: W, height: H, channels: 3, background: "#222" } })
    .composite([{ input: img, top: 0, left: 0 }, { input: label, top: H - 22, left: 0 }]).png().toBuffer();
  tiles.push(tile);
}
const rows = Math.ceil(tiles.length / COLS);
await sharp({ create: { width: W * COLS, height: H * rows, channels: 3, background: "#000" } })
  .composite(tiles.map((t, i) => ({ input: t, left: (i % COLS) * W, top: Math.floor(i / COLS) * H })))
  .jpeg({ quality: 70 }).toFile(out);
console.log(out, tiles.length);
