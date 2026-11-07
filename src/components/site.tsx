import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown,
  Clock3, HeartHandshake, Menu, MessageCircle, Phone, ShieldCheck, Sparkles, X,
} from "lucide-react";
import logo from "@/assets/sanlam-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { businessOffers, individualOffers, offers } from "@/data/offers";
import { faqs } from "@/data/faq";
import { site, whatsappLink } from "@/config/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="mx-auto grid min-h-[76px] max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:flex sm:justify-between sm:px-8">
        <Link to="/" aria-label="Sanlam Casablanca — accueil" className="flex min-w-0 items-center gap-3 no-underline">
          <img className="h-12 w-12 shrink-0 object-contain" src={logo.url} alt="" />
          <span className="min-w-0"><span className="display-font block truncate text-lg font-semibold text-foreground">{site.name}</span><span className="block truncate text-xs text-muted-foreground">{site.descriptor}</span></span>
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-7 text-sm font-medium text-foreground sm:flex">
          <Link to="/" className="hover:text-primary">Accueil</Link>
          <div className="group relative py-7">
            <button className="inline-flex items-center gap-1 bg-transparent text-sm font-medium text-foreground" aria-haspopup="true">Assurances <ChevronDown className="size-4 transition-transform group-hover:rotate-180" /></button>
            <div className="invisible absolute left-1/2 top-[4.5rem] z-50 grid w-[38rem] -translate-x-1/2 grid-cols-2 gap-6 border border-border bg-background p-6 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {[individualOffers, businessOffers].map((group, i) => <div key={i}><p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{i === 0 ? "Particuliers" : "Professionnels"}</p><ul className="space-y-2">{group.map((offer) => <li key={offer.slug}><Link to="/assurances/$slug" params={{ slug: offer.slug }} className="block text-sm text-foreground no-underline hover:text-primary">{offer.title}</Link></li>)}</ul></div>)}
              <Link to="/assurances/auto" className="col-span-2 inline-flex items-center gap-2 border-t border-border pt-4 text-sm font-semibold text-primary no-underline">Toutes nos assurances <ArrowRight className="size-4" /></Link>
            </div>
          </div>
          <Link to="/sinistres" className="hover:text-primary">Sinistres</Link>
          <Link to="/agence" className="hover:text-primary">L'agence</Link>
        </nav>
        <div className="hidden items-center gap-5 sm:flex">
          <a href={`tel:${site.phoneHref}`} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground no-underline"><Phone className="size-4 text-primary" />{site.phone}</a>
          <Button asChild className="rounded-full px-5"><Link to="/devis">Devis gratuit <ArrowUpRight className="size-4" /></Link></Button>
        </div>
        <Button variant="outline" size="icon" className="sm:hidden" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
      </div>
      <AnimatePresence>
        {open && <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute inset-x-0 top-full min-h-[calc(100dvh-76px)] border-t border-border bg-background px-6 py-8 sm:hidden" aria-label="Navigation mobile">
          <div className="mx-auto flex max-w-lg flex-col gap-1">{[["Accueil", "/"], ["Particuliers", "/assurances/auto"], ["Professionnels", "/assurances/multirisque-pro"], ["Sinistres", "/sinistres"], ["L'agence", "/agence"]].map(([label, to]) => <Link key={to} to={to as "/"} onClick={() => setOpen(false)} className="border-b border-border py-4 text-lg font-medium text-foreground no-underline">{label}<ArrowUpRight className="float-right size-5 text-primary" /></Link>)}<Button asChild className="mt-7 rounded-full"><Link to="/devis" onClick={() => setOpen(false)}>Obtenir mon devis</Link></Button><a href={`tel:${site.phoneHref}`} className="mt-4 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-foreground"><Phone className="size-4 text-primary" />{site.phone}</a></div>
        </motion.nav>}
      </AnimatePresence>
    </header>
  );
}

