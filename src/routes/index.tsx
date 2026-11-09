import { useEffect, useRef, useState, type ComponentProps, type KeyboardEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutGroup, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Award, Check, Clock3, MessageCircle, Phone, ShieldCheck, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon, type IconName } from "@/lib/icons";
import { pageHead } from "@/lib/seo";
import { site, telLink, whatsappLink } from "@/config/site";
import { images } from "@/data/images";
import { businessOffers, findOffer, individualOffers, type Offer } from "@/data/offers";
import { faqs } from "@/data/faq";
import { homeTestimonials } from "@/data/testimonials";
import { posts } from "@/data/posts";
import { homeBenefits, homeStats, howSteps } from "@/data/agency";
import { AppLink, ArticleCard, CTABand, FAQAccordion } from "@/components/brand/blocks";
import {
  Arcs, ArrowSlide, Container, CountUp, Eyebrow, ImageWithFallback, Marquee, PhotoReveal, ProofChip, Reveal,
  SectionHeading, Stagger, StaggerItem, Stars, Underline, pill,
} from "@/components/brand/primitives";
import { TestimonialsCarousel } from "@/components/brand/testimonials-carousel";

export const Route = createFileRoute("/")({
  head: () => pageHead({
    title: `${site.name} | Assurance à Tanger, agent général ${site.insurer}`,
    description: `Assurance Tanger : ${site.name}, agent général ${site.insurer}, vous conseille pour votre auto, habitation, santé, voyage et vos risques professionnels. Devis gratuit sous 24 h.`,
    path: "/",
    image: images.home.hero,
  }),
  component: HomePage,
});

const yearsOfExperience = new Date().getFullYear() - site.foundedYear;

function HomePage() {
  return (
    <>
      <Hero />
      <QuickQuote />
      <TrustMarquee />
      <Solutions />
      <WhyAgent />
      <HowItWorks />
      <Stats />
      <Claims />
      <Team />
      <section className="bg-brand-sand py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Ils nous font confiance"
            title={<>Ce que nos clients <span className="text-primary">disent</span> de nous.</>}
            description={`Noté ${site.rating.label.replace(" · ", " sur ")}, l'agence accompagne des familles et des entreprises de tout Tanger.`}
          />
          <TestimonialsCarousel items={homeTestimonials} />
        </Container>
      </section>
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Conseils"
            title={<>Mieux comprendre vos <span className="text-primary">assurances.</span></>}
            description="Des guides pratiques écrits par l'équipe de l'agence, sans jargon."
            action={<AppLink to="/conseils" className={pill({ variant: "ghost" })}>Tous les conseils <ArrowSlide icon={ArrowRight} /></AppLink>}
          />
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => <StaggerItem key={post.slug} className="h-full"><ArticleCard post={post} /></StaggerItem>)}
          </Stagger>
        </Container>
      </section>
      <section className="bg-brand-ice py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>Questions fréquentes</Eyebrow>
            <h2 className="h2-display text-brand-navy">Les réponses avant de vous <span className="text-primary">lancer.</span></h2>
            <p className="lead mt-5">Une autre question ? Un conseiller vous répond directement sur WhatsApp, du lundi au samedi.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={pill()}><MessageCircle />Écrire sur WhatsApp</a>
              <AppLink to="/faq" className={pill({ variant: "ghost" })}>Toute la FAQ <ArrowSlide icon={ArrowRight} /></AppLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}><FAQAccordion items={faqs.slice(0, 6)} /></Reveal>
        </Container>
      </section>
      <CTABand title={<>Votre protection commence par une <span className="text-brand-navy">conversation.</span></>} image={images.home.cta} />
    </>
  );
}

/* ---------------------------------------------------------------- helpers */

/** Arrow-key navigation for radio groups and tab lists (WAI-ARIA pattern). */
function useRovingKeys<T extends string>(values: readonly T[], current: T, onChange: (value: T) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const i = values.indexOf(current);
    const last = values.length - 1;
    const next =
      e.key === "Home" ? 0
      : e.key === "End" ? last
      : e.key === "ArrowRight" || e.key === "ArrowDown" ? (i >= last ? 0 : i + 1)
      : (i <= 0 ? last : i - 1);
    const value = values[next];
    if (value === undefined) return;
    onChange(value);
    refs.current[next]?.focus();
  };
  const register = (index: number) => (el: HTMLButtonElement | null) => { refs.current[index] = el; };
  return { onKeyDown, register };
}

