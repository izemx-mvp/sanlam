import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Car, Clock3, Mail, MapPin, MessageCircle, Phone, Quote, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { pageHead } from "@/lib/seo";
import { mapsUrl, site, telLink, whatsappLink } from "@/config/site";
import { images } from "@/data/images";
import { agencyHistory, agencyStats, team, values } from "@/data/agency";
import { CTABand, MapEmbed, PageHero } from "@/components/brand/blocks";
import {
  Arcs, ArrowSlide, Container, CountUp, Eyebrow, ImageWithFallback, PhotoReveal, Reveal, SectionHeading, Stagger, StaggerItem, pill,
} from "@/components/brand/primitives";

export const Route = createFileRoute("/agence")({
  head: () => pageHead({
    title: `L'agence ${site.name} à Tanger | Équipe, horaires, accès`,
    description: `Découvrez ${site.name}, agent général ${site.insurer} avenue Moulay Rachid à Tanger depuis ${site.foundedYear} : notre histoire, notre équipe, nos horaires et le plan d'accès.`,
    path: "/agence",
    image: images.agence.hero,
    breadcrumbs: [{ name: "L'agence", path: "/agence" }],
  }),
  component: AgencyPage,
});

const yearsOfExperience = new Date().getFullYear() - site.foundedYear;

/* Weekly opening hours (Lun–Sam 9h–20h, jeudi dès 8h, dimanche fermé). index = Date.getDay() */
const WEEK = [
  { day: "Dimanche", open: null, close: null },
  { day: "Lundi", open: 9, close: 20 },
  { day: "Mardi", open: 9, close: 20 },
  { day: "Mercredi", open: 9, close: 20 },
  { day: "Jeudi", open: 8, close: 20 },
  { day: "Vendredi", open: 9, close: 20 },
  { day: "Samedi", open: 9, close: 20 },
] as const;
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

function nowInTangier() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" }));
}

/** Computed on the client only (avoids SSR hydration mismatch). */
function useOpenStatus() {
  const [status, setStatus] = useState<{ open: boolean; label: string; today: number } | null>(null);
  useEffect(() => {
    const update = () => {
      const now = nowInTangier();
      const today = now.getDay();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const slot = WEEK[today]!;
      if (slot.open !== null && minutes >= slot.open * 60 && minutes < slot.close * 60) {
        setStatus({ open: true, label: `Ouvert maintenant · ferme à ${slot.close}h`, today });
        return;
      }
      if (slot.open !== null && minutes < slot.open * 60) {
        setStatus({ open: false, label: `Fermé · ouvre aujourd'hui à ${slot.open}h`, today });
        return;
      }
      for (let i = 1; i <= 7; i++) {
        const next = WEEK[(today + i) % 7]!;
        if (next.open !== null) {
          setStatus({ open: false, label: `Fermé · ouvre ${i === 1 ? "demain" : next.day.toLowerCase()} à ${next.open}h`, today });
          return;
        }
      }
    };
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

function OpenBadge({ className }: { className?: string }) {
  const status = useOpenStatus();
  if (!status) return null;
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold", status.open ? "bg-emerald-50 text-emerald-700" : "bg-brand-sand text-brand-navy/80", className)}>
      <span className="relative flex size-2">
        {status.open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" />}
        <span className={cn("relative inline-flex size-2 rounded-full", status.open ? "bg-emerald-500" : "bg-brand-navy/40")} />
      </span>
      {status.label}
    </span>
  );
}

function AgencyPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "L'agence", path: "/agence" }]}
        eyebrow={site.descriptor}
        title={<>Une agence de proximité, au cœur de <span className="text-primary">Tanger.</span></>}
        description={`Depuis ${site.foundedYear}, notre équipe accueille particuliers et entreprises avenue Moulay Rachid, six jours sur sept.`}
        image={images.agence.hero}
        chip={{ icon: MapPin, title: "Av. Moulay Rachid", text: "Avec ou sans rendez-vous" }}
        actions={
          <>
            <a href="#nous-trouver" className={pill()}>Nous rendre visite <ArrowSlide icon={ArrowRight} /></a>
            <a href={telLink} className={pill({ variant: "ghost" })}><Phone />{site.phone}</a>
          </>
        }
      >
        <OpenBadge className="mt-6" />
      </PageHero>

      <History />
      <Stats />
      <Values />
      <TeamSection />
      <Gallery />
      <FindUs />

      <CTABand title={<>Une question avant de <span className="text-brand-navy">venir ?</span></>} description="Appelez l'agence ou écrivez-nous sur WhatsApp : nous préparons votre rendez-vous." />
    </>
  );
}

