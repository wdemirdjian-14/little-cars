/**
 * PM2 — site Little. Ce fichier est copié à la racine du dossier
 * d'application sur le serveur (ex. /home/warren/little-cars) :
 *
 *   little-cars/
 *   ├── ecosystem.config.cjs   ← ce fichier
 *   ├── current -> releases/v0.1.0
 *   ├── releases/v0.1.0/       ← build autonome Next.js (server.js)
 *   └── shared/
 *       ├── .env               ← secrets (SMTP…), jamais écrasé
 *       └── data/              ← demandes des formulaires
 *
 * Le chemin passe par le lien « current » : `pm2 reload little-cars` démarre
 * donc toujours la dernière release activée.
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

// Le VPS garde Node 18/20 pour les applications historiques ; Next 16 exige Node 20.9+.
const NODE_22 = "/home/warren/.local/node22/bin/node";

function readEnv(file) {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(file, "utf8")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#") && l.includes("="))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
      }),
  );
}

module.exports = {
  apps: [
    {
      name: "little-cars",
      cwd: path.join(ROOT, "current"),
      script: path.join(ROOT, "current", "server.js"),
      interpreter: fs.existsSync(NODE_22) ? NODE_22 : undefined,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "350M",
      env: {
        NODE_ENV: "production",
        PORT: "3020",
        HOSTNAME: "127.0.0.1",
        TZ: "Europe/Paris",
        DATA_DIR: path.join(ROOT, "shared", "data"),
        ...readEnv(path.join(ROOT, "shared", ".env")),
      },
    },
  ],
};
