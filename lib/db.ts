import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA } from "./schema.mjs";

// ─────────────────────────────────────────────────────────────────────────────
// Base SQLite unique : contenus du CMS, messages, comptes, mesure d'audience.
// Sur le serveur, DATA_DIR pointe vers ~/little-cars/shared/data, hors des
// releases : la base et les images téléversées survivent aux déploiements.
//
// Un seul process PM2 (fork) écrit dans ce fichier : jamais de mode cluster.
// ─────────────────────────────────────────────────────────────────────────────

export const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), "data"));
export const UPLOAD_ROOT = path.join(DATA_DIR, "uploads");

let db: Database.Database | undefined;

export function getDb(): Database.Database {
  if (!db) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    db = new Database(path.join(DATA_DIR, "little-cars.db"));
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    db.pragma("busy_timeout = 3000");
    db.exec(SCHEMA);
  }
  return db;
}