export function SiteFooter() {
  return <footer className="bg-brand-navy text-primary-foreground">
    <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
      <div><Link to="/" className="mb-5 inline-flex items-center gap-3 text-primary-foreground no-underline"><img src={logo.url} alt="" className="h-12 w-12 rounded-full bg-background object-contain p-1"/><span className="display-font text-xl font-semibold">Sanlam</span></Link><p className="max-w-xs text-sm leading-6 text-primary-foreground/75">Un agent à vos côtés pour choisir et comprendre vos assurances.</p><p className="mt-8 text-xs text-primary-foreground/55">{site.partner}</p></div>
      <div><h2 className="display-font mb-4 text-sm font-semibold">Nous contacter</h2><address className="space-y-3 text-sm not-italic leading-6 text-primary-foreground/75"><p>{site.address}</p><a className="block text-primary-foreground no-underline hover:underline" href={`tel:${site.phoneHref}`}>{site.phone}</a><a className="block text-primary-foreground no-underline hover:underline" href={`mailto:${site.email}`}>{site.email}</a><a className="block text-primary-foreground no-underline hover:underline" href={whatsappLink()}>WhatsApp</a></address></div>
      <div><h2 className="display-font mb-4 text-sm font-semibold">Nos horaires</h2><p className="text-sm leading-6 text-primary-foreground/75">{site.hours}</p><p className="mt-3 text-xs text-primary-foreground/55">Heure locale de Casablanca</p></div>
      <div><h2 className="display-font mb-4 text-sm font-semibold">Explorer</h2><ul className="space-y-3 text-sm text-primary-foreground/75"><li><Link to="/assurances/auto" className="text-primary-foreground/75 no-underline hover:text-primary-foreground">Nos assurances</Link></li><li><Link to="/sinistres" className="text-primary-foreground/75 no-underline hover:text-primary-foreground">Déclarer un sinistre</Link></li><li><Link to="/agence" className="text-primary-foreground/75 no-underline hover:text-primary-foreground">L'agence</Link></li><li><Link to="/mentions-legales" className="text-primary-foreground/75 no-underline hover:text-primary-foreground">Mentions légales</Link></li></ul></div>
    </div><div className="border-t border-primary-foreground/15 px-6 py-5 text-center text-xs text-primary-foreground/55">© {new Date().getFullYear()} Sanlam Casablanca. Tous droits réservés.</div>
  </footer>;
}

export function ContactActions() {
  return <><a href={whatsappLink()} aria-label="Écrire à l'agence sur WhatsApp" className="fixed bottom-24 right-5 z-40 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6"><MessageCircle className="size-6" /></a><div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-border bg-background p-2 sm:hidden"><Button variant="outline" asChild className="rounded-full"><a href={`tel:${site.phoneHref}`}><Phone className="size-4"/>Appeler</a></Button><Button asChild className="rounded-full"><Link to="/devis">Devis gratuit</Link></Button></div></>;
}

export function SiteShell({ children }: { children: ReactNode }) {
  return <><SiteHeader /><main>{children}</main><SiteFooter /><ContactActions /></>;
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduced ? 0 : 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] ${light ? "text-brand-sky" : "text-primary"}`}><span className="size-1.5 rounded-full bg-current" />{children}</div>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="relative overflow-hidden border-b border-border bg-brand-ice"><div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8"><Eyebrow>{eyebrow}</Eyebrow><h1 className="display-font max-w-4xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">{title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p></div></section>;
}

export function SectionHeading({ eyebrow, title, description, center = false }: { eyebrow: string; title: string; description?: string; center?: boolean }) {
  return <div className={`mb-10 max-w-2xl ${center ? "mx-auto text-center" : ""}`}><Eyebrow>{eyebrow}</Eyebrow><h2 className="display-font text-3xl font-semibold leading-tight text-foreground sm:text-4xl">{title}</h2>{description && <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>}</div>;
}

export function OfferGrid({ group = "all", compact = false }: { group?: "all" | "individual" | "business"; compact?: boolean }) {
  const list = group === "individual" ? individualOffers : group === "business" ? businessOffers : offers;
  return <div className={`grid gap-4 sm:grid-cols-2 ${compact ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>{list.map((offer, i) => {
    const Icon = iconByName[offer.icon] ?? ShieldCheck;
    return <Reveal key={offer.slug} delay={i % 4 * 0.05}><Link to="/assurances/$slug" params={{ slug: offer.slug }} className="group flex h-full min-h-52 flex-col border border-border bg-background p-5 text-foreground no-underline transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <span className="mb-7 grid size-11 place-items-center rounded-xl bg-brand-ice text-primary"><Icon className="size-5" /></span><span className="display-font text-lg font-semibold">{offer.title}</span><span className="mt-2 text-sm leading-6 text-muted-foreground">{offer.short}</span><span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-primary">Découvrir <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
    </Link></Reveal>;
  })}</div>;
}

