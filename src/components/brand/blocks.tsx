import { forwardRef, useMemo, type AnchorHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Calendar, ChevronDown, ChevronRight, Clock3, Home, MessageCircle, Quote } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { mapsEmbedUrl, site, whatsappLink } from "@/config/site";
import type { SiteImage } from "@/data/images";
import type { Offer } from "@/data/offers";
import { formatPostDate, type Post } from "@/data/posts";
import type { Testimonial } from "@/data/testimonials";
import {
  Arcs, ArrowSlide, Container, Eyebrow, IconTile, ImageWithFallback, PhotoReveal, ProofChip, Reveal, pill,
} from "@/components/brand/primitives";

/* ---------------------------------------------------------------- Links */

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to: string; children: ReactNode; activeClassName?: string; exact?: boolean };

/** Internal link that accepts a plain path string (incl. query and hash). */
export function AppLink({ to, children, activeClassName, exact = false, ...rest }: AppLinkProps) {
  const [pathAndSearch, hash] = to.split("#");
  const [path, query] = (pathAndSearch ?? "").split("?");
  const search = query ? Object.fromEntries(new URLSearchParams(query)) : undefined;
  return (
    <Link
      to={(path || "/") as "/"}
      {...(search ? { search: search as never } : {})}
      {...(hash ? { hash } : {})}
      {...(activeClassName ? { activeProps: { className: activeClassName }, activeOptions: { exact, includeSearch: false } } : {})}
      {...(rest as object)}
    >
      {children}
    </Link>
  );
}

