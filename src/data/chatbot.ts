/**
 * "Assistant Cherradi" — a scripted, rule-based assistant. No API, no AI model:
 * everything below runs in the visitor's browser and nothing is sent anywhere.
 */
import { site } from "@/config/site";
import { faqItems } from "@/data/faq";

export type ChatIntent = "devis" | "sinistre" | "offres" | "horaires" | "conseiller" | "prix" | "salutation" | "merci";

export const chatbot = {
  name: "Assistant Cherradi",
  status: "En ligne · répond en quelques secondes",
  tooltip: "Une question ? Je suis là",
  availability: "Disponible Lun–Sam 9h–20h",
  placeholder: "Écrivez votre message…",
  welcome: `Bonjour 👋 Je suis l'assistant de ${site.name}, votre agence à Tanger. Comment puis-je vous aider ?`,
  menu: [
    { label: "Obtenir un devis", intent: "devis" },
    { label: "Déclarer un sinistre", intent: "sinistre" },
    { label: "Nos assurances", intent: "offres" },
    { label: "Horaires & adresse", intent: "horaires" },
    { label: "Parler à un conseiller", intent: "conseiller" },
  ] as { label: string; intent: ChatIntent }[],
  texts: {
    askProduct: "Avec plaisir ! Que souhaitez-vous assurer ?",
    askFirstName: "Parfait, c'est noté. Quel est votre prénom ?",
    badFirstName: "Pouvez-vous m'indiquer simplement votre prénom ? 🙂",
    askPhone: (name: string) => `Merci ${name} ! Quel est votre numéro de téléphone ?`,
    badPhone: "Ce numéro ne semble pas valide 🙂 Indiquez un numéro marocain à 10 chiffres, au format 06 12 34 56 78.",
    askChannel: "Comment préférez-vous être recontacté ?",
    summaryIntro: "Voici le récapitulatif de votre demande :",
    confirmation: (ref: string) => `C'est noté ✅ Votre référence est ${ref}. Envoyez le récapitulatif sur WhatsApp et votre conseiller vous recontacte sous 24 h avec un devis gratuit.`,
    askClaimType: "Je suis désolé pour ce désagrément. De quel type de sinistre s'agit-il ?",
    claimIntro: (label: string) => `Voici la marche à suivre pour un sinistre ${label.toLowerCase()} :`,
    askAudience: "Nos solutions sont pensées pour deux profils. Vous êtes :",
    offersIntro: (group: string) => `Voici nos assurances pour les ${group.toLowerCase()}. Faites défiler pour tout voir 👉`,
    offerIntro: (title: string) => `Voici l'essentiel sur notre ${title.toLowerCase()} :`,
    contextIntro: (title: string) => `Vous consultez notre ${title.toLowerCase()}. Je peux vous préparer un devis ou répondre à vos questions.`,
    hoursIntro: "L'agence vous accueille avec ou sans rendez-vous :",
    advisorIntro: "Un conseiller de l'agence vous répond directement :",
    price: "Chaque tarif est personnalisé selon votre profil : votre conseiller vous envoie un devis gratuit sous 24 h.",
    fallback: "Je n'ai pas bien compris 🙂 Voulez-vous parler directement à un conseiller ?",
    hello: "Bonjour ! Ravi de vous lire. Que puis-je faire pour vous ?",
    thanks: "Avec plaisir ! N'hésitez pas si vous avez une autre question.",
    backToMenu: "Que puis-je faire d'autre pour vous ?",
    faqFollowUp: "Cette réponse vous aide-t-elle ?",
  },
  channels: ["Appel", "WhatsApp", "Email"],
};

