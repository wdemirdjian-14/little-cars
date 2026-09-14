/**
 * Définition des formulaires, partagée par l'affichage (components/LeadForm)
 * et la validation serveur (app/api/demande/route.ts).
 */

export type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  required?: boolean;
  options?: string[];
  autoComplete?: string;
  /** Occupe une demi-largeur sur grand écran. */
  half?: boolean;
};

export type FormId = "contact" | "sav" | "devis";

export type FormDef = {
  id: FormId;
  title: string;
  intro: string;
  submitLabel: string;
  fields: Field[];
};

const SECTEURS = [
  "Agriculture",
  "Élevage",
  "Centre équestre",
  "Domaine de chasse",
  "Domaine viticole",
  "Domaine forestier",
  "Industrie & logistique",
  "Collectivité",
  "Zoo, loisirs & tourisme",
  "Autre",
];

const ECHEANCES = ["Moins d'un mois", "Entre 2 et 3 mois", "Entre 3 et 6 mois", "Plus de 6 mois"];

const identity: Field[] = [
  { name: "prenom", label: "Prénom", type: "text", required: true, autoComplete: "given-name", half: true },
  { name: "nom", label: "Nom", type: "text", required: true, autoComplete: "family-name", half: true },
  { name: "telephone", label: "Téléphone", type: "tel", required: true, autoComplete: "tel", half: true },
  { name: "email", label: "E-mail", type: "email", required: true, autoComplete: "email", half: true },
];

export const forms: Record<FormId, FormDef> = {
  contact: {
    id: "contact",
    title: "Envoyez-nous un message",
    intro: "Une question, un devis, un essai ? Nous vous répondons sous 48 h ouvrées.",
    submitLabel: "Envoyer ma demande",
    fields: [
      ...identity,
      { name: "secteur", label: "Secteur d'activité", type: "select", options: SECTEURS, half: true },
      { name: "echeance", label: "Date prévue d'acquisition", type: "select", options: ECHEANCES, half: true },
      { name: "sujet", label: "Objet", type: "text" },
      { name: "message", label: "Message", type: "textarea", required: true },
    ],
  },
  sav: {
    id: "sav",
    title: "Décrivez votre besoin",
    intro: "Indiquez le modèle et, si possible, le numéro de série : notre technicien pourra préparer son intervention.",
    submitLabel: "Envoyer la demande de SAV",
    fields: [
      ...identity,
      { name: "entreprise", label: "Entreprise", type: "text", autoComplete: "organization", half: true },
      { name: "modele", label: "Modèle", type: "select", options: ["LITTLE EBOX", "LITTLE BEGO", "LITTLE 4", "City Fun / City Garden", "Autre"], half: true },
      { name: "numero_serie", label: "Numéro de série", type: "text", half: true },
      { name: "sujet", label: "Objet", type: "text", half: true },
      { name: "message", label: "Description du problème", type: "textarea", required: true },
    ],
  },
  devis: {
    id: "devis",
    title: "Recevez une proposition",
    intro: "Un conseiller Little vous rappelle pour définir la configuration adaptée à votre activité.",
    submitLabel: "Être rappelé",
    fields: [
      ...identity,
      { name: "secteur", label: "Secteur d'activité", type: "select", options: SECTEURS, required: true, half: true },
      { name: "echeance", label: "Date prévue d'acquisition", type: "select", options: ECHEANCES, required: true, half: true },
      { name: "message", label: "Votre projet", type: "textarea", required: true },
    ],
  },
};
