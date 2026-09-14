/** Identité, coordonnées et navigation communes à tout le site. */

export const company = {
  brand: "Little",
  siteName: "Little Cars",
  legalName: "Technical Studio",
  legalForm: "SARL",
  capital: "154 200 €",
  siret: "432 937 878 00028",
  foundingYear: 2000,
  phone: "02 38 31 82 58",
  phoneIntl: "+33238318258",
  email: "contact@little-cars.fr",
  address: {
    street: "ZAC de la Bosserie Nord, rue des Batraciens",
    postalCode: "45500",
    city: "Gien",
    region: "Centre-Val de Loire",
    country: "FR",
  },
  /** Repère affiché dans l'interface (atelier de Gien), pas une géolocalisation précise. */
  coordinates: "47.70° N · 2.64° E",
  hours: {
    label: "Du lundi au vendredi, sur rendez-vous",
    slots: ["09h00 – 12h00", "14h00 – 17h00"],
    schema: ["Mo-Fr 09:00-12:00", "Mo-Fr 14:00-17:00"],
  },
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=100086133894089",
    instagram: "https://www.instagram.com/littlecarsofficiel/",
    youtube: "https://www.youtube.com/channel/UC5vuNZQqGjXXdU_w8okPE-w",
  },
};

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const nav: NavItem[] = [
  { label: "Little", href: "/little/" },
  {
    label: "Véhicules",
    href: "/les-utilitaires-electriques-par-usage/",
    children: [
      { label: "Par usage", href: "/les-utilitaires-electriques-par-usage/" },
      { label: "EBOX 2 et 3 places", href: "/utilitaire-electrique-ebox-2-et-3-places/" },
      { label: "EBOX 6 et 9 places", href: "/utilitaire-electrique-ebox-6-et-9-places/" },
      { label: "EBOX XL 2 et 6 places", href: "/utilitaire-electrique-ebox-xl-2-et-6-places/" },
      { label: "EBOX Industrie 2 et 3 places", href: "/utilitaire-electrique-ebox-industrie-2-et-3-places/" },
      { label: "EBOX Rail & Route", href: "/utilitaire-electrique-ebox-rail-et-route/" },
      { label: "BEGO", href: "/bego-lutilitaire-electrique-ultime/" },
      { label: "Accessoires EBOX", href: "/accessoires-ebox/" },
    ],
  },
  {
    label: "SAV & services",
    href: "/services-apres-vente-et-services-little/",
    children: [
      { label: "Nos services", href: "/services-apres-vente-et-services-little/" },
      { label: "Maintenance", href: "/contrats-dentretien-de-maintenance-little/" },
      { label: "Pièces d'origine", href: "/pieces-dorigine-little/" },
      { label: "Demande de SAV", href: "/faire-une-demande-de-sav/" },
      { label: "Programme REBORN", href: "/programme-reborn/" },
    ],
  },
  { label: "Location", href: "/location-longue-duree-little/" },
  { label: "Occasion", href: "/nos-vehicules-doccasion/" },
  {
    label: "Ressources",
    href: "/fiches-techniques/",
    children: [
      { label: "Fiches techniques", href: "/fiches-techniques/" },
      { label: "Les 5 atouts EBOX", href: "/les-5-atouts-de-la-gamme-ebox/" },
      { label: "FAQ", href: "/faq/" },
    ],
  },
];

export const footerColumns: { title: string; links: NavItem[] }[] = [
  {
    title: "Little Cars",
    links: [
      { label: "L'ADN de Little", href: "/little/" },
      { label: "Les 5 atouts de la gamme EBOX", href: "/les-5-atouts-de-la-gamme-ebox/" },
      { label: "Location longue durée", href: "/location-longue-duree-little/" },
      { label: "Véhicules d'occasion", href: "/nos-vehicules-doccasion/" },
      { label: "Programme REBORN", href: "/programme-reborn/" },
    ],
  },
  {
    title: "Les véhicules électriques",
    links: [
      { label: "Par usage", href: "/les-utilitaires-electriques-par-usage/" },
      { label: "EBOX 2 & 3 places", href: "/utilitaire-electrique-ebox-2-et-3-places/" },
      { label: "EBOX 6 & 9 places", href: "/utilitaire-electrique-ebox-6-et-9-places/" },
      { label: "EBOX XL 2 & 6 places", href: "/utilitaire-electrique-ebox-xl-2-et-6-places/" },
      { label: "EBOX Industrie 2 & 3 places", href: "/utilitaire-electrique-ebox-industrie-2-et-3-places/" },
      { label: "EBOX Rail & Route", href: "/utilitaire-electrique-ebox-rail-et-route/" },
      { label: "BEGO", href: "/bego-lutilitaire-electrique-ultime/" },
      { label: "Accessoires", href: "/accessoires-ebox/" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "SAV & services", href: "/services-apres-vente-et-services-little/" },
      { label: "Contrats d'entretien", href: "/contrats-dentretien-de-maintenance-little/" },
      { label: "Pièces d'origine", href: "/pieces-dorigine-little/" },
      { label: "Faire une demande de SAV", href: "/faire-une-demande-de-sav/" },
      { label: "Fiches techniques", href: "/fiches-techniques/" },
      { label: "FAQ", href: "/faq/" },
    ],
  },
];

export const legalLinks: NavItem[] = [
  { label: "Mentions légales", href: "/mentions-legales/" },
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite/" },
];

/** Chiffres clés repris du site d'origine. */
export const keyFigures = {
  range: [
    { value: 9, label: "places max." },
    { value: 5, label: "longueurs de bennes" },
    { value: 2, label: "dimensions de fourgons" },
    { value: 3, label: "empattements" },
  ],
  company: [
    { value: 20, suffix: " ans", label: "d'engineering automobile" },
    { value: 15, suffix: " ans", label: "de véhicule électrique" },
    { value: 600, suffix: "", label: "véhicules en utilisation" },
  ],
  lld: { from: 199, minMonths: 36, maxMonths: 60 },
};
