import type { ReactNode } from "react";
import {
  ArrowRight,
  Briefcase,
  Car,
  Check,
  Clock,
  Factory,
  FileText,
  Handshake,
  HeartPulse,
  Home,
  MapPin,
  MessageCircle,
  PiggyBank,
  Plane,
  SearchCheck,
  ShieldCheck,
  Store,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { site } from "@/config/site";
import type { SiteImage } from "@/data/images";
import { businessOffers, individualOffers } from "@/data/offers";
import { hubFaqs, packs } from "@/data/packs";
import { testimonialsFor } from "@/data/testimonials";
import { AppLink, CTABand, FAQAccordion, PageHero, ProductCard, TestimonialCard } from "@/components/brand/blocks";
import { ArrowSlide, Container, Eyebrow, Reveal, SectionHeading, Stagger, StaggerItem, pill } from "@/components/brand/primitives";

type Audience = "Particuliers" | "Professionnels";

type Item = { icon: LucideIcon; title: string; text: string };

type HubCopy = {
  title: ReactNode;
  description: string;
  needs: ReactNode;
  chip: { title: string; text: string };
  profilesTitle: ReactNode;
  profiles: Item[];
  stepsTitle: ReactNode;
  steps: Item[];
  why: Item[];
  other: { audience: Audience; path: string; title: string; text: string };
};

const copy: Record<Audience, HubCopy> = {
  Particuliers: {
    title: <>Votre famille, votre maison, vos <span className="text-primary">projets.</span></>,
    description: "Auto, habitation, santé, voyage, épargne : des solutions claires pour chaque moment de vie, expliquées par un conseiller qui vous connaît.",
    needs: <>Des assurances pour votre <span className="text-primary">quotidien.</span></>,
    chip: { title: "2 300+ clients", text: "accompagnés à Tanger" },
    profilesTitle: <>Une solution pour chaque <span className="text-primary">moment de vie.</span></>,
    profiles: [
      { icon: Car, title: "Conducteurs", text: "Premier véhicule, voiture familiale ou deux-roues." },
      { icon: Home, title: "Propriétaires & locataires", text: "Logement, contenu et responsabilité civile." },
      { icon: HeartPulse, title: "Familles", text: "Santé, prévoyance et protection de vos proches." },
      { icon: Plane, title: "Voyageurs", text: "Assistance et frais médicaux à l'étranger." },
      { icon: PiggyBank, title: "Épargnants", text: "Préparer un projet, la retraite ou les études." },
    ],
    stepsTitle: <>Votre assurance en <span className="text-primary">4 étapes.</span></>,
    steps: [
      { icon: MessageCircle, title: "Vous nous parlez de vous", text: "En ligne, par téléphone ou directement en agence." },
      { icon: SearchCheck, title: "On compare pour vous", text: "Votre conseiller sélectionne les garanties utiles, sans superflu." },
      { icon: FileText, title: "Vous signez en toute clarté", text: "Chaque garantie expliquée, les documents préparés avec vous." },
      { icon: ShieldCheck, title: "On reste à vos côtés", text: "Changement de situation ou sinistre : un seul interlocuteur." },
    ],
    why: [
      { icon: MapPin, title: "Une agence à Tanger", text: "Un vrai bureau où passer, pas un centre d'appels." },
      { icon: Handshake, title: "Un conseiller dédié", text: "La même personne suit vos contrats d'année en année." },
      { icon: ShieldCheck, title: `Solutions ${site.insurer}`, text: "La solidité d'un grand assureur, le conseil de proximité." },
      { icon: Clock, title: "Accompagnement sinistre", text: "On vous guide pas à pas jusqu'à l'indemnisation." },
    ],
    other: { audience: "Professionnels", path: "/professionnels", title: "Vous avez aussi une activité ?", text: "Commerce, cabinet, flotte ou PME : découvrez nos assurances professionnelles." },
  },
  Professionnels: {
    title: <>Votre activité mérite une protection <span className="text-primary">sur mesure.</span></>,
    description: "Commerçants, professions libérales, transporteurs, PME de la zone franche : nous étudions vos risques réels pour vous protéger sans surcoût inutile.",
    needs: <>Des solutions pensées pour votre <span className="text-primary">métier.</span></>,
    chip: { title: "Étude sur site", text: "À Tanger et en zone franche" },
    profilesTitle: <>Nous connaissons votre <span className="text-primary">secteur.</span></>,
    profiles: [
      { icon: Store, title: "Commerçants", text: "Local, stock, vol, perte d'exploitation." },
      { icon: Briefcase, title: "Professions libérales", text: "RC professionnelle et protection du cabinet." },
      { icon: Truck, title: "Transporteurs", text: "Flotte, marchandises transportées, conducteurs." },
      { icon: Factory, title: "PME & zone franche", text: "Multirisque, accidents du travail, santé collective." },
    ],
    stepsTitle: <>Une démarche <span className="text-primary">structurée.</span></>,
    steps: [
      { icon: MessageCircle, title: "Premier échange", text: "Nous découvrons votre activité, vos contrats actuels et vos priorités." },
      { icon: SearchCheck, title: "Étude de vos risques", text: "Visite sur site à Tanger ou en zone franche si nécessaire." },
      { icon: FileText, title: "Proposition sur mesure", text: "Des garanties ajustées à vos risques réels, sans surcoût inutile." },
      { icon: ShieldCheck, title: "Suivi dans la durée", text: "Revue annuelle des contrats et gestion des sinistres à vos côtés." },
    ],
    why: [
      { icon: MapPin, title: "Ancrage local", text: "Nous connaissons le tissu économique de Tanger et de la zone franche." },
      { icon: Handshake, title: "Un interlocuteur unique", text: "Tous vos contrats pro suivis par le même conseiller." },
      { icon: ShieldCheck, title: `Solutions ${site.insurer}`, text: "Des garanties solides, adaptées à la taille de votre structure." },
      { icon: Users, title: "Vous et vos équipes", text: "Santé collective et prévoyance pour fidéliser vos salariés." },
    ],
    other: { audience: "Particuliers", path: "/particuliers", title: "Et pour vous, à titre personnel ?", text: "Auto, habitation, santé, épargne : découvrez nos assurances particuliers." },
  },
};

function IconBadge({ icon: Icon, dark = false }: { icon: LucideIcon; dark?: boolean }) {
  return (
    <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", dark ? "bg-white/10 text-brand-sky" : "bg-brand-ice text-primary")}>
      <Icon className="size-6" aria-hidden="true" />
    </span>
  );
}

export function HubPage({ audience, image, path }: { audience: Audience; image: SiteImage; path: string }) {
  const list = audience === "Particuliers" ? individualOffers : businessOffers;
  const c = copy[audience];
  const reviews = testimonialsFor(audience).slice(0, 3);
  const audiencePacks = packs[audience] ?? [];
  const faqs = hubFaqs[audience] ?? [];

  return (
    <>
      <PageHero
        breadcrumbs={[{ name: audience, path }]}
        eyebrow={`Assurances ${audience.toLowerCase()}`}
        title={c.title}
        description={c.description}
        image={image}
        chip={{ icon: Users, ...c.chip }}
        actions={
          <>
            <AppLink to="/devis" className={pill()}>Demander un devis <ArrowSlide icon={ArrowRight} /></AppLink>
            <a href="#besoins" className={pill({ variant: "ghost" })}>Voir les solutions</a>
          </>
        }
      />

      {/* Profils — l'utilisateur se reconnaît avant de voir les offres */}
      <section aria-labelledby="profils-title" className="bg-brand-ice py-16 sm:py-20">
        <Container>
          <Reveal>
            <Eyebrow>Vous êtes…</Eyebrow>
            <h2 id="profils-title" className="h2-display max-w-2xl text-brand-navy">{c.profilesTitle}</h2>
          </Reveal>
          <Stagger className={cn("mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2", c.profiles.length > 4 ? "lg:grid-cols-5" : "lg:grid-cols-4")}>
            {c.profiles.map((p) => (
              <StaggerItem key={p.title}>
                <a href="#besoins" className="card-surface group flex h-full flex-col gap-4 rounded-[20px] p-6 transition-transform duration-300 hover:-translate-y-1">
                  <IconBadge icon={p.icon} />
                  <div>
                    <h3 className="display-font text-lg font-semibold text-brand-navy">{p.title}</h3>
                    <p className="mt-1.5 text-sm text-ink">{p.text}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Voir les solutions <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Offres */}
      <section id="besoins" className="scroll-mt-28 bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Vos besoins" title={c.needs} description="Chaque solution est détaillée : garanties, options, documents à prévoir et questions fréquentes." />
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((offer) => <StaggerItem key={offer.slug}><ProductCard offer={offer} /></StaggerItem>)}
          </Stagger>
        </Container>
      </section>

      {/* Comment ça marche */}
      <section className="bg-brand-sand py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Comment ça marche" title={c.stepsTitle} description="Un accompagnement simple, du premier contact jusqu'au suivi de vos contrats." />
          <Stagger className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {c.steps.map((s, i) => (
              <StaggerItem key={s.title}>
                <article className="card-surface relative flex h-full flex-col rounded-[24px] p-7">
                  <div className="flex items-center justify-between">
                    <IconBadge icon={s.icon} />
                    <span className="display-font text-4xl font-semibold text-brand-navy/10" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="display-font mt-6 text-xl font-semibold text-brand-navy">
                    <span className="sr-only">Étape {i + 1} : </span>{s.title}
                  </h3>
                  <p className="mt-2 text-ink">{s.text}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-3">
            <AppLink to="/devis" className={pill()}>Commencer mon devis <ArrowSlide icon={ArrowRight} /></AppLink>
          </Reveal>
        </Container>
      </section>

      {/* Packs */}
      {audiencePacks.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <Container>
            <SectionHeading eyebrow="Packs" title={<>Nos formules <span className="text-primary">combinées.</span></>} description="Regroupez vos contrats chez un seul interlocuteur, avec une échéance simplifiée." />
            <Stagger className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {audiencePacks.map((pack) => {
                const Icon = getIcon(pack.icon);
                return (
                  <StaggerItem key={pack.title}>
                    <article className={cn("relative flex h-full flex-col overflow-hidden rounded-[24px] p-8", pack.featured ? "navy-glow text-white shadow-[var(--card-shadow-lg)] lg:-translate-y-3" : "card-surface")}>
                      {pack.featured && <span className="absolute right-6 top-6 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">Le plus demandé</span>}
                      <IconBadge icon={Icon} dark={Boolean(pack.featured)} />
                      <h3 className={cn("display-font mt-6 text-2xl font-semibold", pack.featured ? "text-white" : "text-brand-navy")}>{pack.title}</h3>
                      <p className={cn("mt-3", pack.featured ? "text-white/70" : "text-ink")}>{pack.text}</p>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {pack.lines.map((line) => (
                          <li key={line} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium", pack.featured ? "bg-white/10 text-white" : "bg-brand-sand text-brand-navy")}>
                            <Check className={cn("size-3.5", pack.featured ? "text-brand-sky" : "text-primary")} aria-hidden="true" />{line}
                          </li>
                        ))}
                      </ul>
                      <AppLink to={`/devis?produit=${pack.product}`} className={cn(pill({ variant: pack.featured ? "gradient" : "ghost", size: "sm" }), "mt-auto w-full")} style={{ marginTop: "2rem" }}>
                        Demander ce pack <ArrowSlide icon={ArrowRight} />
                      </AppLink>
                    </article>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Container>
        </section>
      )}

      {/* Pourquoi nous + témoignages */}
      <section className="bg-brand-sand py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={`Pourquoi ${site.name}`} title={<>Le conseil d'un expert, la proximité d'un <span className="text-primary">voisin.</span></>} />
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.why.map((w) => (
              <StaggerItem key={w.title}>
                <div className="flex h-full gap-4 rounded-[20px] bg-white/60 p-6">
                  <IconBadge icon={w.icon} />
                  <div>
                    <h3 className="display-font text-lg font-semibold text-brand-navy">{w.title}</h3>
                    <p className="mt-1.5 text-sm text-ink">{w.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          {reviews.length > 0 && (
            <>
              <Reveal className="mt-20">
                <Eyebrow>Témoignages</Eyebrow>
                <h2 className="h2-display text-brand-navy">Ils nous ont fait <span className="text-primary">confiance.</span></h2>
              </Reveal>
              <Stagger className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {reviews.map((item) => <StaggerItem key={item.name}><TestimonialCard item={item} /></StaggerItem>)}
              </Stagger>
            </>
          )}
        </Container>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-brand-ice py-20 sm:py-28">
          <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <Reveal>
              <Eyebrow>Questions fréquentes</Eyebrow>
              <h2 className="h2-display text-brand-navy">Vos questions, nos <span className="text-primary">réponses.</span></h2>
              <p className="mt-4 max-w-md text-ink">Vous ne trouvez pas votre réponse ? Votre conseiller vous répond directement.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <AppLink to="/faq" className={pill({ variant: "ghost" })}>Toute la FAQ <ArrowSlide icon={ArrowRight} /></AppLink>
                <AppLink to="/devis" className={pill()}>Poser ma question</AppLink>
              </div>
            </Reveal>
            <Reveal delay={0.1}><FAQAccordion items={faqs} /></Reveal>
          </Container>
        </section>
      )}

      {/* Passerelle vers l'autre hub */}
      <section className="bg-white py-12">
        <Container>
          <Reveal>
            <AppLink
              to={c.other.path}
              className="card-surface group flex flex-col items-start justify-between gap-6 rounded-[24px] p-8 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-5">
                <IconBadge icon={c.other.audience === "Professionnels" ? Briefcase : Home} />
                <div>
                  <p className="display-font text-xl font-semibold text-brand-navy">{c.other.title}</p>
                  <p className="mt-1 text-ink">{c.other.text}</p>
                </div>
              </div>
              <span className={pill({ variant: "ghost", size: "sm" })}>
                Assurances {c.other.audience.toLowerCase()} <ArrowSlide icon={ArrowRight} />
              </span>
            </AppLink>
          </Reveal>
        </Container>
      </section>

      <CTABand />
    </>
  );
}