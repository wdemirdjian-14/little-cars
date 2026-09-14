// ─────────────────────────────────────────────────────────────────────────────
// Schéma SQLite, partagé par le serveur (lib/db.ts) et les scripts
// d'exploitation (scripts/admin-invite.mjs). Idempotent : uniquement des
// CREATE … IF NOT EXISTS. Fichier .mjs pour être importable tel quel par Node
// sur le serveur, sans compilation.
//
// Les listes appelées à grossir (messages.source, evenements.type) restent
// sans CHECK : SQLite ne sait pas élargir un CHECK sans reconstruire la table.
// ─────────────────────────────────────────────────────────────────────────────

export const SCHEMA = `
-- ══ Comptes du back-office ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS utilisateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  nom TEXT NOT NULL,
  mot_de_passe_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK(role IN ('admin','editeur')),
  actif INTEGER NOT NULL DEFAULT 1 CHECK(actif IN (0,1)),
  derniere_connexion_le TEXT,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seule l'empreinte SHA-256 du jeton est stockée : une fuite de la base ne
-- permet pas d'ouvrir une session.
CREATE TABLE IF NOT EXISTS sessions (
  jeton_hash TEXT PRIMARY KEY,
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  expire_le TEXT NOT NULL,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Invitation d'un nouveau compte ou réinitialisation d'un mot de passe : même
-- mécanisme, un lien à usage unique valable 72 h.
CREATE TABLE IF NOT EXISTS invitations (
  jeton_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE,
  nom TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'admin' CHECK(role IN ('admin','editeur')),
  cree_par INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
  expire_le TEXT NOT NULL,
  utilisee_le TEXT,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ══ Contenus (CMS) ═════════════════════════════════════════════════════════════

-- Une ligne n'existe que si le document a été modifié : sinon le site affiche
-- la valeur par défaut définie dans content/*.ts.
CREATE TABLE IF NOT EXISTS contenus (
  cle TEXT PRIMARY KEY,
  donnees TEXT NOT NULL,
  modifie_le TEXT NOT NULL DEFAULT (datetime('now')),
  modifie_par INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS contenus_historique (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cle TEXT NOT NULL,
  donnees TEXT NOT NULL,
  enregistre_le TEXT NOT NULL DEFAULT (datetime('now')),
  enregistre_par INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_historique_cle ON contenus_historique(cle, id DESC);

CREATE TABLE IF NOT EXISTS medias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL UNIQUE,
  nom_origine TEXT NOT NULL,
  largeur INTEGER NOT NULL,
  hauteur INTEGER NOT NULL,
  octets INTEGER NOT NULL,
  cree_le TEXT NOT NULL DEFAULT (datetime('now')),
  cree_par INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL
);

-- ══ Messages reçus ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'nouveau' CHECK(statut IN ('nouveau','en_cours','traite','archive')),
  nom TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  telephone TEXT NOT NULL DEFAULT '',
  sujet TEXT NOT NULL DEFAULT '',
  corps TEXT NOT NULL DEFAULT '',
  champs TEXT NOT NULL DEFAULT '{}',
  page TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  lu_le TEXT,
  cree_le TEXT NOT NULL DEFAULT (datetime('now')),
  modifie_le TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_messages_statut ON messages(statut, id DESC);

CREATE TABLE IF NOT EXISTS reponses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  auteur_id INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
  sujet TEXT NOT NULL,
  corps TEXT NOT NULL,
  envoyee INTEGER NOT NULL DEFAULT 0 CHECK(envoyee IN (0,1)),
  erreur TEXT,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ══ Mesure d'audience ══════════════════════════════════════════════════════════════
-- Sans cookie ni IP : « visiteur » est une empreinte SHA-256 de (sel du jour,
-- IP, navigateur). Le sel est détruit après 48 h, l'empreinte ne peut donc plus
-- être recalculée ni rapprochée d'une personne (exemption CNIL).

CREATE TABLE IF NOT EXISTS visites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  jour TEXT NOT NULL,
  visiteur TEXT NOT NULL,
  chemin TEXT NOT NULL,
  referent TEXT NOT NULL DEFAULT '',
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campagne TEXT NOT NULL DEFAULT '',
  appareil TEXT NOT NULL DEFAULT 'ordinateur',
  navigateur TEXT NOT NULL DEFAULT '',
  systeme TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_visites_jour ON visites(jour);
CREATE INDEX IF NOT EXISTS idx_visites_ts ON visites(ts);

CREATE TABLE IF NOT EXISTS evenements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  jour TEXT NOT NULL,
  visiteur TEXT NOT NULL,
  type TEXT NOT NULL,
  libelle TEXT NOT NULL DEFAULT '',
  chemin TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_evenements_jour ON evenements(jour, type);

CREATE TABLE IF NOT EXISTS sels (
  jour TEXT PRIMARY KEY,
  sel TEXT NOT NULL
);
`;
