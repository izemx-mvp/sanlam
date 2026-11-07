export type QuoteField = { name: string; label: string; type: "text" | "number" | "date" | "select"; options?: string[]; placeholder?: string };

export const quoteFieldsByOffer: Record<string, QuoteField[]> = {
  auto: [
    { name: "vehicle", label: "Véhicule", type: "text", placeholder: "Ex. Dacia Sandero" },
    { name: "year", label: "Année", type: "number", placeholder: "2022" },
    { name: "power", label: "Puissance fiscale", type: "number", placeholder: "7" },
    { name: "usage", label: "Usage", type: "select", options: ["Privé", "Privé et professionnel", "Professionnel"] },
    { name: "expiry", label: "Échéance du contrat actuel", type: "date" },
  ],
  habitation: [
    { name: "status", label: "Vous êtes", type: "select", options: ["Propriétaire", "Locataire"] },
    { name: "homeType", label: "Type de logement", type: "select", options: ["Appartement", "Maison", "Autre"] },
    { name: "surface", label: "Surface approximative (m²)", type: "number", placeholder: "85" },
    { name: "city", label: "Ville du logement", type: "text", placeholder: "Casablanca" },
  ],
  sante: [
    { name: "coverType", label: "Couverture souhaitée", type: "select", options: ["Individuelle", "Famille"] },
    { name: "people", label: "Nombre de personnes", type: "number", placeholder: "2" },
  ],
  voyage: [
    { name: "destination", label: "Destination", type: "text", placeholder: "Espagne" },
    { name: "startDate", label: "Départ", type: "date" },
    { name: "endDate", label: "Retour", type: "date" },
    { name: "people", label: "Nombre de voyageurs", type: "number", placeholder: "2" },
  ],
  "epargne-retraite": [
    { name: "goal", label: "Votre objectif", type: "select", options: ["Préparer la retraite", "Constituer une épargne", "Protéger mes proches"] },
    { name: "horizon", label: "Horizon envisagé", type: "select", options: ["Moins de 5 ans", "5 à 10 ans", "Plus de 10 ans"] },
  ],
  prevoyance: [
    { name: "family", label: "Situation familiale", type: "select", options: ["Seul(e)", "En couple", "Avec enfants"] },
    { name: "need", label: "Votre priorité", type: "select", options: ["Protéger mes proches", "Préserver mes revenus", "Faire le point"] },
  ],
  "multirisque-pro": [
    { name: "sector", label: "Secteur d'activité", type: "text", placeholder: "Commerce, restauration…" },
    { name: "employees", label: "Nombre de salariés", type: "number", placeholder: "4" },
    { name: "city", label: "Ville", type: "text", placeholder: "Casablanca" },
    { name: "need", label: "Besoin principal", type: "text", placeholder: "Local, matériel…" },
  ],
  flotte: [
    { name: "sector", label: "Secteur d'activité", type: "text", placeholder: "Transport, services…" },
    { name: "vehicles", label: "Nombre de véhicules", type: "number", placeholder: "5" },
    { name: "city", label: "Ville", type: "text", placeholder: "Casablanca" },
  ],
  "responsabilite-civile": [
    { name: "sector", label: "Secteur d'activité", type: "text", placeholder: "Conseil, bâtiment…" },
    { name: "employees", label: "Nombre de salariés", type: "number", placeholder: "3" },
    { name: "city", label: "Ville", type: "text", placeholder: "Casablanca" },
    { name: "need", label: "Votre activité", type: "text", placeholder: "Décrivez vos prestations" },
  ],
  "accidents-travail": [
    { name: "sector", label: "Secteur d'activité", type: "text", placeholder: "Bâtiment, industrie…" },
    { name: "employees", label: "Nombre de salariés", type: "number", placeholder: "12" },
    { name: "city", label: "Ville", type: "text", placeholder: "Casablanca" },
    { name: "need", label: "Activités exercées", type: "text", placeholder: "Décrivez les principaux métiers" },
  ],
  "sante-groupe": [
    { name: "sector", label: "Secteur d'activité", type: "text", placeholder: "Votre secteur" },
    { name: "employees", label: "Nombre de salariés", type: "number", placeholder: "12" },
    { name: "city", label: "Ville", type: "text", placeholder: "Casablanca" },
    { name: "need", label: "Besoin principal", type: "text", placeholder: "Votre priorité pour l'équipe" },
  ],
};