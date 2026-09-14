import type { Img, TextBlock } from "./types";

export type Seo = { title: string; description: string };
export type Hero = { eyebrow: string; title: string; lead: string; image: Img };
export type Video = { provider: "youtube" | "vimeo"; id: string; title: string; caption?: string; poster: Img };
export type Card = { title: string; text: string; image?: Img; href?: string; cta?: string };

/* Vidéos ------------------------------------------------------------------ */

export const testimonials: Video[] = [
  {
    provider: "youtube",
    id: "lQfvmeyZzF0",
    title: "EBOX 4WD au Haras du Cottard",
    caption: "Frédéric Keller, Haras du Cottard (89) — LLD Full Service",
    poster: { src: "2023/03/2303-Cottard16.jpg", alt: "EBOX 4WD au Haras du Cottard, à côté d'un cheval" },
  },
  {
    provider: "youtube",
    id: "0hkTyg6UzYU",
    title: "EBOX XL chez Globe Planter",
    caption: "Daphné Aubry, Globe Planter (45) — LLD Full Service",
    poster: { src: "2023/03/2303-Globe11.jpg", alt: "EBOX XL jaune conduit dans la pépinière Globe Planter" },
  },
  {
    provider: "youtube",
    id: "QqZEwSMfUrA",
    title: "Témoignage d'une écurie : l'EBOX au quotidien",
    caption: "Écurie Dupuy — équitation",
    poster: { src: "2023/03/2303-Header-4.jpg", alt: "EBOX blanc devant des boxes à chevaux" },
  },
  {
    provider: "youtube",
    id: "8adbodYxaIk",
    title: "Navette électrique pour le transport de personnes en tunnel",
    caption: "Un EBOX sur mesure pour un chantier souterrain",
    poster: { src: "2023/04/6-9pl-1.jpg", alt: "EBOX 6 places pour le transport de personnes" },
  },
];

export const vehicleVideos: Record<string, Video> = {
  "utilitaire-electrique-ebox-2-et-3-places": { provider: "youtube", id: "aSgvwY8ArbA", title: "4x4 utilitaire électrique EBOX 2 places", poster: { src: "2023/04/2-pl-38.jpg", alt: "EBOX 2 places au bord d'un étang" } },
  "utilitaire-electrique-ebox-6-et-9-places": { provider: "vimeo", id: "417236072", title: "EBOX gamme pro nature", poster: { src: "2023/04/6-9pl-5.jpg", alt: "EBOX 6 places en situation" } },
  "utilitaire-electrique-ebox-xl-2-et-6-places": { provider: "youtube", id: "O1Tj2a_VvJw", title: "4x4 utilitaire électrique EBOX 6 places", poster: { src: "2023/03/LI-EBox-XL-Benne-9.jpg", alt: "EBOX XL cabine fermée devant une longère" } },
  "utilitaire-electrique-ebox-industrie-2-et-3-places": { provider: "vimeo", id: "424717608", title: "La gamme EBOX en action", poster: { src: "2022/11/Industrie-Galerie1.jpg", alt: "EBOX Industrie avec fourgon rouge" } },
  "utilitaire-electrique-ebox-rail-et-route": { provider: "vimeo", id: "428845037", title: "EBOX Rail & Route", poster: { src: "2022/11/Rail-Galerie1.jpg", alt: "EBOX Rail & Route tractant un chariot sur la voie" } },
  "bego-lutilitaire-electrique-ultime": { provider: "vimeo", id: "433182158", title: "Little BEGO", poster: { src: "2022/11/Bego-Galerie1.jpg", alt: "BEGO en franchissement au bord d'un lac de montagne" } },
};

/* Accueil ----------------------------------------------------------------- */

export const home = {
  seo: {
    title: "Little, constructeur français de véhicules électriques",
    description:
      "Little, constructeur français d'utilitaires électriques, propose la plus large gamme de SSV électriques professionnels homologués pour la route, en 2 et 4 roues motrices.",
  },
  h1: "Little, constructeur français d'utilitaires électriques",
  scenes: [
    {
      word: "Silencieux",
      caption: "Des utilitaires 100 % électriques, puissants, fiables et écologiques.",
      image: { src: "2023/01/Little-Header-Slider1-NEW.jpg", alt: "EBOX 4 roues motrices vert en lisière de forêt au crépuscule" },
      readout: { label: "Émissions à l'usage", value: "0", unit: "g CO₂/km" },
    },
    {
      word: "Tout-terrain",
      caption: "Double moteur, quatre roues indépendantes : ni la boue ni les charges ne l'arrêtent.",
      image: { src: "2022/10/Ebox1.jpg", alt: "EBOX traversant un gué en pleine forêt" },
      readout: { label: "Capacité de traction", value: "2 800", unit: "kg" },
    },
    {
      word: "Polyvalent",
      caption: "Du haras au site industriel, jusqu'à 9 places homologuées route.",
      image: { src: "2023/03/2303-Header-Slider-Indsutrie.jpg", alt: "Deux EBOX Industrie à cabine Hi-Vision sous un ciel d'orage" },
      readout: { label: "Configuration", value: "9", unit: "places max." },
    },
    {
      word: "Made in France",
      caption: "Conçus par nos ingénieurs, assemblés par nos compagnons dans le Loiret.",
      image: { src: "2023/03/2303-Atelier3.jpg", alt: "Technicien Little assemblant un EBOX dans l'atelier de Gien" },
      readout: { label: "Constructeur depuis", value: "2000", unit: "" },
    },
  ],
  intro: {
    eyebrow: "EBOX 2 & 4 roues motrices",
    title: "La plus vaste gamme professionnelle de SSV électriques",
    paragraphs: [
      "LITTLE a développé la plus vaste gamme d'utilitaires électriques conçus pour les professionnels, jusqu'à 6 et 9 places homologués route.",
      "L'outil qui s'adapte à votre activité : agriculture, élevage, chasse, entretien de domaines et de sites touristiques, industrie, maintenance…",
      "Tous les modèles existent en 2 et 4 roues motrices, en 2, 3, 6 et 9 places.",
    ],
    image: { src: "2022/10/Home_image1-1.jpg", alt: "EBOX sable sur un chemin forestier entre les pins" },
  },
  usages: [
    { id: "personnes", title: "Transporter des personnes", image: { src: "2023/04/6-9pl-1.jpg", alt: "EBOX 6 places, quatre rangées de sièges" } },
    { id: "materiel-personnes", title: "Transporter du matériel et des personnes", image: { src: "2023/03/LI-EBox-XL-Benne-9.jpg", alt: "EBOX XL cabine fermée avec benne grillagée" } },
    { id: "materiel", title: "Transporter du matériel", image: { src: "2023/04/2-pl-38.jpg", alt: "EBOX 2 places avec benne au bord d'un étang" } },
    { id: "industrie", title: "Industrie, cabine Hi-Vision", image: { src: "2023/04/industrie-11.jpg", alt: "Deux EBOX Industrie à cabine Hi-Vision" } },
    { id: "rail", title: "Réseaux ferrés et routes", image: { src: "2022/11/Rail-Galerie1.jpg", alt: "EBOX Rail & Route tractant un chariot sur une voie ferrée" } },
  ],
  drift: [
    { src: "2022/11/Bego-Galerie1.jpg", alt: "BEGO en franchissement en montagne" },
    { src: "2023/03/2303-Cottard16.jpg", alt: "EBOX au haras" },
    { src: "2022/10/Home_image8.jpg", alt: "EBOX devant le camion atelier SAV Little" },
    { src: "2022/12/Image10.jpg", alt: "EBOX 4WD en sous-bois à l'automne" },
    { src: "2023/03/2303-Globe11.jpg", alt: "EBOX XL en pépinière" },
    { src: "2022/11/Industrie-Galerie1.jpg", alt: "EBOX Industrie avec fourgon rouge" },
    { src: "2022/11/Rail-Image1.jpg", alt: "EBOX Rail & Route engagé sur les rails" },
    { src: "2023/03/2303-Header-2.jpg", alt: "EBOX en forêt de Sologne" },
    { src: "2022/12/Header_FAQ-v2.jpg", alt: "EBOX au bord d'un terrain de sport" },
    { src: "2023/04/xl-24.jpg", alt: "EBOX XL vert avec benne et rehausses" },
  ] satisfies Img[],
  atouts: [
    { key: "silence", title: "Silencieux & écologique", text: "Ni bruit, ni odeur, ni vibration : idéal tôt le matin, la nuit ou au contact des animaux." },
    { key: "force", title: "Efficace en toute circonstance", text: "Double motorisation électrique et châssis à quatre roues indépendantes : EBOX tire de fortes charges sur les terrains difficiles." },
    { key: "metier", title: "Adapté à votre besoin", text: "Transporter du matériel ou des personnes, tracter, pousser : il y a toujours un EBOX pour votre métier." },
    { key: "agile", title: "Maniable & polyvalent", text: "Dimensions compactes, quatre longueurs de bennes, fourgons, chenilles 4 saisons : il passe partout et sait tout faire." },
    { key: "duree", title: "Construit pour durer", text: "Moteur brushless sans entretien, batteries fabriquées en Europe, un simple contrôle annuel. Environ 1,20 € la charge." },
  ],
  lld: {
    eyebrow: "Location longue durée",
    title: "Utilisez votre EBOX. Nous nous chargeons du reste.",
    text: "Restez concentré sur votre activité : maintenance, garantie et pièces sont incluses dans un loyer fixe.",
    list: ["Une offre services compris", "Un budget connu et maîtrisé", "Une capacité de financement préservée pour votre entreprise"],
    image: { src: "2023/01/Little_Imgae_VER_Home2.jpg", alt: "EBOX vert à cabine fermée dans un pré avec des moutons" },
  },
  sav: {
    eyebrow: "Service & SAV",
    title: "Toujours à vos côtés",
    text: "Notre mission quotidienne : vous garantir un véhicule opérationnel quand vous en avez besoin. Techniciens formés à l'usine, camions ateliers, pièces d'origine en stock.",
    image: { src: "2022/10/Home_image8.jpg", alt: "EBOX devant le camion atelier du SAV Little" },
  },
};

