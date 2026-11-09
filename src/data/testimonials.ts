import { images, type SiteImage } from "@/data/images";

export type Testimonial = {
  name: string;
  city: string;
  product: string;
  audience: "Particuliers" | "Professionnels";
  quote: string;
  avatar?: SiteImage;
};

/** The first four (with photos) are shown on the home carousel, in this order. */
export const testimonials: Testimonial[] = [
  { name: "Anas El Mansouri", city: "Tanger · Malabata", product: "Assurance auto", audience: "Particuliers", avatar: images.testimonials.t1, quote: "Après un accrochage sur la route de Tétouan, l'agence m'a guidé pour le constat et a suivi le dossier jusqu'au bout. Ma voiture était réparée en dix jours." },
  { name: "Nadia Berrada", city: "Tanger · Iberia", product: "Santé familiale", audience: "Particuliers", avatar: images.testimonials.t2, quote: "Salma a pris le temps de comparer les formules pour mes trois enfants. Je dépose mes feuilles de soins à l'agence et les remboursements arrivent sans relance." },
  { name: "Abdelkader Ouazzani", city: "Tanger · Mghogha", product: "Multirisque professionnelle", audience: "Professionnels", avatar: images.testimonials.t3, quote: "Pour mon commerce de matériaux, M. Cherradi est venu voir le dépôt avant de proposer quoi que ce soit. Après une infiltration l'hiver dernier, j'ai été indemnisé rapidement." },
  { name: "Hajar Alaoui", city: "Tanger · Boukhalef", product: "Assurance voyage", audience: "Particuliers", avatar: images.testimonials.t4, quote: "J'avais besoin de mon attestation pour un visa étudiant en France. Tout a été réglé par WhatsApp le jour même, avec des explications très claires." },
  { name: "Rachid Benjelloun", city: "Zone franche de Tanger", product: "Assurance flotte", audience: "Professionnels", quote: "Nos douze utilitaires sont regroupés dans un seul contrat. Quand on ajoute un véhicule, l'attestation arrive dans la journée. On gagne un temps précieux." },
  { name: "Dr Leïla Fassi", city: "Tanger · Centre-ville", product: "Responsabilité civile pro", audience: "Professionnels", quote: "Pour l'ouverture de mon cabinet dentaire, l'agence a réuni RC professionnelle et multirisque des locaux. Un interlocuteur unique et des réponses précises." },
];

export const homeTestimonials = testimonials.slice(0, 4);
export const testimonialsFor = (audience: Testimonial["audience"]) => testimonials.filter((t) => t.audience === audience);
