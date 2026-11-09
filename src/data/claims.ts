import type { IconName } from "@/lib/icons";

export type ClaimType = "auto" | "habitation" | "sante" | "autre";

export type ClaimGuide = {
  type: ClaimType;
  label: string;
  icon: IconName;
  steps: { title: string; text: string }[];
  documents: { icon: IconName; label: string }[];
};

export const claimGuides: ClaimGuide[] = [
  {
    type: "auto",
    label: "Auto",
    icon: "CarFront",
    steps: [
      { title: "Sécurisez les lieux", text: "Feux de détresse, gilet, triangle. En cas de blessé, appelez le 15 ou le 19 avant toute démarche." },
      { title: "Remplissez le constat amiable", text: "Avec l'autre conducteur, cochez les cases avec soin, faites un croquis et signez à deux." },
      { title: "Prenez des photos", text: "Véhicules, plaques d'immatriculation, position sur la chaussée et dégâts visibles." },
      { title: "Déclarez sous 5 jours", text: "Transmettez le constat à l'agence : nous vérifions le dossier et lançons la prise en charge." },
    ],
    documents: [
      { icon: "FileText", label: "Constat amiable signé" },
      { icon: "FileCheck2", label: "Carte grise et permis" },
      { icon: "BadgeCheck", label: "Attestation d'assurance" },
      { icon: "Laptop", label: "Photos des dégâts" },
    ],
  },
  {
    type: "habitation",
    label: "Habitation",
    icon: "House",
    steps: [
      { title: "Limitez les dégâts", text: "Coupez l'eau ou l'électricité, protégez vos biens et, en cas de vol, ne touchez à rien." },
      { title: "Prévenez les autorités si besoin", text: "Pour un vol ou un acte de vandalisme, déposez plainte au commissariat sous 24 heures." },
      { title: "Rassemblez les preuves", text: "Photos, factures, constat dégât des eaux rempli avec le voisin concerné." },
      { title: "Déclarez à l'agence", text: "Sous 5 jours ouvrés, ou 2 jours pour un vol. Nous organisons le passage de l'expert si nécessaire." },
    ],
    documents: [
      { icon: "FileText", label: "Constat dégât des eaux" },
      { icon: "ShieldCheck", label: "Récépissé de plainte" },
      { icon: "Wallet", label: "Factures des biens" },
      { icon: "Laptop", label: "Photos avant / après" },
    ],
  },
  {
    type: "sante",
    label: "Santé",
    icon: "HeartPulse",
    steps: [
      { title: "Conservez vos justificatifs", text: "Feuilles de soins, ordonnances, factures de pharmacie et comptes rendus." },
      { title: "Demandez une prise en charge", text: "Pour une hospitalisation programmée, contactez l'agence en amont pour l'accord de tiers payant." },
      { title: "Déposez votre dossier", text: "À l'agence ou par WhatsApp : nous vérifions les pièces avant transmission." },
    ],
    documents: [
      { icon: "Stethoscope", label: "Feuille de soins remplie" },
      { icon: "FileText", label: "Ordonnance originale" },
      { icon: "Wallet", label: "Factures acquittées" },
      { icon: "Hospital", label: "Compte rendu d'hospitalisation" },
    ],
  },
  {
    type: "autre",
    label: "Autre",
    icon: "ShieldCheck",
    steps: [
      { title: "Appelez l'agence", text: "Décrivez la situation : nous identifions le contrat concerné et les garanties mobilisables." },
      { title: "Réunissez les éléments", text: "Date, lieu, circonstances, coordonnées des personnes impliquées et photos." },
      { title: "Nous constituons le dossier", text: "Votre interlocuteur prépare la déclaration et vous tient informé à chaque étape." },
    ],
    documents: [
      { icon: "FileText", label: "Numéro de contrat" },
      { icon: "CalendarClock", label: "Date et lieu du sinistre" },
      { icon: "Users", label: "Coordonnées des témoins" },
      { icon: "Laptop", label: "Photos et justificatifs" },
    ],
  },
];

export const findClaimGuide = (type: ClaimType) => claimGuides.find((guide) => guide.type === type) ?? claimGuides[0]!;