/* L'ADN de Little ------------------------------------------------------------ */

export const little = {
  seo: {
    title: "Little : des utilitaires électriques fiables et puissants",
    description:
      "100 % électrique, made in France, depuis plus de 20 ans. Les équipes de LITTLE développent des véhicules innovants, adaptés à chaque métier et construits pour durer.",
  },
  hero: {
    eyebrow: "L'ADN de Little",
    title: "Découvrez l'ADN de Little",
    lead: "100 % électrique, made in France, depuis plus de 20 ans. Nos équipes développent des véhicules innovants, adaptés à chaque métier et construits pour durer.",
    image: { src: "2022/12/Header-Little-v2.jpg", alt: "EBOX incliné en pleine pente dans une forêt" },
  } satisfies Hero,
  knowHow: {
    title: "Un savoir-faire unique",
    paragraphs: [
      "Depuis 2000, les équipes de LITTLE ont acquis une expérience rare de l'engineering automobile, et plus particulièrement du véhicule électrique. Rigueur, professionnalisme et passion sont notre ADN.",
      "Du design au service après-vente en passant par la production, techniciens, compagnons et ingénieurs : LITTLE maîtrise toute la chaîne.",
      "L'expérience de chacun profite à tous. C'est ce qui nous permet de développer rapidement de nouveaux véhicules et de nouveaux concepts.",
    ],
  },
  videos: [
    { provider: "vimeo", id: "410918977", title: "La fabrication de véhicules électriques", poster: { src: "2023/03/2303-Atelier1.jpg", alt: "Technicien dans l'atelier Little" } },
    { provider: "vimeo", id: "412266985", title: "L'innovation au cœur de notre métier", poster: { src: "2022/10/Image_Reborn.jpg", alt: "Châssis EBOX en cours de restauration" } },
  ] satisfies Video[],
  innovation: {
    title: "L'innovation au cœur de notre métier",
    lead: "Notre objectif : concevoir les véhicules qu'attendent nos clients.",
    list: [
      "L'amélioration continue des modèles existants, pour toujours plus de fiabilité et de facilité d'utilisation",
      "Le sur-mesure, avec des équipements et des modèles étudiés pour des demandes particulières",
      "Le développement de nouveaux modèles et équipements pour des solutions de mobilité innovantes",
    ],
    paragraphs: [
      "LITTLE conçoit ses véhicules avec le logiciel utilisé par les plus grands constructeurs automobiles et aéronautiques.",
      "Toutes les études sont réalisées en France par LITTLE, qui contrôle ainsi la qualité de ses véhicules du début à la fin.",
    ],
  },
  tests: {
    title: "Construit pour durer",
    lead: "Des tests rigoureux pour vous garantir sécurité et fiabilité.",
    text: "Résistance de l'arceau de sécurité, compatibilité électromagnétique, freinage : tous nos véhicules passent une batterie d'essais validés par des laboratoires indépendants certifiés. Tous nos modèles bénéficient d'une homologation européenne pour rouler sur route.",
    image: { src: "2023/03/LI-EBox-XL-Benne-4.jpg", alt: "EBOX XL avec benne lors d'un essai" },
  },
  values: [
    { title: "L'être humain d'abord", text: "Nous formons nos nouveaux collaborateurs sans a priori et les faisons évoluer dans une structure à taille humaine. Nous accueillons des stagiaires et soutenons l'apprentissage." },
    { title: "La technologie, à bon escient", text: "Nous ne changeons pas de technologie au gré d'innovations immatures. Nous proposons la bonne technologie au bon moment : celle qui apporte efficacité, confort, productivité et sécurité." },
    { title: "Au service de nos clients", text: "Nous assurons nous-mêmes le service après-vente. Nos clients parlent à des techniciens formés à l'usine, et leurs retours remontent directement au bureau d'études." },
    { title: "La qualité", text: "Une démarche qualité complète a permis d'homologuer notre site de production. Nos modèles subissent une batterie de tests pour le plus haut niveau de sécurité." },
    { title: "L'économie circulaire", text: "Nos utilitaires ne sont pas faits pour être jetés dans 5 ans. Ils restent réparables, et le programme REBORN permet de les restaurer et de les améliorer." },
    { title: "L'éco-responsabilité", text: "Moins de pièces, motorisation électrique, poids limité, production au plus près des utilisateurs : LITTLE réduit son empreinte et soutient l'emploi local." },
  ],
  partners: {
    title: "Ils nous soutiennent",
    text: "Pour l'innovation, Oséo, Bpifrance, le département du Loiret, la communauté de communes Giennoises et la région Centre-Val de Loire nous accompagnent. Le Crédit Agricole est présent depuis le début.",
    logos: [
      { src: "2022/10/Logo-region.jpg", alt: "Région Centre-Val de Loire" },
      { src: "2022/10/Logo-bpi.jpg", alt: "Bpifrance" },
      { src: "2022/10/Logo_loiret.jpg", alt: "Département du Loiret" },
      { src: "2022/10/Logo-oseo.jpg", alt: "Oséo" },
      { src: "2022/10/Logo-credit-agricole.jpg", alt: "Crédit Agricole" },
      { src: "2022/10/Logo-cdcg.jpg", alt: "Communauté de communes Giennoises" },
    ] satisfies Img[],
  },
  team: [
    { name: "Éric Gibert", role: "Président et co-fondateur", bio: "Passé par OTIS Elevator comme responsable de bureau d'études, il rejoint Technical Studio en 2010 comme président, chargé de la gestion et du développement de l'entreprise.", image: { src: "2023/02/Little-Equipe2.jpg", alt: "Portrait d'Éric Gibert" } },
    { name: "Armand Dupuy", role: "Responsable commercial & stratégie produit", bio: "Engineering chez OTIS et Renault, ordonnancement pré-série chez PSA, achats chez Matra : une vision globale de l'automobile au service du développement commercial.", image: { src: "2023/02/Little-Equipe1.jpg", alt: "Portrait d'Armand Dupuy" } },
    { name: "Pascal Pajot", role: "Responsable engineering", bio: "Après OTIS, ABMI et Magneti Marelli, il dirige depuis 2003 tous les projets d'engineering : mécanique, carrosserie et électronique.", image: { src: "2023/02/Little-Equipe3.jpg", alt: "Portrait de Pascal Pajot" } },
  ],
  timeline: [
    { date: "Octobre 2000", title: "Création de Little", text: "Naissance de l'entreprise et de son bureau d'études automobile.", image: { src: "2022/12/Image17-2012.jpg", alt: "Les débuts de Little" } },
    { date: "2008", title: "Premier modèle électrique", text: "LITTLE développe puis commercialise son premier véhicule électrique, le LITTLE 4, hommage au design des années 60-70.", image: { src: "2022/12/Image19-Little4.jpg", alt: "Le LITTLE 4" } },
    { date: "2011", title: "Lancement de l'EBOX", text: "Proposé en 4 roues motrices, l'EBOX s'impose comme l'outil des pros : puissant, maniable, silencieux et efficace sur les terrains les plus difficiles.", image: { src: "2022/12/Image8.jpg", alt: "Un des premiers EBOX" } },
    { date: "Juillet 2020", title: "Génération 2", text: "Lancement du développement d'une nouvelle gamme d'utilitaires électriques.", image: { src: "2022/12/Image_projet_futur.jpg", alt: "Étude de la nouvelle génération d'utilitaires Little" } },
    { date: "Mai 2022", title: "L'usine détruite par un incendie", text: "Le 11 mai 2022, l'usine est détruite. Dès le lendemain, l'activité reprend, à commencer par le SAV de nos 600 véhicules en service, avec le soutien de nos clients, de nos partenaires et des acteurs locaux.", image: { src: "2022/12/Incendie1.jpg", alt: "L'usine après l'incendie de mai 2022" } },
    { date: "Septembre 2022", title: "Installation à Gien", text: "Little s'installe dans de nouveaux locaux à Gien, grâce au soutien de la communauté de communes Giennoises et de la mairie de Gien.", image: { src: "2022/12/Atelier23.jpg", alt: "Le nouvel atelier Little à Gien" } },
  ],
};