export function FAQList({ items = faqs }: { items?: { q: string; a: string }[] }) {
  return <Accordion type="single" collapsible className="w-full">{items.map((faq, index) => <AccordionItem key={faq.q} value={`faq-${index}`} className="border-border"><AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">{faq.q}</AccordionTrigger><AccordionContent className="max-w-3xl text-sm leading-7 text-muted-foreground">{faq.a}</AccordionContent></AccordionItem>)}</Accordion>;
}

export function CTASection({ title = "Parlons de votre projet.", description = "Un conseiller prend le temps de comprendre votre besoin et de vous guider.", dark = true }: { title?: string; description?: string; dark?: boolean }) {
  return <section className={dark ? "relative overflow-hidden bg-brand-navy text-primary-foreground" : "bg-brand-sand text-foreground"}><div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 lg:grid-cols-[1fr_auto] lg:px-8"><div className="arc-frame"><Eyebrow light={dark}>À vos côtés, simplement</Eyebrow><h2 className="display-font max-w-2xl text-3xl font-semibold sm:text-4xl">{title}</h2><p className={`mt-4 max-w-xl text-base leading-7 ${dark ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{description}</p></div><div className="flex flex-wrap gap-3"><Button asChild size="lg" className="rounded-full"><Link to="/devis">Obtenir mon devis <ArrowRight className="size-4" /></Link></Button><Button asChild size="lg" variant={dark ? "outline" : "secondary"} className={`rounded-full ${dark ? "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" : ""}`}><a href={whatsappLink()}><MessageCircle className="size-4"/>WhatsApp</a></Button></div></div></section>;
}

export function TrustStrip() {
  return <div className="grid gap-4 border-y border-border bg-background px-6 py-5 sm:grid-cols-3 sm:gap-6"><div className="flex items-center gap-3 text-sm"><ShieldCheck className="size-5 shrink-0 text-primary"/><span><strong className="block font-semibold">Un agent à vos côtés</strong><span className="text-muted-foreground">Un interlocuteur qui vous connaît</span></span></div><div className="flex items-center gap-3 text-sm"><Clock3 className="size-5 shrink-0 text-primary"/><span><strong className="block font-semibold">Réponse sous 24 h</strong><span className="text-muted-foreground">Pour vos demandes de devis</span></span></div><div className="flex items-center gap-3 text-sm"><HeartHandshake className="size-5 shrink-0 text-primary"/><span><strong className="block font-semibold">Proche de vous</strong><span className="text-muted-foreground">Au cœur de Casablanca</span></span></div></div>;
}

export function QuoteLink({ product }: { product: string }) {
  return <Button asChild className="rounded-full"><Link to="/devis" search={{ produit: product }}>Demander un devis <ArrowRight className="size-4" /></Link></Button>;
}

export function SuccessPanel({ title, description, reference, whatsappMessage }: { title: string; description: string; reference: string; whatsappMessage: string }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl border border-border bg-background px-6 py-12 text-center sm:px-12"><span className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-brand-ice text-primary"><CheckCircle2 className="size-8" /></span><Eyebrow>Demande préparée</Eyebrow><h2 className="display-font text-3xl font-semibold">{title}</h2><p className="mx-auto mt-4 max-w-lg leading-7 text-muted-foreground">{description}</p><div className="mx-auto mt-7 max-w-xs border border-border bg-brand-ice px-5 py-4"><span className="block text-xs font-medium uppercase text-muted-foreground">Votre référence</span><span className="display-font mt-1 block text-xl font-semibold text-primary">{reference}</span></div><p className="mt-5 text-xs leading-5 text-muted-foreground">Cette confirmation est affichée dans votre navigateur. Votre demande n'a pas été envoyée ni enregistrée.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Button asChild className="rounded-full"><a href={whatsappLink(whatsappMessage)}><MessageCircle className="size-4"/>Continuer sur WhatsApp</a></Button><Button variant="outline" asChild className="rounded-full"><Link to="/">Retour à l'accueil</Link></Button></div></motion.div>;
}

export function StepsBar({ active, labels }: { active: number; labels: string[] }) {
  return <ol className="mb-10 grid grid-cols-4 gap-2" aria-label="Étapes du formulaire">{labels.map((label, i) => <li key={label} className="min-w-0"><div className={`mb-2 h-1.5 rounded-full ${i <= active ? "bg-primary" : "bg-border"}`} /><span className={`block truncate text-xs ${i === active ? "font-semibold text-primary" : "text-muted-foreground"}`}>{label}</span></li>)}</ol>;
}

export function FormField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="block min-w-0"><span className="mb-2 block text-sm font-medium text-foreground">{label}</span>{children}{error && <span className="mt-1 block text-xs text-destructive" role="alert">{error}</span>}</label>;
}

export const formInputClass = "h-12 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring";
export const formSelectClass = "h-12 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring";

export function Breadcrumb({ current }: { current: string }) {
  return <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground"><Link to="/" className="text-muted-foreground no-underline hover:text-primary">Accueil</Link><ArrowRight className="size-3" /><span>{current}</span></div>;
}

export function LogoMark() { return <img src={logo.url} className="size-8 object-contain" alt="Sanlam" />; }

export function IconWithCheck({ children }: { children: ReactNode }) { return <span className="flex items-start gap-3"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-ice text-primary"><Check className="size-3.5" /></span><span>{children}</span></span>; }

export function TinyArrow() { return <ArrowDownRight className="size-4" />; }

const iconByName: Record<string, typeof ShieldCheck> = {
  CarFront: Sparkles,
  House: ShieldCheck,
  HeartPulse: HeartHandshake,
  Plane: ArrowUpRight,
  ChartNoAxesCombined: ArrowRight,
  ShieldPlus: ShieldCheck,
  Store: ShieldCheck,
  Truck: ArrowRight,
  Scale: ShieldCheck,
  HardHat: ShieldCheck,
  UsersRound: HeartHandshake,
};