/* ---------------------------------------------------------------- Histoire */

function History() {
  const facts = [
    { icon: ShieldCheck, label: `Agent général ${site.insurer}` },
    { icon: Clock3, label: `${yearsOfExperience} ans d'expérience` },
    { icon: MapPin, label: "Tanger, av. Moulay Rachid" },
  ];
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
        <Reveal>
          <Eyebrow>Notre histoire</Eyebrow>
          <h2 className="h2-display text-brand-navy">{yearsOfExperience} ans de conseil, une même <span className="text-primary">exigence.</span></h2>
          {agencyHistory.paragraphs.map((p) => <p key={p.slice(0, 24)} className="lead mt-6">{p}</p>)}
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {facts.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-full border border-brand-navy/10 bg-brand-sand px-4 py-2 text-sm font-semibold text-brand-navy">
                <Icon className="size-4 text-primary" aria-hidden="true" />{label}
              </li>
            ))}
          </ul>
          <figure className="relative mt-10 overflow-hidden rounded-[24px] bg-brand-ice p-7 pl-8">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-brand-gradient" />
            <Quote className="size-7 text-primary" aria-hidden="true" />
            <blockquote className="display-font mt-3 text-xl font-medium leading-snug text-brand-navy">« {agencyHistory.quote} »</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <ImageWithFallback image={images.agence.team1} objectPosition="50% 20%" className="size-12 rounded-full ring-[3px] ring-white" />
              <span className="text-sm"><strong className="block text-brand-navy">{site.director}</strong><span className="text-muted-foreground">{site.directorRole}</span></span>
            </figcaption>
          </figure>
        </Reveal>
        <div className="relative mx-auto w-full max-w-md lg:ml-auto">
          <Arcs className="-left-20 -top-16 hidden size-[24rem] sm:block" />
          <PhotoReveal className="overflow-hidden radius-organic shadow-[0_30px_60px_-30px_rgba(11,42,69,0.5)]">
            <ImageWithFallback image={images.agence.office} className="aspect-[4/5]" sizes="(min-width: 1024px) 450px, 90vw" />
          </PhotoReveal>
          <div className="absolute -bottom-6 -left-4 rounded-[20px] bg-white p-4 pr-6 shadow-[var(--card-shadow)] sm:-left-10">
            <p className="display-font text-3xl font-semibold leading-none text-primary">{site.foundedYear}</p>
            <p className="mt-1 text-sm text-ink">Ouverture de l'agence</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Chiffres */

