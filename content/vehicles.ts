import type { Img, Option, Vehicle } from "./types";

const PDF = "/wp-content/uploads";
const TARIFS = { label: "Grille tarifaire EBOX (janvier 2023)", kind: "Tarifs", href: `${PDF}/2023/01/LITTLE_EBOX_Gamme_tarif-012023.pdf` } as const;
const BROCHURE_NATURE = { label: "Brochure EBOX 4x4 — gamme Nature", kind: "Brochure", href: `${PDF}/2022/12/Brochure-Nature.pdf` } as const;
const BROCHURE_INDUSTRIE = { label: "Brochure EBOX Industrie", kind: "Brochure", href: `${PDF}/2022/12/Brochure-Industrie.pdf` } as const;

const PRICE_NOTE = "EBOX classic 2 places 2WD, hors options, accessoires, frais de transport et homologation.";

const series = (name: string, files: string[]): Img[] =>
  files.map((src, i) => ({ src, alt: `${name} — vue ${i + 1}` }));

/* Équipements partagés entre plusieurs modèles ------------------------------ */

const LAME: Option = {
  title: "Lame à neige",
  text: "Pour le déneigement des chemins et des parkings. Démontage facile, commande par treuil électrique et télécommande sans fil.",
  image: "2022/11/lame-neige.jpeg",
  dims: ["Largeur 1 400 mm"],
};
const SALEUSE: Option = {
  title: "Saleuse",
  text: "Complément de la lame à neige : 70 ou 120 litres, extraction par vis sans fin, plateau inox, châssis aluminium marine. Débit réglable depuis la cabine, épandage orientable.",
  image: "2022/11/saleuse.jpeg",
  dims: ["Largeur de travail 5 m"],
};
const REMORQUE: Option = {
  title: "Remorque sur mesure",
  text: "Nous réalisons des remorques adaptées à votre métier, comme cette remorque surbaissée qui transporte les caisses à outils du service maintenance d'une usine.",
  image: "2022/11/Remorque_sur_mesure.jpeg",
};
const TRAINE: Option = {
  title: "Équipement traîné",
  text: "Grâce à ses capacités de traction, EBOX tracte de nombreux outils professionnels : tondeuses, agrainoirs, équipements pour centres hippiques…",
  image: "2022/11/Equipement_traine.jpeg",
};
const REMORQUE_CHASSE: Option = {
  title: "Remorque de chasse",
  text: "Conçue pour transporter de 6 à 12 chasseurs, avec 1 ou 2 essieux.",
  image: "2022/11/Remorque_chasse.jpeg",
};
const AGRAINOIR: Option = {
  title: "Agrainoir autoporté",
  text: "Projection de 5 à 30 mètres, orientable sur 180°, sans casser le grain. Bac de 80 litres (60 kg de maïs), alimentation 12 V, démontage en 2 boulons.",
  image: "2022/11/agrainoir.jpeg",
  dims: ["Poids 22,5 kg"],
};
const VERIN: Option = {
  title: "Relevage par vérin électrique",
  text: "Videz facilement votre benne. Vérin électrique de forte capacité pour un usage intensif.",
  image: "2022/11/XL-Verin.jpg",
  dims: ["Sur benne galvanisée 900 et 1 300 mm"],
};
const REHAUSSES: Option = {
  title: "Rehausses grillagées",
  text: "Augmentez le volume transportable : branchages, caisses, végétaux…",
  image: "2022/11/XL-Rehausse.jpg",
  dims: ["Hauteur ridelles 750 mm"],
};
const BACHES: Option = {
  title: "Bâches",
  text: "Protègent le chargement des intempéries et offrent un volume utile de 1,2 à 1,5 m³.",
  image: "2022/11/XL-Bache.jpg",
  dims: ["Hauteur ridelles 750 mm"],
};
const FOURGON_STANDARD: Option = {
  title: "Fourgon standard",
  text: "Pour le transport de colis et la livraison du dernier kilomètre. 1,1 m³ sécurisés par un rideau aluminium fermant à clé, ouverture arrière.",
  image: "2022/11/XL-Fourgon-Arriere.jpg",
  dims: ["L 1 200 × l 1 300 × h 1 100 mm"],
};
const FOURGON_MESURE: Option = {
  title: "Fourgon sur mesure",
  text: "À partir de 1,6 m³, rideau aluminium fermant à clé, ouverture arrière et/ou latérale.",
  image: "2022/11/XL-Fourgon-Lateral.jpg",
  dims: ["l 1 300 × h 1 100 mm"],
};
const BENNE_ACIER: Option = {
  title: "Benne acier galvanisé 900 ou 1 300",
  text: "L'équipement des professionnels, robuste, en tôle galvanisée. La version 1 300 accepte les palettes Euro.",
  image: "2022/11/XL-Benne-Acier.jpg",
  dims: ["l 1 400 mm", "L 900 / 1 300 mm", "Ridelles 300 mm"],
};