function useDesktopParallax() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnabled(mq.matches && !reduced);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduced]);
  return enabled;
}

/* ---------------------------------------------------------------- 1. Hero */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const parallax = useDesktopParallax();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const avatars = [images.home.avatar1, images.home.avatar2, images.home.avatar3];
  return (
    <section ref={ref} className="relative overflow-hidden bg-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[42rem] w-[52rem] rounded-full bg-brand-sand blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-brand-ice blur-3xl" />
      <Container className="relative grid grid-cols-1 items-center gap-14 pb-36 pt-10 sm:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:pb-40 lg:pt-20">
        <div>
          <div className="rise-in"><Eyebrow>{site.descriptor}</Eyebrow></div>
          <h1 className="h1-display rise-in rise-in-1 max-w-[14ch] text-balance text-brand-navy">
            À vos côtés pour <Underline onLoad>protéger</Underline> ce qui compte.
          </h1>
          <p className="lead rise-in rise-in-2 mt-7 max-w-xl text-pretty">
            Depuis {site.foundedYear}, notre équipe tangéroise vous aide à choisir, comprendre et utiliser vos assurances, pour votre famille comme pour votre entreprise.
          </p>
          <div className="rise-in rise-in-3 mt-9 flex flex-wrap gap-3">
            <AppLink to="/devis" className={pill()}>Demander un devis <ArrowSlide icon={ArrowRight} /></AppLink>
            <AppLink to="/agence" className={pill({ variant: "ghost" })}>Rencontrer l'agence <ArrowSlide icon={ArrowUpRight} /></AppLink>
          </div>
          <div className="rise-in rise-in-4 mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {avatars.map((avatar) => (
                  <ImageWithFallback key={avatar.src} image={avatar} className="size-11 rounded-full ring-[3px] ring-white" sizes="44px" />
                ))}
              </div>
              <div className="leading-tight">
                <Stars value={site.rating.value} />
                <p className="mt-1 text-sm font-medium text-brand-navy">{site.rating.label}</p>
              </div>
            </div>
            <span aria-hidden="true" className="hidden h-10 w-px bg-brand-navy/10 sm:block" />
            <p className="flex items-center gap-2 text-sm font-medium text-brand-navy/80">
              <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
              Agent général {site.insurer}
            </p>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[30rem] lg:mr-0">
          <Arcs className="-left-16 -top-14 size-[calc(100%+8rem)] lg:-left-20" count={3} />
          <motion.div style={parallax ? { y } : {}} className="relative">
            <div className="hero-photo overflow-hidden radius-organic shadow-[0_40px_80px_-40px_rgba(11,42,69,0.6)]">
              <ImageWithFallback image={images.home.hero} priority className="aspect-[4/5]" sizes="(min-width: 1024px) 480px, 90vw" />
            </div>
          </motion.div>
          <ProofChip icon={Clock3} title="Réponse sous 24 h" text="Pour chaque demande de devis" className="rise-in rise-in-5 -left-3 top-10 sm:-left-10" />
          <ProofChip icon={UserRound} title="Un conseiller dédié" text="Qui suit vos contrats" className="rise-in rise-in-5 -right-2 bottom-10 sm:-right-8" />
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- 2. Quick quote */

const quickLabels: Record<string, string> = { auto: "Auto", habitation: "Habitation", sante: "Santé", voyage: "Voyage", "multirisque-pro": "Commerce", flotte: "Flotte" };
const quickProducts = ["auto", "habitation", "sante", "voyage", "multirisque-pro", "flotte"];