function Stats() {
  return (
    <section className="navy-glow relative overflow-hidden py-20 text-white">
      <Arcs light className="-right-40 top-1/2 size-[38rem] -translate-y-1/2" />
      <Container className="relative">
        <Stagger className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {agencyStats.map((stat) => (
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

/* ---------------------------------------------------------------- Valeurs */

function Values() {
  return (
    <section className="bg-brand-sand py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Nos valeurs" title={<>Ce qui guide notre <span className="text-primary">travail.</span></>} description="Quatre engagements que nous tenons avec chaque client, du premier devis au règlement d'un sinistre." />
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const Icon = getIcon(v.icon);
            return (
              <StaggerItem key={v.title} className="h-full">
                <article className="group relative h-full overflow-hidden rounded-[24px] bg-white p-7 shadow-[var(--card-shadow)] transition-all duration-300 hover:-translate-y-1.5">
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-gradient transition-transform duration-500 group-hover:scale-x-100" />
                  <div className="flex items-start justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-brand-ice text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span aria-hidden="true" className="display-font text-3xl font-semibold leading-none text-brand-navy/10">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="display-font mt-6 text-xl font-semibold text-brand-navy">{v.title}</h3>
                  <p className="mt-2 text-ink">{v.text}</p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Équipe */

function TeamSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="L'équipe" title={<>Quatre conseillers, un seul <span className="text-primary">objectif.</span></>} description="Des visages que vous retrouvez à chaque rendez-vous, et qui connaissent votre dossier." />
        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <StaggerItem key={member.name} className="h-full">
              <article className="group zoom-media flex h-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[var(--card-shadow)] transition-transform duration-300 hover:-translate-y-1.5">
                <div className="relative overflow-hidden">
                  <ImageWithFallback image={member.photo} objectPosition="50% 20%" className="aspect-[4/5]" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none" />
                  <div className="absolute inset-x-0 bottom-0 flex gap-2 p-4 opacity-100 transition-all duration-300 sm:translate-y-3 sm:opacity-0 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                    <a href={`tel:${member.phone}`} aria-label={`Appeler ${member.name}`} className="grid size-10 place-items-center rounded-full bg-white text-brand-navy shadow-lg transition-colors hover:bg-primary hover:text-white"><Phone className="size-4" /></a>
                    <a href={`mailto:${member.email}`} aria-label={`Écrire à ${member.name}`} className="grid size-10 place-items-center rounded-full bg-white text-brand-navy shadow-lg transition-colors hover:bg-primary hover:text-white"><Mail className="size-4" /></a>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="display-font text-lg font-semibold text-brand-navy">{member.name}</h3>
                  <p className="text-sm font-semibold text-primary">{member.role}</p>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink">{member.line}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Galerie */

function Gallery() {
  return (
    <section className="bg-white pb-20 sm:pb-28">
      <Container>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,0.6fr)_minmax(0,0.6fr)] md:grid-rows-[repeat(2,minmax(0,15rem))] lg:grid-rows-[repeat(2,minmax(0,18rem))]">
          <PhotoReveal className="relative col-span-2 aspect-[4/5] overflow-hidden rounded-[28px] md:col-span-1 md:row-span-2 md:aspect-auto">
            <ImageWithFallback image={images.agence.gallery1} className="!absolute inset-0 h-full w-full" sizes="(min-width: 768px) 40vw, 100vw" />
          </PhotoReveal>
          <PhotoReveal className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[28px] md:aspect-auto">
            <ImageWithFallback image={images.agence.gallery2} className="!absolute inset-0 h-full w-full" sizes="(min-width: 768px) 60vw, 100vw" />
          </PhotoReveal>
          <PhotoReveal className="relative aspect-square overflow-hidden rounded-[28px] md:aspect-auto">
            <ImageWithFallback image={images.agence.gallery3} className="!absolute inset-0 h-full w-full" sizes="(min-width: 768px) 30vw, 50vw" />
          </PhotoReveal>
          <Reveal className="relative flex aspect-square flex-col justify-end overflow-hidden rounded-[28px] bg-brand-gradient p-6 text-white md:aspect-auto">
            <Arcs light className="-right-16 -top-16 size-48" count={2} />
            <p className="display-font relative text-4xl font-semibold !text-white">6j/7</p>
            <p className="relative mt-2 text-sm text-white/85">Lun–Sam de 9h à 20h, dès 8h le jeudi.</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Nous trouver */

function FindUs() {
  const status = useOpenStatus();
  return (
    <section id="nous-trouver" className="scroll-mt-28 bg-brand-ice py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Nous trouver" title={<>Passez nous voir à <span className="text-primary">l'agence.</span></>} action={<OpenBadge />} />
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <Reveal className="min-h-[26rem] overflow-hidden rounded-[28px] shadow-[var(--card-shadow)]"><MapEmbed className="h-full" /></Reveal>
          <Reveal delay={0.1} className="card-surface flex flex-col p-7">
            <ul className="space-y-5 text-[0.98rem]">
              <li className="flex gap-3"><MapPin className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" /><span><strong className="block text-brand-navy">Adresse</strong><span className="text-ink">{site.address}</span></span></li>
              <li className="flex gap-3"><Phone className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" /><span><strong className="block text-brand-navy">Téléphone</strong><a href={telLink} className="text-ink no-underline hover:text-primary">{site.phone}</a></span></li>
              <li className="flex gap-3"><Car className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" /><span><strong className="block text-brand-navy">Stationnement</strong><span className="text-ink">Places dans les rues voisines et parking public à proximité.</span></span></li>
            </ul>
            <div className="mt-6 rounded-2xl bg-brand-sand p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-navy"><Clock3 className="size-4 text-primary" aria-hidden="true" />Horaires</p>
              <dl className="space-y-1 text-sm">
                {DISPLAY_ORDER.map((index) => {
                  const slot = WEEK[index]!;
                  const isToday = status?.today === index;
                  return (
                    <div key={slot.day} className={cn("flex justify-between rounded-lg px-2 py-1", isToday && "bg-white font-semibold text-brand-navy")}>
                      <dt className={cn(!isToday && "text-ink")}>{slot.day}{isToday && " (aujourd'hui)"}</dt>
                      <dd className={cn(slot.open === null ? "text-muted-foreground" : !isToday && "text-ink")}>{slot.open === null ? "Fermé" : `${slot.open}h – ${slot.close}h`}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={pill({ size: "sm" })}>Itinéraire <ArrowSlide icon={ArrowRight} /></a>
              <a href={whatsappLink("Bonjour, je souhaite prendre rendez-vous à l'agence.")} target="_blank" rel="noopener noreferrer" className={pill({ variant: "ghost", size: "sm" })}><MessageCircle />Rendez-vous</a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}