import "server-only";
import { connection } from "next/server";
import { legal } from "@/content/legal";
import * as P from "@/content/pages";
import { company, keyFigures } from "@/content/site";
import type { Vehicle } from "@/content/types";
import { vehicles as defaultVehicles } from "@/content/vehicles";
import { infer, merge, validate, type Schema } from "./content-schema";
import { getDb } from "./db";
import { UserError } from "./http";

// ─────────────────────────────────────────────────────────────────────────────
// Contenus du site (CMS).
//
// Chaque document a une valeur par défaut dans content/*.ts. La table
// `contenus` ne contient que les documents modifiés dans le back-office.
//
// Les pages appellent getContent(), qui passe par connection() : elles sont
// rendues à chaque requête et affichent donc immédiatement ce qui vient d'être
// enregistré, y compris juste après un déploiement (le build, lui, n'a pas
// accès à la base). Une lecture SQLite coûte quelques dizaines de microsecondes.
// ─────────────────────────────────────────────────────────────────────────────

type Groupe = "Général" | "Pages" | "Véhicules" | "Services" | "Ressources" | "Campagnes" | "Légal";

type DocDef = {
  label: string;
  groupe: Groupe;
  chemin: string;
  aide?: string;
  /** Champs non modifiables (chemins génériques, « * » = n'importe quel rang). */
  verrouilles?: string[];
  defaut: unknown;
};

const DOCS = {
  site: {
    label: "Coordonnées & chiffres clés",
    groupe: "Général",
    chemin: "/little-contact/",
    aide: "Téléphone, adresse, horaires, réseaux sociaux et chiffres repris sur tout le site.",
    defaut: { company, keyFigures },
  },
  accueil: { label: "Accueil", groupe: "Pages", chemin: "/", defaut: P.home, verrouilles: ["atouts.*.key", "usages.*.id"] },
  temoignages: { label: "Vidéos témoignages", groupe: "Pages", chemin: "/", aide: "Vidéos YouTube de l'accueil et des landing pages.", defaut: P.testimonials },
  little: { label: "L'ADN de Little", groupe: "Pages", chemin: "/little/", defaut: P.little },
  contact: { label: "Contact", groupe: "Pages", chemin: "/little-contact/", defaut: P.contact },
  merci: { label: "Page de remerciement", groupe: "Pages", chemin: "/merci-pour-votre-demande/", defaut: P.thanks },
  usages: { label: "Véhicules par usage", groupe: "Véhicules", chemin: "/les-utilitaires-electriques-par-usage/", defaut: P.usages, verrouilles: ["groups.*.id"] },
  atouts: { label: "Les 5 atouts EBOX", groupe: "Véhicules", chemin: "/les-5-atouts-de-la-gamme-ebox/", defaut: P.atouts },
  accessoires: { label: "Accessoires", groupe: "Véhicules", chemin: "/accessoires-ebox/", defaut: P.accessoires },
  occasions: {
    label: "Véhicules d'occasion",
    groupe: "Véhicules",
    chemin: "/nos-vehicules-doccasion/",
    aide: "Chaque véhicule a sa page /vehicules-occasions/<slug>/. Changer un slug change l'adresse de la page.",
    defaut: P.occasions,
  },
  "videos-vehicules": { label: "Vidéos des fiches véhicules", groupe: "Véhicules", chemin: "/utilitaire-electrique-ebox-2-et-3-places/", defaut: P.vehicleVideos },
  services: { label: "SAV & services", groupe: "Services", chemin: "/services-apres-vente-et-services-little/", defaut: P.services },
  maintenance: { label: "Contrats d'entretien", groupe: "Services", chemin: "/contrats-dentretien-de-maintenance-little/", defaut: P.maintenance },
  pieces: { label: "Pièces d'origine", groupe: "Services", chemin: "/pieces-dorigine-little/", defaut: P.pieces },
  reborn: { label: "Programme REBORN", groupe: "Services", chemin: "/programme-reborn/", defaut: P.reborn },
  location: { label: "Location longue durée", groupe: "Services", chemin: "/location-longue-duree-little/", defaut: P.lld },
  "demande-sav": { label: "Demande de SAV", groupe: "Services", chemin: "/faire-une-demande-de-sav/", defaut: P.savRequest },
  faq: { label: "FAQ", groupe: "Ressources", chemin: "/faq/", defaut: P.faq },
  documentation: { label: "Fiches techniques & brochures", groupe: "Ressources", chemin: "/fiches-techniques/", defaut: P.documentation },
  landings: { label: "Landing pages Ads : titres", groupe: "Campagnes", chemin: "/ssv-electrique/", aide: "Pages non indexées, destinées aux campagnes Google Ads.", defaut: P.landings },
  "landing-contenu": { label: "Landing pages Ads : contenu commun", groupe: "Campagnes", chemin: "/ssv-electrique/", defaut: P.landingContent },
  "mentions-legales": { label: "Mentions légales", groupe: "Légal", chemin: "/mentions-legales/", defaut: { markdown: legal.mentions } },
  confidentialite: { label: "Politique de confidentialité", groupe: "Légal", chemin: "/politique-de-confidentialite/", defaut: { markdown: legal.confidentialite } },
} satisfies Record<string, DocDef>;