/* Par usage ----------------------------------------------------------------- */

export type RangeItem = {
  title: string;
  subtitle: string;
  note: string;
  image: Img;
  href: string;
  speed: string;
  payload: string;
  range: string;
  priceLld?: number;
  priceBuy?: number;
};

const V = {
  compact: "/utilitaire-electrique-ebox-2-et-3-places/",
  places: "/utilitaire-electrique-ebox-6-et-9-places/",
  xl: "/utilitaire-electrique-ebox-xl-2-et-6-places/",
  industrie: "/utilitaire-electrique-ebox-industrie-2-et-3-places/",
  rail: "/utilitaire-electrique-ebox-rail-et-route/",
  bego: "/bego-lutilitaire-electrique-ultime/",
};

export const usages = {
  seo: {
    title: "Des utilitaires électriques 100 % adaptés à votre métier",
    description:
      "La plus vaste gamme professionnelle d'utilitaires et de mules électriques pour votre secteur : agriculture, élevage, centre équestre, haras, chasse, industrie & logistique, loisirs, hôpitaux, collectivités, sécurité…",
  },
  hero: {
    eyebrow: "Les véhicules par usage",
    title: "Des utilitaires 100 % électriques adaptés à votre métier",
    lead: "Agriculture, élevage, centre équestre, haras, domaine de chasse, industrie & logistique, loisirs, hôpitaux, collectivités, sécurité… Tous les modèles existent en 2 et 4 roues motrices et se personnalisent entièrement.",
    image: { src: "2023/03/2303-Header-3.jpg", alt: "EBOX jaune dans une pépinière" },
  } satisfies Hero,
  groups: [
    {
      id: "materiel",
      title: "Transporter du matériel",
      items: [
        { title: "EBOX 2/3 places benne", subtitle: "3 types de bennes", note: "En option : vérin électrique, rehausses grillagées, bâches", image: { src: "2022/10/2places-4wd.jpg", alt: "EBOX 2 places avec benne" }, href: V.compact, speed: "40 km/h", payload: "500 kg", range: "25–100 km", priceLld: 239, priceBuy: 12470 },
        { title: "EBOX 2/3 places fourgon", subtitle: "3 longueurs de fourgon", note: "Rideaux arrière ou latéraux (L 1 200 uniquement)", image: { src: "2022/12/Image3.jpg", alt: "EBOX 2 places avec fourgon" }, href: V.compact, speed: "40 km/h", payload: "500 kg", range: "25–100 km", priceLld: 239, priceBuy: 12470 },
        { title: "EBOX 2/3 places XL", subtitle: "Bennes jusqu'à 2 m de long", note: "En option : vérin électrique, rehausses grillagées, bâches", image: { src: "2022/10/2-3-places-benne.jpg", alt: "EBOX XL 2 places avec longue benne" }, href: V.xl, speed: "40 km/h", payload: "500 kg", range: "25–100 km", priceLld: 289, priceBuy: 15460 },
      ],
    },
    {
      id: "materiel-personnes",
      title: "Transporter du matériel & des personnes",
      items: [
        { title: "EBOX 6 places XL", subtitle: "6 places et benne jusqu'à 1,3 m", note: "En option : vérin électrique, rehausses grillagées, bâches", image: { src: "2022/12/Image7.jpg", alt: "EBOX 6 places XL avec benne" }, href: V.xl, speed: "40 km/h", payload: "500 kg", range: "25–100 km", priceLld: 289, priceBuy: 15460 },
      ],
    },
    {
      id: "personnes",
      title: "Transporter des personnes",
      items: [
        { title: "EBOX 6 places", subtitle: "L'encombrement d'un 2 places", note: "Homologué route", image: { src: "2022/10/6places.jpg", alt: "EBOX 6 places orange" }, href: V.places, speed: "40 km/h", payload: "200 kg", range: "25–100 km", priceLld: 299, priceBuy: 16290 },
        { title: "EBOX 9 places", subtitle: "Jusqu'à 9 personnes", note: "Homologué route", image: { src: "2022/10/9places-1.jpg", alt: "EBOX 9 places" }, href: V.places, speed: "40 km/h", payload: "200 kg", range: "25–100 km", priceLld: 299, priceBuy: 16290 },
        { title: "BEGO 6 places", subtitle: "Des capacités exceptionnelles", note: "Existe en version 3 places grande benne", image: { src: "2022/10/Bego.jpg", alt: "Little BEGO 6 places" }, href: V.bego, speed: "80 km/h", payload: "1 200 kg", range: "jusqu'à 200 km" },
      ],
    },
    {
      id: "industrie",
      title: "Gamme industrie, cabine Hi-Vision",
      items: [
        { title: "EBOX Industrie benne", subtitle: "3 types de bennes", note: "En option : vérin électrique, rehausses grillagées, bâches", image: { src: "2022/10/Hivision-1.jpg", alt: "EBOX Industrie cabine Hi-Vision avec benne" }, href: V.industrie, speed: "40 km/h", payload: "500 kg", range: "25–100 km", priceLld: 299, priceBuy: 16150 },
        { title: "EBOX Industrie fourgon", subtitle: "2 longueurs de fourgon", note: "Rideaux arrière ou latéraux (L 1 200 uniquement)", image: { src: "2022/10/Hivision-2-pompiers.jpg", alt: "EBOX Industrie fourgon aux couleurs des pompiers" }, href: V.industrie, speed: "40 km/h", payload: "500 kg", range: "25–100 km", priceLld: 299, priceBuy: 16150 },
        { title: "EBOX Industrie XL", subtitle: "Bennes jusqu'à 2 m de long", note: "Cabine Hi-Vision", image: { src: "2022/10/Hivision3.jpg", alt: "EBOX Industrie XL cabine Hi-Vision" }, href: V.industrie, speed: "40 km/h", payload: "500 kg", range: "25–100 km" },
      ],
    },
    {
      id: "rail",
      title: "Travailler sur les réseaux ferrés",
      items: [
        { title: "EBOX Rail & Route", subtitle: "Roule sur rail et sur route", note: "Transporter, tracter, pousser…", image: { src: "2022/10/Rails.jpg", alt: "EBOX Rail & Route sur la voie" }, href: V.rail, speed: "40 km/h", payload: "500 kg", range: "25–100 km" },
      ],
    },
  ] satisfies { id: string; title: string; items: RangeItem[] }[],
  footnote: "* Prix de départ HT : EBOX classic 2 places 2WD, hors options, accessoires, frais de transport et homologation. LLD : loyer mensuel HT.",
};

