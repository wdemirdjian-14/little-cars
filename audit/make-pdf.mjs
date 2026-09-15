// Génère Audit-little-cars.pdf à partir de audit-little-cars.html.
//
//   node audit/make-pdf.mjs
//
// Chrome est piloté par le protocole DevTools plutôt que par --print-to-pdf :
// l'option en ligne de commande impose sa propre échelle dès qu'il y a des
// marges, alors qu'ici le document est imprimé à sa taille réelle (scale 1).
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = Number(process.env.CHROME_PORT || 9333);
const OUT = path.join(HERE, "Audit-little-cars.pdf");

// Le HTML est écrit pour l'enveloppe des Artifacts (ni <html> ni <head>) :
// on le complète pour qu'il s'ouvre en mode standard, accents compris.
const tmp = mkdtempSync(path.join(os.tmpdir(), "audit-pdf-"));
const page = path.join(tmp, "audit.html");
writeFileSync(
  page,
  `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n</head>\n<body>\n${readFileSync(path.join(HERE, "audit-little-cars.html"), "utf8")}\n</body>\n</html>\n`,
);

const chrome = spawn(CHROME, ["--headless", "--disable-gpu", "--no-first-run", `--remote-debugging-port=${PORT}`, `--user-data-dir=${path.join(tmp, "profil")}`, "about:blank"], {
  stdio: "ignore",
});

const rpc = (ws, id, method, params = {}) =>
  new Promise((resolve, reject) => {
    const onMessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id !== id) return;
      ws.removeEventListener("message", onMessage);
      msg.error ? reject(new Error(`${method} : ${msg.error.message}`)) : resolve(msg.result);
    };
    ws.addEventListener("message", onMessage);
    ws.send(JSON.stringify({ id, method, params }));
  });

try {
  let target;
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250);
    try {
      target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
    } catch {
      /* le port de débogage n'est pas encore ouvert */
    }
  }
  if (!target) throw new Error("Chrome n'a pas ouvert son port de débogage.");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });

  const loaded = new Promise((resolve) => {
    const onMessage = (e) => {
      if (JSON.parse(e.data).method !== "Page.loadEventFired") return;
      ws.removeEventListener("message", onMessage);
      resolve();
    };
    ws.addEventListener("message", onMessage);
  });

  await rpc(ws, 1, "Page.enable");
  await rpc(ws, 2, "Page.navigate", { url: pathToFileURL(page).href });
  await loaded;
  // Les polices Google doivent être chargées avant la mise en page définitive.
  await rpc(ws, 3, "Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
  await sleep(500);

  const { data } = await rpc(ws, 4, "Page.printToPDF", {
    printBackground: true,
    scale: 1,
    paperWidth: 8.27, // A4
    paperHeight: 11.69,
    marginTop: 0.55, // 14 mm
    marginBottom: 0.59, // 15 mm
    marginLeft: 0.47, // 12 mm
    marginRight: 0.47,
    preferCSSPageSize: false,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate:
      `<div style="width:100%;margin:0 12mm;font:400 7pt 'Helvetica Neue',Arial,sans-serif;color:#7b8a94;display:flex;justify-content:space-between;">` +
      `<span>Audit little-cars.fr — 14 septembre 2026</span>` +
      `<span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  });

  writeFileSync(OUT, Buffer.from(data, "base64"));
  console.log(`PDF écrit : ${OUT}`);
  ws.close();
} finally {
  chrome.kill();
}
