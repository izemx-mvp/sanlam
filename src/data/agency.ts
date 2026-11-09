import type { IconName } from "@/lib/icons";
import { images, type SiteImage } from "@/data/images";
import { site } from "@/config/site";

export type TeamMember = { name: string; role: string; line: string; photo: SiteImage; phone: string; email: string };

export const team: TeamMember[] = [
  { name: site.director, role: site.directorRole, line: "Fondateur de l'agence en 2008, il accompagne particuliers et entreprises sur les dossiers les plus techniques.", photo: images.agence.team1, phone: site.phoneHref, email: "k.cherradi@assurances-cherradi.ma" },
  { name: "Salma Bennani", role: "Conseillère commerciale", line: "Auto, habitation, santé : elle compare les formules avec vous et prépare vos devis sous 24 h.", photo: images.agence.team2, phone: site.phoneHref, email: "s.bennani@assurances-cherradi.ma" },
  { name: "Youssef El Idrissi", role: "Responsable sinistres", line: "Il suit chaque déclaration jusqu'à l'indemnisation et reste votre interlocuteur en cas de coup dur.", photo: images.agence.team3, phone: site.phoneHref, email: "y.elidrissi@assurances-cherradi.ma" },
  { name: "Imane Tazi", role: "Chargée de relation client", line: "Attestations, avenants, attestations visa : elle traite vos demandes du quotidien, souvent le jour même.", photo: images.agence.team4, phone: site.phoneHref, email: "i.tazi@assurances-cherradi.ma" },
];

export const advisorContact = team[1] ?? team[0]!;

export type Stat = { value: number; suffix?: string; prefix?: string; label: string };

export const homeStats: Stat[] = [
  { value: 18, suffix: " ans", label: "d'expérience à Tanger" },
  { value: 2300, suffix: "+", label: "clients accompagnés" },
  { value: 11, label: "solutions d'assurance" },
  { value: 24, suffix: " h", label: "pour recevoir votre devis" },
];

export const agencyStats: Stat[] = [
  { value: site.foundedYear, label: "année d'ouverture de l'agence" },
  { value: 4, label: "conseillers à votre écoute" },
  { value: 350, suffix: "+", label: "sinistres accompagnés chaque année" },
  { value: 4.5, suffix: "/5", label: "note moyenne sur Google" },
];

export const values: { icon: IconName; title: string; text: string }[] = [
  { icon: "MapPin", title: "Proximité", text: "Une agence ouverte six jours sur sept, au cœur de Tanger, où l'on vous reconnaît quand vous poussez la porte." },
  { icon: "FileText", title: "Clarté", text: "Des garanties expliquées avec des mots simples, des exclusions annoncées avant la signature, jamais après." },
  { icon: "Timer", title: "Réactivité", text: "Un devis sous 24 h, une attestation souvent le jour même et un rappel rapide en cas de sinistre." },
  { icon: "HeartHandshake", title: "Engagement", text: "Nous défendons vos intérêts auprès de l'assureur et suivons votre dossier jusqu'à son règlement." },
];

export const agencyHistory = {
  paragraphs: [
    `${site.name} a ouvert ses portes en ${site.foundedYear} avenue Moulay Rachid, avec une conviction simple : l'assurance doit se comprendre avant de se signer. Karim Cherradi, alors jeune agent général ${site.insurer}, accueillait ses premiers clients dans un bureau de deux pièces.`,
    "Dix-huit ans plus tard, l'agence accompagne plus de 2 300 familles, commerçants et entreprises de Tanger et de sa région, de la zone franche à Asilah. L'équipe a grandi, mais la méthode n'a pas changé : écouter, expliquer, puis rester présent quand survient le sinistre.",
  ],
  quote: "Un client ne nous juge pas le jour où il signe, mais le jour où il a besoin de nous. C'est pour ce jour-là que nous travaillons.",
};

export const homeBenefits = [
  { title: "Un conseiller qui vous connaît", text: "Vous n'êtes pas un numéro de dossier : la même personne suit vos contrats d'une année à l'autre." },
  { title: "Des garanties expliquées clairement", text: "Nous comparons les formules avec vous, exclusions comprises, pour que vous choisissiez en connaissance de cause." },
  { title: "À vos côtés en cas de sinistre", text: "Constat, pièces à fournir, suivi de l'expertise : nous défendons votre dossier jusqu'à l'indemnisation." },
  { title: "Une agence ouverte six jours sur sept", text: "Lun–Sam de 9h à 20h, dès 8h le jeudi, avec WhatsApp pour les demandes simples." },
];

export const howSteps: { icon: IconName; title: string; text: string }[] = [
  { icon: "ClipboardCheck", title: "Vous décrivez votre besoin", text: "En ligne, par WhatsApp ou à l'agence, en quelques minutes seulement." },
  { icon: "Scale", title: "Nous comparons pour vous", text: "Votre conseiller étudie votre profil et vous propose la formule la plus juste sous 24 h." },
  { icon: "BadgeCheck", title: "Vous êtes protégé", text: "Signature à l'agence ou à distance, attestation remise immédiatement, suivi toute l'année." },
];
