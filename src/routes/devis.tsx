import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock3, HeartHandshake, Lock, MessageCircle, Pencil, Phone, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { pageHead } from "@/lib/seo";
import { isMoroccanPhone, makeReference, site, telLink, whatsappLink } from "@/config/site";
import { images } from "@/data/images";
import { businessOffers, findOffer, individualOffers, type Offer } from "@/data/offers";
import { quoteFieldsByOffer, takeQuotePrefill, type QuoteField, type QuotePrefill } from "@/data/quoteForms";
import { ConsentCheckbox, FloatInput, FloatSelect, FloatTextarea, PageHero, Stepper, SuccessScreen } from "@/components/brand/blocks";
import { Arcs, ArrowSlide, Container, ImageWithFallback, Stars, pill } from "@/components/brand/primitives";

export const Route = createFileRoute("/devis")({
  validateSearch: (search: Record<string, unknown>): { produit?: string } =>
    typeof search["produit"] === "string" ? { produit: search["produit"] } : {},
  head: () => pageHead({
    title: `Devis assurance gratuit à Tanger | ${site.name}`,
    description: `Demandez votre devis d'assurance gratuit en 2 minutes : auto, habitation, santé, voyage ou professionnel. Réponse de votre conseiller ${site.name} sous 24 h.`,
    path: "/devis",
    image: images.devis.advisor,
    breadcrumbs: [{ name: "Demander un devis", path: "/devis" }],
  }),
  component: QuotePage,
});

const STEPS = ["Votre assurance", "Votre besoin", "Vos coordonnées"];
const MINUTES_LEFT = ["environ 2 min", "environ 1 min", "moins d'1 min"];
const CHANNELS = ["Appel", "WhatsApp", "Email"];

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Indiquez votre nom complet."),
  phone: z.string().trim().refine(isMoroccanPhone, "Indiquez un numéro marocain valide, au format 06 12 34 56 78."),
  email: z.union([z.literal(""), z.string().trim().email("Indiquez une adresse e-mail valide.")]),
  channel: z.string().min(1, "Choisissez comment être recontacté."),
  message: z.string().trim().max(600, "600 caractères maximum.").optional(),
  consent: z.boolean().refine((v) => v, "Votre accord est nécessaire pour traiter la demande."),
}).superRefine((values, ctx) => {
  if (values.channel === "Email" && !values.email) {
    ctx.addIssue({ code: "custom", path: ["email"], message: "Indiquez votre e-mail pour être recontacté par e-mail." });
  }
});
type ContactValues = z.infer<typeof contactSchema>;

function detailsSchema(fields: QuoteField[]) {
  return z.object(Object.fromEntries(fields.map((field) => {
    const required = z.string().trim().min(1, field.type === "select" ? "Choisissez une réponse." : "Ce champ est nécessaire pour votre devis.");
    return [field.name, field.type === "number" ? required.regex(/^\d{1,6}$/, "Indiquez un nombre.") : required];
  })));
}

function QuotePage() {
  const { produit } = Route.useSearch();
  return <QuoteFlow key={produit ?? ""} produit={produit} />;
}