type Docs = typeof DOCS;
export type DocKey = keyof Docs;
export type Company = typeof company;

const VEHICLE_PREFIX = "vehicule-";
const vehicleSchema: Schema = defaultVehicles.map(infer).reduce(merge);

function readRow<T>(cle: string, fallback: T): T {
  const row = getDb().prepare("SELECT donnees FROM contenus WHERE cle = ?").get(cle) as { donnees: string } | undefined;
  if (!row) return fallback;
  try {
    return JSON.parse(row.donnees) as T;
  } catch {
    console.error(`[contenus] document illisible : ${cle}, valeur par défaut utilisée`);
    return fallback;
  }
}

/* Lecture côté site ------------------------------------------------------------------ */

export async function getContent<K extends DocKey>(key: K): Promise<Docs[K]["defaut"]> {
  await connection();
  return readRow(key, DOCS[key].defaut);
}

export async function getVehicles(): Promise<Vehicle[]> {
  await connection();
  return defaultVehicles.map((v) => readRow(VEHICLE_PREFIX + v.slug, v));
}

export async function getVehicle(slug: string): Promise<Vehicle | undefined> {
  return (await getVehicles()).find((v) => v.slug === slug);
}

/* Back-office ------------------------------------------------------------------------ */

export type DocEntry = {
  cle: string;
  label: string;
  groupe: Groupe;
  chemin: string;
  aide?: string;
  modifie_le: string | null;
  modifie_par: string | null;
};

type Definition = DocDef & { schema: Schema };

function definition(cle: string): Definition | null {
  if (cle in DOCS) {
    const d = DOCS[cle as DocKey] as DocDef;
    return { ...d, schema: infer(d.defaut) };
  }
  if (cle.startsWith(VEHICLE_PREFIX)) {
    const v = defaultVehicles.find((x) => VEHICLE_PREFIX + x.slug === cle);
    if (v) {
      return {
        label: v.name,
        groupe: "Véhicules",
        chemin: `/${v.slug}/`,
        aide: "Fiche véhicule : prix, caractéristiques, photos, options, plans et documents.",
        verrouilles: ["slug", "category"],
        defaut: v,
        schema: vehicleSchema,
      };
    }
  }
  return null;
}

export function listDocuments(): DocEntry[] {
  const rows = getDb()
    .prepare("SELECT c.cle, c.modifie_le, u.nom AS modifie_par FROM contenus c LEFT JOIN utilisateurs u ON u.id = c.modifie_par")
    .all() as { cle: string; modifie_le: string; modifie_par: string | null }[];
  const edits = new Map(rows.map((r) => [r.cle, r]));
  const keys = [...Object.keys(DOCS), ...defaultVehicles.map((v) => VEHICLE_PREFIX + v.slug)];
  return keys.map((cle) => {
    const d = definition(cle)!;
    const e = edits.get(cle);
    return { cle, label: d.label, groupe: d.groupe, chemin: d.chemin, aide: d.aide, modifie_le: e?.modifie_le ?? null, modifie_par: e?.modifie_par ?? null };
  });
}

