/**
 * Modèle de contenu du site. Ces types sont la frontière avec le futur
 * back-office : il remplacera les fichiers de `content/` en gardant ces formes.
 *
 * Les images sont référencées par leur chemin d'origine WordPress
 * (`2023/04/2-pl-38.jpg`) : `scripts/import-media.mjs` en tire les WebP
 * servis sous `/media/` et les redirections des anciennes URLs.
 */

export type Img = {
  src: string;
  alt: string;
};

export type Spec = {
  label: string;
  value: string;
  unit?: string;
};

export type Option = {
  title: string;
  text: string;
  image?: string;
  dims?: string[];
};

export type OptionGroup = {
  title: string;
  items: Option[];
};

export type Doc = {
  label: string;
  kind: "Tarifs" | "Fiche technique" | "Brochure";
  href: string;
};

export type TextBlock = {
  title: string;
  paragraphs: string[];
  list?: string[];
};

export type Category = "nature" | "industrie" | "rail" | "bego";

export type Vehicle = {
  slug: string;
  name: string;
  category: Category;
  seo: { title: string; description: string };
  tagline: string;
  /** Prix de départ, en euros HT. Absent : tarif sur demande. */
  priceBuy?: number;
  priceLld?: number;
  priceNote?: string;
  quick: { speed: string; payload: string; range: string };
  specs: Spec[];
  card: Img;
  slides: Img[];
  blocks: TextBlock[];
  optionGroups: OptionGroup[];
  dimensions: Img[];
  docs: Doc[];
  gallery: Img[];
};