/* Les 5 atouts ---------------------------------------------------------------- */

export const atouts = {
  seo: {
    title: "Les 5 atouts de nos utilitaires électriques",
    description:
      "La plus vaste gamme professionnelle d'utilitaires et de mules électriques adaptée à votre secteur : agriculture, centre équestre, haras, chasse, industrie & logistique, loisirs, hôpitaux, collectivités, sécurité.",
  },
  hero: {
    eyebrow: "Gamme EBOX",
    title: "Little EBOX, le SSV 100 % électrique made in France",
    lead: "Cinq atouts qui font de l'EBOX l'outil des professionnels, de la forêt à l'usine.",
    image: { src: "2022/10/EboxLarge.jpg", alt: "EBOX vert foncé à cabine fermée devant une haie" },
  } satisfies Hero,
  items: [
    {
      title: "Silencieux & écologique",
      image: { src: "2022/10/Ebox1.jpg", alt: "EBOX traversant un gué en forêt" },
      paragraphs: [
        "Circulez en silence, sans odeur ni vibration. La souplesse des moteurs électriques vous fait avancer sans effort sur tous les terrains.",
        "Une solution appréciable pour les interventions de nuit ou tôt le matin, et pour tous ceux qui veulent un véhicule plus respectueux de l'environnement.",
      ],
    },
    {
      title: "Une efficacité en toute circonstance",
      image: { src: "2022/10/Performance3.jpg", alt: "Moteur électrique EBOX" },
      paragraphs: [
        "La double motorisation électrique exclusive, associée au châssis à quatre roues indépendantes et doubles triangles, fait de l'EBOX l'un des véhicules électriques les plus efficaces en terrain difficile ou pour tirer de fortes charges.",
      ],
    },
    {
      title: "Adapté à votre besoin",
      image: { src: "2023/03/2303-Cottard16.jpg", alt: "EBOX au haras" },
      paragraphs: ["Transporter du matériel ou des hommes, tracter, pousser : il y a toujours un EBOX qui correspond à votre métier."],
      sectors: [
        { title: "Agriculture, vignoble, centre hippique", text: "Transportez outils, palettes ou cuve à eau, même en terrain difficile." },
        { title: "Chasse", text: "Agrainage, transport d'hommes ou d'animaux, entretien du domaine, en silence." },
        { title: "Industrie & logistique", text: "Sites industriels étendus, livraisons du dernier kilomètre, distribution de colis et de courrier." },
        { title: "Loisirs", text: "Hôtels et domaines, îles et sites préservés, zoos, parcs de loisirs, campings." },
        { title: "Hôpitaux & cliniques", text: "Livraisons et maintenance avec un coût d'entretien réduit." },
        { title: "Collectivités", text: "Parcs et jardins, déneigement et salage, maintenance, livraison de repas et de colis." },
        { title: "Sécurité", text: "Véhicules de premiers secours, surveillance des plages et des sites touristiques." },
      ],
    },
    {
      title: "Maniable & polyvalent",
      image: { src: "2022/12/Image10.jpg", alt: "EBOX 4WD en sous-bois" },
      paragraphs: [
        "Ses dimensions compactes lui permettent de circuler partout avec une grande maniabilité. Tracter, transporter, travailler : EBOX sait tout faire.",
        "Quatre dimensions de bennes avec ou sans vérin électrique, fourgons, chenilles 4 saisons : les équipements suivent votre activité.",
      ],
    },
    {
      title: "Construit pour durer",
      image: { src: "2023/03/2303-Atelier1.jpg", alt: "Technicien Little dans l'atelier" },
      paragraphs: [
        "Pas de filtre, pas de vidange, des batteries sans entretien : EBOX ne demande qu'un contrôle annuel. Une charge coûte environ 1,20 €.",
        "L'entretien d'un véhicule électrique coûte 60 % de moins que celui d'un véhicule thermique, et la consommation plus de 70 % de moins.",
      ],
      list: [
        "Moteur brushless sans entretien, de qualité industrielle",
        "Batterie plomb pur sans entretien, recharge partielle possible, fabriquée en Europe",
        "Batterie lithium conçue et assemblée en Europe",
        "Électronique d'un des plus grands fournisseurs du secteur",
      ],
    },
  ],
  commitments: [
    { title: "Made in France", text: "Nos véhicules sont conçus par nos ingénieurs et assemblés par nos compagnons dans le Loiret, en région Centre-Val de Loire." },
    { title: "Un véhicule qu'on ne jette pas", text: "Nos véhicules évoluent dans le temps et nos équipes savent les restaurer : c'est le programme REBORN." },
    { title: "Homologué route", text: "Tous les EBOX ont obtenu l'homologation routière européenne. Pour un usage sur site privé, elle reste en option." },
  ],
  tech: [
    { title: "Batteries lithium", image: { src: "2022/10/Performance1.jpg", alt: "Pack batterie lithium EBOX" }, text: "Plus d'autonomie et moins de poids. Technologie lithium fer-phosphate, choisie pour sa fiabilité et sa sécurité. Recharge en 4 à 5 h sur une prise 220 V 16 A. Développées et assemblées en Europe." },
    { title: "Batteries plomb pur", image: { src: "2022/10/Performance2.jpg", alt: "Batteries plomb pur EBOX" }, text: "Recharges intermédiaires sans décharge complète, sans entretien ni dégagement de gaz. Recharge en 4 h 30 (80 % en 3 h) sur une prise 220 V 16 A. Fabriquées en Europe." },
    { title: "4 roues motrices Dual Power", image: { src: "2022/10/Performance3.jpg", alt: "Moteur électrique Dual Power" }, text: "Deux moteurs électriques de 4 kW chacun pour une motricité et une sécurité sans égal sur sol glissant. Une technologie unique pour un utilitaire, développée par les ingénieurs LITTLE. EBOX existe aussi en 2 roues motrices." },
  ],
  models: [
    { title: "2/3 places benne", image: { src: "2022/10/2-PLACES-GRANDE-BENNE-GRILLAGE-NON-COTE.jpeg", alt: "Profil EBOX 2/3 places benne" }, href: V.compact },
    { title: "2/3 places fourgon", image: { src: "2022/10/2-PLACES-FOURGON-NON-COTE.jpeg", alt: "Profil EBOX 2/3 places fourgon" }, href: V.compact },
    { title: "2/3 places XL benne", image: { src: "2022/10/EBOX-XL75-2places.jpeg", alt: "Profil EBOX XL 2/3 places benne" }, href: V.xl },
    { title: "6 places", image: { src: "2022/10/PETITE-BENNE-6-PLACE.jpeg", alt: "Profil EBOX 6 places" }, href: V.places },
    { title: "9 places", image: { src: "2022/10/9-PLACES-NON-COTE.jpeg", alt: "Profil EBOX 9 places" }, href: V.places },
    { title: "6 places XL benne", image: { src: "2022/10/GRANDE-BENNE-6-PLACE.jpeg", alt: "Profil EBOX 6 places XL benne" }, href: V.xl },
    { title: "2 places Hi-Vision benne", image: { src: "2022/10/EBOX-industrie-2pl-benne-1300-1.jpeg", alt: "Profil EBOX Industrie Hi-Vision benne" }, href: V.industrie },
    { title: "2 places Hi-Vision fourgon", image: { src: "2022/10/EBOX-industrie-2pl-fourgon-std-1.jpeg", alt: "Profil EBOX Industrie Hi-Vision fourgon" }, href: V.industrie },
    { title: "2 places XL Hi-Vision benne", image: { src: "2022/10/EBOX-XL75-2places-new-cabine.jpeg", alt: "Profil EBOX XL Hi-Vision benne" }, href: V.industrie },
  ],
};