export function readDocument(cle: string) {
  const d = definition(cle);
  if (!d) return null;
  const row = getDb()
    .prepare("SELECT c.modifie_le, u.nom AS modifie_par FROM contenus c LEFT JOIN utilisateurs u ON u.id = c.modifie_par WHERE c.cle = ?")
    .get(cle) as { modifie_le: string; modifie_par: string | null } | undefined;
  return {
    cle,
    label: d.label,
    groupe: d.groupe,
    chemin: d.chemin,
    aide: d.aide ?? null,
    verrouilles: d.verrouilles ?? [],
    schema: d.schema,
    data: readRow(cle, d.defaut),
    personnalise: !!row,
    modifie_le: row?.modifie_le ?? null,
    modifie_par: row?.modifie_par ?? null,
  };
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function check(cle: string, d: Definition, data: unknown) {
  const issue = validate(data, d.schema);
  if (issue) throw new UserError(`Enregistrement refusé : ${issue.path || "document"} — ${issue.message}.`);
  // Les champs verrouillés doivent rester identiques à la version par défaut.
  if (cle.startsWith(VEHICLE_PREFIX)) {
    const v = data as Vehicle;
    const ref = d.defaut as Vehicle;
    if (v.slug !== ref.slug || v.category !== ref.category) throw new UserError("L'adresse et la gamme d'un véhicule ne se modifient pas.");
  }
  if (cle === "occasions") {
    const slugs = (data as typeof P.occasions).items.map((o) => o.slug);
    const bad = slugs.find((s) => !SLUG.test(s));
    if (bad !== undefined) throw new UserError(`Slug invalide « ${bad} » : minuscules, chiffres et tirets uniquement.`);
    if (new Set(slugs).size !== slugs.length) throw new UserError("Deux véhicules d'occasion ont le même slug.");
  }
}

function pushHistory(cle: string, d: Definition, userId: number) {
  const db = getDb();
  const current = readRow(cle, d.defaut);
  db.prepare("INSERT INTO contenus_historique (cle, donnees, enregistre_par) VALUES (?, ?, ?)").run(cle, JSON.stringify(current), userId);
  db.prepare(
    "DELETE FROM contenus_historique WHERE cle = ? AND id NOT IN (SELECT id FROM contenus_historique WHERE cle = ? ORDER BY id DESC LIMIT 30)",
  ).run(cle, cle);
}

export function saveDocument(cle: string, data: unknown, userId: number) {
  const d = definition(cle);
  if (!d) throw new UserError("Document inconnu.", 404);
  check(cle, d, data);
  const db = getDb();
  db.transaction(() => {
    pushHistory(cle, d, userId);
    db.prepare(
      `INSERT INTO contenus (cle, donnees, modifie_le, modifie_par) VALUES (?, ?, datetime('now'), ?)
       ON CONFLICT(cle) DO UPDATE SET donnees = excluded.donnees, modifie_le = excluded.modifie_le, modifie_par = excluded.modifie_par`,
    ).run(cle, JSON.stringify(data), userId);
  })();
}

export function resetDocument(cle: string, userId: number) {
  const d = definition(cle);
  if (!d) throw new UserError("Document inconnu.", 404);
  const db = getDb();
  db.transaction(() => {
    pushHistory(cle, d, userId);
    db.prepare("DELETE FROM contenus WHERE cle = ?").run(cle);
  })();
}

export function listHistory(cle: string) {
  return getDb()
    .prepare(
      `SELECT h.id, h.enregistre_le, u.nom AS auteur FROM contenus_historique h
       LEFT JOIN utilisateurs u ON u.id = h.enregistre_par WHERE h.cle = ? ORDER BY h.id DESC`,
    )
    .all(cle) as { id: number; enregistre_le: string; auteur: string | null }[];
}

export function restoreHistory(cle: string, id: number, userId: number) {
  const row = getDb().prepare("SELECT donnees FROM contenus_historique WHERE cle = ? AND id = ?").get(cle, id) as { donnees: string } | undefined;
  if (!row) throw new UserError("Version introuvable.", 404);
  saveDocument(cle, JSON.parse(row.donnees), userId);
}

/** Documents modifiés qui utilisent une image (avant suppression d'un média). */
export function documentsUsing(ref: string): string[] {
  const rows = getDb().prepare("SELECT cle FROM contenus WHERE donnees LIKE ?").all(`%"${ref}"%`) as { cle: string }[];
  return rows.map((r) => definition(r.cle)?.label ?? r.cle);
}