/* ---------------------------------------------------------------- Breadcrumbs */

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-7">
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", light ? "text-white/70" : "text-muted-foreground")}>
        <li><AppLink to="/" className={cn("inline-flex items-center gap-1.5 no-underline transition-colors", light ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-primary")}><Home className="size-3.5" aria-hidden="true" />Accueil</AppLink></li>
        {items.map((item, i) => (
          <li key={item.path} className="inline-flex items-center gap-1.5">
            <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />
            {i === items.length - 1 ? (
              <span aria-current="page" className={light ? "text-white" : "font-medium text-brand-navy"}>{item.name}</span>
            ) : (
              <AppLink to={item.path} className={cn("no-underline transition-colors", light ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-primary")}>{item.name}</AppLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------------------------------------------------------------- Page hero */

type PageHeroProps = {
  variant?: "photo" | "compact";
  breadcrumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  image?: SiteImage;
  chip?: { icon: LucideIcon; title: string; text: string };
  children?: ReactNode;
};

export function PageHero({ variant = "photo", breadcrumbs, eyebrow, title, description, actions, image, chip, children }: PageHeroProps) {
  if (variant === "compact" || !image) {
    return (
      <section className="relative overflow-hidden bg-brand-sand">
        <Arcs className="-right-40 -top-40 hidden size-[34rem] md:block" />
        <Container className="relative py-14 sm:py-20">
          <Breadcrumbs items={breadcrumbs} />
          <div className="rise-in max-w-3xl">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="h1-display text-brand-navy">{title}</h1>
            <p className="lead mt-6 max-w-2xl">{description}</p>
            {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
            {children}
          </div>
        </Container>
      </section>
    );
  }
  return (
    <section className="relative overflow-hidden bg-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-0 h-[38rem] w-[46rem] rounded-full bg-brand-sand blur-3xl" />
      <Container className="relative grid grid-cols-1 items-center gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:pb-24">
        <div className="rise-in">
          <Breadcrumbs items={breadcrumbs} />
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="h1-display text-brand-navy">{title}</h1>
          <p className="lead mt-6 max-w-xl">{description}</p>
          {actions && <div className="mt-9 flex flex-wrap gap-3">{actions}</div>}
          {children}
        </div>
        <div className="relative">
          <Arcs className="-right-24 -top-20 hidden size-[30rem] lg:block" />
          <div className="hero-photo relative overflow-hidden radius-organic shadow-[0_30px_60px_-30px_rgba(11,42,69,0.45)]">
            <ImageWithFallback image={image} priority className="aspect-[16/10]" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          {chip && <ProofChip icon={chip.icon} title={chip.title} text={chip.text} className="rise-in rise-in-5 -bottom-6 left-4 sm:left-8" />}
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- CTA band */

export function CTABand({ title = "Parlons de votre protection.", description = "Un conseiller de l'agence étudie votre situation et vous envoie un devis gratuit sous 24 h.", image, eyebrow = "Devis gratuit, sans engagement" }: { title?: ReactNode; description?: string; image?: SiteImage; eyebrow?: string }) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[28px] bg-brand-gradient text-white">
          <Arcs light className="-left-24 -top-24 size-[26rem]" />
          <Arcs light className={cn("-bottom-48 size-[30rem]", image ? "right-[30%] hidden lg:block" : "-right-24")} />
          <div className={cn("relative grid items-center", image ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]" : "")}>
            <div className="px-6 py-14 sm:px-12 sm:py-16 lg:py-20">
              <Eyebrow light className="!text-white/85">{eyebrow}</Eyebrow>
              <h2 className="h2-display max-w-2xl text-white">{title}</h2>
              <p className="mt-5 max-w-xl text-lg text-white/85">{description}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <AppLink to="/devis" className={pill({ variant: "white" })}>Demander un devis <ArrowSlide icon={ArrowRight} /></AppLink>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={pill({ variant: "outline" })}><MessageCircle />WhatsApp</a>
              </div>
            </div>
            {image && (
              <div className="relative hidden h-full self-stretch lg:block">
                <ImageWithFallback image={image} className="absolute inset-y-0 right-0 h-full w-full [mask-image:linear-gradient(90deg,transparent,black_28%)]" sizes="40vw" />
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- FAQ */

export function FAQAccordion({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <AccordionPrimitive.Item key={item.q} value={`faq-${index}`} className="overflow-hidden rounded-[20px] border border-brand-navy/8 bg-white transition-shadow data-[state=open]:shadow-[var(--card-shadow)]">
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-semibold text-brand-navy sm:px-6">
              {item.q}
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-ice text-primary transition-all duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:bg-primary group-data-[state=open]:text-white">
                <ChevronDown className="size-4" aria-hidden="true" />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="px-5 pb-6 text-[1rem] leading-relaxed text-ink sm:px-6">{item.a}</p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}

/* ---------------------------------------------------------------- Cards */

export function ProductCard({ offer, className }: { offer: Offer; className?: string }) {
  const Icon = getIcon(offer.icon);
  return (
    <AppLink to={`/assurances/${offer.slug}`} className={cn("group card-surface card-hover zoom-media flex h-full flex-col overflow-hidden text-brand-navy no-underline", className)}>
      <div className="relative">
        <ImageWithFallback image={offer.heroImage} className="aspect-[16/10]" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-brand-navy/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-navy backdrop-blur">{offer.group}</span>
      </div>
      <div className="relative flex flex-1 flex-col p-6 pt-0">
        <IconTile icon={Icon} className="-mt-6 mb-5 bg-white shadow-[var(--card-shadow)]" />
        <h3 className="display-font text-xl font-semibold">{offer.title}</h3>
        <p className="mt-2 text-[0.98rem] leading-relaxed text-ink">{offer.short}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-primary">Découvrir <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
      </div>
    </AppLink>
  );
}

export function ArticleCard({ post, className }: { post: Post; className?: string }) {
  return (
    <AppLink to={`/conseils/${post.slug}`} className={cn("group card-surface card-hover zoom-media flex h-full flex-col overflow-hidden text-brand-navy no-underline", className)}>
      <ImageWithFallback image={post.cover} className="aspect-[16/10]" sizes="(min-width: 1024px) 33vw, 100vw" />
      <div className="flex flex-1 flex-col p-6">
        <span className="w-fit rounded-full bg-brand-ice px-3 py-1 text-xs font-semibold text-primary">{post.category}</span>
        <h3 className="display-font mt-4 text-lg font-semibold leading-snug transition-colors group-hover:text-primary">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-[0.97rem] leading-relaxed text-ink">{post.excerpt}</p>
        <p className="mt-auto flex items-center gap-4 pt-6 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Calendar className="size-3.5" aria-hidden="true" />{formatPostDate(post.date)}</span>
          <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" aria-hidden="true" />{post.readingTime} min de lecture</span>
        </p>
      </div>
    </AppLink>
  );
}

export function TestimonialCard({ item, className }: { item: Testimonial; className?: string }) {
  const initials = item.name.replace(/^Dr\s+/, "").split(" ").map((w) => w[0]).join("").slice(0, 2);
  return (
    <figure className={cn("card-surface flex h-full flex-col p-7 sm:p-8", className)}>
      <span className="grid size-11 place-items-center rounded-2xl bg-brand-gradient text-white"><Quote className="size-5" aria-hidden="true" /></span>
      <blockquote className="mt-6 flex-1 text-[1.05rem] leading-relaxed text-brand-navy">« {item.quote} »</blockquote>
      <figcaption className="mt-8 flex items-center gap-4 border-t border-brand-navy/8 pt-6">
        {item.avatar ? (
          <ImageWithFallback image={item.avatar} className="size-12 shrink-0 rounded-full" />
        ) : (
          <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-ice font-semibold text-primary">{initials}</span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-brand-navy">{item.name}</span>
          <span className="block text-sm text-muted-foreground">{item.city}</span>
        </span>
        <span className="hidden shrink-0 rounded-full bg-brand-ice px-3 py-1 text-xs font-semibold text-primary sm:inline">{item.product}</span>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- Forms */

type FieldBase = { label: string; error?: string | undefined; className?: string };

export const FloatInput = forwardRef<HTMLInputElement, FieldBase & InputHTMLAttributes<HTMLInputElement>>(function FloatInput({ label, error, className, id, ...props }, ref) {
  const fieldId = id ?? `f-${props.name ?? label}`;
  return (
    <div className={className}>
      <div className="field-shell">
        <input ref={ref} id={fieldId} placeholder=" " aria-invalid={error ? true : undefined} aria-describedby={error ? `${fieldId}-err` : undefined} className="field-input" {...props} />
        <label htmlFor={fieldId} className="field-label">{label}</label>
      </div>
      {error && <p id={`${fieldId}-err`} role="alert" className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
});

export const FloatSelect = forwardRef<HTMLSelectElement, FieldBase & SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }>(function FloatSelect({ label, error, className, id, options, ...props }, ref) {
  const fieldId = id ?? `f-${props.name ?? label}`;
  return (
    <div className={className}>
      <div className="field-shell">
        <select ref={ref} id={fieldId} aria-invalid={error ? true : undefined} aria-describedby={error ? `${fieldId}-err` : undefined} className="field-input" {...props}>
          <option value="">Choisir…</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <label htmlFor={fieldId} className="field-label">{label}</label>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      </div>
      {error && <p id={`${fieldId}-err`} role="alert" className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
});

export const FloatTextarea = forwardRef<HTMLTextAreaElement, FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>>(function FloatTextarea({ label, error, className, id, ...props }, ref) {
  const fieldId = id ?? `f-${props.name ?? label}`;
  return (
    <div className={className}>
      <div className="field-shell">
        <textarea ref={ref} id={fieldId} placeholder=" " rows={5} aria-invalid={error ? true : undefined} aria-describedby={error ? `${fieldId}-err` : undefined} className="field-input" {...props} />
        <label htmlFor={fieldId} className="field-label">{label}</label>
      </div>
      {error && <p id={`${fieldId}-err`} role="alert" className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
});

export const ConsentCheckbox = forwardRef<HTMLInputElement, { error?: string | undefined } & InputHTMLAttributes<HTMLInputElement>>(function ConsentCheckbox({ error, id, ...props }, ref) {
  const fieldId = id ?? "consent";
  return (
    <div>
      <label htmlFor={fieldId} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink">
        <input ref={ref} id={fieldId} type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--primary)]" aria-invalid={error ? true : undefined} {...props} />
        <span>J'accepte que mes informations soient utilisées par {site.name} pour traiter ma demande, conformément à la <AppLink to="/politique-de-confidentialite" className="font-medium text-primary">politique de confidentialité</AppLink>.</span>
      </label>
      {error && <p role="alert" className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
});

export function Stepper({ steps, active }: { steps: string[]; active: number }) {
  const reduced = useReducedMotion();
  const progress = steps.length > 1 ? Math.min(active, steps.length - 1) / (steps.length - 1) : 0;
  return (
    <ol className="relative mb-10 flex justify-between" aria-label="Étapes du formulaire">
      <span aria-hidden="true" className="absolute left-5 right-5 top-5 h-0.5 rounded bg-brand-navy/10" />
      <motion.span aria-hidden="true" className="absolute left-5 top-5 h-0.5 origin-left rounded bg-brand-gradient" style={{ right: "1.25rem" }} initial={false} animate={{ scaleX: progress }} transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }} />
      {steps.map((label, i) => {
        const state = i < active ? "done" : i === active ? "current" : "todo";
        return (
          <li key={label} className="relative z-10 flex flex-col items-center gap-2" aria-current={state === "current" ? "step" : undefined}>
            <span className={cn("grid size-10 place-items-center rounded-full border-2 text-sm font-semibold transition-colors duration-300",
              state === "done" && "border-primary bg-primary text-white",
              state === "current" && "border-primary bg-white text-primary shadow-[0_0_0_6px_color-mix(in_oklab,var(--primary)_14%,transparent)]",
              state === "todo" && "border-brand-navy/15 bg-white text-muted-foreground")}>{i + 1}</span>
            <span className={cn("max-w-[6.5rem] text-center text-xs sm:text-sm", state === "current" ? "font-semibold text-brand-navy" : "text-muted-foreground")}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------------------------------------------------------- Success */

export function SuccessScreen({ title, description, reference, summary = [], whatsappMessage, confetti = true }: {
  title: string; description: string; reference: string; summary?: { label: string; value: string }[]; whatsappMessage: string; confetti?: boolean;
}) {
  const dots = useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    left: `${(i * 37) % 100}%`, delay: `${(i % 9) * 0.07}s`, dx: `${((i * 53) % 120) - 60}px`, size: 5 + (i % 4) * 2, sky: i % 3 === 0,
  })), []);
  return (
    <div className="relative overflow-hidden text-center" role="status" aria-live="polite">
      {confetti && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-64">
          {dots.map((dot, i) => (
            <span key={i} className="confetti-dot absolute top-0 rounded-full opacity-0" style={{ left: dot.left, width: dot.size, height: dot.size, animationDelay: dot.delay, background: dot.sky ? "var(--brand-sky)" : "var(--primary)", ["--dx" as string]: dot.dx }} />
          ))}
        </div>
      )}
      <svg viewBox="0 0 64 64" className="mx-auto size-20" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="var(--brand-ice)" />
        <circle cx="32" cy="32" r="30" fill="none" stroke="var(--primary)" strokeWidth="2" opacity="0.25" />
        <path className="check-path" d="M20 33.5l8 8 16-17" fill="none" stroke="var(--primary)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h2 className="h2-display mt-6 text-brand-navy">{title}</h2>
      <p className="mx-auto mt-4 max-w-lg text-ink">{description}</p>
      <div className="mx-auto mt-7 inline-flex flex-col rounded-2xl border border-primary/20 bg-brand-ice px-6 py-4">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Votre référence</span>
        <span className="display-font mt-1 text-2xl font-semibold tracking-wide text-primary">{reference}</span>
      </div>
      {summary.length > 0 && (
        <dl className="mx-auto mt-8 grid max-w-lg gap-px overflow-hidden rounded-2xl border border-brand-navy/8 bg-brand-navy/8 text-left">
          {summary.map((row) => (
            <div key={row.label} className="flex flex-wrap justify-between gap-x-6 gap-y-1 bg-white px-5 py-3 text-sm">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-medium text-brand-navy">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">Ce récapitulatif est affiché sur votre appareil : envoyez-le sur WhatsApp pour que votre conseiller le reçoive immédiatement.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={whatsappLink(`${whatsappMessage}\nRéférence : ${reference}`)} target="_blank" rel="noopener noreferrer" className={pill()}><MessageCircle />Envoyer sur WhatsApp</a>
        <AppLink to="/" className={pill({ variant: "ghost" })}>Retour à l'accueil <ArrowSlide icon={ArrowUpRight} /></AppLink>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Map */

export function MapEmbed({ className, title = `Plan d'accès à ${site.name}, ${site.address}` }: { className?: string; title?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-[28px] border border-brand-navy/8 bg-brand-ice shadow-[var(--card-shadow)]", className)}>
      <iframe title={title} src={mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full min-h-[22rem] w-full border-0" />
    </div>
  );
}

export { PhotoReveal, ProofChip, Reveal };
