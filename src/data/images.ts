/**
 * Every image used on the site, grouped by page. Files live in /public/images and are
 * referenced by URL — never import them from src/assets and never hard-code a path in a component.
 */
export type SiteImage = { src: string; width: number; height: number; alt: string };

const img = (src: string, width: number, height: number, alt: string): SiteImage => ({ src, width, height, alt });

export const images = {
  home: {
    hero: img("/images/home/hero.webp", 1280, 1600, "Conseiller d'Assurances Cherradi accueillant un client à l'agence de Tanger"),
    avatar1: img("/images/home/avatar-1.webp", 320, 320, "Portrait d'un client de l'agence"),
    avatar2: img("/images/home/avatar-2.webp", 320, 320, "Portrait d'une cliente de l'agence"),
    avatar3: img("/images/home/avatar-3.webp", 320, 320, "Portrait d'un client accompagné par l'agence"),
    whyAgent: img("/images/home/why-agent.webp", 1200, 1500, "Conseiller expliquant un contrat d'assurance à une cliente"),
    sinistre: img("/images/home/sinistre.webp", 1600, 1200, "Conseiller accompagnant un assuré après un sinistre"),
    cta: img("/images/home/cta.webp", 1200, 1500, "Conseillère souriante prête à répondre à vos questions"),
  },
  menu: {
    promo: img("/images/menu/menu-promo.webp", 1200, 900, "Demande de devis d'assurance en ligne"),
  },
  testimonials: {
    t1: img("/images/testimonials/t1.webp", 600, 600, "Portrait d'Anas El Mansouri"),
    t2: img("/images/testimonials/t2.webp", 600, 600, "Portrait de Nadia Berrada"),
    t3: img("/images/testimonials/t3.webp", 600, 600, "Portrait d'Abdelkader Ouazzani"),
    t4: img("/images/testimonials/t4.webp", 600, 600, "Portrait de Hajar Alaoui"),
  },
  offers: {
    auto: img("/images/offers/auto.webp", 1600, 1000, "Voiture sur une route côtière près de Tanger"),
    habitation: img("/images/offers/habitation.webp", 1600, 1000, "Intérieur lumineux d'un appartement familial"),
    sante: img("/images/offers/sante.webp", 1600, 1000, "Médecin en consultation avec une patiente"),
    voyage: img("/images/offers/voyage.webp", 1600, 1000, "Voyageurs avec leurs valises à l'aéroport"),
    epargneRetraite: img("/images/offers/epargne-retraite.webp", 1600, 1000, "Couple préparant sereinement sa retraite"),
    prevoyance: img("/images/offers/prevoyance.webp", 1600, 1000, "Famille réunie à la maison"),
    multirisquePro: img("/images/offers/multirisque-pro.webp", 1600, 1000, "Commerçant dans sa boutique"),
    flotte: img("/images/offers/flotte.webp", 1600, 1000, "Véhicules utilitaires d'une entreprise"),
    responsabiliteCivile: img("/images/offers/responsabilite-civile.webp", 1600, 1000, "Professionnel en rendez-vous avec un client"),
    accidentsTravail: img("/images/offers/accidents-travail.webp", 1600, 1000, "Ouvriers équipés sur un chantier"),
    santeGroupe: img("/images/offers/sante-groupe.webp", 1600, 1000, "Équipe de collaborateurs dans un bureau"),
  },
  hubs: {
    particuliers: img("/images/hubs/particuliers.webp", 1600, 1000, "Famille sereine dans son quotidien"),
    professionnels: img("/images/hubs/professionnels.webp", 1600, 1000, "Chef d'entreprise dans ses locaux"),
  },
  devis: {
    advisor: img("/images/devis/advisor.webp", 1200, 900, "Conseillère d'Assurances Cherradi à son bureau"),
  },
  sinistres: {
    hero: img("/images/sinistres/hero.webp", 1600, 1000, "Assuré échangeant avec son conseiller après un sinistre"),
  },
  agence: {
    hero: img("/images/agence/hero.webp", 1600, 1000, "Intérieur de l'agence Assurances Cherradi à Tanger"),
    office: img("/images/agence/office.webp", 1200, 1500, "Bureau de conseil de l'agence"),
    team1: img("/images/agence/team-1.webp", 800, 1000, "Karim Cherradi, directeur d'agence"),
    team2: img("/images/agence/team-2.webp", 800, 1000, "Salma Bennani, conseillère commerciale"),
    team3: img("/images/agence/team-3.webp", 800, 1000, "Youssef El Idrissi, responsable sinistres"),
    team4: img("/images/agence/team-4.webp", 800, 1000, "Imane Tazi, chargée de relation client"),
    gallery1: img("/images/agence/gallery-1.webp", 1200, 1500, "Espace d'accueil de l'agence"),
    gallery2: img("/images/agence/gallery-2.webp", 1600, 1000, "Rendez-vous conseil à l'agence"),
    gallery3: img("/images/agence/gallery-3.webp", 1000, 1000, "Détail de l'espace de travail de l'agence"),
  },
  contact: {
    agencyFront: img("/images/contact/agency-front.webp", 1200, 1500, "Façade de l'agence Assurances Cherradi, avenue Moulay Rachid"),
  },
  blog: {
    choisirFormuleAuto: img("/images/blog/choisir-formule-auto.webp", 1600, 1000, "Conducteur au volant de sa voiture"),
    proprietaireOuLocataire: img("/images/blog/proprietaire-ou-locataire.webp", 1600, 1000, "Clés remises lors d'une installation dans un logement"),
    apresUnAccident: img("/images/blog/apres-un-accident.webp", 1600, 1000, "Constat amiable rempli après un accrochage"),
    complementaireSanteAmo: img("/images/blog/complementaire-sante-amo.webp", 1600, 1000, "Patient remettant ses documents de santé"),
    assuranceVoyageVisa: img("/images/blog/assurance-voyage-visa.webp", 1600, 1000, "Passeport et billet préparés pour un voyage"),
    assurancesTpe: img("/images/blog/assurances-tpe.webp", 1600, 1000, "Gérante de petite entreprise dans son atelier"),
  },
} as const;