/* Services ------------------------------------------------------------------ */

export const services = {
  seo: {
    title: "Services après-vente et services Little",
    description:
      "Compétence et réactivité caractérisent notre SAV : nos techniciens connaissent parfaitement tous nos véhicules. LITTLE propose aussi une large gamme de services adaptés à vos besoins.",
  },
  hero: {
    eyebrow: "SAV & services",
    title: "Un SAV à votre service",
    lead: "Compétence et réactivité : nos techniciens connaissent parfaitement chaque véhicule, et nos services s'adaptent à votre activité.",
    image: { src: "2023/03/2303-Header-SAV3.jpg", alt: "Technicien Little intervenant sur un EBOX dans l'atelier" },
  } satisfies Hero,
  pillars: [
    { title: "Service après-vente", text: "En tant que constructeur, nous connaissons nos produits mieux que personne. Nos techniciens SAV sont formés sur notre chaîne de montage et apportent la solution la plus rapide.", href: "/contrats-dentretien-de-maintenance-little/", cta: "Nos contrats d'entretien" },
    { title: "Pièces de rechange", text: "Les pièces LITTLE sont des pièces d'origine : performances optimales et disponibilité maximale de votre machine.", href: "/pieces-dorigine-little/", cta: "Les pièces d'origine" },
    { title: "Programme REBORN", text: "Nos utilitaires peuvent être entièrement restaurés, remis à niveau et bénéficier des dernières technologies.", href: "/programme-reborn/", cta: "Découvrir REBORN" },
  ] satisfies Card[],
  offers: [
    { title: "Contrat d'entretien", text: "Protégez votre investissement : les solutions LITTLE Care garantissent les performances et le bon fonctionnement de votre machine.", image: { src: "2023/03/2303-Atelier1.jpg", alt: "Révision d'un EBOX à l'atelier" }, href: "/contrats-dentretien-de-maintenance-little/" },
    { title: "Entretien hors saison", text: "Votre machine doit être disponible quand la saison reprend. LITTLE adapte la révision hors saison à vos contraintes.", image: { src: "2022/10/SAV2.jpg", alt: "Entretien d'un EBOX" }, href: "/contrats-dentretien-de-maintenance-little/" },
    { title: "Pièces d'origine", text: "Testées et conçues pour les conditions extrêmes, nos pièces protègent votre investissement.", image: { src: "2022/10/SAV4.jpg", alt: "Pièces détachées Little" }, href: "/pieces-dorigine-little/" },
    { title: "Accessoires", text: "Attelages, éclairages, passage en 4 roues motrices ou en batterie lithium : la gamme complète d'accessoires d'origine.", image: { src: "2022/10/SAV5.jpg", alt: "Accessoires EBOX" }, href: "/accessoires-ebox/" },
  ] satisfies Card[],
  quotes: [
    { text: "Nous avons 2 EBOX 4WD lithium pour l'entretien de la propriété et la récolte de l'eau de bouleau. À certaines périodes, le matériel doit absolument être opérationnel. J'apprécie avant tout le professionnalisme et la réactivité du SAV LITTLE.", author: "A. de Louvencourt", place: "Somme (80)" },
    { text: "Mon EBOX AWD lithium est très sollicité l'hiver sur un terrain extrêmement boueux. Le contrat de révision hors saison me garantit de l'avoir pendant toute la saison. Les révisions sont programmées par LITTLE.", author: "Yannick D.", place: "Seine-et-Marne (77)" },
    { text: "Le SAV assuré directement par LITTLE est un vrai plus : ils connaissent parfaitement le véhicule et savent même me dépanner par téléphone. En location longue durée, tout est pris en charge : c'est rassurant et efficace.", author: "X. D. Poisson", place: "Eure" },
  ],
  lldTeaser: "Votre EBOX entretenu et garanti par LITTLE à partir de 199 € HT par mois",
};

export const maintenance = {
  seo: {
    title: "Contrats d'entretien & de maintenance LITTLE",
    description: "Les contrats d'entretien et de maintenance LITTLE Care vous garantissent un véhicule toujours opérationnel.",
  },
  hero: {
    eyebrow: "LITTLE Care",
    title: "Contrat d'entretien & de maintenance",
    lead: "Les contrats LITTLE Care vous garantissent un véhicule toujours opérationnel.",
    image: { src: "2022/12/Header-Maintenance-v2.jpg", alt: "Technicien préparant des pièces pour l'entretien d'un EBOX" },
  } satisfies Hero,
  intro: "LITTLE adapte la révision de votre véhicule à vos exigences et à sa disponibilité. Nos techniciens sont formés régulièrement, efficaces, et vous offrent le meilleur rapport qualité-prix.",
  blocks: [
    { title: "Révision d'après-saison", paragraphs: ["Votre utilitaire a été sollicité toute la saison : offrez-lui une révision. Vous limitez la détérioration pendant l'arrêt, facilitez la reprise et assurez l'efficacité des machines utilisées toute l'année."] },
    { title: "Révision d'avant-saison", paragraphs: ["Votre machine n'a pas été révisée depuis longtemps ? Du contrôle visuel à la révision complète avec rapport d'état et de panne, vous disposez des informations nécessaires pour bien préparer l'année."] },
  ] satisfies TextBlock[],
};

export const pieces = {
  seo: {
    title: "Les pièces d'origine de nos utilitaires électriques",
    description: "Des pièces détachées d'origine, testées, fiables et conçues pour supporter des conditions extrêmes.",
  },
  hero: {
    eyebrow: "Pièces d'origine",
    title: "Pièces d'origine Little",
    lead: "Des pièces détachées testées, fiables et conçues pour supporter des conditions extrêmes.",
    image: { src: "2022/12/Header-Pieces-v2.jpg", alt: "Disque et moyeu de roue d'origine Little" },
  } satisfies Hero,
  why: {
    title: "Pourquoi choisir des pièces d'origine ?",
    lead: "LITTLE fabrique des utilitaires électriques de premier choix pour les professionnels. Le choix de l'origine est le choix garanti.",
    list: [
      "Installation toujours parfaite",
      "Pièces testées et fabriquées selon les spécifications d'origine",
      "Des performances toujours optimales",
      "Conçues pour supporter des conditions extrêmes",
    ],
    paragraphs: [
      "Nous proposons la plus large gamme de pièces LITTLE, avec de nombreuses références en stock. Notre équipe SAV a la formation, l'expérience et les équipements pour vous conseiller et vous envoyer les pièces dans les meilleurs délais.",
      "Nous assurons aussi la maintenance sur site : nos camions ateliers embarquent tout l'outillage nécessaire à l'entretien et à la réparation de votre utilitaire.",
    ],
  },
  eco: { title: "Nous réduisons notre empreinte", text: "Pour l'envoi de nos pièces détachées, nous réutilisons systématiquement les emballages de nos fournisseurs." },
};

