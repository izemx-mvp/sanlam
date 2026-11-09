import { site } from "@/config/site";

export type LegalSection = { id: string; title: string; paragraphs: string[]; list?: string[] };

export const legalNotice: LegalSection[] = [
  {
    id: "editeur",
    title: "Éditeur du site",
    paragraphs: [
      `Le présent site est édité par ${site.name}, agence d'assurance exerçant en qualité d'agent général de la compagnie ${site.insurer} Maroc, immatriculée au registre de commerce de Tanger.`,
      `Siège : ${site.address}. Téléphone : ${site.phone}. E-mail : ${site.email}.`,
      `Directeur de la publication : ${site.director}, ${site.directorRole.toLowerCase()}.`,
    ],
  },
  {
    id: "activite",
    title: "Activité réglementée",
    paragraphs: [
      `${site.name} exerce l'activité d'intermédiaire d'assurance conformément à la loi n° 17-99 portant Code des assurances. L'agence est agréée et placée sous le contrôle de l'Autorité de Contrôle des Assurances et de la Prévoyance Sociale (ACAPS).`,
      `En tant qu'agent général, l'agence présente, souscrit et gère des contrats pour le compte de ${site.insurer}, dont elle est le mandataire.`,
    ],
  },
  {
    id: "hebergement",
    title: "Hébergement",
    paragraphs: [
      "Le site est hébergé par Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis. Les contenus sont distribués via un réseau de serveurs sécurisés.",
    ],
  },
  {
    id: "informations",
    title: "Nature des informations publiées",
    paragraphs: [
      "Les informations présentées sur ce site ont un caractère général et informatif. Elles ne constituent ni une offre contractuelle, ni un conseil personnalisé.",
      "Les garanties, exclusions, franchises et conditions applicables sont exclusivement celles figurant dans les conditions générales et particulières de chaque contrat, remises avant toute souscription.",
    ],
  },
  {
    id: "propriete",
    title: "Propriété intellectuelle",
    paragraphs: [
      `L'ensemble des contenus du site (textes, photographies, illustrations, logos, mise en page) est protégé par la législation marocaine relative aux droits d'auteur. Le nom et le logo ${site.insurer} sont des marques déposées de leur titulaire et sont utilisés dans le cadre du mandat d'agent général.`,
      "Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite.",
    ],
  },
  {
    id: "responsabilite",
    title: "Responsabilité",
    paragraphs: [
      "L'agence s'efforce d'assurer l'exactitude et la mise à jour des informations publiées, sans pouvoir garantir l'absence totale d'erreur ou d'omission. Elle ne saurait être tenue responsable de l'usage fait de ces informations.",
      "Les liens vers des sites tiers sont fournis à titre pratique ; l'agence n'exerce aucun contrôle sur leur contenu.",
    ],
  },
  {
    id: "reclamations",
    title: "Réclamations",
    paragraphs: [
      `Pour toute réclamation, contactez l'agence par e-mail à ${site.email} ou par courrier à l'adresse ci-dessus. Une réponse vous est apportée dans un délai maximal de quinze jours.`,
      "À défaut de solution satisfaisante, vous pouvez saisir le service réclamations de la compagnie, puis l'ACAPS.",
    ],
  },
  {
    id: "credits",
    title: "Crédits",
    paragraphs: [`Conception et réalisation : IZEMX. ${site.partner}.`],
  },
];

export const privacyPolicy: LegalSection[] = [
  {
    id: "responsable",
    title: "Responsable du traitement",
    paragraphs: [
      `Le responsable du traitement des données personnelles est ${site.name}, ${site.address}, représentée par ${site.director}.`,
      `Pour toute question relative à vos données : ${site.email}.`,
    ],
  },
  {
    id: "donnees",
    title: "Données collectées",
    paragraphs: ["Les formulaires du site (demande de devis, déclaration de sinistre, contact) et l'assistant en ligne peuvent recueillir :"],
    list: [
      "Vos données d'identification : nom, prénom",
      "Vos coordonnées : téléphone, adresse e-mail",
      "Les informations utiles à votre demande : type d'assurance, caractéristiques du bien ou du véhicule, circonstances d'un sinistre",
      "Votre canal de contact préféré",
    ],
  },
  {
    id: "fonctionnement",
    title: "Fonctionnement des formulaires",
    paragraphs: [
      "Les informations saisies dans les formulaires et dans l'assistant sont traitées dans votre navigateur pour préparer un récapitulatif. Elles ne sont transmises à l'agence que lorsque vous choisissez de les envoyer, par WhatsApp, par e-mail ou par téléphone.",
      "Aucune donnée de santé n'est demandée en ligne. Les questionnaires médicaux éventuels sont remis et traités de manière confidentielle à l'agence.",
    ],
  },
  {
    id: "finalites",
    title: "Finalités",
    paragraphs: ["Les données que vous nous transmettez sont utilisées exclusivement pour :"],
    list: [
      "Établir un devis et vous recontacter",
      "Préparer, souscrire et gérer vos contrats d'assurance",
      "Instruire et suivre vos déclarations de sinistre",
      "Répondre à vos demandes d'information",
    ],
  },
  {
    id: "conservation",
    title: "Durée de conservation",
    paragraphs: [
      "Les données relatives à une demande de devis non suivie de souscription sont conservées trois ans à compter du dernier contact.",
      "Les données des clients sont conservées pendant toute la durée du contrat, puis pendant les délais de prescription légaux applicables en matière d'assurance.",
    ],
  },
  {
    id: "destinataires",
    title: "Destinataires",
    paragraphs: [
      `Vos données sont destinées à l'équipe de l'agence et, pour la souscription et la gestion des contrats, à la compagnie ${site.insurer} et à ses prestataires (assistance, experts). Elles ne sont jamais vendues ni cédées à des fins commerciales.`,
    ],
  },
  {
    id: "droits",
    title: "Vos droits (loi 09-08)",
    paragraphs: [
      "Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et d'opposition pour des motifs légitimes.",
      `Pour exercer ces droits, écrivez à ${site.email} ou par courrier à l'agence, en joignant une copie de votre pièce d'identité. Vous pouvez également introduire une réclamation auprès de la Commission Nationale de contrôle de la protection des Données à caractère Personnel (CNDP).`,
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paragraphs: [
      "Le site n'utilise pas de cookies publicitaires. Seul un stockage technique de session peut être utilisé pour mémoriser des préférences d'affichage, comme la fermeture d'une bulle d'information.",
      "La carte intégrée est fournie par Google Maps, qui peut déposer ses propres cookies lorsque vous interagissez avec elle.",
    ],
  },
  {
    id: "securite",
    title: "Sécurité",
    paragraphs: [
      "Le site est servi exclusivement en HTTPS. L'agence met en œuvre des mesures techniques et organisationnelles pour protéger les données qui lui sont confiées contre toute perte, altération ou accès non autorisé.",
    ],
  },
];
