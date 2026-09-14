#!/usr/bin/env node
/**
 * Crée un lien d'invitation au back-office (nouveau compte ou nouveau mot de
 * passe pour un compte existant). Le lien est valable 72 h et à usage unique.
 *
 * Sur le serveur, depuis la release active :
 *   cd ~/little-cars/current
 *   DATA_DIR=~/little-cars/shared/data ~/.local/node22/bin/node scripts/admin-invite.mjs prenom.nom@exemple.fr "Prénom Nom" [admin|editeur]
 *
 * En local : npm run admin:invite -- prenom.nom@exemple.fr "Prénom Nom"
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { SCHEMA } from "../lib/schema.mjs";

const [email, nom = "", role = "admin"] = process.argv.slice(2);
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !["admin", "editeur"].includes(role)) {
  console.error('Usage : node scripts/admin-invite.mjs email@exemple.fr "Prénom Nom" [admin|editeur]');
  process.exit(1);
}

const dataDir = path.resolve(process.env.DATA_DIR || "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "little-cars.db"));
db.pragma("journal_mode = WAL");
db.exec(SCHEMA);

const token = crypto.randomBytes(32).toString("base64url");
const hash = crypto.createHash("sha256").update(token).digest("hex");
const expires = new Date(Date.now() + 72 * 3_600_000).toISOString();

db.prepare("DELETE FROM invitations WHERE email = ? AND utilisee_le IS NULL").run(email);
db.prepare("INSERT INTO invitations (jeton_hash, email, nom, role, expire_le) VALUES (?, ?, ?, ?, ?)").run(hash, email, nom, role, expires);

const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3020").replace(/\/$/, "");
console.log(`Invitation créée pour ${email} (${role}), valable jusqu'au ${new Date(expires).toLocaleString("fr-FR")} :`);
console.log(`${site}/admin/activation/?jeton=${token}`);
