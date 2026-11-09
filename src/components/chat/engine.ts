import { isMoroccanPhone, makeReference, normalizePhone } from "@/config/site";
import { chatbot, formatFirstName, isFirstName, matchMessage, matchOption, type ChatIntent } from "@/data/chatbot";
import { findClaimGuide, claimGuides, type ClaimType } from "@/data/claims";
import { businessOffers, findOffer, individualOffers, offers } from "@/data/offers";
import { chatQuestionsFor } from "@/data/quoteForms";

/* ---------------------------------------------------------------- Types */

export type DevisSummary = {
  product: string;
  productTitle: string;
  answers: { name: string; label: string; value: string }[];
  firstName: string;
  phone: string;
  channel: string;
  reference: string;
};

export type ChatCard =
  | { kind: "offers"; slugs: string[] }
  | { kind: "summary"; summary: DevisSummary }
  | { kind: "contact" }
  | { kind: "hours" }
  | { kind: "claim"; claim: ClaimType };

export type BotOut = { text?: string; card?: ChatCard };

export type ChatAction =
  | { type: "intent"; intent: ChatIntent }
  | { type: "pickOffer"; slug: string }
  | { type: "answer"; value: string }
  | { type: "claim"; claim: ClaimType }
  | { type: "audience"; group: "Particuliers" | "Professionnels" }
  | { type: "link"; href: string; external?: boolean };

export type QuickReply = { id: string; label: string; group?: string; action: ChatAction };

export type DevisFlow = {
  name: "devis";
  step: "product" | "question" | "firstName" | "phone" | "channel";
  product?: string;
  qIndex: number;
  answers: Record<string, string>;
  firstName?: string;
  phone?: string;
};
export type ChatFlow = { name: "idle" } | DevisFlow | { name: "sinistre" } | { name: "offres" };

export type ChatEvent = { type: "action"; action: ChatAction } | { type: "text"; text: string } | { type: "context"; offer: string };

export type Outcome = { bot: BotOut[]; flow: ChatFlow; replies: QuickReply[] };

/* ---------------------------------------------------------------- Reply sets */

const rid = (prefix: string, label: string) => `${prefix}-${label}`;

export const menuReplies = (): QuickReply[] =>
  chatbot.menu.map((item) => ({ id: rid("menu", item.intent), label: item.label, action: { type: "intent", intent: item.intent } }));

const productReplies = (): QuickReply[] => [
  ...individualOffers.map((o) => ({ id: rid("p", o.slug), label: o.title.replace(/^Assurance /, ""), group: "Particuliers", action: { type: "pickOffer", slug: o.slug } as ChatAction })),
  ...businessOffers.map((o) => ({ id: rid("p", o.slug), label: o.title, group: "Professionnels", action: { type: "pickOffer", slug: o.slug } as ChatAction })),
];

const optionReplies = (options: string[]): QuickReply[] => options.map((value) => ({ id: rid("o", value), label: value, action: { type: "answer", value } }));

const fallbackReplies = (): QuickReply[] => [
  { id: "fb-call", label: "Appeler", action: { type: "link", href: "tel" } },
  { id: "fb-wa", label: "WhatsApp", action: { type: "link", href: "whatsapp", external: true } },
  { id: "fb-devis", label: "Obtenir un devis", action: { type: "intent", intent: "devis" } },
];

const afterReplies = (extra: QuickReply[] = []): QuickReply[] => [
  ...extra,
  ...menuReplies().filter((r) => !extra.some((e) => e.label === r.label)).slice(0, extra.length ? 3 : 5),
];

const devisReply = (slug?: string): QuickReply =>
  slug ? { id: rid("devis", slug), label: "Obtenir un devis", action: { type: "pickOffer", slug } } : { id: "devis", label: "Obtenir un devis", action: { type: "intent", intent: "devis" } };

/* ---------------------------------------------------------------- Flow steps */

const idle: ChatFlow = { name: "idle" };

function startDevis(slug?: string): Outcome {
  if (slug && findOffer(slug)) return pickProduct(slug);
  return { bot: [{ text: chatbot.texts.askProduct }], flow: { name: "devis", step: "product", qIndex: 0, answers: {} }, replies: productReplies() };
}

function pickProduct(slug: string): Outcome {
  const offer = findOffer(slug);
  if (!offer) return startDevis();
  const questions = chatQuestionsFor(slug);
  const flow: DevisFlow = { name: "devis", step: "question", product: slug, qIndex: 0, answers: {} };
  const first = questions[0];
  if (!first) return { bot: [{ text: `${offer.title}, très bien. ${chatbot.texts.askFirstName}` }], flow: { ...flow, step: "firstName" }, replies: [] };
  return { bot: [{ text: `${offer.title}, excellent choix 👍` }, { text: first.chatPrompt ?? first.label }], flow, replies: optionReplies(first.options ?? []) };
}