export const reborn = {
  seo: {
    title: "Restauration et remise à niveau des utilitaires électriques",
    description: "Restauration et remise à niveau disponibles sur toute la gamme. Donnez une nouvelle vie à votre EBOX !",
  },
  hero: {
    eyebrow: "Économie circulaire",
    title: "Programme REBORN",
    lead: "Restauration et remise à niveau sur toute la gamme. Donnez une deuxième, et même une troisième vie à votre EBOX.",
    image: { src: "2022/12/Header_Reborn-v2.jpg", alt: "EBOX restauré, vert, sur une pelouse" },
  } satisfies Hero,
  intro: [
    "Vous n'avez pas acheté un véhicule jetable et vous voulez pérenniser votre investissement : nos utilitaires électriques sont conçus pour être restaurés et recevoir de nouveaux équipements.",
    "Pour LITTLE, l'économie circulaire n'est pas un vain mot.",
  ],
  steps: [
    { title: "Passage en batterie lithium", text: "Plus d'autonomie, plus de puissance, un véhicule plus léger et une durée de vie multipliée par 5." },
    { title: "Restauration mécanique", text: "Après une inspection méticuleuse, nous remplaçons toutes les pièces usées par des pièces d'origine." },
    { title: "Nouveaux équipements", text: "Direction assistée, chauffage, nouvelle benne avec vérin électrique : la plupart des équipements récents s'adaptent à votre EBOX." },
    { title: "Carrosserie", text: "Remplacement des éléments de carrosserie, nouvelle couleur : vous avez le choix." },
  ],
  image: { src: "2022/10/Image_Reborn.jpg", alt: "Châssis d'EBOX en cours de restauration" },
  warranty: "Et une nouvelle garantie de 12 ou 24 mois",
};

export const lld = {
  seo: {
    title: "Location longue durée d'utilitaires et véhicules électriques",
    description:
      "La location sans souci, disponible sur toute la gamme : la formule Full Service comprend la maintenance et la garantie, pour un véhicule toujours disponible et en parfait état.",
  },
  hero: {
    eyebrow: "LLD Full Service",
    title: "Location longue durée Little",
    lead: "La location sans souci : maintenance et garantie comprises, pour un véhicule toujours disponible et en parfait état.",
    image: { src: "2023/03/2303-Header-4.jpg", alt: "EBOX blanc devant des boxes à chevaux" },
  } satisfies Hero,
  intro: {
    title: "Utilisez-le, nous nous occupons du reste",
    text: "Avec la location longue durée LITTLE Full Service, concentrez-vous sur votre travail sans vous soucier de la maintenance ni de la garantie.",
  },
  pillars: [
    { title: "Le véhicule", text: "Vous choisissez votre matériel, ses équipements et ses accessoires selon vos besoins." },
    { title: "Full Service", text: "Révision, garantie, batterie, remplacement des pièces défectueuses : tout est compris*." },
    { title: "La durée", text: "Vous choisissez la durée, y compris en location saisonnière récurrente (par exemple 5 mois par an sur 4 ans)." },
    { title: "Les finances", text: "Les loyers sont comptabilisés en charges : votre budget est connu et maîtrisé." },
  ],
  footnote: "* À l'exception des pneus et de l'assurance, hors accident. Voir conditions générales de location.",
  examples: [
    { title: "EBOX 4WD XL", subtitle: "Pneus tout-terrain, batterie plomb", note: "Benne L 1 700 mm, ridelles amovibles", image: { src: "2022/10/2-3-places-benne.jpg", alt: "EBOX 4WD XL avec benne" }, speed: "40 km/h", payload: "500 kg", range: "25 km", price: 365 },
    { title: "EBOX 2WD Hi-Vision", subtitle: "Cabine Hi-Vision, batterie plomb", note: "Fourgon L 1 200, 2 rideaux latéraux", image: { src: "2022/12/Image3.jpg", alt: "EBOX 2WD avec fourgon" }, speed: "40 km/h", payload: "500 kg", range: "25 km", price: 313 },
    { title: "EBOX 4WD", subtitle: "Pneus tout-terrain, pare-brise, batterie plomb", note: "Benne acier galvanisé L 900 mm", image: { src: "2022/10/2places-4wd.jpg", alt: "EBOX 4WD avec benne galvanisée" }, speed: "40 km/h", payload: "500 kg", range: "25 km", price: 358 },
  ],
};

/* FAQ ----------------------------------------------------------------------- */

export const faq = {
  seo: {
    title: "Questions / réponses sur nos utilitaires électriques",
    description: "Retrouvez les réponses aux questions les plus fréquentes sur les véhicules électriques, les batteries et nos services.",
  },
  hero: {
    eyebrow: "Ressources",
    title: "Questions / réponses",
    lead: "Batteries, autonomie, homologation, entretien : les réponses aux questions les plus fréquentes.",
    image: { src: "2022/12/Header_FAQ-v2.jpg", alt: "EBOX au bord d'un terrain de sport" },
  } satisfies Hero,
  groups: [
    {
      title: "Les batteries",
      items: [
        { q: "Quelle est la durée de vie des batteries plomb ?", a: "La durée de vie d'une batterie se mesure en cycles, un cycle correspondant à une charge et une décharge complètes. Une batterie plomb tient de 500 à 600 cycles. Son entretien est déterminant : laissée presque vide, elle se décharge naturellement et risque la sous-tension. LITTLE utilise des batteries au plomb pur, qui acceptent des charges partielles d'une heure minimum ; faites tout de même régulièrement des cycles complets et ne laissez jamais le véhicule batteries vides." },
        { q: "Batterie lithium ou batterie plomb : que choisir ?", a: "La batterie lithium dure beaucoup plus longtemps, se recharge à tout moment quel que soit son niveau, et pèse 2,5 à 4 fois moins lourd à puissance égale. Elle offre aussi plus d'autonomie : un EBOX parcourt environ 25 à 30 km en plomb contre 45 à 50 km en lithium, et pèse 825 kg en plomb (4WD) contre 665 kg en lithium. Toute la gamme peut être équipée de l'une ou l'autre technologie selon votre utilisation." },
        { q: "Les batteries sont-elles recyclées ?", a: "La filière de recyclage des batteries plomb est bien établie : elles se recyclent à 99 %. Celle des batteries lithium s'organise avec la croissance du parc. Une batterie lithium automobile peut aussi connaître une seconde vie, par exemple en stockage stationnaire pour alimenter une maison." },
        { q: "Quel est l'avenir de la batterie lithium ?", a: "Le lithium-ion à électrolyte liquide s'est imposé et restera la norme encore une décennie. D'autres technologies sont à l'étude : le lithium-ion « solid state », qui améliore surtout la sécurité, le lithium métal ou le lithium-soufre pour de meilleures performances. Notre R&D assure une veille active, mais notre priorité reste une batterie fiable et sûre : LITTLE a choisi la technologie lithium fer-phosphate (LFP), le meilleur compromis entre sécurité, fiabilité et efficacité." },
      ],
    },
    {
      title: "Utilisation & services",
      items: [
        { q: "Combien de temps faut-il pour recharger un EBOX ?", a: "Un EBOX se recharge en 4 h environ sur une simple prise 220 V 16 A : 4 à 5 h en lithium, 4 h 30 en plomb pur (80 % en 3 h). Le BEGO se recharge en 6 h. Une charge complète coûte environ 1,20 €." },
        { q: "Les véhicules Little sont-ils homologués pour la route ?", a: "Oui. Tous les EBOX ont obtenu une homologation routière européenne, y compris les versions 6 et 9 places. Si vous roulez uniquement sur un site privé, l'homologation route est proposée en option." },
        { q: "Quel entretien demande un utilitaire électrique Little ?", a: "Pas de filtre, pas de vidange, des batteries sans entretien : un simple contrôle annuel suffit. Nos contrats LITTLE Care et nos révisions avant ou après saison garantissent la disponibilité de votre véhicule." },
        { q: "Peut-on louer un EBOX plutôt que l'acheter ?", a: "Oui, toute la gamme est disponible en location longue durée Full Service, de 36 à 60 mois, à partir de 199 € HT par mois : maintenance, garantie, batterie et pièces sont comprises, hors pneus et assurance." },
      ],
    },
  ],
};

