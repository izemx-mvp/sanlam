import { useCallback, useEffect, useReducer, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock3, FileText, MapPin, MessageCircle, Phone, RotateCcw, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { mapsUrl, site, telLink, whatsappLink } from "@/config/site";
import { chatbot } from "@/data/chatbot";
import { images } from "@/data/images";
import { findOffer } from "@/data/offers";
import { findClaimGuide } from "@/data/claims";
import { advisorContact } from "@/data/agency";
import { setQuotePrefill } from "@/data/quoteForms";
import { AppLink } from "@/components/brand/blocks";
import { ImageWithFallback } from "@/components/brand/primitives";
import { inputHint, respond, welcome, type BotOut, type ChatAction, type ChatCard, type ChatEvent, type ChatFlow, type DevisSummary, type Outcome, type QuickReply } from "@/components/chat/engine";
import type { ChatRequest } from "@/components/chat/store";

/* ---------------------------------------------------------------- State */

type Message = { id: number; from: "bot" | "user"; time: number; text?: string; card?: ChatCard };
type State = { messages: Message[]; flow: ChatFlow; replies: QuickReply[]; typing: boolean };
type Action =
  | { type: "add"; message: Omit<Message, "id" | "time"> }
  | { type: "flow"; flow: ChatFlow }
  | { type: "replies"; replies: QuickReply[] }
  | { type: "typing"; typing: boolean }
  | { type: "reset" };

let nextId = 1;
const initialState: State = { messages: [], flow: { name: "idle" }, replies: [], typing: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": return { ...state, messages: [...state.messages, { ...action.message, id: nextId++, time: Date.now() }] };
    case "flow": return { ...state, flow: action.flow };
    case "replies": return { ...state, replies: action.replies };
    case "typing": return { ...state, typing: action.typing };
    case "reset": return initialState;
  }
}

