// ─────────────────────────────────────────────────────────────────────────────
// Schéma des documents du CMS, déduit des valeurs par défaut (content/*.ts).
// Partagé par le serveur (validation à l'enregistrement) et par l'éditeur du
// back-office (affichage des champs, création d'éléments, contrôle avant envoi).
//
// Le principe : un rédacteur modifie les valeurs, ajoute ou retire des éléments
// de listes, mais ne change jamais la forme d'un document. Le site public peut
// donc lire la base en toute confiance.
// ─────────────────────────────────────────────────────────────────────────────

export type Schema =
  | { t: "string" }
  | { t: "number" }
  | { t: "boolean" }
  | { t: "array"; item: Schema | null; min: number }
  | { t: "object"; fields: Record<string, { s: Schema; req: boolean }> };

export function infer(value: unknown): Schema {
  if (Array.isArray(value)) {
    const item = value.reduce<Schema | null>((acc, v) => (acc ? merge(acc, infer(v)) : infer(v)), null);
    return { t: "array", item, min: value.length > 0 ? 1 : 0 };
  }
  if (value && typeof value === "object") {
    return {
      t: "object",
      fields: Object.fromEntries(Object.entries(value).map(([k, v]) => [k, { s: infer(v), req: true }])),
    };
  }
  if (typeof value === "number") return { t: "number" };
  if (typeof value === "boolean") return { t: "boolean" };
  return { t: "string" };
}

/** Union de deux schémas : un champ absent d'un côté devient facultatif. */
export function merge(a: Schema, b: Schema): Schema {
  if (a.t === "array" && b.t === "array") {
    return { t: "array", item: a.item && b.item ? merge(a.item, b.item) : (a.item ?? b.item), min: Math.min(a.min, b.min) };
  }
  if (a.t === "object" && b.t === "object") {
    const fields: Record<string, { s: Schema; req: boolean }> = {};
    for (const k of new Set([...Object.keys(a.fields), ...Object.keys(b.fields)])) {
      const fa = a.fields[k];
      const fb = b.fields[k];
      fields[k] = fa && fb ? { s: merge(fa.s, fb.s), req: fa.req && fb.req } : { s: (fa ?? fb).s, req: false };
    }
    return { t: "object", fields };
  }
  return a;
}

/** Valeur vide conforme au schéma, pour un nouvel élément de liste. */
export function blank(s: Schema): unknown {
  switch (s.t) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      return Object.fromEntries(Object.entries(s.fields).map(([k, f]) => [k, blank(f.s)]));
  }
}

/** Chemin technique → chemin générique (« scenes[2].word » → « scenes.*.word »). */
export const genericPath = (path: string) => path.replace(/\[\d+\]/g, ".*");

export type Issue = { path: string; message: string };

export function validate(value: unknown, s: Schema, path = ""): Issue | null {
  const at = (message: string): Issue => ({ path, message });
  switch (s.t) {
    case "string":
      if (typeof value !== "string") return at("texte attendu");
      if (value.length > 50_000) return at("texte trop long");
      if (/(^|\.)src$/.test(path) && !value.trim()) return at("choisissez une image");
      return null;
    case "number":
      return typeof value === "number" && Number.isFinite(value) ? null : at("nombre attendu");
    case "boolean":
      return typeof value === "boolean" ? null : at("case à cocher attendue");
    case "array": {
      if (!Array.isArray(value)) return at("liste attendue");
      if (value.length < s.min) return at("au moins un élément est nécessaire");
      if (value.length > 300) return at("liste trop longue");
      if (!s.item) return value.length ? at("cette liste ne prend pas d'éléments") : null;
      for (let i = 0; i < value.length; i++) {
        const issue = validate(value[i], s.item, `${path}[${i}]`);
        if (issue) return issue;
      }
      return null;
    }
    case "object": {
      if (!value || typeof value !== "object" || Array.isArray(value)) return at("bloc attendu");
      const obj = value as Record<string, unknown>;
      for (const k of Object.keys(obj)) if (!(k in s.fields)) return { path: join(path, k), message: "champ inconnu" };
      for (const [k, f] of Object.entries(s.fields)) {
        if (!(k in obj)) {
          if (f.req) return { path: join(path, k), message: "champ manquant" };
          continue;
        }
        const issue = validate(obj[k], f.s, join(path, k));
        if (issue) return issue;
      }
      return null;
    }
  }
}

const join = (path: string, key: string) => (path ? `${path}.${key}` : key);