/** Lowercase, strip accents and punctuation, collapse spaces. */
export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[''`]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const tokenize = (text: string) => normalize(text).split(" ").filter(Boolean);

/** Keyword lists per intent. Multi-word entries are matched as phrases. */
export const intentKeywords: Record<Exclude<ChatIntent, "salutation" | "merci">, string[]> = {
  prix: ["prix", "tarif", "tarifs", "combien", "cout", "coute", "coutent", "montant", "cher", "prime", "cotisation", "budget"],
  devis: ["devis", "souscrire", "souscription", "assurer", "cotation", "proposition", "m assurer", "nouveau contrat"],
  sinistre: ["sinistre", "accident", "accrochage", "vol", "vole", "volee", "degat", "degats", "cambriolage", "cambriole", "constat", "incendie", "fuite", "declarer", "declaration", "choc", "panne", "casse"],
  horaires: ["horaire", "horaires", "heure", "heures", "ouvert", "ouverte", "ouverture", "ferme", "fermee", "adresse", "itineraire", "localisation", "ou etes", "ou se trouve", "ou trouver", "ou est", "plan", "venir", "samedi", "dimanche"],
  conseiller: ["humain", "conseiller", "conseillere", "appeler", "appel", "telephone", "parler", "rappeler", "rappel", "contact", "contacter", "joindre", "quelqu un", "agent", "personne"],
  offres: ["offres", "produits", "solutions", "vos assurances", "quelles assurances", "gamme", "catalogue"],
};

const greetings = ["bonjour", "salut", "bonsoir", "hello", "salam", "slt", "coucou", "hey"];
const thanks = ["merci", "super", "parfait", "genial", "top", "nickel"];

/** Free-text keywords that point to one offer. */
export const offerKeywords: Record<string, string[]> = {
  auto: ["auto", "voiture", "vehicule", "moto", "permis", "carte grise", "conduire", "conducteur"],
  habitation: ["habitation", "maison", "appartement", "logement", "villa", "locataire", "domicile", "chez moi"],
  sante: ["sante", "mutuelle", "complementaire", "amo", "maladie", "medecin", "hospitalisation", "soins", "remboursement"],
  voyage: ["voyage", "visa", "schengen", "etranger", "omra", "hajj", "vacances", "voyager"],
  "epargne-retraite": ["retraite", "epargne", "epargner", "placement", "capital", "etudes des enfants"],
  prevoyance: ["prevoyance", "deces", "invalidite", "assurance vie", "proteger ma famille", "emprunteur"],
  "multirisque-pro": ["multirisque", "commerce", "boutique", "magasin", "local commercial", "restaurant", "cafe", "atelier", "stock"],
  flotte: ["flotte", "camion", "camions", "utilitaire", "utilitaires", "parc automobile", "transporteur", "poids lourd"],
  "responsabilite-civile": ["responsabilite civile", "rc pro", "rc professionnelle", "profession liberale", "cabinet", "reclamation client"],
  "accidents-travail": ["accident du travail", "accidents du travail", "accident de travail", "salarie blesse", "cnss"],
  "sante-groupe": ["sante collective", "sante groupe", "mutuelle entreprise", "mutuelle salaries", "salaries", "employes", "collaborateurs"],
};

const proKeywords = ["pro", "professionnel", "professionnels", "entreprise", "societe", "pme", "tpe", "employeur"];

const matchCount = (normalized: string, tokens: string[], keywords: string[]) =>
  keywords.reduce((score, keyword) => {
    if (keyword.includes(" ")) return score + (` ${normalized} `.includes(` ${keyword} `) ? 2 : 0);
    return score + (tokens.some((t) => t === keyword || t === `${keyword}s` || t === `${keyword}x`) ? 1 : 0);
  }, 0);

const stopwords = new Set("le la les l de des du d un une et en a au aux pour par sur est sont je j vous mon ma mes votre vos que qu qui quoi comment quel quelle quels quelles il elle on ce cet cette se s sa son ses ne n pas plus y faut faire peut puis t il ils nous me m te avec dans ou si bien".split(" "));
const keyTokens = (text: string) => tokenize(text).filter((t) => t.length > 2 && !stopwords.has(t));
const faqIndex = faqItems.map((item) => ({ item, tokens: new Set(keyTokens(item.q)) }));

export type ChatMatch =
  | { kind: "intent"; intent: ChatIntent; offer?: string }
  | { kind: "offer"; offer: string }
  | { kind: "pro" }
  | { kind: "faq"; q: string; a: string }
  | { kind: "none" };

/** Scores a free-text message against intents, offers and the FAQ. */
export function matchMessage(text: string): ChatMatch {
  const normalized = normalize(text);
  const tokens = normalized.split(" ").filter(Boolean);
  if (!tokens.length) return { kind: "none" };

  const scores = Object.entries(intentKeywords).map(([intent, keywords]) => ({ intent: intent as ChatIntent, score: matchCount(normalized, tokens, keywords) }));
  const offerScores = Object.entries(offerKeywords)
    .map(([slug, keywords]) => ({ slug, score: matchCount(normalized, tokens, keywords) }))
    .sort((a, b) => b.score - a.score);
  const bestOffer = offerScores[0] && offerScores[0].score > 0 ? offerScores[0].slug : undefined;
  const score = (intent: ChatIntent) => scores.find((s) => s.intent === intent)?.score ?? 0;

  // Price questions always get the "personalised quote" answer, never an amount.
  if (score("prix") > 0) return bestOffer ? { kind: "intent", intent: "prix", offer: bestOffer } : { kind: "intent", intent: "prix" };
  // FAQ: share of the question's key words found in the message.
  const messageTokens = new Set(keyTokens(text));
  let bestFaq: { q: string; a: string; score: number; hits: number } | null = null;
  for (const { item, tokens: qTokens } of faqIndex) {
    let hits = 0;
    qTokens.forEach((t) => { if (messageTokens.has(t)) hits += 1; });
    const ratio = qTokens.size ? hits / qTokens.size : 0;
    if (hits >= 2 && ratio >= 0.4 && (!bestFaq || ratio > bestFaq.score)) bestFaq = { q: item.q, a: item.a, score: ratio, hits };
  }
  // A precise question (3+ key words, most of an FAQ entry) gets the FAQ answer before generic intents.
  if (bestFaq && bestFaq.hits >= 3 && bestFaq.score >= 0.6) return { kind: "faq", q: bestFaq.q, a: bestFaq.a };

  // "Accident du travail" is an offer, not a claim, unless the visitor talks about declaring one.
  if (bestOffer === "accidents-travail" && score("sinistre") <= 2 && !tokens.includes("declarer")) {
    return score("devis") > 0 ? { kind: "intent", intent: "devis", offer: bestOffer } : { kind: "offer", offer: bestOffer };
  }
  if (score("sinistre") > 0 && score("sinistre") >= score("devis")) return { kind: "intent", intent: "sinistre" };
  if (score("devis") > 0) return bestOffer ? { kind: "intent", intent: "devis", offer: bestOffer } : { kind: "intent", intent: "devis" };

  const bestIntent = scores.filter((s) => s.score > 0).sort((a, b) => b.score - a.score)[0];
  if (bestFaq && bestFaq.score >= 0.6) return { kind: "faq", q: bestFaq.q, a: bestFaq.a };
  if (bestIntent) return { kind: "intent", intent: bestIntent.intent };
  if (bestOffer) return { kind: "offer", offer: bestOffer };
  if (bestFaq) return { kind: "faq", q: bestFaq.q, a: bestFaq.a };
  if (matchCount(normalized, tokens, proKeywords) > 0) return { kind: "pro" };
  if (tokens.some((t) => greetings.includes(t))) return { kind: "intent", intent: "salutation" };
  if (tokens.some((t) => thanks.includes(t))) return { kind: "intent", intent: "merci" };
  return { kind: "none" };
}

/** Matches typed text to one of the proposed chip options. */
export function matchOption(text: string, options: string[]) {
  const n = normalize(text);
  if (!n) return undefined;
  return options.find((option) => normalize(option) === n) ?? options.find((option) => normalize(option).includes(n) || n.includes(normalize(option)));
}

export const isFirstName = (text: string) => /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ' -]{1,29}$/.test(text.trim());
export const formatFirstName = (text: string) =>
  text.trim().split(/\s+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(" ");