/* Documentation ----------------------------------------------------------------- */

const UP = "/wp-content/uploads";

export const documentation = {
  seo: {
    title: "Fiches techniques des utilitaires électriques",
    description: "Téléchargez les brochures et fiches techniques de nos véhicules et utilitaires électriques.",
  },
  hero: {
    eyebrow: "Ressources",
    title: "Fiches techniques & brochures",
    lead: "Toute la gamme EBOX et BEGO en détail, à télécharger.",
    image: { src: "2023/01/Little_Header_New11.jpg", alt: "EBOX avec benne au bord d'un étang" },
  } satisfies Hero,
  brochures: [
    { title: "EBOX 4x4 — gamme Nature", image: { src: "2022/10/Gamme_nature.jpg", alt: "Couverture de la brochure EBOX Nature" }, href: `${UP}/2022/12/Brochure-Nature.pdf`, size: "1,4 Mo" },
    { title: "EBOX Industrie", image: { src: "2022/10/Gamme_industrie.jpg", alt: "Couverture de la brochure EBOX Industrie" }, href: `${UP}/2022/12/Brochure-Industrie.pdf`, size: "1,3 Mo" },
    { title: "BEGO", image: { src: "2022/10/Gamme_bego.jpg", alt: "Couverture de la brochure BEGO" }, href: `${UP}/2022/12/Brochure-Bego.pdf`, size: "1,7 Mo" },
  ],
  sheets: [
    { title: "EBOX 2/4WD 2/3 places benne", image: { src: "2022/10/2places_benne.jpg", alt: "EBOX 2/3 places benne" }, href: `${UP}/2023/01/3_LITTLE_EBOX_BENNE-Fiche_techniques-SP-1.pdf` },
    { title: "EBOX 2/4WD 2/3 places fourgon", image: { src: "2022/12/Bloc_Brochure_Fourgon.jpg", alt: "EBOX 2/3 places fourgon" }, href: `${UP}/2022/12/LITTLE_EBOX_FOURGON_LONG-Fiche_Technique_SP.pdf` },
    { title: "EBOX 2/4WD 6 places benne", image: { src: "2022/10/6places_benne.jpg", alt: "EBOX 6 places benne" }, href: `${UP}/2022/12/LITTLE_EBOX_6places-Fiche_technique_SP.pdf` },
    { title: "EBOX 2/4WD 9 places", image: { src: "2022/10/9places.jpg", alt: "EBOX 9 places" }, href: `${UP}/2022/12/LITTLE_EBOX_9places-Fiche_Techniques_SP.pdf` },
    { title: "EBOX XL 2/4WD 2/3 places benne", image: { src: "2022/10/2placesXL.jpg", alt: "EBOX XL 2/3 places benne" }, href: `${UP}/2022/12/LITTLE_EBOX_XL_BENNE-Fiche_techniques_SP.pdf` },
    { title: "EBOX XL 2/4WD 6 places benne", image: { src: "2022/10/6places-XL.jpg", alt: "EBOX XL 6 places benne" }, href: `${UP}/2022/12/LITTLE_EBOX_6places_XL-Fiche_Techniques_SP.pdf` },
  ],
};

/* Accessoires ------------------------------------------------------------------ */

export const accessoires = {
  seo: {
    title: "Tous les accessoires de nos utilitaires électriques",
    description:
      "Les accessoires d'origine LITTLE ou sélectionnés parmi nos partenaires améliorent vos conditions de travail, votre productivité, votre confort et votre sécurité.",
  },
  hero: {
    eyebrow: "Accessoires EBOX",
    title: "Des accessoires et des outils pour plus de productivité",
    lead: "Accessoires d'origine LITTLE ou sélectionnés chez nos partenaires, pour votre confort, votre productivité et votre sécurité.",
    image: { src: "2022/12/Header-Accessoires-v2.jpg", alt: "EBOX gris aux jantes rouges" },
  } satisfies Hero,
  groups: [
    {
      title: "Cabine",
      items: [
        { title: "Pare-brise et essuie-glace", text: "Dégivrage intégré au pare-brise pour une consommation électrique maîtrisée. De série sur EBOX 4WD.", image: "2022/11/Accessoire-PARE-BRISE-ESSUIE-GLACE.jpg" },
        { title: "Cloison arrière", text: "Protection arrière de la cabine.", image: "2022/11/Accessoire-CLOISON-ARRIERE.jpg" },
        { title: "Vitrage de cloison arrière", text: "Pour une meilleure visibilité en manœuvre.", image: "2022/11/Accessoire-VITRAGE-CLOISON-ARRIERE.jpg" },
        { title: "Bâche souple", text: "Un moyen efficace et économique de protéger la cabine. Pour EBOX 2, 6 et 9 places.", image: "2022/11/Accessoire-BACHE.jpg" },
        { title: "Chauffage intégré", text: "Deux bouches d'aération orientables intégrées au tableau de bord." },
        { title: "Chauffage additionnel", text: "Chauffage d'appoint fixé sur le tableau de bord." },
        { title: "Direction assistée", text: "Direction assistée électrique pour un maniement plus facile.", image: "2022/11/Accessoire-DIRECTION-ASSISTEE.jpg" },
        { title: "Sélecteur de vitesse", text: "Trois vitesses programmables : pédale au plancher, l'EBOX roule à la vitesse choisie.", image: "2022/11/Accessoire-SELECTEUR-VITESSE.jpg" },
        { title: "Accélérateur à main", text: "Réglez la vitesse du véhicule à la main.", image: "2022/11/Accessoire-ACCELERATEUR.jpg" },
      ],
    },
    {
      title: "Pneumatiques et jantes",
      items: [
        { title: "Pneus tout-terrain", text: "Une motricité en toute circonstance, en 6 ou 8 plis. Réducteur court inclus.", image: "2022/11/Accessoire-PNEUS-TOUT-TERRAIN.jpg" },
        { title: "Jantes alliage", text: "Pour alléger et personnaliser votre EBOX." },
        { title: "Pneus gazon", text: "Préservent les pelouses, terrains de sport et golfs.", image: "2022/11/Accessoire-PNEUS-GAZON.jpg" },
      ],
    },
    {
      title: "Protection du véhicule",
      items: [
        { title: "Pare-buffle", text: "Protège efficacement l'avant de votre EBOX.", image: "2022/11/Accessoire-PARE-BUFFLE.jpg" },
        { title: "Pare-buffle avec porte-bagages", text: "Pare-branches associé à un solide porte-bagages, en acier et peinture époxy.", image: "2022/11/Accessoire-PORTE-BAGAGE.jpg" },
        { title: "Treuil électrique", text: "Ce treuil télécommandé vous sort des situations les plus difficiles.", image: "2022/11/Accessoire-TREUIL.jpg" },
        { title: "Tôle de soubassement", text: "Acier galvanisé pour une protection exceptionnelle du soubassement.", image: "2022/11/Accessoire-TOLE.jpg" },
        { title: "Chargeur étanche", text: "Un chargeur pour les milieux difficiles et exposés aux intempéries.", image: "2022/11/Accessoire-CHARGEUR-ETANCHE.jpg" },
      ],
    },
    {
      title: "Travail",
      items: [
        { title: "Prise agricole", text: "Pour brancher un accessoire de travail : agrainoir…", image: "2022/11/Accessoire-PRISE-AGRICOLE.jpg" },
        { title: "Attelage simple ou double", text: "Boule standard et prise remorque, ou boule standard, barreau et prise remorque.", image: "2022/12/Accessoire_Attelage.jpg" },
        { title: "Phare de travail LED", text: "Un éclairage puissant pour travailler de nuit.", image: "2022/11/Accessoire-PHARE.jpg" },
      ],
    },
    {
      title: "Sécurité et signalisation",
      items: [
        { title: "Gyrophare LED", text: "Signalez votre présence sur les sites et la voirie.", image: "2022/11/Accessoire-GIROPHARE.jpg" },
        { title: "Buzzer de marche avant", text: "Un signal sonore prévient les piétons quand le véhicule avance, silence électrique oblige.", image: "2022/12/Accessoire_buzzer.jpg" },
        { title: "Triangle LED AK5", text: "Signalisation lumineuse de véhicule lent.", image: "2022/11/Accessoire-TRIANGLE.jpg" },
        { title: "Extincteur", text: "Pour intervenir sans attendre.", image: "2022/11/Accessoire-EXTINCTEUR.jpg" },
        { title: "Bande réfléchissante", text: "Une meilleure visibilité de nuit.", image: "2022/11/Accessoire-BANDE-REFLECHISSANTE.jpg" },
      ],
    },
  ],
};

