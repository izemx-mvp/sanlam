import type { IconName } from "@/lib/icons";

export type Pack = { title: string; text: string; icon: IconName; lines: string[]; product: string; featured?: boolean };

export const packs: Record<"Particuliers" | "Professionnels", Pack[]> = {
  Particuliers: [
    { title: "Auto + Habitation", text: "Votre voiture et votre logement réunis chez un seul interlocuteur, avec une échéance unique.", icon: "House", lines: ["Assurance auto", "Assurance habitation", "Assistance 24h/24"], product: "auto" },
    { title: "Famille sereine", text: "La santé de toute la famille, la protection de vos proches et un projet d'épargne pour les enfants.", icon: "HeartHandshake", lines: ["Assurance santé", "Prévoyance & vie", "Épargne études", "Habitation"], product: "sante", featured: true },
    { title: "Jeune actif", text: "Premier emploi, premier logement, premiers voyages : l'essentiel pour bien démarrer.", icon: "GraduationCap", lines: ["Assurance auto", "Habitation locataire", "Assurance voyage"], product: "auto" },
  ],
  Professionnels: [
    { title: "Commerçant", text: "Votre boutique, votre stock et votre responsabilité couverts, avec la perte d'exploitation en option.", icon: "Store", lines: ["Multirisque professionnelle", "RC exploitation", "Accidents du travail"], product: "multirisque-pro" },
    { title: "Professions libérales", text: "Cabinet, responsabilité professionnelle et protection personnelle du praticien.", icon: "Briefcase", lines: ["RC professionnelle", "Multirisque du cabinet", "Prévoyance", "Santé"], product: "responsabilite-civile", featured: true },
    { title: "Transporteurs", text: "Votre flotte, vos chauffeurs et les marchandises transportées, gérés dans un seul dossier.", icon: "Truck", lines: ["Assurance flotte", "Marchandises transportées", "Accidents du travail"], product: "flotte" },
  ],
};

export const hubFaqs: Record<"Particuliers" | "Professionnels", { q: string; a: string }[]> = {
  Particuliers: [
    { q: "Puis-je regrouper tous mes contrats à l'agence ?", a: "Oui, et c'est même recommandé : un seul interlocuteur suit votre auto, votre habitation et votre santé, avec un point annuel pour ajuster vos garanties." },
    { q: "Combien de temps pour recevoir un devis ?", a: "Vous recevez une proposition personnalisée sous 24 h ouvrées pour la plupart des assurances particuliers." },
    { q: "Puis-je souscrire à distance ?", a: "Oui. Nous échangeons par téléphone ou WhatsApp, et la signature peut se faire à l'agence ou à distance selon le contrat." },
    { q: "Les MRE peuvent-ils assurer un bien au Maroc ?", a: "Bien sûr. Nous assurons régulièrement des logements et véhicules de Marocains résidant à l'étranger, avec un suivi à distance." },
  ],
  Professionnels: [
    { q: "Pouvez-vous vous déplacer dans mon entreprise ?", a: "Oui, pour évaluer vos locaux, votre activité ou votre parc de véhicules, un conseiller se déplace à Tanger, en zone franche et dans la région." },
    { q: "Quelles assurances sont obligatoires pour une entreprise ?", a: "La responsabilité civile automobile pour vos véhicules et l'assurance accidents du travail dès le premier salarié. Certaines professions ont aussi une RC professionnelle obligatoire." },
    { q: "Sous quel délai recevoir une proposition ?", a: "Comptez 48 à 72 h pour une étude professionnelle complète, le temps d'analyser votre activité et vos risques." },
    { q: "Pouvez-vous reprendre mes contrats existants ?", a: "Oui. Nous analysons vos contrats actuels, identifions les doublons ou les manques et organisons le transfert à l'échéance." },
  ],
};