/* Libellés affichés dans l'éditeur ------------------------------------------------ */

const LABELS: Record<string, string> = {
  seo: "Référencement (Google)",
  title: "Titre",
  description: "Description",
  h1: "Titre principal (H1)",
  eyebrow: "Surtitre",
  lead: "Chapeau",
  hero: "En-tête de page",
  image: "Image",
  images: "Images",
  src: "Image",
  alt: "Texte alternatif (accessibilité et SEO)",
  paragraphs: "Paragraphes",
  list: "Liste à puces",
  items: "Éléments",
  text: "Texte",
  caption: "Légende",
  poster: "Image d'aperçu",
  provider: "Plateforme (youtube ou vimeo)",
  id: "Identifiant",
  scenes: "Scènes d'ouverture",
  word: "Grand mot",
  readout: "Compteur affiché",
  label: "Libellé",
  value: "Valeur",
  unit: "Unité",
  intro: "Introduction",
  usages: "Usages",
  drift: "Photos en défilement",
  atouts: "Atouts",
  key: "Icône",
  lld: "Location longue durée",
  sav: "Service & SAV",
  knowHow: "Savoir-faire",
  videos: "Vidéos",
  innovation: "Innovation",
  tests: "Essais & fiabilité",
  values: "Valeurs",
  partners: "Partenaires",
  logos: "Logos",
  team: "Équipe",
  name: "Nom",
  role: "Fonction",
  bio: "Présentation",
  timeline: "Frise chronologique",
  date: "Date",
  groups: "Groupes",
  subtitle: "Sous-titre",
  note: "Précision",
  href: "Lien",
  cta: "Texte du lien",
  speed: "Vitesse",
  payload: "Charge utile",
  range: "Autonomie",
  priceLld: "Prix LLD (€ HT / mois)",
  priceBuy: "Prix d'achat (€ HT)",
  priceNote: "Mention sous le prix",
  footnote: "Note de bas de page",
  sectors: "Secteurs",
  commitments: "Engagements",
  tech: "Technologies",
  models: "Modèles",
  pillars: "Points clés",
  offers: "Offres",
  quotes: "Témoignages écrits",
  author: "Auteur",
  place: "Lieu",
  lldTeaser: "Accroche location",
  blocks: "Blocs de texte",
  why: "Pourquoi",
  eco: "Engagement écologique",
  steps: "Étapes",
  warranty: "Garantie",
  examples: "Exemples",
  price: "Prix (€ HT / mois)",
  q: "Question",
  a: "Réponse",
  brochures: "Brochures",
  sheets: "Fiches techniques",
  size: "Taille du fichier",
  slug: "Adresse de la page (slug)",
  brand: "Marque",
  model: "Modèle",
  year: "Année",
  condition: "État",
  energy: "Énergie",
  km: "Kilométrage",
  priceHt: "Prix HT (€)",
  available: "Disponibilité",
  company: "Société",
  brandName: "Marque",
  siteName: "Nom du site",
  legalName: "Raison sociale",
  legalForm: "Forme juridique",
  capital: "Capital",
  siret: "SIRET",
  foundingYear: "Année de création",
  phone: "Téléphone (affiché)",
  phoneIntl: "Téléphone (format international, pour les liens)",
  email: "E-mail",
  address: "Adresse",
  street: "Rue",
  postalCode: "Code postal",
  city: "Ville",
  region: "Région",
  country: "Pays (code)",
  coordinates: "Coordonnées affichées",
  hours: "Horaires",
  slots: "Créneaux",
  schema: "Horaires pour Google (format Mo-Fr 09:00-12:00)",
  socials: "Réseaux sociaux",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  keyFigures: "Chiffres clés",
  suffix: "Suffixe",
  from: "À partir de (€)",
  minMonths: "Durée minimale (mois)",
  maxMonths: "Durée maximale (mois)",
  tagline: "Accroche",
  specs: "Caractéristiques (tableau de bord)",
  quick: "Aperçu sur les cartes",
  card: "Image de la carte",
  slides: "Photos défilantes",
  optionGroups: "Options",
  dims: "Dimensions",
  dimensions: "Plans cotés",
  docs: "Documents à télécharger",
  kind: "Type de document",
  gallery: "Galerie",
  category: "Gamme",
  markdown: "Texte (Markdown)",
  points: "Arguments",
  benefits: "Bénéfices",
  lead_: "Chapeau",
};

export function labelFor(key: string): string {
  if (LABELS[key]) return LABELS[key];
  const spaced = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
