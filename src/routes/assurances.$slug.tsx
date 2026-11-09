import { useEffect, useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { LayoutGroup, motion } from "framer-motion";
import {
  ArrowRight, Check, Clock3, FileText, Headset, MessageCircle, MessagesSquare, Phone, Plus, ShieldCheck, SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { faqJsonLd, pageHead } from "@/lib/seo";
import { site, telLink, whatsappLink } from "@/config/site";
import { findOffer, getOffers, offers, type Offer } from "@/data/offers";
import { howSteps } from "@/data/agency";
import { AppLink, CTABand, FAQAccordion, PageHero, ProductCard } from "@/components/brand/blocks";
import { Arcs, ArrowSlide, Container, Eyebrow, IconTile, Reveal, SectionHeading, Stagger, StaggerItem, highlightLast, pill } from "@/components/brand/primitives";
import { openChat } from "@/components/chat/store";

export const Route = createFileRoute("/assurances/$slug")({
  loader: ({ params }) => {
    const offer = findOffer(params.slug);
    if (!offer) throw notFound();
    return offer;
  },
  head: ({ loaderData }) => {
    const offer = loaderData ?? offers[0]!;
    return pageHead({
      title: `${offer.title} à Tanger | ${site.name}`,
      description: `${offer.tagline} Devis gratuit sous 24 h avec ${site.name}, agent général ${site.insurer} à Tanger.`,
      path: `/assurances/${offer.slug}`,
      image: offer.heroImage,
      breadcrumbs: [
        { name: offer.group, path: offer.group === "Particuliers" ? "/particuliers" : "/professionnels" },
        { name: offer.title, path: `/assurances/${offer.slug}` },
      ],
      jsonLd: [faqJsonLd(offer.faq)],
    });
  },
  component: OfferPage,
});

const sections = [
  { id: "pour-qui", label: "Pour qui" },
  { id: "garanties", label: "Garanties" },
  { id: "options", label: "Options" },
  { id: "documents", label: "Documents" },
  { id: "demarches", label: "Démarches" },
  { id: "faq", label: "FAQ" },
] as const;

function useActiveSection() {
  const [active, setActive] = useState<string>(sections[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

function OfferPage() {
  const offer = Route.useLoaderData();
  const active = useActiveSection();
  const hub = offer.group === "Particuliers" ? "/particuliers" : "/professionnels";
  const ProofIcon = getIcon(offer.guarantees[4]?.icon ?? "ShieldCheck");
  const devisHref = `/devis?produit=${offer.slug}`;
  return (
    <>
      <PageHero
        breadcrumbs={[{ name: offer.group, path: hub }, { name: offer.title, path: `/assurances/${offer.slug}` }]}
        eyebrow={offer.group}
        title={highlightLast(offer.title)}
        description={offer.tagline}
        image={offer.heroImage}
        chip={{ icon: ProofIcon, title: offer.proof.title, text: offer.proof.text }}
        actions={
          <>
            <AppLink to={devisHref} className={pill()}>Demander un devis <ArrowSlide icon={ArrowRight} /></AppLink>
            <a href={whatsappLink(`Bonjour ${site.name}, je souhaite des informations au sujet de : ${offer.title}.`)} target="_blank" rel="noopener noreferrer" className={pill({ variant: "ghost" })}>
              <MessageCircle />WhatsApp
            </a>
          </>
        }
      >
        <button type="button" onClick={() => openChat({ offer: offer.slug })} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-600">
          <MessagesSquare className="size-4" aria-hidden="true" />Poser une question à l'assistant
        </button>
      </PageHero>

      <SectionNav active={active} devisHref={devisHref} />
      <KeyFacts offer={offer} />
      <ForWho offer={offer} />
      <Guarantees offer={offer} />
      <OptionsAndDocuments offer={offer} devisHref={devisHref} />
      <Process offer={offer} devisHref={devisHref} />

      {/* FAQ */}
      <section id="faq" className="scroll-mt-40 bg-brand-ice py-20 sm:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <Reveal className="lg:sticky lg:top-44 lg:self-start">
            <Eyebrow>Questions fréquentes</Eyebrow>
            <h2 className="h2-display text-brand-navy">{offer.title} : vos <span className="text-primary">questions.</span></h2>
            <p className="lead mt-5">Vous ne trouvez pas votre réponse ? Notre assistant ou un conseiller vous répond.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => openChat({ offer: offer.slug })} className={pill({ variant: "ghost" })}><MessagesSquare />Poser une question</button>
              <a href={telLink} className={pill({ variant: "ghost" })}><Phone />Appeler</a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><FAQAccordion items={offer.faq} /></Reveal>
        </Container>
      </section>

      {/* Related */}
      <section className="bg-white pt-20 sm:pt-24">
        <Container>
          <SectionHeading
            eyebrow="Autres solutions"
            title={<>Vous pourriez aussi <span className="text-primary">aimer.</span></>}
            action={<AppLink to={hub} className={pill({ variant: "ghost" })}>Tout voir <ArrowSlide icon={ArrowRight} /></AppLink>}
          />
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getOffers(offer.related).map((o) => <StaggerItem key={o.slug} className="h-full"><ProductCard offer={o} /></StaggerItem>)}
          </Stagger>
        </Container>
      </section>

      <CTABand
        title={<>Votre situation est <span className="text-brand-navy">unique.</span></>}
        description={`${offer.title} : recevez une proposition adaptée à votre profil, gratuitement et sous 24 h.`}
      />
    </>
  );
}

/* ---------------------------------------------------------------- Sticky section nav */

function SectionNav({ active, devisHref }: { active: string; devisHref: string }) {
  const index = sections.findIndex((s) => s.id === active);
  const progress = ((index + 1) / sections.length) * 100;
  return (
    <div className="z-30 border-y border-brand-navy/8 bg-white/90 backdrop-blur-xl lg:sticky lg:top-[76px]">
      <Container className="flex items-center gap-4">
        <nav aria-label="Sections de la page" className="no-scrollbar -mx-4 flex flex-1 gap-1 overflow-x-auto px-4 py-3">
          <LayoutGroup id="offer-section-nav">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className="relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {isActive && <motion.span layoutId="offer-nav-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                  <span className={cn("relative transition-colors", isActive ? "text-white" : "text-brand-navy hover:text-primary")}>{s.label}</span>
                </a>
              );
            })}
          </LayoutGroup>
        </nav>
        <AppLink to={devisHref} className={cn(pill(), "hidden shrink-0 lg:inline-flex")}>Devis gratuit <ArrowSlide icon={ArrowRight} /></AppLink>
      </Container>
      <div aria-hidden="true" className="h-0.5 bg-brand-navy/5">
        <div className="h-full bg-brand-gradient transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Key facts */

function KeyFacts({ offer }: { offer: Offer }) {
  const facts = [
    { icon: Clock3, title: "Devis sous 24 h", text: "Gratuit et sans engagement" },
    { icon: ShieldCheck, title: `${offer.guarantees.length} garanties clés`, text: "Expliquées avant signature" },
    { icon: SlidersHorizontal, title: `${offer.options.length} options`, text: "À ajouter selon vos besoins" },
    { icon: Headset, title: "Suivi par l'agence", text: "Un interlocuteur unique à Tanger" },
  ];
  return (
    <section aria-label="L'essentiel" className="bg-white pt-12 sm:pt-16">
      <Container>
        <Stagger className="grid grid-cols-2 overflow-hidden rounded-[24px] border border-brand-navy/10 bg-white lg:grid-cols-4">
          {facts.map((fact, i) => (
            <StaggerItem
              key={fact.title}
              className={cn(
                "flex items-center gap-4 p-5 sm:p-6",
                i % 2 === 0 && "border-r border-brand-navy/10",
                i < 2 && "border-b border-brand-navy/10 lg:border-b-0",
                i === 1 && "lg:border-r",
                i === 2 && "lg:border-r",
              )}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-ice text-primary"><fact.icon className="size-5" aria-hidden="true" /></span>
              <span className="leading-tight">
                <strong className="block font-semibold text-brand-navy">{fact.title}</strong>
                <span className="mt-1 block text-sm text-muted-foreground">{fact.text}</span>
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Pour qui */

function ForWho({ offer }: { offer: Offer }) {
  return (
    <section id="pour-qui" className="scroll-mt-40 bg-white py-20 sm:py-24">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
        <Reveal>
          <Eyebrow>Pour qui</Eyebrow>
          <h2 className="h2-display text-brand-navy">Une réponse adaptée à <span className="text-primary">votre situation.</span></h2>
          <p className="lead mt-6">{offer.intro}</p>
          <p className="mt-4 text-ink">{offer.audience}</p>
        </Reveal>
        <Reveal delay={0.1} className="relative">
          <Arcs className="-right-24 -top-24 hidden size-[22rem] lg:block" count={2} />
          <div className="card-surface relative p-7 sm:p-9">
            <p className="display-font text-lg font-semibold text-brand-navy">Cette assurance est faite pour vous si vous êtes :</p>
            <ul className="mt-6 divide-y divide-brand-navy/8">
              {offer.forWho.map((profile) => (
                <li key={profile} className="flex items-center gap-3 py-3.5 text-[1.02rem] font-medium text-brand-navy">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-white"><Check className="size-4" aria-hidden="true" /></span>
                  {profile}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-sand p-4">
              <p className="text-sm font-medium text-brand-navy">Pas sûr que ce soit pour vous ?</p>
              <button type="button" onClick={() => openChat({ offer: offer.slug })} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-600">
                <MessagesSquare className="size-4" aria-hidden="true" />Demander à l'assistant
              </button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Garanties */

function Guarantees({ offer }: { offer: Offer }) {
  return (
    <section id="garanties" className="scroll-mt-40 bg-brand-sand py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Garanties"
          title={<>Ce qui est <span className="text-primary">couvert.</span></>}
          description="Les principales garanties, détaillées dans votre proposition avec leurs plafonds et franchises."
        />
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offer.guarantees.map((g, i) => {
            const Icon = getIcon(g.icon);
            const featured = i === 0;
            return (
              <StaggerItem key={g.title} className="h-full">
                <article
                  className={cn(
                    "group relative h-full overflow-hidden rounded-[24px] p-7 transition-all duration-300 hover:-translate-y-1.5",
                    featured
                      ? "navy-glow text-white shadow-[0_30px_60px_-30px_rgba(11,42,69,0.7)]"
                      : "card-surface card-hover",
                  )}
                >
                  <div className="flex items-start justify-between">
                    {featured ? (
                      <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-brand-sky"><Icon className="size-6" aria-hidden="true" /></span>
                    ) : (
                      <IconTile icon={Icon} />
                    )}
                    <span aria-hidden="true" className={cn("display-font text-3xl font-semibold leading-none", featured ? "text-white/20" : "text-brand-navy/10")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className={cn("display-font mt-6 text-lg font-semibold", featured ? "!text-white" : "text-brand-navy")}>{g.title}</h3>
                  <p className={cn("mt-2", featured ? "text-white/75" : "text-ink")}>{g.text}</p>
                  {featured && <span className="mt-5 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-sky">Garantie essentielle</span>}
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Options + documents */

function OptionsAndDocuments({ offer, devisHref }: { offer: Offer; devisHref: string }) {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16">
        <div id="options" className="scroll-mt-40">
          <Reveal>
            <Eyebrow>Options</Eyebrow>
            <h2 className="h2-display text-brand-navy">Allez plus loin selon vos <span className="text-primary">besoins.</span></h2>
            <p className="lead mt-5">Des options à la carte, que votre conseiller vous propose uniquement si elles vous sont utiles.</p>
          </Reveal>
          <Stagger as="ul" className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {offer.options.map((option) => (
              <StaggerItem as="li" key={option}>
                <div className="group flex h-full items-center gap-3 rounded-2xl border border-brand-navy/10 bg-white px-4 py-4 text-[1.02rem] font-medium text-brand-navy transition-all duration-200 hover:border-primary/40 hover:bg-brand-ice">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-ice text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Plus className="size-4" aria-hidden="true" />
                  </span>
                  {option}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <aside id="documents" className="scroll-mt-40 lg:sticky lg:top-44">
          <Reveal className="relative overflow-hidden rounded-[28px] navy-glow p-8 text-white">
            <Arcs light className="-right-24 -top-24 size-64" count={2} />
            <span className="relative grid size-12 place-items-center rounded-2xl bg-white/10 text-brand-sky"><FileText className="size-6" aria-hidden="true" /></span>
            <h2 className="display-font relative mt-6 text-2xl font-semibold !text-white">Documents à préparer</h2>
            <p className="relative mt-2 text-white/70">Pour un devis précis et rapide :</p>
            <ol className="relative mt-6 space-y-3.5">
              {offer.documents.map((doc, i) => (
                <li key={doc} className="flex gap-3 text-[0.98rem] text-white/90">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-brand-sky">{i + 1}</span>
                  {doc}
                </li>
              ))}
            </ol>
            <AppLink to={devisHref} className={cn(pill({ variant: "gradient" }), "relative mt-8 w-full")}>Préparer mon devis <ArrowSlide icon={ArrowRight} /></AppLink>
            <p className="relative mt-4 flex items-center justify-center gap-2 text-xs text-white/60"><ShieldCheck className="size-3.5" aria-hidden="true" />Une photo envoyée par WhatsApp suffit</p>
          </Reveal>
        </aside>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Démarches */

function Process({ offer, devisHref }: { offer: Offer; devisHref: string }) {
  return (
    <section id="demarches" className="relative scroll-mt-40 overflow-hidden navy-glow py-20 text-white sm:py-24">
      <Arcs light className="-right-40 top-1/2 size-[36rem] -translate-y-1/2" />
      <Container className="relative">
        <Reveal className="max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-sky"><span aria-hidden="true" className="h-px w-6 bg-brand-sky" />Démarches</p>
          <h2 className="h2-display !text-white">Votre {offer.title.toLowerCase()} en trois <span className="text-brand-sky">étapes.</span></h2>
          <p className="lead mt-5 !text-white/75">Simple, rapide, et toujours avec un conseiller de l'agence à vos côtés.</p>
        </Reveal>
        <Stagger as="ol" className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {howSteps.map((step, i) => {
            const Icon = getIcon(step.icon);
            return (
              <StaggerItem as="li" key={step.title} className="h-full">
                <div className="group h-full rounded-[24px] border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.1]">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span aria-hidden="true" className="display-font text-4xl font-semibold leading-none text-white/15">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="display-font mt-6 text-xl font-semibold !text-white">{step.title}</h3>
                  <p className="mt-2 text-white/70">{step.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
        <Reveal className="mt-12 flex flex-wrap gap-3">
          <AppLink to={devisHref} className={pill({ variant: "gradient" })}>Commencer mon devis <ArrowSlide icon={ArrowRight} /></AppLink>
          <a href={telLink} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-semibold text-white no-underline transition-colors hover:bg-white/10">
            <Phone className="size-4" aria-hidden="true" />Appeler l'agence
          </a>
        </Reveal>
      </Container>
    </section>
  );
}