function answerQuestion(flow: DevisFlow, value: string): Outcome {
  const questions = chatQuestionsFor(flow.product ?? "");
  const current = questions[flow.qIndex];
  const answers = current ? { ...flow.answers, [current.name]: value } : flow.answers;
  const next = questions[flow.qIndex + 1];
  if (next) return { bot: [{ text: next.chatPrompt ?? next.label }], flow: { ...flow, qIndex: flow.qIndex + 1, answers }, replies: optionReplies(next.options ?? []) };
  return { bot: [{ text: chatbot.texts.askFirstName }], flow: { ...flow, step: "firstName", answers }, replies: [] };
}

function buildSummary(flow: DevisFlow, channel: string): DevisSummary {
  const offer = findOffer(flow.product ?? "") ?? offers[0]!;
  const questions = chatQuestionsFor(offer.slug);
  return {
    product: offer.slug,
    productTitle: offer.title,
    answers: questions.filter((q) => flow.answers[q.name]).map((q) => ({ name: q.name, label: q.label, value: flow.answers[q.name] ?? "" })),
    firstName: flow.firstName ?? "",
    phone: flow.phone ?? "",
    channel,
    reference: makeReference("DV"),
  };
}

function devisStep(flow: DevisFlow, event: ChatEvent): Outcome | null {
  const text = event.type === "text" ? event.text.trim() : "";
  const action = event.type === "action" ? event.action : null;

  if (flow.step === "product") {
    if (action?.type === "pickOffer") return pickProduct(action.slug);
    if (text) {
      const option = matchOption(text, offers.map((o) => o.title));
      const byTitle = offers.find((o) => o.title === option);
      if (byTitle) return pickProduct(byTitle.slug);
      const match = matchMessage(text);
      const slug = match.kind === "offer" ? match.offer : match.kind === "intent" ? match.offer : undefined;
      if (slug) return pickProduct(slug);
    }
    return null;
  }

  if (flow.step === "question") {
    const question = chatQuestionsFor(flow.product ?? "")[flow.qIndex];
    if (action?.type === "answer") return answerQuestion(flow, action.value);
    if (text && question?.options) {
      const value = matchOption(text, question.options);
      if (value) return answerQuestion(flow, value);
    }
    return null;
  }

  if (flow.step === "firstName" && text) {
    if (!isFirstName(text)) return { bot: [{ text: chatbot.texts.badFirstName }], flow, replies: [] };
    const firstName = formatFirstName(text);
    return { bot: [{ text: chatbot.texts.askPhone(firstName) }], flow: { ...flow, step: "phone", firstName }, replies: [] };
  }

  if (flow.step === "phone" && text) {
    if (!isMoroccanPhone(text)) return { bot: [{ text: chatbot.texts.badPhone }], flow, replies: [] };
    return { bot: [{ text: chatbot.texts.askChannel }], flow: { ...flow, step: "channel", phone: normalizePhone(text) }, replies: optionReplies(chatbot.channels) };
  }

  if (flow.step === "channel") {
    const channel = action?.type === "answer" ? action.value : text ? matchOption(text, chatbot.channels) : undefined;
    if (!channel) return null;
    const summary = buildSummary(flow, channel);
    return {
      bot: [{ text: chatbot.texts.summaryIntro, card: { kind: "summary", summary } }, { text: chatbot.texts.confirmation(summary.reference) }],
      flow: idle,
      replies: afterReplies(),
    };
  }
  return null;
}

function repromptDevis(flow: DevisFlow): Outcome {
  const hint = "Choisissez simplement une réponse ci-dessous 🙂";
  if (flow.step === "question") {
    const question = chatQuestionsFor(flow.product ?? "")[flow.qIndex];
    return { bot: [{ text: `${hint} ${question?.chatPrompt ?? ""}`.trim() }], flow, replies: optionReplies(question?.options ?? []) };
  }
  if (flow.step === "channel") return { bot: [{ text: `${hint} ${chatbot.texts.askChannel}` }], flow, replies: optionReplies(chatbot.channels) };
  return { bot: [{ text: `${hint} ${chatbot.texts.askProduct}` }], flow, replies: productReplies() };
}

/* ---------------------------------------------------------------- Intents */