function QuickQuote() {
  const navigate = useNavigate();
  const list = quickProducts.map(findOffer).filter((o): o is Offer => Boolean(o));
  const slugs = list.map((o) => o.slug);
  const [selected, setSelected] = useState(slugs[0] ?? "auto");
  const roving = useRovingKeys(slugs, selected, setSelected);
  return (
    <div className="relative z-10 -mt-24 sm:-mt-20">
      <Container>
        <Reveal className="card-surface p-5 sm:p-7 lg:flex lg:items-center lg:gap-8">
          <div className="mb-4 shrink-0 lg:mb-0 lg:max-w-[12rem]">
            <p id="quick-quote-label" className="display-font text-lg font-semibold text-brand-navy">Que souhaitez-vous assurer ?</p>
            <p className="mt-1 text-sm text-muted-foreground">Devis gratuit, réponse sous 24 h.</p>
          </div>
          <div role="radiogroup" aria-labelledby="quick-quote-label" onKeyDown={roving.onKeyDown} className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {list.map((offer, index) => {
              const Icon = getIcon(offer.icon);
              const active = selected === offer.slug;
              return (
                <button
                  key={offer.slug}
                  ref={roving.register(index)}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSelected(offer.slug)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    active
                      ? "border-primary bg-primary text-white shadow-[0_10px_24px_-12px_rgba(10,117,187,0.8)]"
                      : "border-brand-navy/10 bg-white text-brand-navy hover:-translate-y-0.5 hover:border-primary/40 hover:bg-brand-ice",
                  )}
                >
                  <Icon className={cn("size-5 shrink-0", active ? "text-white" : "text-primary")} aria-hidden="true" />
                  <span className="truncate">{quickLabels[offer.slug] ?? offer.title}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => void navigate({ to: "/devis", search: { produit: selected } })}
            className={cn(pill(), "mt-4 w-full lg:mt-0 lg:w-auto")}
          >
            Continuer <ArrowSlide icon={ArrowRight} />
          </button>
        </Reveal>
      </Container>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Marquee */

const marqueeItems: { label: string; icon: IconName }[] = [
  { label: "Assurance auto", icon: "CarFront" },
  { label: "Habitation", icon: "House" },
  { label: "Santé", icon: "HeartPulse" },
  { label: "Voyage", icon: "Plane" },
  { label: "Épargne", icon: "PiggyBank" },
  { label: "Professionnels", icon: "Briefcase" },
  { label: "Flotte", icon: "Truck" },
  { label: "Accidents du travail", icon: "HardHat" },
];

function TrustMarquee() {
  return (
    <section aria-label="Nos domaines d'assurance" className="-mt-16 bg-brand-sand pb-10 pt-28 sm:-mt-14">
      <Marquee>
        {marqueeItems.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <span key={item.label} className="mx-6 inline-flex items-center gap-3 whitespace-nowrap text-lg font-medium text-brand-navy/80 sm:mx-10">
              <Icon className="size-5 text-primary" aria-hidden="true" />
              {item.label}
              <span aria-hidden="true" className="ml-6 size-1.5 rounded-full bg-brand-sky sm:ml-10" />
            </span>
          );
        })}
      </Marquee>
    </section>
  );
}

/* ---------------------------------------------------------------- 4. Solutions */

const audiences = ["Particuliers", "Professionnels"] as const;
type Audience = (typeof audiences)[number];

