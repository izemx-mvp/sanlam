import { useRef, useState, type KeyboardEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, FileSignature, LifeBuoy, MessageCircle, Phone, PhoneCall, ShieldAlert, Siren, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { faqJsonLd, pageHead } from "@/lib/seo";
import { isMoroccanPhone, makeReference, site, telLink, whatsappLink } from "@/config/site";
import { images } from "@/data/images";
import { claimGuides, type ClaimType } from "@/data/claims";
import { sinistreFaqs } from "@/data/faq";
import { CTABand, ConsentCheckbox, FAQAccordion, FloatInput, FloatSelect, FloatTextarea, PageHero, SuccessScreen } from "@/components/brand/blocks";
import { Arcs, ArrowSlide, Container, Eyebrow, Reveal, SectionHeading, Stagger, StaggerItem, pill } from "@/components/brand/primitives";

export const Route = createFileRoute("/sinistres")({
  head: () => pageHead({
    title: `Déclarer un sinistre à Tanger | ${site.name}`,
    description: `Accident, dégât des eaux, vol, frais de santé : les étapes à suivre, les documents à fournir et votre déclaration en ligne avec ${site.name}, agent ${site.insurer} à Tanger.`,
    path: "/sinistres",
    image: images.sinistres.hero,
    breadcrumbs: [{ name: "Sinistres", path: "/sinistres" }],
    jsonLd: [faqJsonLd(sinistreFaqs)],
  }),
  component: ClaimsPage,
});

function ClaimsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Sinistres", path: "/sinistres" }]}
        eyebrow="Sinistres"
        title={<>Un sinistre ? Gardez votre calme, on vous <span className="text-primary">guide.</span></>}
        description="Accident, dégât des eaux, vol ou frais de santé : votre conseiller vous accompagne de la déclaration jusqu'à l'indemnisation."
        image={images.sinistres.hero}
        chip={{ icon: PhoneCall, title: `Urgence : ${site.phone}`, text: "Lun–Sam 9h–20h" }}
        actions={
          <>
            <a href="#declaration" className={pill()}>Déclarer en ligne <ArrowSlide icon={ArrowRight} /></a>
            <a href={telLink} className={pill({ variant: "ghost" })}><Phone />Appeler l'agence</a>
          </>
        }
      />
      <UrgencyStrip />
      <Reflexes />
      <Guide />
      <DeclarationForm />
      <section className="bg-white py-20 sm:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>Questions fréquentes</Eyebrow>
            <h2 className="h2-display text-brand-navy">Sinistres : les <span className="text-primary">réponses.</span></h2>
            <p className="lead mt-5">Délais, expertise, suivi de dossier : l'essentiel à savoir.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={telLink} className={pill({ variant: "ghost" })}><Phone />Appeler l'agence</a>
              <a href={whatsappLink("Bonjour, j'ai une question sur mon sinistre.")} target="_blank" rel="noopener noreferrer" className={pill({ variant: "ghost" })}><MessageCircle />WhatsApp</a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><FAQAccordion items={sinistreFaqs} /></Reveal>
        </Container>
      </section>
      <CTABand title={<>Mieux couvert, mieux <span className="text-brand-navy">indemnisé.</span></>} description="Faites le point sur vos garanties avec votre conseiller avant le prochain imprévu." />
    </>
  );
}