const COMPACT_SPECS = [
  { label: "Charge utile", value: "500", unit: "kg" },
  { label: "Traction 4WD", value: "2 800", unit: "kg" },
  { label: "Autonomie", value: "25–100", unit: "km" },
  { label: "Rayon de braquage", value: "7", unit: "m" },
  { label: "Encombrement", value: "2,65 × 1,39", unit: "m" },
  { label: "Temps de charge", value: "4", unit: "h" },
];

export const vehicles: Vehicle[] = [
  {
    slug: "utilitaire-electrique-ebox-2-et-3-places",
    name: "EBOX 2 et 3 places",
    category: "nature",
    seo: {
      title: "Utilitaire électrique Ebox 2 et 3 places",
      description:
        "EBOX est le SSV électrique adapté à vos besoins : silencieux, maniable, polyvalent, puissant, efficace, à l'entretien réduit. La version 2/3 places est compacte et maniable.",
    },
    tagline: "Utilitaire électrique compact & polyvalent",
    priceLld: 239,
    priceBuy: 12470,
    priceNote: PRICE_NOTE,
    quick: { speed: "40 km/h", payload: "500 kg", range: "25–100 km" },
    specs: COMPACT_SPECS,
    card: { src: "2022/10/2places-4wd.jpg", alt: "Little EBOX 2 places 4 roues motrices avec benne" },
    slides: series("EBOX 2 et 3 places", [
      "2023/04/2-pl-38.jpg", "2023/04/2-pl-11.jpg", "2023/04/2-pl-3.jpg", "2023/04/2-pl-4.jpg", "2023/04/2-pl-31.jpg",
      "2023/04/2-pl-13.jpg", "2023/04/2-pl-32.jpg", "2023/04/2-pl-39.jpg", "2023/04/2-pl-25.jpg", "2023/04/2-pl-15.jpg",
    ]),
    blocks: [
      {
        title: "Compact, maniable, à l'aise partout",
        paragraphs: [
          "EBOX est le SSV électrique adapté à vos besoins : silencieux, maniable, polyvalent, puissant, efficace et à l'entretien réduit.",
          "La version 2/3 places reste compacte et maniable, même sur des voies étroites. Elle passe des sentiers boueux aux sites industriels sans changer de caractère.",
          "Maintenance, logistique, surveillance de site : quelle que soit votre utilisation, il y a un EBOX qui vous correspond.",
        ],
      },
      {
        title: "Un outil de travail qui évolue avec vous",
        paragraphs: [
          "Grâce à son interface unique, chaque équipement se démonte en quelques minutes, sans outil particulier.",
          "Cette version compacte accepte 3 types de bennes, 1 fourgon et de nombreux accessoires étudiés pour votre métier : treuil, lame à neige, prise agricole, agrainoir…",
          "Tous les outils sont interchangeables : vous passez d'une benne à un fourgon et votre investissement dure.",
        ],
      },
    ],
    optionGroups: [
      {
        title: "Bennes et fourgon",
        items: [
          { title: "Benne standard", text: "L'outil idéal pour un usage courant. En acier, habillage extérieur en plastique injecté.", image: "2022/11/Benne-standard.jpeg", dims: ["l 1 250 mm", "L 920 mm", "Ridelles 280 mm"] },
          { title: "Benne acier galvanisé 900", text: "L'équipement des professionnels, robuste, en tôle galvanisée, en version compacte.", image: "2022/11/Benne-galva900.jpeg", dims: ["l 1 400 mm", "L 900 mm", "Ridelles 300 mm"] },
          { title: "Benne acier galvanisé 1 300", text: "Robuste, en tôle galvanisée : elle accepte les palettes Euro et les contenants de grandes dimensions.", image: "2022/11/Benne-galva1300.jpeg", dims: ["l 1 400 mm", "L 1 300 mm", "Ridelles 300 mm"] },
          { title: "Fourgon", text: "1,1 m³ sécurisés par un rideau aluminium fermant à clé. Disponible sur mesure jusqu'à 3 m³.", image: "2022/11/Fourgon.jpeg", dims: ["l 1 300 mm", "L 900 mm", "h 1 100 mm"] },
        ],
      },
      { title: "Options pour les bennes", items: [VERIN, REHAUSSES, BACHES] },
      { title: "Outils de travail", items: [AGRAINOIR, LAME, SALEUSE, REMORQUE, TRAINE, REMORQUE_CHASSE] },
    ],
    dimensions: [
      { src: "2022/12/2places-petite-benne.jpg", alt: "Plan coté EBOX 2 places petite benne, vue de profil" },
      { src: "2022/11/Dessin_Ebox_Face.jpeg", alt: "Plan coté EBOX, vue de face" },
      { src: "2022/12/2places-grande-benne-grillage.jpg", alt: "Plan coté EBOX 2 places grande benne avec rehausses grillagées" },
      { src: "2022/11/Dessin_Fourgon.jpeg", alt: "Plan coté EBOX 2 places fourgon" },
    ],
    docs: [
      TARIFS,
      { label: "Fiche technique EBOX 2/3 places benne", kind: "Fiche technique", href: `${PDF}/2022/12/LITTLE_EBOX_BENNE-Fiche_techniques-SP.pdf` },
      { label: "Fiche technique EBOX 2/3 places fourgon", kind: "Fiche technique", href: `${PDF}/2022/12/LITTLE_EBOX_FOURGON_LONG-Fiche_Technique_SP.pdf` },
      BROCHURE_NATURE,
    ],
    gallery: series("EBOX 2 et 3 places sur le terrain", [
      "2022/11/Ebox2-3-Galerie1.jpg", "2023/03/2303-Cottard16.jpg", "2022/11/Ebox2-3-Galerie3.jpg",
      "2022/11/Ebox2-3-Galerie4.jpg", "2023/03/2303-Cottard9.jpg", "2022/11/Ebox2-3-Galerie6.jpg",
    ]),
  },
  {
    slug: "utilitaire-electrique-ebox-6-et-9-places",
    name: "EBOX 6 et 9 places",
    category: "nature",
    seo: {
      title: "Utilitaire électrique Ebox 6 et 9 places",
      description:
        "6 ou 9 personnes confortablement et en toute sécurité. Nos SSV électriques EBOX 6 et 9 places équipent des maisons de champagne, des centres équestres, des domaines de chasse, des usines…",
    },
    tagline: "Mule électrique polyvalente et confortable",
    priceLld: 299,
    priceBuy: 16290,
    priceNote: PRICE_NOTE,
    quick: { speed: "40 km/h", payload: "200 kg", range: "25–100 km" },
    specs: [
      { label: "Charge utile", value: "200", unit: "kg" },
      { label: "Traction 4WD", value: "2 800", unit: "kg" },
      { label: "Autonomie", value: "25–100", unit: "km" },
      { label: "Rayon de braquage", value: "7", unit: "m" },
      { label: "Encombrement", value: "3,04 × 1,39", unit: "m" },
      { label: "Temps de charge", value: "4", unit: "h" },
    ],
    card: { src: "2022/10/6places.jpg", alt: "Little EBOX 6 places pour le transport de personnes" },
    slides: series("EBOX 6 et 9 places", [
      "2023/04/6-9pl-1.jpg", "2023/05/6places5.jpg", "2023/05/6places8.jpg", "2023/04/6-9pl-5.jpg", "2023/04/6-9pl-6.jpg",
      "2023/04/6-9pl-7.jpg", "2023/04/6-9pl-10.jpg", "2023/04/6-9pl-11.jpg", "2023/04/6-9pl-12.jpg", "2023/05/6places4.jpg",
    ]),
    blocks: [
      {
        title: "Jusqu'à 9 personnes, en silence",
        paragraphs: [
          "Transportez 6 ou 9 personnes confortablement et en toute sécurité.",
          "Nos SSV électriques EBOX 6 et 9 places équipent des maisons de champagne pour la visite des domaines, des centres équestres, des domaines de chasse, des usines… et même une société de visites guidées à Barcelone.",
          "La version 6 places garde l'encombrement de l'EBOX 2 places : même maniabilité, même rayon de braquage. Les modèles 6 et 9 places sont homologués route.",
        ],
      },
      {
        title: "Toujours un outil de travail",
        paragraphs: [
          "EBOX 6 et 9 places transportent des personnes avec efficacité, mais restent votre outil de travail pour tracter ou déneiger.",
          "Ils profitent de la gamme d'accessoires EBOX (pare-buffle, attelage…) et de toutes les qualités de l'EBOX 4WD : même efficacité en terrain difficile, même maniabilité.",
        ],
      },
    ],
    optionGroups: [
      {
        title: "Benne",
        items: [
          { title: "Benne galvanisée", text: "Une benne arrière pour emporter le matériel avec l'équipe.", image: "2022/11/EBox-6-9-places-Benne.jpg", dims: ["L 500 ou 1 250 mm"] },
        ],
      },
      { title: "Outils de travail", items: [LAME, REMORQUE, TRAINE, REMORQUE_CHASSE] },
    ],
    dimensions: [
      { src: "2022/11/EBox-6-9-Places-Dimensions1.jpg", alt: "Plan coté EBOX 6 places" },
      { src: "2022/11/EBox-6-9-Places-Dimensions2.jpg", alt: "Plan coté EBOX 6 places, vue de face" },
      { src: "2022/11/EBox-6-9-Places-Dimensions3.jpg", alt: "Plan coté EBOX 9 places" },
      { src: "2022/11/EBox-6-9-Places-Dimensions4.jpg", alt: "Plan coté EBOX 9 places, vue de face" },
    ],
    docs: [
      TARIFS,
      { label: "Fiche technique EBOX 6 places benne", kind: "Fiche technique", href: `${PDF}/2022/12/LITTLE_EBOX_6places-Fiche_technique_SP.pdf` },
      { label: "Fiche technique EBOX 9 places", kind: "Fiche technique", href: `${PDF}/2022/12/LITTLE_EBOX_9places-Fiche_Techniques_SP.pdf` },
      BROCHURE_NATURE,
    ],
    gallery: series("EBOX 6 et 9 places en situation", [
      "2022/11/Ebox6-9-Galerie1.jpg", "2022/11/Ebox6-9-Galerie2.jpg", "2022/11/Ebox6-9-Galerie3.jpg",
      "2022/11/Ebox6-9-Galerie4.jpg", "2022/11/Ebox6-9-Galerie5.jpg", "2022/11/Ebox6-9-Galerie6.jpg",
    ]),
  },
  {
    slug: "utilitaire-electrique-ebox-xl-2-et-6-places",
    name: "EBOX XL 2 et 6 places",
    category: "nature",
    seo: {
      title: "Utilitaire électrique Ebox XL 2 et 6 places",
      description:
        "EBOX XL est le SSV électrique grand format adapté à vos besoins : silencieux, maniable, polyvalent, puissant, efficace, à l'entretien réduit.",
    },
    tagline: "L'utilitaire grand format, puissant et polyvalent",
    priceLld: 289,
    priceBuy: 15460,
    priceNote: PRICE_NOTE,
    quick: { speed: "40 km/h", payload: "500 kg", range: "25–100 km" },
    specs: [
      { label: "Charge utile", value: "500", unit: "kg" },
      { label: "Traction 4WD", value: "2 800", unit: "kg" },
      { label: "Autonomie", value: "25–100", unit: "km" },
      { label: "Configuration", value: "6", unit: "places + benne 1,3 m" },
      { label: "Benne", value: "2", unit: "m max (2/3 places)" },
      { label: "Temps de charge", value: "4", unit: "h" },
    ],
    card: { src: "2022/10/2-3-places-benne.jpg", alt: "Little EBOX XL 2 places avec longue benne" },
    slides: series("EBOX XL 2 et 6 places", [
      "2023/04/xl-24.jpg", "2023/04/xl-19.jpg", "2023/04/xl-12.jpg", "2023/04/xl-11.jpg", "2023/04/xl-21.jpg",
    ]),
    blocks: [
      {
        title: "Le grand format électrique",
        paragraphs: [
          "Unique dans le monde de l'utilitaire électrique, la version 6 places XL transporte à la fois 6 personnes et leur matériel, avec une benne jusqu'à 1,3 m.",
          "En version 2/3 places, EBOX XL accepte des bennes jusqu'à 2 m de long.",
          "Avec toujours les qualités de l'EBOX : une capacité de traction inégalée, à l'aise sur tous les terrains et tous les chantiers.",
        ],
      },
      {
        title: "Déjà adopté par les pros du terrain",
        paragraphs: [
          "Paysagistes, jardiniers d'hôtels, semenciers sur leurs parcelles, industriels pour la maintenance de site, domaines, châteaux, vignobles, campings : EBOX XL accompagne le travail quotidien.",
          "Cette version accepte 3 types de bennes, des fourgons et de nombreux accessoires : treuil, lame à neige, prise agricole, agrainoir…",
        ],
      },
    ],
    optionGroups: [
      {
        title: "Bennes",
        items: [
          { title: "Benne standard 6 places XL", text: "L'outil idéal pour un usage courant. En acier, habillage extérieur en plastique injecté.", image: "2022/11/XL-Benne-Standard.jpg", dims: ["l 1 250 mm", "L 920 mm", "Ridelles 280 mm"] },
          BENNE_ACIER,
          { title: "Benne aluminium 1 700 ou 2 000 (2 places XL)", text: "Benne de grande capacité, ouvrable sur 3 côtés.", image: "2022/11/XL-Benne-Large.jpg", dims: ["l 1 400 mm", "L 1 700 / 2 000 mm", "Ridelles 280 mm"] },
        ],
      },
      { title: "Options pour les bennes", items: [VERIN, REHAUSSES, BACHES] },
      { title: "Fourgons", items: [FOURGON_STANDARD, FOURGON_MESURE] },
      { title: "Outils de travail", items: [LAME, SALEUSE] },
    ],
    dimensions: [
      { src: "2022/11/XL-Dimensions3.jpg", alt: "Plan coté EBOX XL, vue de profil" },
      { src: "2022/11/XL-Dimensions2.jpg", alt: "Plan coté EBOX XL, vue de face" },
      { src: "2022/12/xl62.jpg", alt: "Plan coté EBOX XL 6 places avec benne" },
    ],
    docs: [
      TARIFS,
      { label: "Fiche technique EBOX XL 2/3 places benne", kind: "Fiche technique", href: `${PDF}/2022/12/LITTLE_EBOX_XL_BENNE-Fiche_techniques_SP.pdf` },
      { label: "Fiche technique EBOX XL 6 places benne", kind: "Fiche technique", href: `${PDF}/2022/12/LITTLE_EBOX_6places_XL-Fiche_Techniques_SP.pdf` },
      BROCHURE_NATURE,
    ],
    gallery: series("EBOX XL sur le terrain", [
      "2023/03/LI-EBox-XL-Benne-9.jpg", "2022/11/XL-Galerie2.jpg", "2022/11/XL-Galerie3.jpg",
      "2023/03/2303-Globe11.jpg", "2023/03/LI-EBox-XL-Benne-18.jpg", "2023/03/2303-Globe1.jpg",
    ]),
  },
  {
    slug: "utilitaire-electrique-ebox-industrie-2-et-3-places",
    name: "EBOX Industrie 2 et 3 places",
    category: "industrie",
    seo: {
      title: "Utilitaire électrique Ebox Industrie 2 et 3 places",
      description:
        "La version 2/3 places est compacte et maniable, même sur des voies étroites. EBOX est à l'aise sur tous les terrains : les sentiers boueux comme les sites industriels.",
    },
    tagline: "Le véhicule électrique de l'industrie et des collectivités",
    priceLld: 299,
    priceBuy: 16150,
    priceNote: PRICE_NOTE,
    quick: { speed: "40 km/h", payload: "500 kg", range: "25–100 km" },
    specs: COMPACT_SPECS,
    card: { src: "2022/10/Hivision-1.jpg", alt: "Little EBOX Industrie avec cabine Hi-Vision" },
    slides: series("EBOX Industrie cabine Hi-Vision", [
      "2023/04/industrie-11.jpg", "2023/04/industrie-3.jpg", "2023/04/industrie-2.jpg", "2023/04/industrie-6.jpg",
      "2023/04/industrie-1.jpg", "2023/04/industrie-10.jpg", "2023/04/industrie-9.jpg", "2023/04/industrie-7.jpg",
    ]),
    blocks: [
      {
        title: "Pensé pour les sites industriels",
        paragraphs: [
          "Silencieux, maniable, polyvalent, puissant, à l'entretien réduit : EBOX Industrie apporte les qualités de la gamme aux sites de production, aux entrepôts et aux collectivités.",
          "Compact, il circule dans les allées étroites et passe du parking à la voirie. Sa cabine Hi-Vision améliore la visibilité et la sécurité en manœuvre.",
          "Maintenance, logistique interne, surveillance de site : il y a un EBOX pour chaque mission.",
        ],
      },
      {
        title: "Un outil qui change de métier",
        paragraphs: [
          "Chaque équipement se démonte en quelques minutes, sans outil particulier, grâce à l'interface unique EBOX.",
          "Bennes, fourgons, lame à neige, saleuse, remorques : vous passez d'une configuration à l'autre selon la saison et le besoin.",
        ],
      },
    ],
    optionGroups: [
      {
        title: "Bennes",
        items: [
          { title: "Benne standard", text: "L'outil idéal pour un usage courant. En acier, habillage extérieur en plastique injecté.", image: "2022/11/Industrie-Image2.jpg", dims: ["l 1 250 mm", "L 920 mm", "Ridelles 280 mm"] },
          BENNE_ACIER,
        ],
      },
      { title: "Options pour les bennes", items: [VERIN, REHAUSSES, BACHES] },
      { title: "Fourgons", items: [FOURGON_STANDARD, FOURGON_MESURE] },
      { title: "Outils de travail", items: [LAME, SALEUSE, REMORQUE] },
    ],
    dimensions: [
      { src: "2022/11/Industrie-Dimensions1.jpg", alt: "Plan coté EBOX Industrie, vue de profil" },
      { src: "2022/11/Industrie-Dimensions2.jpg", alt: "Plan coté EBOX Industrie, vue de face" },
      { src: "2022/11/Industrie-Dimensions4.jpg", alt: "Plan coté EBOX Industrie avec fourgon" },
      { src: "2022/11/Industrie-Dimensions3.jpg", alt: "Plan coté EBOX Industrie avec benne" },
    ],
    docs: [
      TARIFS,
      { label: "Fiche technique EBOX fourgon", kind: "Fiche technique", href: `${PDF}/2022/12/LITTLE_EBOX_FOURGON-Fiche_technique_SP.pdf` },
      { label: "Fiche technique EBOX fourgon long", kind: "Fiche technique", href: `${PDF}/2022/12/LITTLE_EBOX_FOURGON_LONG-Fiche_Technique_SP.pdf` },
      BROCHURE_INDUSTRIE,
    ],
    gallery: series("EBOX Industrie en situation", [
      "2022/11/Industrie-Galerie1.jpg", "2022/11/Industrie-Galerie2.jpg", "2022/11/Industrie-Galerie3.jpg",
      "2022/11/Industrie-Galerie4.jpg", "2022/11/Industrie-Galerie5.jpg", "2022/11/Industrie-Galerie6.jpg",
    ]),
  },
  {
    slug: "utilitaire-electrique-ebox-rail-et-route",
    name: "EBOX Rail & Route",
    category: "rail",
    seo: {
      title: "Utilitaire électrique Ebox Rail et route",
      description:
        "LITTLE a conçu un véhicule électrique pour le ferroviaire : transport bimodal de matériel et de personnes, surveillance et maintenance sur route comme sur rail, maniable, flexible et non polluant.",
    },
    tagline: "Sur la route comme sur les rails",
    quick: { speed: "40 km/h", payload: "500 kg", range: "25–100 km" },
    specs: [
      { label: "Charge utile", value: "500", unit: "kg" },
      { label: "Traction 4WD", value: "2 800", unit: "kg" },
      { label: "Autonomie", value: "25–100", unit: "km" },
      { label: "Rayon de braquage", value: "7", unit: "m" },
      { label: "Encombrement", value: "3,80 × 1,66", unit: "m" },
      { label: "Temps de charge", value: "4", unit: "h" },
    ],
    card: { src: "2022/10/Rails.jpg", alt: "Little EBOX Rail & Route engagé sur une voie ferrée" },
    slides: [
      { src: "2022/11/Rail-Image1.jpg", alt: "EBOX Rail & Route sur rail" },
      { src: "2022/11/Rail-Image2.jpg", alt: "Bras de guidage ferroviaire de l'EBOX Rail & Route" },
    ],
    blocks: [
      {
        title: "L'utilitaire des interventions ferroviaires",
        paragraphs: [
          "LITTLE a conçu un véhicule électrique pour le ferroviaire : transport bimodal de matériel et d'équipes, surveillance et maintenance sur route comme sur rail, là où il faut un véhicule maniable, flexible et non polluant.",
          "EBOX Rail & Route a été déployé à Toulouse et à Riyad par ENGIE pour mesurer la qualité de l'air dans les tunnels du métro. LITTLE a aussi développé les chariots qui transportent les mâts et le matériel de mesure.",
        ],
      },
      {
        title: "Un bras, un écran, deux modes",
        paragraphs: [
          "Des bras commandés par vérin électrique guident le véhicule sur les rails. Le module s'active depuis l'écran tactile du tableau de bord.",
          "EBOX Rail & Route tire ou pousse des chariots et tout équipement que notre bureau d'études peut développer pour vous.",
          "Il accepte la plupart des aménagements LITTLE : plateau de chargement, fourgon, module de premiers secours, bennes…",
        ],
      },
    ],
    optionGroups: [],
    dimensions: [
      { src: "2022/11/Rail-Dimensions1.jpg", alt: "Plan coté EBOX Rail & Route, vue de profil" },
      { src: "2022/11/Rail-Dimensions2.jpg", alt: "Plan coté EBOX Rail & Route, vue de face" },
    ],
    docs: [BROCHURE_INDUSTRIE],
    gallery: series("EBOX Rail & Route en intervention", [
      "2022/11/Rail-Galerie1.jpg", "2022/11/Rail-Galerie2.jpg", "2022/11/Rail-Galerie3.jpg",
      "2022/11/Rail-Galerie4.jpg", "2022/11/Rail-Galerie5.jpg", "2022/11/Rail-Galerie6.jpg",
    ]),
  },
  {
    slug: "bego-lutilitaire-electrique-ultime",
    name: "BEGO",
    category: "bego",
    seo: {
      title: "Bego, l'utilitaire électrique ultime",
      description:
        "LITTLE BEGO est l'utilitaire électrique adapté à vos besoins : silencieux, maniable, polyvalent, puissant, efficace, à l'entretien réduit.",
    },
    tagline: "Puissance, robustesse & silence",
    quick: { speed: "80 km/h", payload: "1 200 kg", range: "jusqu'à 200 km" },
    specs: [
      { label: "Charge utile", value: "1 200", unit: "kg" },
      { label: "Traction 4WD", value: "5 000", unit: "kg" },
      { label: "Autonomie", value: "200", unit: "km max" },
      { label: "Garde au sol", value: "40", unit: "cm" },
      { label: "Angles d'attaque et de fuite", value: "45", unit: "°" },
      { label: "Temps de charge", value: "6", unit: "h" },
    ],
    card: { src: "2022/10/Bego.jpg", alt: "Little BEGO, utilitaire électrique tout-terrain 6 places" },
    slides: [
      { src: "2022/11/Bego-Image1.jpg", alt: "Little BEGO en tout-terrain" },
      { src: "2022/11/Bego-Image2.jpg", alt: "Little BEGO en franchissement" },
      { src: "2022/11/Bego-Image3.jpg", alt: "Little BEGO en montagne" },
    ],
    blocks: [
      {
        title: "Testé dans le Mercantour",
        paragraphs: [
          "LITTLE BEGO a été éprouvé dans des conditions extrêmes et sous des chocs répétés, dans le parc du Mercantour.",
          "Capacités techniques, précision de conduite, confort : il rivalise avec les meilleurs tout-terrains thermiques, le silence en plus et la pollution en moins. Ses grands pneus robustes encaissent tous les terrains.",
        ],
      },
      {
        title: "Un franchisseur comme on n'en fait plus",
        paragraphs: [
          "Transmission 4 roues motrices permanente et double moteur : BEGO affronte les conditions les plus dures.",
          "Suspensions avant et arrière indépendantes, quatre freins à disque : il est aussi performant sur route qu'en tout-terrain.",
          "Plus de 40 cm de garde au sol et des angles d'attaque et de fuite de 45°.",
        ],
      },
      {
        title: "Construit pour durer",
        paragraphs: ["BEGO est conçu avec des éléments rigoureusement sélectionnés, et il est homologué route."],
        list: [
          "Moteur brushless sans entretien, de qualité industrielle",
          "Batterie lithium conçue et assemblée en Europe",
          "Freinage surdimensionné issu d'un grand constructeur français",
          "Coûts d'entretien réduits",
          "Un véhicule qu'on ne jette pas : il est éligible au programme REBORN",
        ],
      },
    ],
    optionGroups: [],
    dimensions: [
      { src: "2022/11/Bego-Dimensions3.jpg", alt: "Plan coté BEGO, vue de profil" },
      { src: "2022/11/Bego-Dimensions4.jpg", alt: "Plan coté BEGO, vue de face" },
      { src: "2022/11/Bego-Dimensions2.jpg", alt: "Plan coté BEGO avec benne" },
    ],
    docs: [{ label: "Brochure BEGO", kind: "Brochure", href: `${PDF}/2022/12/Brochure-Bego.pdf` }],
    gallery: series("Little BEGO", [
      "2022/11/Bego-Galerie1.jpg", "2022/11/Bego-Galerie2.jpg", "2022/11/Bego-Galerie3.jpg",
      "2022/11/Bego-Galerie4.jpg", "2022/11/Bego-Galerie5.jpg", "2022/11/Bego-Galerie6.jpg",
    ]),
  },
];

export const vehicleBySlug = (slug: string) => vehicles.find((v) => v.slug === slug);