const formatTime = (time: number) => new Date(time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const typingDelay = () => 600 + Math.round(Math.random() * 400);

/* ---------------------------------------------------------------- Panel */

export default function ChatPanel({ open, onClose, request }: { open: boolean; onClose: () => void; request: ChatRequest | null }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const flowRef = useRef<ChatFlow>(initialState.flow);
  const generation = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const handledNonce = useRef<number | null>(null);
  const started = useRef(false);
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  /** Plays the bot messages one by one with a typing indicator, then shows the new quick replies. */
  const deliver = useCallback(async (outcome: Outcome) => {
    const gen = generation.current;
    flowRef.current = outcome.flow;
    dispatch({ type: "flow", flow: outcome.flow });
    dispatch({ type: "replies", replies: [] });
    for (const out of outcome.bot) {
      dispatch({ type: "typing", typing: true });
      await new Promise((resolve) => setTimeout(resolve, typingDelay()));
      if (gen !== generation.current) return;
      dispatch({ type: "typing", typing: false });
      dispatch({ type: "add", message: { from: "bot", ...pick(out) } });
    }
    dispatch({ type: "typing", typing: false });
    dispatch({ type: "replies", replies: outcome.replies });
  }, []);

  const send = useCallback((event: ChatEvent, userLabel?: string) => {
    if (userLabel) dispatch({ type: "add", message: { from: "user", text: userLabel } });
    void deliver(respond(flowRef.current, event));
  }, [deliver]);

  const start = useCallback(async (offer?: string) => {
    const gen = generation.current;
    await deliver(welcome());
    if (offer && gen === generation.current) await deliver(respond(flowRef.current, { type: "context", offer }));
  }, [deliver]);

  // First open, and contextual opens from other pages ("Poser une question").
  useEffect(() => {
    if (!started.current) {
      started.current = true;
      handledNonce.current = request?.nonce ?? null;
      void start(request?.offer);
      return;
    }
    if (request && request.nonce !== handledNonce.current) {
      handledNonce.current = request.nonce;
      if (request.offer) send({ type: "context", offer: request.offer });
    }
  }, [request, send, start]);

  const restart = () => {
    generation.current += 1;
    flowRef.current = initialState.flow;
    dispatch({ type: "reset" });
    setInput("");
    void start();
  };

  // Auto-scroll on new content.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [state.messages.length, state.typing, state.replies, reduced]);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (open) { const t = setTimeout(() => inputRef.current?.focus(), 120); return () => clearTimeout(t); }
    return undefined;
  }, [open]);

  // Lock page scroll on mobile while open.
  useEffect(() => {
    if (!open || window.matchMedia("(min-width: 640px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") { event.stopPropagation(); onClose(); return; }
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  const onReply = (reply: QuickReply) => {
    if (reply.action.type === "link") return;
    send({ type: "action", action: reply.action }, reply.label);
  };
  const onCardAction = (action: ChatAction, label: string) => send({ type: "action", action }, label);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) { setInputError(true); return; }
    setInputError(false);
    setInput("");
    send({ type: "text", text }, text);
  };

  const completeForm = (summary: DevisSummary) => {
    setQuotePrefill({
      product: summary.product,
      details: Object.fromEntries(summary.answers.map((a) => [a.name, a.value])),
      firstName: summary.firstName,
      phone: summary.phone,
      channel: summary.channel,
    });
    onClose();
    void navigate({ to: "/devis", search: { produit: summary.product } });
  };

  const groups = groupReplies(state.replies);

  return (
    <motion.div
      ref={panelRef}
      id="chat-panel"
      role="dialog"
      aria-modal="true"
      aria-label={chatbot.name}
      onKeyDown={onKeyDown}
      initial={false}
      animate={open ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: reduced ? 1 : 0.85, y: reduced ? 0 : 24 }}
      transition={{ duration: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "bottom right", pointerEvents: open ? "auto" : "none", visibility: open ? "visible" : "hidden" }}
      {...(!open ? { inert: true } : {})}
      className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-brand-sand sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(600px,calc(100dvh-3rem))] sm:w-[380px] sm:rounded-[24px] sm:border sm:border-brand-navy/10 sm:shadow-[0_40px_80px_-30px_rgba(7,28,47,0.55)]"
    >
      {/* Header */}
      <div className="relative flex items-center gap-3 overflow-hidden bg-brand-navy/95 px-4 py-3.5 text-white backdrop-blur-xl">
        <div aria-hidden="true" className="absolute -right-10 -top-16 size-40 rounded-full bg-brand-sky/20 blur-2xl" />
        <span className="relative">
          <ImageWithFallback image={images.devis.advisor} alt={`Avatar de l'${chatbot.name}`} objectPosition="45% 25%" className="size-11 rounded-full ring-2 ring-white/25" />
          <span aria-hidden="true" className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-brand-navy bg-emerald-400" />
        </span>
        <div className="relative min-w-0 flex-1">
          <p className="display-font truncate font-semibold text-white">{chatbot.name}</p>
          <p className="flex items-center gap-1.5 truncate text-xs text-white/70"><span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />{chatbot.status}</p>
        </div>
        <button type="button" onClick={restart} className="relative grid size-9 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white" aria-label="Nouvelle conversation" title="Nouvelle conversation"><RotateCcw className="size-4" /></button>
        <button type="button" onClick={onClose} className="relative grid size-9 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white" aria-label="Fermer la conversation"><X className="size-5" /></button>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite" aria-relevant="additions" aria-label="Messages">
        {state.messages.map((message) => (
          <MessageBubble key={message.id} message={message} onCardAction={onCardAction} onCompleteForm={completeForm} onNavigate={onClose} />
        ))}
        {state.typing && <TypingIndicator />}
      </div>

      {/* Quick replies + input */}
      <div className="border-t border-brand-navy/8 bg-white">
        {groups.length > 0 && (
          <div className="max-h-44 space-y-2 overflow-y-auto px-3 pt-3">
            {groups.map(([group, replies]) => (
              <div key={group || "default"}>
                {group && <p className="mb-1.5 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{group}</p>}
                <QuickReplies replies={replies} onReply={onReply} />
              </div>
            ))}
          </div>
        )}
        <form onSubmit={submit} className="flex items-center gap-2 p-3">
          <label htmlFor="chat-input" className="sr-only">Votre message</label>
          <input
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); if (inputError) setInputError(false); }}
            placeholder={inputHint(state.flow)}
            autoComplete="off"
            inputMode={state.flow.name === "devis" && state.flow.step === "phone" ? "tel" : "text"}
            aria-invalid={inputError || undefined}
            className={cn("h-11 min-w-0 flex-1 rounded-full border bg-brand-sand px-4 text-[0.95rem] text-brand-navy outline-none transition focus:border-primary focus:bg-white", inputError ? "border-destructive" : "border-transparent")}
          />
          <button type="submit" aria-label="Envoyer" className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white transition-colors hover:bg-primary-600"><Send className="size-[1.1rem]" /></button>
        </form>
      </div>
    </motion.div>
  );
}

function pick(out: BotOut): Pick<Message, "text" | "card"> {
  return { ...(out.text ? { text: out.text } : {}), ...(out.card ? { card: out.card } : {}) };
}

function groupReplies(replies: QuickReply[]) {
  const map = new Map<string, QuickReply[]>();
  replies.forEach((r) => { const key = r.group ?? ""; map.set(key, [...(map.get(key) ?? []), r]); });
  return Array.from(map.entries());
}

