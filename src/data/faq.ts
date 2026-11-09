import { site } from "@/config/site";

export type FaqCategory = "Devis" | "Contrats" | "Sinistres" | "Paiement" | "L'agence";
export type FaqItem = { q: string; a: string; category: FaqCategory };

export const faqCategories: FaqCategory[] = ["Devis", "Contrats", "Sinistres", "Paiement", "L'agence"];

export const faqItems: FaqItem[] = [
  // Devis
  { category: "Devis", q: "Comment obtenir un devis d'assurance ?", a: "Remplissez notre formulaire en ligne en deux minutes, écrivez-nous sur WhatsApp ou passez à l'agence. Votre conseiller étudie votre besoin et vous envoie une proposition détaillée." },
  { category: "Devis", q: "Le devis est-il gratuit ?", a: "Oui, le devis est entièrement gratuit et sans engagement. Vous prenez le temps de le comparer et de nous poser vos questions avant de décider." },
  { category: "Devis", q: "Sous quel délai vais-je recevoir mon devis ?", a: "Pour l'auto, l'habitation, la santé et le voyage, vous recevez une proposition sous 24 h ouvrées. Pour les risques professionnels, comptez 48 à 72 h, le temps d'étudier votre activité." },
  { category: "Devis", q: "Pourquoi ne pas afficher de tarif en ligne ?", a: "Chaque tarif dépend de votre profil, de vos biens et des garanties choisies. Un prix affiché sans ces éléments serait trompeur : nous préférons vous remettre un devis personnalisé et exact." },
  { category: "Devis", q: "Quels documents prévoir pour un devis auto ?", a: "La carte grise, votre permis de conduire et, si vous êtes déjà assuré, l'attestation de votre assureur actuel. Une photo envoyée par WhatsApp suffit." },
  // Contrats
  { category: "Contrats", q: "Puis-je changer d'assureur pour vous rejoindre ?", a: "Oui. Nous vérifions avec vous la date d'échéance de votre contrat actuel et le préavis à respecter, puis nous préparons la transition pour éviter toute période sans couverture." },
  { category: "Contrats", q: "Comment modifier mon contrat en cours d'année ?", a: "Changement de véhicule, déménagement, nouveau conducteur : prévenez l'agence. Nous établissons un avenant et vous remettons la nouvelle attestation." },
  { category: "Contrats", q: "Comment résilier un contrat ?", a: "La résiliation se fait par écrit en respectant le préavis prévu au contrat, généralement avant l'échéance annuelle. Nous vous aidons à rédiger le courrier." },
  { category: "Contrats", q: "Où retrouver mes conditions générales ?", a: "Elles vous sont remises à la signature. Si vous les avez égarées, demandez-les à l'agence : nous vous les renvoyons par e-mail." },
  { category: "Contrats", q: "Puis-je regrouper plusieurs contrats à l'agence ?", a: "Bien sûr. Auto, habitation, santé ou contrats professionnels : un interlocuteur unique suit l'ensemble et vous propose un point annuel." },
  // Sinistres
  { category: "Sinistres", q: "Quel est le délai pour déclarer un sinistre ?", a: "En règle générale cinq jours ouvrés, deux jours en cas de vol et 48 heures pour un accident du travail. Plus vous déclarez tôt, plus le dossier avance vite." },
  { category: "Sinistres", q: "Que faire juste après un accident de voiture ?", a: "Mettez-vous en sécurité, remplissez un constat amiable avec l'autre conducteur, prenez des photos puis contactez l'agence. Nous vérifions le constat avec vous avant transmission." },
  { category: "Sinistres", q: "Qui contacter en cas de panne ou d'accident la nuit ?", a: "Appelez le numéro d'assistance qui figure sur votre attestation : il est joignable 24h/24. Prévenez ensuite l'agence dès son ouverture." },
  { category: "Sinistres", q: "Comment suivre l'avancement de mon dossier ?", a: "Votre dossier est suivi par Youssef El Idrissi, notre responsable sinistres. Appelez l'agence ou écrivez sur WhatsApp en indiquant votre numéro de contrat." },
  { category: "Sinistres", q: "Un expert va-t-il passer ?", a: "Pour les dommages importants, un expert est mandaté pour évaluer les dégâts. Conservez les biens endommagés et les factures jusqu'à son passage." },
  // Paiement
  { category: "Paiement", q: "Quels moyens de paiement acceptez-vous ?", a: "Espèces, carte bancaire, chèque et virement à l'agence. Les prélèvements mensuels sont possibles pour certains contrats." },
  { category: "Paiement", q: "Puis-je payer en plusieurs fois ?", a: "Oui, selon le contrat, la prime peut être réglée en deux, quatre ou douze échéances. Votre conseiller vous précise les possibilités lors du devis." },
  { category: "Paiement", q: "Que se passe-t-il en cas de retard de paiement ?", a: "Nous vous contactons avant toute suspension. Prévenez-nous en cas de difficulté : une solution est presque toujours possible." },
  { category: "Paiement", q: "Recevrai-je une quittance ?", a: "Une quittance est remise pour chaque règlement, à l'agence ou par e-mail. Elle vous sert de justificatif de paiement." },
  // L'agence
  { category: "L'agence", q: "Quels sont vos horaires d'ouverture ?", a: `L'agence est ouverte du lundi au samedi de 9h00 à 20h00, dès 8h00 le jeudi. Elle est fermée le dimanche.` },
  { category: "L'agence", q: "Où se trouve l'agence ?", a: `Nous vous accueillons ${site.address}. Un stationnement est possible dans les rues voisines.` },
  { category: "L'agence", q: "Faut-il prendre rendez-vous ?", a: "Non, vous pouvez passer sans rendez-vous. Pour un dossier professionnel, un rendez-vous permet de vous consacrer le temps nécessaire." },
  { category: "L'agence", q: "Puis-je parler directement à un conseiller ?", a: `Bien sûr. Appelez l'agence au ${site.phone} ou écrivez-nous sur WhatsApp au même numéro : un conseiller vous répond aux heures d'ouverture.` },
  { category: "L'agence", q: `Quel est le lien entre l'agence et ${site.insurer} ?`, a: `${site.name} est agent général ${site.insurer} : nous vous conseillons, souscrivons et gérons vos contrats ${site.insurer} localement, à Tanger.` },
];

/** Six questions for the home page */
export const faqs = [faqItems[0], faqItems[1], faqItems[2], faqItems[10], faqItems[19], faqItems[22]].filter(
  (item): item is FaqItem => Boolean(item),
);

export const sinistreFaqs = faqItems.filter((item) => item.category === "Sinistres");