function QuoteFlow({ produit }: { produit: string | undefined }) {
  const initialOffer = findOffer(produit ?? "");
  const [prefill] = useState<QuotePrefill | null>(() => (initialOffer ? takeQuotePrefill(initialOffer.slug) : null));
  const [offerSlug, setOfferSlug] = useState<string | null>(initialOffer?.slug ?? null);
  const [step, setStep] = useState(initialOffer ? 1 : 0);
  const [details, setDetails] = useState<Record<string, string>>(prefill?.details ?? {});
  const [result, setResult] = useState<{ reference: string; contact: ContactValues } | null>(null);
  const reduced = useReducedMotion();
  const offer = offerSlug ? findOffer(offerSlug) : undefined;
  const fields = offer ? quoteFieldsByOffer[offer.slug] ?? [] : [];

  const go = (next: number) => { setStep(next); document.getElementById("devis-form")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); };

  const summary = offer && result ? [
    { label: "Assurance", value: offer.title },
    ...fields.filter((f) => details[f.name]).map((f) => ({ label: f.label, value: f.type === "date" ? new Date(details[f.name] ?? "").toLocaleDateString("fr-FR") : details[f.name] ?? "" })),
    { label: "Nom", value: result.contact.fullName },
    { label: "Téléphone", value: result.contact.phone },
    ...(result.contact.email ? [{ label: "E-mail", value: result.contact.email }] : []),
    { label: "Recontact par", value: result.contact.channel },
  ] : [];

  return (
    <>
      <PageHero
        variant="compact"
        breadcrumbs={[{ name: "Demander un devis", path: "/devis" }]}
        eyebrow="Devis gratuit · sans engagement"
        title={<>Votre devis en <span className="text-primary">2 minutes.</span></>}
        description="Quelques questions simples, puis votre conseiller vous envoie une proposition personnalisée sous 24 h."
      />
      <section className="bg-white py-14 sm:py-20">
        <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <AdvisorPanel />
          <div id="devis-form" className="card-surface scroll-mt-32 p-6 sm:p-10">
            {result && offer ? (
              <SuccessScreen
                title="Votre demande est prête !"
                description={`Merci ${result.contact.fullName.split(" ")[0]}. Votre conseiller prépare votre devis ${offer.title.toLowerCase()} et vous recontacte par ${({ Appel: "téléphone", Email: "e-mail" } as Record<string, string>)[result.contact.channel] ?? result.contact.channel} sous 24 h.`}
                reference={result.reference}
                summary={summary}
                whatsappMessage={[`Bonjour ${site.name}, voici ma demande de devis :`, ...summary.map((r) => `• ${r.label} : ${r.value}`)].join("\n")}
              />
            ) : (
              <>
                <Stepper steps={STEPS} active={step} />
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <p className="text-muted-foreground">Étape {step + 1} sur {STEPS.length} · <span className="font-semibold text-brand-navy">{MINUTES_LEFT[step]}</span></p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-navy/8 sm:w-40">
                    <div className="h-full rounded-full bg-brand-gradient transition-[width] duration-500 ease-out" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
                  </div>
                </div>
                {step > 0 && offer && <SelectedOffer offer={offer} onChange={() => go(0)} />}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={`${step}-${offerSlug ?? ""}`} initial={reduced ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                    {step === 0 && (
                      <ProductStep selected={offerSlug} onSelect={(slug) => { if (slug !== offerSlug) setDetails({}); setOfferSlug(slug); }} onNext={() => go(1)} />
                    )}
                    {step === 1 && offer && (
                      <DetailsStep offer={offer} fields={fields} defaults={details} onBack={() => go(0)} onNext={(values) => { setDetails(values); go(2); }} />
                    )}
                    {step === 2 && offer && (
                      <ContactStep prefill={prefill} onBack={() => go(1)} onSubmit={(contact) => setResult({ reference: makeReference("DV"), contact })} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

function SelectedOffer({ offer, onChange }: { offer: Offer; onChange: () => void }) {
  return (
    <div className="mt-6 flex items-center gap-4 rounded-[20px] border border-brand-navy/8 bg-brand-sand p-3 pr-4">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl">
        <ImageWithFallback image={offer.heroImage} className="!absolute inset-0 h-full w-full" sizes="56px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Votre demande</p>
        <p className="truncate font-semibold text-brand-navy">{offer.title}</p>
      </div>
      <button type="button" onClick={onChange} className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-white">
        <Pencil className="size-3.5" aria-hidden="true" />Modifier
      </button>
    </div>
  );
}

function AdvisorPanel() {
  const points = [
    { icon: HeartHandshake, title: "Un conseil personnalisé", text: "Votre conseiller compare les formules selon votre profil réel." },
    { icon: Clock3, title: "Une réponse sous 24 h", text: "Un devis détaillé, gratuit et sans engagement." },
    { icon: ShieldCheck, title: "Un suivi dans la durée", text: "Le même interlocuteur pour vos contrats et vos sinistres." },
  ];
  return (
    <aside className="relative overflow-hidden rounded-[28px] navy-glow text-white lg:sticky lg:top-32">
      <div className="relative">
        <ImageWithFallback image={images.devis.advisor} className="aspect-[4/3]" sizes="(min-width: 1024px) 40vw, 100vw" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-navy to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-3 rounded-2xl bg-white/95 px-4 py-3 text-brand-navy shadow-lg backdrop-blur">
          <span className="leading-tight">
            <Stars value={site.rating.value} />
            <span className="mt-1 block text-xs font-semibold">{site.rating.label}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><span className="size-2 rounded-full bg-emerald-500" />Réponse sous 24 h</span>
        </div>
      </div>
      <Arcs light className="-bottom-24 -right-24 size-72" count={2} />
      <div className="relative p-7 sm:p-9">
        <h2 className="display-font text-2xl font-semibold text-white">Pourquoi passer par votre agent ?</h2>
        <ul className="mt-7 space-y-5">
          {points.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-brand-sky"><Icon className="size-5" aria-hidden="true" /></span>
              <span><strong className="block font-semibold text-white">{title}</strong><span className="text-[0.95rem] text-white/70">{text}</span></span>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid grid-cols-1 gap-3 border-t border-white/10 pt-7 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <a href={telLink} className={pill({ variant: "outline", size: "sm" })}><Phone />{site.phone}</a>
          <a href={whatsappLink("Bonjour, je souhaite un devis d'assurance.")} target="_blank" rel="noopener noreferrer" className={pill({ variant: "gradient", size: "sm" })}><MessageCircle />WhatsApp</a>
        </div>
      </div>
    </aside>
  );
}

function ProductStep({ selected, onSelect, onNext }: { selected: string | null; onSelect: (slug: string) => void; onNext: () => void }) {
  const [error, setError] = useState("");
  const group = (title: string, list: Offer[]) => (
    <fieldset className="mt-7">
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</legend>
      <div role="radiogroup" aria-label={title} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {list.map((offer) => {
          const Icon = getIcon(offer.icon);
          const active = selected === offer.slug;
          return (
            <button key={offer.slug} type="button" role="radio" aria-checked={active} onClick={() => { onSelect(offer.slug); setError(""); }}
              className={cn("relative flex items-start gap-4 rounded-[20px] border-2 p-4 text-left transition-all duration-200",
                active ? "border-primary bg-brand-ice/60 shadow-[0_10px_24px_-14px_rgba(10,117,187,0.6)]" : "border-brand-navy/8 bg-white hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_10px_24px_-18px_rgba(11,42,69,0.5)]")}>
              <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl transition-colors", active ? "bg-primary text-white" : "bg-brand-ice text-primary")}><Icon className="size-5" aria-hidden="true" /></span>
              <span className="min-w-0 pr-6">
                <span className="block font-semibold text-brand-navy">{offer.title}</span>
                <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{offer.short}</span>
              </span>
              {active && <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-primary text-white"><Check className="size-3.5" aria-hidden="true" /></span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
  return (
    <div>
      <h2 className="display-font text-2xl font-semibold text-brand-navy">Que souhaitez-vous assurer ?</h2>
      <p className="mt-2 text-ink">Choisissez l'assurance qui vous intéresse.</p>
      {group("Particuliers", individualOffers)}
      {group("Professionnels", businessOffers)}
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-9 flex justify-end">
        <button type="button" onClick={() => (selected ? onNext() : setError("Choisissez une assurance pour continuer."))} className={pill()}>Continuer <ArrowSlide icon={ArrowRight} /></button>
      </div>
    </div>
  );
}

function DetailsStep({ offer, fields, defaults, onBack, onNext }: { offer: Offer; fields: QuoteField[]; defaults: Record<string, string>; onBack: () => void; onNext: (values: Record<string, string>) => void }) {
  const schema = useMemo(() => detailsSchema(fields), [fields]);
  const { register, handleSubmit, formState: { errors } } = useForm<Record<string, string>>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: Object.fromEntries(fields.map((f) => [f.name, defaults[f.name] ?? ""])),
  });
  return (
    <form noValidate onSubmit={handleSubmit(onNext)}>
      <h2 className="display-font text-2xl font-semibold text-brand-navy">Parlons de votre besoin</h2>
      <p className="mt-2 text-ink">{offer.title} · quelques précisions pour un devis juste.</p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const error = errors[field.name]?.message;
          if (field.type === "select") return <FloatSelect key={field.name} id={`d-${field.name}`} label={field.label} options={field.options ?? []} error={error} {...register(field.name)} />;
          return <FloatInput key={field.name} id={`d-${field.name}`} label={field.label} type={field.type === "number" ? "text" : field.type} inputMode={field.type === "number" ? "numeric" : undefined} error={error} {...register(field.name)} />;
        })}
      </div>
      <div className="mt-9 flex flex-wrap justify-between gap-3">
        <button type="button" onClick={onBack} className={pill({ variant: "ghost" })}><ArrowLeft />Changer d'assurance</button>
        <button type="submit" className={pill()}>Continuer <ArrowSlide icon={ArrowRight} /></button>
      </div>
    </form>
  );
}

function ContactStep({ prefill, onBack, onSubmit }: { prefill: QuotePrefill | null; onBack: () => void; onSubmit: (values: ContactValues) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { fullName: prefill?.firstName ?? "", phone: prefill?.phone ?? "", email: "", channel: prefill?.channel ?? "", message: "", consent: false },
  });
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <h2 className="display-font text-2xl font-semibold text-brand-navy">Comment vous joindre ?</h2>
      <p className="mt-2 text-ink">Votre conseiller vous recontacte sous 24 h, par le canal de votre choix.</p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FloatInput id="c-name" label="Nom complet" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
        <FloatInput id="c-phone" label="Téléphone" type="tel" autoComplete="tel" inputMode="tel" error={errors.phone?.message} {...register("phone")} />
        <FloatInput id="c-email" label="Adresse e-mail (facultatif)" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <FloatSelect id="c-channel" label="Être recontacté par" options={CHANNELS} error={errors.channel?.message} {...register("channel")} />
        <FloatTextarea id="c-message" label="Une précision ? (facultatif)" className="sm:col-span-2" error={errors.message?.message} {...register("message")} />
        <div className="sm:col-span-2"><ConsentCheckbox id="c-consent" error={errors.consent?.message} {...register("consent")} /></div>
      </div>
      <div className="mt-9 flex flex-wrap justify-between gap-3">
        <button type="button" onClick={onBack} className={pill({ variant: "ghost" })}><ArrowLeft />Retour</button>
        <button type="submit" disabled={isSubmitting} className={pill()}>Recevoir mon devis <ArrowSlide icon={ArrowRight} /></button>
      </div>
      <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
        <Lock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        Vos informations restent confidentielles : elles servent uniquement à préparer votre devis et ne sont jamais revendues.
      </p>
    </form>
  );
}