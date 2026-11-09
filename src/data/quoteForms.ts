export type QuoteField = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  options?: string[];
  /** Question asked by the chatbot for select fields (the first two select fields are used). */
  chatPrompt?: string;
};

export const quoteFieldsByOffer: Record<string, QuoteField[]> = {
  auto: [
    { name: "usage", label: "Usage du véhicule", type: "select", options: ["Privé", "Privé et professionnel", "Professionnel"], chatPrompt: "Quel est l'usage du véhicule ?" },
    { name: "vehicleAge", label: "Âge du véhicule", type: "select", options: ["Neuf", "1 à 5 ans", "6 à 10 ans", "Plus de 10 ans"], chatPrompt: "Quel âge a le véhicule ?" },
    { name: "vehicle", label: "Marque et modèle", type: "text" },
    { name: "power", label: "Puissance fiscale (CV)", type: "number" },
    { name: "expiry", label: "Échéance du contrat actuel", type: "date" },
  ],
  habitation: [
    { name: "status", label: "Vous êtes", type: "select", options: ["Propriétaire", "Locataire"], chatPrompt: "Vous êtes propriétaire ou locataire ?" },
    { name: "homeType", label: "Type de logement", type: "select", options: ["Appartement", "Maison", "Villa"], chatPrompt: "De quel type de logement s'agit-il ?" },
    { name: "surface", label: "Surface approximative (m²)", type: "number" },
    { name: "district", label: "Quartier ou ville", type: "text" },
  ],
  sante: [
    { name: "coverType", label: "Couverture souhaitée", type: "select", options: ["Individuelle", "Couple", "Famille"], chatPrompt: "Qui souhaitez-vous couvrir ?" },
    { name: "amo", label: "Êtes-vous affilié à l'AMO ?", type: "select", options: ["Oui", "Non", "Je ne sais pas"], chatPrompt: "Êtes-vous déjà affilié à l'AMO ?" },
    { name: "people", label: "Nombre de personnes", type: "number" },
  ],
  voyage: [
    { name: "purpose", label: "Motif du voyage", type: "select", options: ["Visa Schengen", "Vacances", "Omra ou Hajj", "Études", "Affaires"], chatPrompt: "Quel est le motif du voyage ?" },
    { name: "duration", label: "Durée du séjour", type: "select", options: ["Moins de 15 jours", "15 à 30 jours", "1 à 3 mois", "Multi-voyages annuel"], chatPrompt: "Combien de temps dure le séjour ?" },
    { name: "destination", label: "Pays de destination", type: "text" },
    { name: "startDate", label: "Date de départ", type: "date" },
    { name: "people", label: "Nombre de voyageurs", type: "number" },
  ],
  "epargne-retraite": [
    { name: "goal", label: "Votre objectif", type: "select", options: ["Préparer la retraite", "Financer les études", "Constituer une épargne"], chatPrompt: "Quel est votre objectif principal ?" },
    { name: "horizon", label: "Horizon envisagé", type: "select", options: ["Moins de 5 ans", "5 à 10 ans", "Plus de 10 ans"], chatPrompt: "Sur quel horizon ?" },
  ],
  prevoyance: [
    { name: "family", label: "Situation familiale", type: "select", options: ["Seul(e)", "En couple", "Avec enfants"], chatPrompt: "Quelle est votre situation familiale ?" },
    { name: "need", label: "Votre priorité", type: "select", options: ["Protéger mes proches", "Couvrir un crédit", "Préserver mes revenus"], chatPrompt: "Quelle est votre priorité ?" },
  ],
  "multirisque-pro": [
    { name: "sector", label: "Secteur d'activité", type: "select", options: ["Commerce", "Restauration", "Artisanat", "Profession libérale", "Bureaux et services"], chatPrompt: "Quel est votre secteur d'activité ?" },
    { name: "premises", label: "Vos locaux", type: "select", options: ["Propriétaire", "Locataire"], chatPrompt: "Êtes-vous propriétaire ou locataire de vos locaux ?" },
    { name: "employees", label: "Nombre de salariés", type: "number" },
    { name: "need", label: "Ce que vous souhaitez protéger", type: "text" },
  ],
  flotte: [
    { name: "vehicles", label: "Nombre de véhicules", type: "select", options: ["3 à 5", "6 à 15", "16 à 50", "Plus de 50"], chatPrompt: "Combien de véhicules compte votre parc ?" },
    { name: "vehicleType", label: "Type de véhicules", type: "select", options: ["Véhicules légers", "Utilitaires", "Poids lourds", "Mixte"], chatPrompt: "De quels véhicules s'agit-il ?" },
    { name: "sector", label: "Secteur d'activité", type: "text" },
  ],
  "responsabilite-civile": [
    { name: "sector", label: "Type d'activité", type: "select", options: ["Profession libérale", "Bâtiment et travaux", "Conseil et services", "Santé", "Commerce"], chatPrompt: "Quel type d'activité exercez-vous ?" },
    { name: "employees", label: "Effectif", type: "select", options: ["Seul(e)", "2 à 9", "10 à 49", "50 et plus"], chatPrompt: "Quel est votre effectif ?" },
    { name: "need", label: "Vos prestations", type: "text" },
  ],
  "accidents-travail": [
    { name: "sector", label: "Secteur d'activité", type: "select", options: ["Industrie", "BTP", "Commerce", "Hôtellerie-restauration", "Services"], chatPrompt: "Quel est votre secteur d'activité ?" },
    { name: "employees", label: "Nombre de salariés", type: "select", options: ["1 à 9", "10 à 49", "50 à 199", "200 et plus"], chatPrompt: "Combien de salariés employez-vous ?" },
    { name: "need", label: "Principaux métiers exercés", type: "text" },
  ],
  "sante-groupe": [
    { name: "employees", label: "Salariés à couvrir", type: "select", options: ["5 à 19", "20 à 49", "50 à 199", "200 et plus"], chatPrompt: "Combien de salariés souhaitez-vous couvrir ?" },
    { name: "current", label: "Couverture actuelle", type: "select", options: ["Aucune", "AMO seule", "Contrat à renégocier"], chatPrompt: "Quelle est votre couverture actuelle ?" },
    { name: "sector", label: "Secteur d'activité", type: "text" },
  ],
};

export const chatQuestionsFor = (slug: string) =>
  (quoteFieldsByOffer[slug] ?? []).filter((field) => field.type === "select" && field.chatPrompt).slice(0, 2);

/**
 * In-memory prefill shared between the chatbot and the /devis form (client-side navigation only).
 * Nothing is persisted.
 */
export type QuotePrefill = { product: string; details: Record<string, string>; firstName?: string; phone?: string; channel?: string };
let quotePrefill: QuotePrefill | null = null;
export const setQuotePrefill = (value: QuotePrefill) => { quotePrefill = value; };
export const takeQuotePrefill = (product: string) => {
  const value = quotePrefill && quotePrefill.product === product ? quotePrefill : null;
  quotePrefill = null;
  return value;
};