function runIntent(intent: ChatIntent, offer?: string): Outcome {
  switch (intent) {
    case "devis":
      return startDevis(offer);
    case "prix":
      return { bot: [{ text: chatbot.texts.price }], flow: idle, replies: afterReplies([devisReply(offer)]) };
    case "sinistre":
      return {
        bot: [{ text: chatbot.texts.askClaimType }],
        flow: { name: "sinistre" },
        replies: claimGuides.map((g) => ({ id: rid("c", g.type), label: g.label, action: { type: "claim", claim: g.type } })),
      };
    case "offres":
      return {
        bot: [{ text: chatbot.texts.askAudience }],
        flow: { name: "offres" },
        replies: [
          { id: "aud-part", label: "Particuliers", action: { type: "audience", group: "Particuliers" } },
          { id: "aud-pro", label: "Professionnels", action: { type: "audience", group: "Professionnels" } },
        ],
      };
    case "horaires":
      return { bot: [{ text: chatbot.texts.hoursIntro, card: { kind: "hours" } }], flow: idle, replies: afterReplies() };
    case "conseiller":
      return { bot: [{ text: chatbot.texts.advisorIntro, card: { kind: "contact" } }], flow: idle, replies: afterReplies() };
    case "salutation":
      return { bot: [{ text: chatbot.texts.hello }], flow: idle, replies: menuReplies() };
    case "merci":
      return { bot: [{ text: chatbot.texts.thanks }], flow: idle, replies: menuReplies() };
  }
}

function showOffer(slug: string, intro?: string): Outcome {
  const offer = findOffer(slug);
  if (!offer) return runIntent("offres");
  return {
    bot: [{ text: intro ?? chatbot.texts.offerIntro(offer.title), card: { kind: "offers", slugs: [offer.slug] } }],
    flow: idle,
    replies: afterReplies([devisReply(offer.slug)]),
  };
}

/* ---------------------------------------------------------------- Entry point */

export const welcome = (): Outcome => ({ bot: [{ text: chatbot.welcome }], flow: idle, replies: menuReplies() });

export function respond(flow: ChatFlow, event: ChatEvent): Outcome {
  if (event.type === "context") {
    const offer = findOffer(event.offer);
    return offer ? showOffer(offer.slug, chatbot.texts.contextIntro(offer.title)) : welcome();
  }

  if (flow.name === "devis") {
    const result = devisStep(flow, event);
    if (result) return result;
    if (event.type === "text" && matchMessage(event.text).kind === "none") return repromptDevis(flow);
  }

  if (event.type === "action") {
    const { action } = event;
    switch (action.type) {
      case "intent": return runIntent(action.intent);
      case "pickOffer": return pickProduct(action.slug);
      case "claim": {
        const guide = findClaimGuide(action.claim);
        return { bot: [{ text: chatbot.texts.claimIntro(guide.label), card: { kind: "claim", claim: guide.type } }], flow: idle, replies: afterReplies() };
      }
      case "audience": {
        const list = action.group === "Particuliers" ? individualOffers : businessOffers;
        return { bot: [{ text: chatbot.texts.offersIntro(action.group), card: { kind: "offers", slugs: list.map((o) => o.slug) } }], flow: idle, replies: afterReplies([devisReply()]) };
      }
      case "answer": return runIntent("devis");
      case "link": return { bot: [], flow, replies: [] };
    }
  }

  const text = event.type === "text" ? event.text : "";
  if (flow.name === "sinistre") {
    const claim = claimGuides.find((g) => matchOption(text, [g.label]));
    if (claim) return respond(idle, { type: "action", action: { type: "claim", claim: claim.type } });
  }
  if (flow.name === "offres") {
    const group = matchOption(text, ["Particuliers", "Professionnels"]);
    if (group) return respond(idle, { type: "action", action: { type: "audience", group: group as "Particuliers" | "Professionnels" } });
  }

  const match = matchMessage(text);
  switch (match.kind) {
    case "intent": return runIntent(match.intent, match.offer);
    case "offer": return showOffer(match.offer);
    case "pro": return respond(idle, { type: "action", action: { type: "audience", group: "Professionnels" } });
    case "faq": return { bot: [{ text: match.a }, { text: chatbot.texts.faqFollowUp }], flow: idle, replies: afterReplies([{ id: "faq-human", label: "Parler à un conseiller", action: { type: "intent", intent: "conseiller" } }]) };
    case "none": return { bot: [{ text: chatbot.texts.fallback }], flow: idle, replies: fallbackReplies() };
  }
}

/** Placeholder shown in the input depending on what the bot expects. */
export function inputHint(flow: ChatFlow) {
  if (flow.name === "devis" && flow.step === "firstName") return "Votre prénom";
  if (flow.name === "devis" && flow.step === "phone") return "06 12 34 56 78";
  return chatbot.placeholder;
}