function Solutions() {
  const [tab, setTab] = useState<Audience>("Particuliers");
  const roving = useRovingKeys(audiences, tab, setTab);
  const list = tab === "Particuliers" ? individualOffers : businessOffers;
  const [lead, ...rest] = list;
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Nos solutions"
          title={<>Une protection pour chaque <span className="text-primary">étape</span> de vie.</>}
          description="Particulier ou professionnel, chaque contrat est étudié avec vous et expliqué clairement avant signature."
          action={
            <LayoutGroup id="solutions-tabs">
              <div role="tablist" aria-label="Type de client" onKeyDown={roving.onKeyDown} className="inline-flex rounded-full border border-brand-navy/10 bg-brand-sand p-1.5">
                {audiences.map((t, index) => (
                  <button
                    key={t}
                    ref={roving.register(index)}
                    id={`solutions-tab-${index}`}
                    role="tab"
                    type="button"
                    aria-selected={tab === t}
                    aria-controls="solutions-panel"
                    tabIndex={tab === t ? 0 : -1}
                    onClick={() => setTab(t)}
                    className={cn(
                      "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-6",
                      tab === t ? "text-white" : "text-brand-navy hover:text-primary",
                    )}
                  >
                    {tab === t && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                    <span className="relative">{t}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          }
        />
        <div id="solutions-panel" role="tabpanel" aria-labelledby={`solutions-tab-${audiences.indexOf(tab)}`}>
          <Stagger key={tab} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:auto-rows-[minmax(17rem,auto)] lg:grid-cols-3">
            {lead && (
              <StaggerItem className="md:col-span-2 lg:row-span-2">
                <LeadCard offer={lead} />
              </StaggerItem>
            )}
            {rest.map((offer, i) => (
              <StaggerItem key={offer.slug} className={cn("h-full", i === rest.length - 1 && rest.length % 2 === 0 && "lg:col-span-2")}>
                <BentoCard offer={offer} />
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-brand-navy/10 bg-brand-sand px-6 py-5 sm:px-8">
            <p className="font-medium text-brand-navy">Vous ne savez pas quelle formule choisir ? Un conseiller vous oriente gratuitement.</p>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={pill({ variant: "ghost" })}><MessageCircle />Demander conseil</a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function LeadCard({ offer }: { offer: Offer }) {
  return (
    <AppLink to={`/assurances/${offer.slug}`} className="group zoom-media relative flex h-full min-h-[24rem] flex-col justify-end overflow-hidden rounded-[28px] text-white no-underline shadow-[0_30px_60px_-36px_rgba(11,42,69,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
      <ImageWithFallback image={offer.heroImage} className="!absolute inset-0 h-full w-full" sizes="(min-width: 1024px) 66vw, 100vw" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/35 to-transparent" />
      <div className="relative p-7 sm:p-10">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
          <Check className="size-3.5" aria-hidden="true" />{offer.proof.title}
        </span>
        <h3 className="h2-display max-w-md !text-white">{offer.title}</h3>
        <p className="mt-3 max-w-md text-white/85">{offer.tagline}</p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors group-hover:bg-brand-ice">
          Découvrir <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </AppLink>
  );
}

function BentoCard({ offer }: { offer: Offer }) {
  const Icon = getIcon(offer.icon);
  return (
    <AppLink
      to={`/assurances/${offer.slug}`}
      className="group zoom-media relative flex h-full min-h-[17rem] flex-col justify-end overflow-hidden rounded-[24px] text-white no-underline shadow-[0_24px_48px_-32px_rgba(11,42,69,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <ImageWithFallback image={offer.heroImage} className="!absolute inset-0 h-full w-full" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
      {/* full-bleed photo with a navy gradient: faces stay visible, text stays readable */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/45 to-brand-navy/0" />
      <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/0 transition-colors duration-500 group-hover:bg-brand-navy/15" />
      <span className="absolute left-5 top-5 grid size-11 place-items-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur-md">
        <Icon className="size-5 text-white" aria-hidden="true" />
      </span>
      <span aria-hidden="true" className="absolute right-5 top-5 grid size-10 -translate-y-1 place-items-center rounded-full bg-white text-brand-navy opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <ArrowUpRight className="size-4" />
      </span>
      <div className="relative p-6">
        <h3 className="display-font text-xl font-semibold leading-tight !text-white">{offer.title}</h3>
        <p className="mt-2 line-clamp-2 max-w-sm text-[0.95rem] leading-relaxed text-white/80">{offer.short}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
          Découvrir <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </AppLink>
  );
}

/* ---------------------------------------------------------------- 5. Why an agent */

function WhyAgent() {
  return (
    <section className="bg-brand-sand py-20 sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          <Arcs className="-bottom-16 -right-16 hidden size-[22rem] sm:block" />
          <PhotoReveal className="overflow-hidden radius-organic-left shadow-[0_30px_60px_-30px_rgba(11,42,69,0.5)]">
            <ImageWithFallback image={images.home.whyAgent} className="aspect-[4/5]" sizes="(min-width: 1024px) 450px, 90vw" />
          </PhotoReveal>
          <ProofChip
            icon={Award}
            title={`${yearsOfExperience} ans d'expérience`}
            text={`Agent général ${site.insurer} depuis ${site.foundedYear}`}
            className="-right-3 bottom-12 sm:-right-10"
          />
        </div>
        <div>
          <Reveal>
            <Eyebrow>Pourquoi un agent</Eyebrow>
            <h2 className="h2-display text-brand-navy">Un vrai interlocuteur, pas un <span className="text-primary">centre d'appels.</span></h2>
            <p className="lead mt-5">Passer par votre agent général, c'est bénéficier de la solidité de {site.insurer} et d'un conseil humain, à deux pas de chez vous.</p>
          </Reveal>
          <Stagger as="ol" className="mt-10 border-t border-brand-navy/10">
            {homeBenefits.map((benefit, i) => (
              <StaggerItem as="li" key={benefit.title} className="group flex gap-6 border-b border-brand-navy/10 py-6">
                <span className="display-font w-10 shrink-0 text-lg font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-lg font-semibold text-brand-navy">{benefit.title}</h3>
                  <p className="mt-1.5 text-ink">{benefit.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- 6. How it works */

function HowItWorks() {
  const reduced = useReducedMotion();
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading center eyebrow="Comment ça marche" title={<>Votre devis en trois <span className="text-primary">étapes</span> simples.</>} description="Gratuit, sans engagement, et toujours avec un conseiller à l'écoute." />
        <div className="relative">
          <div aria-hidden="true" className="absolute left-[16.66%] right-[16.66%] top-12 hidden h-px bg-brand-navy/10 md:block">
            <motion.div
              className="h-full origin-left bg-brand-gradient"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
            />
          </div>
          <Stagger as="ol" className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {howSteps.map((step, i) => {
              const Icon = getIcon(step.icon);
              return (
                <StaggerItem as="li" key={step.title} className="group text-center">
                  <div className="relative mx-auto h-24 w-28 bg-white">
                    <span aria-hidden="true" className="display-font absolute inset-y-0 left-1 grid place-items-center text-[6.5rem] font-semibold leading-none text-transparent [-webkit-text-stroke:2px_color-mix(in_oklab,var(--primary)_45%,transparent)]">{i + 1}</span>
                    <span className="absolute -bottom-2 right-0 grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[var(--card-shadow)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="display-font mt-6 text-xl font-semibold text-brand-navy">{step.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-ink">{step.text}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
        <Reveal className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <AppLink to="/devis" className={pill()}>Commencer mon devis <ArrowSlide icon={ArrowRight} /></AppLink>
          <a href={telLink} className={pill({ variant: "ghost" })}><Phone />Préférer un appel</a>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- 7. Stats */

function Stats() {
  return (
    <section className="relative overflow-hidden navy-glow py-20 text-white sm:py-24">
      <Arcs light className="-right-40 top-1/2 size-[40rem] -translate-y-1/2" />
      <Arcs light className="-left-48 -top-48 size-[30rem]" count={2} />
      <Container className="relative">
        <Stagger className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {homeStats.map((stat) => (
            <StaggerItem key={stat.label} className="border-l border-white/15 pl-5 sm:pl-8">
              <CountUp value={stat.value} {...(stat.suffix ? { suffix: stat.suffix } : {})} className="display-font block text-[clamp(2.4rem,5vw,3.75rem)] font-semibold leading-none tracking-tight text-white" />
              <span className="mt-3 block text-[0.95rem] text-brand-sky">{stat.label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- 8. Claims */

const claimSteps = [
  { title: "Prévenez-nous rapidement", text: "Par téléphone, WhatsApp ou à l'agence, dès que possible après le sinistre." },
  { title: "Nous constituons le dossier", text: "Constat, photos, pièces justificatives : nous vérifions tout avec vous." },
  { title: "Nous suivons l'indemnisation", text: "Un interlocuteur unique, jusqu'au règlement de votre dossier." },
];

function Claims() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <Reveal className="card-surface grid grid-cols-1 overflow-hidden lg:grid-cols-2">
          <PhotoReveal className="relative aspect-[4/3] lg:aspect-auto lg:min-h-full">
            <ImageWithFallback image={images.home.sinistre} className="!absolute inset-0 h-full w-full" sizes="(min-width: 1024px) 50vw, 100vw" />
            <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-brand-navy shadow-[var(--card-shadow)] backdrop-blur">
              <Clock3 className="size-4 text-primary" aria-hidden="true" />
              Réponse le jour même, du lundi au samedi
            </div>
          </PhotoReveal>
          <div className="p-7 sm:p-12">
            <Eyebrow>Sinistres</Eyebrow>
            <h2 className="h2-display text-brand-navy">Un sinistre ? On s'en <span className="text-primary">occupe</span> avec vous.</h2>
            <ol className="mt-8 space-y-5">
              {claimSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-ice text-sm font-semibold text-primary">{i + 1}</span>
                  <span><strong className="block font-semibold text-brand-navy">{step.title}</strong><span className="text-ink">{step.text}</span></span>
                </li>
              ))}
            </ol>
            <div className="mt-9 flex flex-wrap gap-3">
              <AppLink to="/sinistres" className={pill()}>Déclarer un sinistre <ArrowSlide icon={ArrowRight} /></AppLink>
              <a href={telLink} className={pill({ variant: "ghost" })}><Phone />Appeler l'agence</a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Check className="size-4 text-primary" aria-hidden="true" />Assistance 24h/24 au numéro figurant sur votre attestation</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- 9. Team teaser */

// Built from the hero image object (same 4:5 ratio) so it matches the image type ImageWithFallback expects.
type ImageAsset = ComponentProps<typeof ImageWithFallback>["image"];
const teamImage = (n: number, alt: string): ImageAsset => ({ ...images.home.hero, src: `/images/agence/team-${n}.webp`, alt });

const team = [
  { image: teamImage(1, "Le directeur de l'agence Assurances Cherradi à Tanger"), role: "Directeur d'agence" },
  { image: teamImage(2, "Conseillère commerciale de l'agence"), role: "Conseillère commerciale" },
  { image: teamImage(3, "Responsable sinistres de l'agence"), role: "Responsable sinistres" },
  { image: teamImage(4, "Chargée de relation client de l'agence"), role: "Relation client" },
];

function Team() {
  return (
    <section className="relative overflow-hidden bg-brand-ice py-20 sm:py-28">
      <Arcs className="-left-40 -top-40 hidden size-[30rem] lg:block" count={2} />
      <Container className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal>
          <Eyebrow>L'équipe</Eyebrow>
          <h2 className="h2-display text-brand-navy">Des visages, pas des <span className="text-primary">numéros.</span></h2>
          <p className="lead mt-5">
            À l'agence de l'avenue Moulay Rachid, vous êtes reçu par la même équipe, du premier devis jusqu'au règlement d'un sinistre. On connaît votre dossier, et votre prénom.
          </p>
          <ul className="mt-8 space-y-3">
            {["Un conseiller attitré pour chaque client", "Un suivi des échéances et des renouvellements", "Des réponses claires, en français ou en darija"].map((item) => (
              <li key={item} className="flex items-start gap-3 text-brand-navy">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-white"><Check className="size-3.5" aria-hidden="true" /></span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <AppLink to="/agence" className={pill()}>Découvrir l'agence <ArrowSlide icon={ArrowRight} /></AppLink>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={pill({ variant: "ghost" })}><MessageCircle />WhatsApp</a>
          </div>
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-4 sm:gap-5">
          {team.map((member, i) => (
            <StaggerItem key={member.role} className={cn(i % 2 === 1 && "mt-8 sm:mt-12")}>
              <figure className="group zoom-media relative overflow-hidden rounded-[24px] shadow-[0_24px_48px_-28px_rgba(11,42,69,0.55)]">
                <ImageWithFallback image={member.image} className="aspect-[4/5]" sizes="(min-width: 1024px) 280px, 45vw" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/85 to-transparent p-4 pt-12 text-sm font-semibold text-white sm:p-5 sm:pt-14">
                  {member.role}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}