/* Occasions -------------------------------------------------------------------- */

export type UsedVehicle = {
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  condition: string;
  energy: string;
  km: number;
  priceHt: number;
  available?: string;
  description: string[];
  images: Img[];
};

export const occasions = {
  seo: {
    title: "Nos utilitaires et véhicules électriques d'occasion",
    description: "Découvrez notre sélection de véhicules électriques d'occasion testés et garantis.",
  },
  hero: {
    eyebrow: "Occasion",
    title: "Nos véhicules d'occasion",
    lead: "Des utilitaires électriques d'occasion testés et garantis par nos techniciens.",
    image: { src: "2023/01/Little_Header_New18.jpg", alt: "EBOX vert canard en forêt" },
  } satisfies Hero,
  items: [
    {
      slug: "little-ebox-4wd-xl-lithium-fourgon",
      title: "LITTLE EBOX 4WD XL Lithium Fourgon",
      brand: "Little",
      model: "EBOX 4WD XL Lithium Fourgon",
      year: 2024,
      condition: "Excellent, état neuf",
      energy: "Électrique",
      km: 10,
      priceHt: 30000,
      description: [
        "Batterie lithium 20 kWh",
        "Cabine fermée, chauffage, direction assistée",
        "Grand fourgon L 1 700 × l 1 400 × h 1 000 mm, 2 rideaux latéraux",
        "Homologué route",
      ],
      images: [
        { src: "2024/10/20241023_112340.jpg", alt: "EBOX 4WD XL Lithium Fourgon, vue avant trois quarts" },
        { src: "2024/10/20241023_112347.jpg", alt: "EBOX 4WD XL Lithium Fourgon, vue latérale" },
        { src: "2024/10/20241023_112358.jpg", alt: "EBOX 4WD XL Lithium Fourgon, rideau latéral" },
        { src: "2024/10/20241023_112458.jpg", alt: "EBOX 4WD XL Lithium Fourgon, vue arrière" },
      ],
    },
    {
      slug: "goupil-g5",
      title: "GOUPIL G5",
      brand: "Goupil",
      model: "G5",
      year: 2014,
      condition: "Bon",
      energy: "Électrique",
      km: 8000,
      priceHt: 9400,
      available: "Mars 2023",
      description: ["Utilitaire électrique 2 places", "Benne basculante", "Batterie 160 Ah", "Pare-brise dégivrant", "Permis B1"],
      images: [{ src: "2023/01/goupil-g5.jpg", alt: "Utilitaire électrique Goupil G5 avec benne basculante" }],
    },
  ] satisfies UsedVehicle[],
};

/* Contact, SAV, remerciement ------------------------------------------------------ */

export const contact = {
  seo: {
    title: "Contactez-nous pour en savoir plus sur nos utilitaires électriques",
    description: "Nous serons ravis de vous aider et de vous conseiller sur nos véhicules et utilitaires électriques. Demandez un devis ou un essai.",
  },
  hero: {
    eyebrow: "Contact",
    title: "Contactez-nous pour plus d'informations",
    lead: "Ou pour réaliser un essai.",
    image: { src: "2023/03/2303-Header-2.jpg", alt: "EBOX vert en forêt" },
  } satisfies Hero,
};

export const savRequest = {
  seo: {
    title: "Service après-vente de votre véhicule électrique",
    description: "Faites une demande de SAV pour votre véhicule Little. Consultez d'abord notre FAQ : la réponse s'y trouve peut-être.",
  },
  hero: {
    eyebrow: "SAV",
    title: "Faire une demande de SAV",
    lead: "La réponse est peut-être déjà dans notre FAQ. Sinon, décrivez votre besoin : un technicien vous recontacte.",
    image: { src: "2023/02/Header_SAV.jpg", alt: "Technicien sous un EBOX sur un pont élévateur" },
  } satisfies Hero,
  image: { src: "2022/10/Image_dde_sav.jpg", alt: "Intervention du SAV Little" },
};

export const thanks = {
  seo: { title: "Merci pour votre demande", description: "Nous avons bien reçu votre message." },
  title: "Merci pour votre demande",
  text: "Nous avons bien reçu votre message et revenons très vite vers vous.",
};

/* Landing pages Google Ads (noindex) ------------------------------------------------ */

export const landings: Record<string, { seo: Seo; h1: string }> = {
  "ssv-electrique": { seo: { title: "SSV électrique", description: "Une large gamme de SSV électriques adaptés à tous les métiers, conçus et fabriqués en France." }, h1: "Découvrez nos SSV électriques" },
  "utv-electrique": { seo: { title: "UTV électrique", description: "Une large gamme d'UTV électriques adaptés à tous les métiers, conçus et fabriqués en France." }, h1: "Découvrez nos UTV électriques" },
  "mule-electrique": { seo: { title: "Mule électrique", description: "Leader des mules électriques en France : une gamme adaptée à tous les métiers, conçue et fabriquée en France." }, h1: "Leader des mules électriques en France" },
  "4x4-electrique": { seo: { title: "4x4 électrique", description: "Des utilitaires 4x4 électriques adaptés à tous les métiers, conçus et fabriqués en France." }, h1: "Découvrez nos utilitaires 4x4 électriques" },
};

export const landingContent = {
  lead: "Une large gamme de véhicules électriques adaptés à tous les métiers : agriculture, élevage, centre équestre, pépinière, domaine de chasse…",
  points: [
    "Tous nos véhicules sont conçus et fabriqués en France, dans nos ateliers de Gien (45).",
    "Les techniciens qui construisent les véhicules sont aussi ceux qui en assurent la maintenance.",
    "Disponibles à l'achat ou en location longue durée Full Service : à partir de 239 € HT par mois ou 12 470 € HT à l'achat.",
  ],
  benefits: [
    "Zéro émission, zéro compromis : une conduite écologique sans sacrifier la performance",
    "Une autonomie jusqu'à 100 km pour aller où vous voulez",
    "Un 4x4 tout-terrain de confiance, des sentiers escarpés aux routes enneigées",
    "Des modèles entièrement personnalisables",
  ],
  gallery: [
    { src: "2023/09/WhatsApp-Image-2023-09-17-at-19.51.48-2.jpeg", alt: "EBOX livré à un client" },
    { src: "2023/09/WhatsApp-Image-2023-09-17-at-19.50.24.jpeg", alt: "EBOX en situation chez un client" },
    { src: "2023/09/WhatsApp-Image-2023-09-17-at-19.51.48-1.jpeg", alt: "EBOX au travail" },
    { src: "2023/09/WhatsApp-Image-2023-09-17-at-19.52.26.jpeg", alt: "EBOX sur son terrain" },
    { src: "2023/09/WhatsApp-Image-2023-09-17-at-19.50.24-2.jpeg", alt: "EBOX chez un client" },
    { src: "2023/09/WhatsApp-Image-2023-09-17-at-19.52.22.jpeg", alt: "EBOX en utilisation" },
  ] satisfies Img[],
};