function UrgencyStrip() {
  const items = [
    { icon: Phone, title: "Appeler l'agence", text: `${site.phone} · Lun–Sam 9h–20h`, href: telLink, cta: "Appeler" },
    { icon: Siren, title: "Assistance 24h/24", text: "Numéro d'assistance inscrit sur votre attestation", href: "#reflexes", cta: "Les bons réflexes" },
    { icon: MessageCircle, title: "WhatsApp", text: "Envoyez constat et photos directement", href: whatsappLink("Bonjour, je souhaite déclarer un sinistre."), cta: "Écrire" },
  ];
  return (
    <section className="navy-glow relative overflow-hidden py-14 text-white">
      <Container>
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map(({ icon: Icon, title, text, href, cta }) => (
            <StaggerItem key={title}>
              <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex h-full items-center gap-4 rounded-[24px] border border-white/10 bg-white/5 p-5 text-white no-underline transition-colors hover:border-brand-sky/50 hover:bg-white/10">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient"><Icon className="size-5" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <strong className="block font-semibold">{title}</strong>
                  <span className="block text-sm text-white/65">{text}</span>
                </span>
                <span className="hidden text-sm font-semibold text-brand-sky xl:inline">{cta}</span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

const reflexes = [
  { icon: ShieldAlert, title: "Mettez-vous en sécurité", text: "Protégez les personnes en priorité, balisez si besoin et appelez les secours en cas de blessés." },
  { icon: FileSignature, title: "Remplissez le constat", text: "En cas d'accident avec un tiers, complétez et signez le constat amiable sur place, sans rien raturer." },
  { icon: Camera, title: "Prenez des photos", text: "Dégâts, plaques, lieux, documents : ces photos accélèrent l'étude de votre dossier." },
  { icon: Phone, title: "Prévenez l'agence", text: "Contactez-nous au plus vite : nous vous indiquons les démarches et les délais à respecter." },
];

function Reflexes() {
  return (
    <section id="reflexes" className="scroll-mt-32 bg-brand-sand py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Les bons réflexes" title={<>Les 4 gestes à faire <span className="text-primary">tout de suite.</span></>} description="Quel que soit le sinistre, ces premiers réflexes protègent vos droits et accélèrent l'indemnisation." />
        <Stagger as="ol" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reflexes.map(({ icon: Icon, title, text }, i) => (
            <StaggerItem as="li" key={title} className="h-full">
              <article className="group relative h-full overflow-hidden rounded-[24px] bg-white p-7 shadow-[var(--card-shadow)] transition-transform duration-300 hover:-translate-y-1.5">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-gradient transition-transform duration-500 group-hover:scale-x-100" />
                <div className="flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-ice text-primary transition-colors group-hover:bg-primary group-hover:text-white"><Icon className="size-5" aria-hidden="true" /></span>
                  <span aria-hidden="true" className="display-font text-3xl font-semibold leading-none text-brand-navy/10">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="display-font mt-6 text-lg font-semibold text-brand-navy">{title}</h3>
                <p className="mt-2 text-ink">{text}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-8 flex items-start gap-3 rounded-[20px] border border-amber-200 bg-amber-50 p-5 text-[0.95rem] text-amber-900">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden="true" />
          <p>En cas de vol ou d'agression, déposez plainte auprès de la police ou de la gendarmerie avant toute déclaration : le récépissé vous sera demandé.</p>
        </Reveal>
      </Container>
    </section>
  );
}

function Guide() {
  const [type, setType] = useState<ClaimType>("auto");
  const reduced = useReducedMotion();
  const guide = claimGuides.find((g) => g.type === type) ?? claimGuides[0]!;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const i = claimGuides.findIndex((g) => g.type === type);
    const last = claimGuides.length - 1;
    const next = e.key === "Home" ? 0 : e.key === "End" ? last : e.key === "ArrowRight" ? (i >= last ? 0 : i + 1) : (i <= 0 ? last : i - 1);
    const target = claimGuides[next];
    if (!target) return;
    setType(target.type);
    tabRefs.current[next]?.focus();
  };
  return (
    <section id="guide" className="scroll-mt-32 bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Guide pas à pas" title={<>Que faire selon votre <span className="text-primary">situation ?</span></>} description="Choisissez le type de sinistre pour découvrir les étapes et les pièces à réunir." />
        <LayoutGroup id="claim-tabs">
          <div role="tablist" aria-label="Type de sinistre" onKeyDown={onTabKey} className="no-scrollbar mb-10 flex gap-2 overflow-x-auto">
            {claimGuides.map((g, index) => {
              const Icon = getIcon(g.icon);
              const active = g.type === type;
              return (
                <button key={g.type} ref={(el) => { tabRefs.current[index] = el; }} role="tab" type="button" aria-selected={active} aria-controls="claim-panel" tabIndex={active ? 0 : -1} onClick={() => setType(g.type)}
                  className={cn("relative inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", active ? "border-primary text-white" : "border-brand-navy/10 bg-brand-sand text-brand-navy hover:border-primary/40")}>
                  {active && <motion.span layoutId="claim-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <Icon className="relative size-4" aria-hidden="true" /><span className="relative">{g.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={type} id="claim-panel" role="tabpanel" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16">
            <ol className="relative">
              <span aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-gradient-to-b from-primary via-brand-sky to-transparent" />
              {guide.steps.map((step, i) => (
                <li key={step.title} className="relative flex gap-6 pb-10 last:pb-0">
                  <span className="display-font relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-primary font-semibold text-white ring-8 ring-white">{i + 1}</span>
                  <div className="flex-1 rounded-[20px] border border-transparent p-4 pt-1.5 transition-colors hover:border-brand-navy/8 hover:bg-brand-sand/60 sm:-mt-1 sm:pt-2">
                    <h3 className="display-font text-xl font-semibold text-brand-navy">{step.title}</h3>
                    <p className="mt-2 max-w-xl text-ink">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <aside className="card-surface p-7 lg:sticky lg:top-36">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-ice text-primary"><LifeBuoy className="size-6" aria-hidden="true" /></span>
              <h3 className="display-font mt-5 text-xl font-semibold text-brand-navy">Documents à fournir</h3>
              <ul className="mt-5 space-y-3">
                {guide.documents.map((doc) => {
                  const Icon = getIcon(doc.icon);
                  return <li key={doc.label} className="flex items-center gap-3 rounded-2xl bg-brand-sand px-4 py-3 text-[0.95rem] font-medium text-brand-navy"><Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />{doc.label}</li>;
                })}
              </ul>
              <a href="#declaration" className={cn(pill({ size: "sm" }), "mt-6 w-full")}>Faire ma déclaration <ArrowSlide icon={ArrowRight} /></a>
            </aside>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}

const claimSchema = z.object({
  type: z.string().min(1, "Choisissez le type de sinistre."),
  fullName: z.string().trim().min(2, "Indiquez votre nom complet."),
  phone: z.string().trim().refine(isMoroccanPhone, "Indiquez un numéro marocain valide, au format 06 12 34 56 78."),
  policy: z.string().trim().min(4, "Indiquez votre numéro de contrat ou d'immatriculation."),
  incidentDate: z.string().min(1, "Indiquez la date du sinistre.").refine((v) => new Date(v) <= new Date(), "La date ne peut pas être dans le futur."),
  place: z.string().trim().min(2, "Indiquez le lieu du sinistre."),
  details: z.string().trim().min(20, "Décrivez les circonstances en quelques phrases (20 caractères minimum)."),
  consent: z.boolean().refine((v) => v, "Votre accord est nécessaire pour traiter la déclaration."),
});
type ClaimValues = z.infer<typeof claimSchema>;

function DeclarationForm() {
  const [result, setResult] = useState<{ reference: string; values: ClaimValues } | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClaimValues>({
    resolver: zodResolver(claimSchema),
    mode: "onTouched",
    defaultValues: { type: "", fullName: "", phone: "", policy: "", incidentDate: "", place: "", details: "", consent: false },
  });
  const summary = result ? [
    { label: "Type", value: result.values.type },
    { label: "Date", value: new Date(result.values.incidentDate).toLocaleDateString("fr-FR") },
    { label: "Lieu", value: result.values.place },
    { label: "Contrat", value: result.values.policy },
    { label: "Nom", value: result.values.fullName },
    { label: "Téléphone", value: result.values.phone },
  ] : [];
  return (
    <section id="declaration" className="scroll-mt-28 bg-brand-sand py-20 sm:py-28">
      <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>Déclaration en ligne</Eyebrow>
          <h2 className="h2-display text-brand-navy">Déclarez votre sinistre en <span className="text-primary">5 minutes.</span></h2>
          <p className="lead mt-5">Renseignez les informations essentielles : notre responsable sinistres vous rappelle pour compléter le dossier et vous indiquer les prochaines étapes.</p>
          <div className="relative mt-8 overflow-hidden rounded-[24px] navy-glow p-6 text-white">
            <Arcs light className="-right-20 -top-20 size-56" count={2} />
            <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-brand-sky">Et ensuite ?</p>
            <ol className="relative mt-4 space-y-4">
              {[
                { title: "Rappel dans la journée ouvrée", text: "Notre responsable sinistres vérifie votre déclaration avec vous." },
                { title: "Envoi des pièces par WhatsApp", text: "Constat, photos, factures : une simple photo suffit." },
                { title: "Suivi jusqu'au règlement", text: "Un interlocuteur unique vous tient informé à chaque étape." },
              ].map((item, i) => (
                <li key={item.title} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-brand-sky">{i + 1}</span>
                  <span><strong className="block font-semibold text-white">{item.title}</strong><span className="text-sm text-white/70">{item.text}</span></span>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Vous préférez parler à quelqu'un ?{" "}
            <a href={telLink} className="font-semibold text-primary no-underline hover:text-primary-600">{site.phone}</a>
          </p>
        </Reveal>
        <Reveal delay={0.1} className="card-surface p-6 sm:p-10">
          {result ? (
            <SuccessScreen
              title="Votre déclaration est prête"
              description={`Merci ${result.values.fullName.split(" ")[0]}. Envoyez ce récapitulatif sur WhatsApp avec vos photos et votre constat : Youssef El Idrissi, notre responsable sinistres, prend le relais.`}
              reference={result.reference}
              summary={summary}
              whatsappMessage={[`Bonjour ${site.name}, je déclare un sinistre :`, ...summary.map((r) => `• ${r.label} : ${r.value}`), `• Circonstances : ${result.values.details}`].join("\n")}
            />
          ) : (
            <form noValidate onSubmit={handleSubmit((values) => setResult({ reference: makeReference("SIN"), values }))}>
              <h3 className="display-font text-2xl font-semibold text-brand-navy">Votre déclaration</h3>
              <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FloatSelect id="s-type" label="Type de sinistre" options={claimGuides.map((g) => g.label)} error={errors.type?.message} {...register("type")} />
                <FloatInput id="s-date" label="Date du sinistre" type="date" error={errors.incidentDate?.message} {...register("incidentDate")} />
                <FloatInput id="s-name" label="Nom complet" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
                <FloatInput id="s-phone" label="Téléphone" type="tel" inputMode="tel" autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
                <FloatInput id="s-policy" label="N° de contrat ou immatriculation" error={errors.policy?.message} {...register("policy")} />
                <FloatInput id="s-place" label="Lieu du sinistre" error={errors.place?.message} {...register("place")} />
                <FloatTextarea id="s-details" label="Décrivez les circonstances" className="sm:col-span-2" error={errors.details?.message} {...register("details")} />
                <div className="sm:col-span-2"><ConsentCheckbox id="s-consent" error={errors.consent?.message} {...register("consent")} /></div>
              </div>
              <div className="mt-8 flex justify-end">
                <button type="submit" disabled={isSubmitting} className={pill()}>Préparer ma déclaration <ArrowSlide icon={ArrowRight} /></button>
              </div>
            </form>
          )}
        </Reveal>
      </Container>
    </section>
  );
}