/* ---------------------------------------------------------------- Pieces */

function QuickReplies({ replies, onReply }: { replies: QuickReply[]; onReply: (reply: QuickReply) => void }) {
  const chip = "inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-white px-3.5 py-2 text-sm font-medium text-primary no-underline transition-colors hover:border-primary hover:bg-primary hover:text-white";
  return (
    <div className="flex flex-wrap gap-2 pb-1">
      {replies.map((reply) => {
        if (reply.action.type === "link") {
          const href = reply.action.href === "tel" ? telLink : reply.action.href === "whatsapp" ? whatsappLink() : reply.action.href;
          return <a key={reply.id} href={href} className={chip} {...(reply.action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{reply.action.href === "tel" ? <Phone className="size-3.5" /> : <MessageCircle className="size-3.5" />}{reply.label}</a>;
        }
        return <button key={reply.id} type="button" className={chip} onClick={() => onReply(reply)}>{reply.label}</button>;
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2" aria-label="L'assistant écrit…" role="status">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-sm">
        {[0, 1, 2].map((i) => <span key={i} className="typing-dot size-2 rounded-full bg-brand-navy/40" style={{ animationDelay: `${i * 0.15}s` }} />)}
      </div>
    </div>
  );
}

function MessageBubble({ message, onCardAction, onCompleteForm, onNavigate }: {
  message: Message; onCardAction: (action: ChatAction, label: string) => void; onCompleteForm: (s: DevisSummary) => void; onNavigate: () => void;
}) {
  const bot = message.from === "bot";
  return (
    <div className={cn("flex flex-col", bot ? "items-start" : "items-end")}>
      {message.text && (
        <div className={cn("max-w-[85%] whitespace-pre-line px-4 py-2.5 text-[0.95rem] leading-relaxed", bot ? "rounded-2xl rounded-bl-md bg-white text-brand-navy shadow-sm" : "rounded-2xl rounded-br-md bg-primary text-white")}>
          {message.text}
        </div>
      )}
      {message.card && <div className="mt-2 w-full"><ChatCardView card={message.card} onAction={onCardAction} onCompleteForm={onCompleteForm} onNavigate={onNavigate} /></div>}
      <span className="mt-1 px-1 text-[0.68rem] text-muted-foreground">{bot ? `${chatbot.name} · ` : ""}{formatTime(message.time)}</span>
    </div>
  );
}

const cardBtn = "inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-[0.82rem] font-semibold no-underline transition-colors";
const cardBtnPrimary = `${cardBtn} bg-primary text-white hover:bg-primary-600`;
const cardBtnGhost = `${cardBtn} border border-brand-navy/12 bg-white text-brand-navy hover:border-primary/40`;

function ChatCardView({ card, onAction, onCompleteForm, onNavigate }: {
  card: ChatCard; onAction: (action: ChatAction, label: string) => void; onCompleteForm: (s: DevisSummary) => void; onNavigate: () => void;
}) {
  const closeOnMobile = () => { if (!window.matchMedia("(min-width: 640px)").matches) onNavigate(); };

  if (card.kind === "offers") {
    const list = card.slugs.map(findOffer).filter((o): o is NonNullable<typeof o> => Boolean(o));
    return (
      <div className={cn("no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1", list.length === 1 && "mx-0 px-0")}>
        {list.map((offer) => {
          const Icon = getIcon(offer.icon);
          return (
            <div key={offer.slug} className={cn("shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-sm", list.length === 1 ? "w-full" : "w-[15rem]")}>
              <div className="relative">
                <ImageWithFallback image={offer.heroImage} className="aspect-[16/9]" sizes="240px" />
                <span className="absolute left-3 top-3 grid size-8 place-items-center rounded-lg bg-white text-primary"><Icon className="size-4" aria-hidden="true" /></span>
              </div>
              <div className="p-3.5">
                <p className="font-semibold text-brand-navy">{offer.title}</p>
                <p className="mt-1 line-clamp-2 text-[0.85rem] text-muted-foreground">{offer.short}</p>
                <div className="mt-3 flex gap-2">
                  <AppLink to={`/assurances/${offer.slug}`} onClick={closeOnMobile} className={cardBtnGhost}>Voir</AppLink>
                  <button type="button" className={cardBtnPrimary} onClick={() => onAction({ type: "pickOffer", slug: offer.slug }, `Devis ${offer.title.toLowerCase()}`)}>Devis</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (card.kind === "summary") {
    const { summary } = card;
    const lines = [`Bonjour ${site.name}, voici ma demande de devis (réf. ${summary.reference}) :`, `• Assurance : ${summary.productTitle}`, ...summary.answers.map((a) => `• ${a.label} : ${a.value}`), `• Prénom : ${summary.firstName}`, `• Téléphone : ${summary.phone}`, `• Recontact par : ${summary.channel}`];
    return (
      <div className="overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-2 bg-brand-ice px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Demande de devis</span>
          <span className="text-xs font-semibold text-brand-navy">{summary.reference}</span>
        </div>
        <dl className="divide-y divide-brand-navy/6 px-4 text-[0.85rem]">
          {[["Assurance", summary.productTitle], ...summary.answers.map((a) => [a.label, a.value]), ["Prénom", summary.firstName], ["Téléphone", summary.phone], ["Recontact", summary.channel]].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3 py-2"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-medium text-brand-navy">{value}</dd></div>
          ))}
        </dl>
        <div className="flex flex-col gap-2 p-3">
          <a href={whatsappLink(lines.join("\n"))} target="_blank" rel="noopener noreferrer" data-analytics="chatbot_devis_whatsapp" className={cardBtnPrimary}><MessageCircle className="size-4" />Envoyer sur WhatsApp</a>
          <button type="button" data-analytics="chatbot_devis_form" onClick={() => onCompleteForm(summary)} className={cardBtnGhost}><FileText className="size-4" />Compléter le formulaire</button>
        </div>
      </div>
    );
  }

  if (card.kind === "contact") {
    return (
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex items-center gap-3 p-3.5">
          <ImageWithFallback image={advisorContact.photo} objectPosition="50% 20%" className="size-14 shrink-0 rounded-2xl" />
          <div>
            <p className="font-semibold text-brand-navy">{advisorContact.name}</p>
            <p className="text-[0.85rem] text-muted-foreground">{advisorContact.role}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700"><Clock3 className="size-3.5" />{chatbot.availability}</p>
          </div>
        </div>
        <div className="flex gap-2 px-3.5 pb-3.5">
          <a href={telLink} className={cardBtnGhost}><Phone className="size-4" />Appeler</a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={cardBtnPrimary}><MessageCircle className="size-4" />WhatsApp</a>
        </div>
      </div>
    );
  }

  if (card.kind === "hours") {
    return (
      <div className="rounded-2xl bg-white p-4 text-[0.88rem] shadow-sm">
        <p className="flex gap-2 font-medium text-brand-navy"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" />{site.address}</p>
        <ul className="mt-3 space-y-1 border-t border-brand-navy/6 pt-3 text-muted-foreground">
          <li className="flex justify-between"><span>Lundi – Samedi</span><span className="font-medium text-brand-navy">9h00 – 20h00</span></li>
          <li className="flex justify-between"><span>Jeudi</span><span className="font-medium text-brand-navy">dès 8h00</span></li>
          <li className="flex justify-between"><span>Dimanche</span><span className="font-medium text-brand-navy">Fermé</span></li>
        </ul>
        <div className="mt-3 flex flex-col gap-1.5 border-t border-brand-navy/6 pt-3">
          <a href={telLink} className="inline-flex items-center gap-2 font-medium text-brand-navy no-underline hover:text-primary"><Phone className="size-4 text-primary" />{site.phone}</a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium text-brand-navy no-underline hover:text-primary"><MessageCircle className="size-4 text-primary" />WhatsApp · {site.whatsapp}</a>
        </div>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={cn(cardBtnPrimary, "mt-3 w-full")}>Voir sur la carte <ArrowUpRight className="size-4" /></a>
      </div>
    );
  }

  const guide = findClaimGuide(card.claim);
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <ol className="space-y-3">
        {guide.steps.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-white">{i + 1}</span>
            <span className="text-[0.86rem] leading-snug"><strong className="block text-brand-navy">{step.title}</strong><span className="text-muted-foreground">{step.text}</span></span>
          </li>
        ))}
      </ol>
      <div className="mt-4 rounded-xl bg-brand-ice p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Documents à préparer</p>
        <ul className="mt-2 grid gap-1.5 text-[0.84rem] text-brand-navy">
          {guide.documents.map((doc) => { const Icon = getIcon(doc.icon); return <li key={doc.label} className="flex items-center gap-2"><Icon className="size-3.5 text-primary" aria-hidden="true" />{doc.label}</li>; })}
        </ul>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <AppLink to="/sinistres#declaration" onClick={closeOnMobile} className={cardBtnPrimary}>Faire ma déclaration</AppLink>
        <a href={telLink} className={cardBtnGhost}><Phone className="size-4" />Appeler l'agence</a>
      </div>
    </div>
  );
}
