import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, MapPin, ShieldCheck } from "lucide-react";
import { SiteShell, Eyebrow, OfferGrid, FAQList, CTASection, SectionHeading, Reveal } from "@/components/site";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { faqs } from "@/data/faq";
import { testimonials } from "@/data/testimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sanlam Casablanca | Votre agence d'assurance" },
      { name: "description", content: "Votre agent Sanlam à Casablanca vous accompagne pour choisir et comprendre vos assurances, côté particuliers comme professionnels." },
      { property: "og:title", content: "Sanlam Casablanca | Votre agence d'assurance" },
      { property: "og:description", content: "Un agent à vos côtés pour choisir et comprendre vos assurances." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "InsuranceAgency",
      name: `${site.name} — Casablanca`,
      address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: "Casablanca", addressCountry: "MA" },
      telephone: site.phone,
      email: site.email,
      openingHours: site.hours,
      sameAs: [],
    }) }],
  }),
  component: HomePage,
});

function HomePage() {
  return <SiteShell>
    <section className="relative overflow-hidden bg-brand-ice">
      <div className="pointer-events-none absolute -right-24 top-8 hidden h-[34rem] w-[34rem] rounded-full border border-brand-sky/40 lg:block" />
      <div className="pointer-events-none absolute -right-12 top-20 hidden h-[29rem] w-[29rem] rounded-full border border-primary/20 lg:block" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        <div className="relative z-10">
          <Eyebrow>Votre agence Sanlam à Casablanca</Eyebrow>
          <h1 className="display-font max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">À vos côtés, pour protéger ce qui compte.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Un agent proche de vous pour faire le point, comprendre vos garanties et trouver la protection adaptée à votre vie comme à votre activité.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full"><Link to="/devis">Demander un devis <ArrowRight className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/agence">Rencontrer l'agence <ArrowUpRight className="size-4" /></Link></Button>
          </div>
          <div className="mt-9 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4 text-primary" />Un interlocuteur local, au cœur de Casablanca</div>
        </div>
        <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
          <div className="relative aspect-[4/3] overflow-hidden border border-primary/15 bg-background p-5 shadow-sm sm:p-8">
            <div className="absolute inset-5 border border-brand-sky/30 sm:inset-8" />
            <svg viewBox="0 0 520 360" className="relative h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M260 34 420 98v102c0 91-62 139-160 166C162 339 100 291 100 200V98L260 34Z" fill="var(--brand-ice)" stroke="var(--primary)" strokeWidth="3" />
              <path d="m181 186 51 52 108-112" stroke="var(--primary)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M44 280h91M385 280h91M75 316h73M372 316h73" stroke="var(--brand-sky)" strokeWidth="2" />
              <circle cx="260" cy="180" r="122" stroke="var(--brand-sky)" strokeWidth="1.5" strokeDasharray="5 10" />
            </svg>
            <div className="absolute bottom-7 left-7 flex items-center gap-3 border border-border bg-background px-4 py-3 sm:bottom-10 sm:left-10"><span className="grid size-9 place-items-center bg-brand-ice text-primary"><ShieldCheck className="size-5" /></span><span><strong className="block text-sm font-semibold">Un conseil à votre mesure</strong><span className="text-xs text-muted-foreground">Avant, pendant et après</span></span></div>
          </div>
        </div>
      </div>
    </section>
    <div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="grid gap-4 border-b border-border py-6 sm:grid-cols-3"><p className="flex items-center gap-3 text-sm"><Check className="size-5 text-primary" /><span>Des explications claires</span></p><p className="flex items-center gap-3 text-sm"><Check className="size-5 text-primary" /><span>Un agent dédié à Casablanca</span></p><p className="flex items-center gap-3 text-sm"><Check className="size-5 text-primary" /><span>Des solutions pour tous vos projets</span></p></div></div>
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
      <SectionHeading eyebrow="Nos assurances" title="Une protection pour chaque étape." description="Particulier ou professionnel, découvrez les solutions et parlons de vos besoins." />
      <OfferGrid compact />
      <div className="mt-8"><Button asChild variant="outline" className="rounded-full"><Link to="/assurances/auto">Découvrir toutes les assurances <ArrowRight className="size-4" /></Link></Button></div>
    </section>
    <section className="bg-brand-ice/70"><div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8"><SectionHeading eyebrow="Votre agent" title="Un échange humain, des réponses concrètes." description="Votre agent prend le temps de comprendre ce qui compte pour vous et vous aide à comparer les garanties avec clarté." /><div className="grid gap-5 md:grid-cols-3">{testimonials.slice(0, 3).map((item) => <Reveal key={item.name}><figure className="h-full border border-border bg-background p-6"><div className="mb-4 flex gap-1 text-primary" aria-label="Avis client"><span>★★★★★</span></div><blockquote className="text-sm leading-7 text-foreground">« {item.quote} »</blockquote><figcaption className="mt-6 border-t border-border pt-4"><span className="block text-sm font-semibold">{item.name}</span><span className="mt-1 block text-xs text-muted-foreground">{item.product} · {item.city}</span></figcaption></figure></Reveal>)}</div></div></section>
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8"><div><Eyebrow>Questions fréquentes</Eyebrow><h2 className="display-font text-3xl font-semibold leading-tight text-foreground">Les réponses avant de vous lancer.</h2><p className="mt-4 text-base leading-7 text-muted-foreground">Votre conseiller reste disponible si vous souhaitez en parler de vive voix.</p><Button asChild variant="outline" className="mt-6 rounded-full"><Link to="/agence">Contacter l'agence <ArrowRight className="size-4" /></Link></Button></div><FAQList items={faqs.slice(0, 5)} /></section>
    <CTASection title="Parlons de votre projet." description="Un conseiller de l'agence de Casablanca vous accompagne pour préparer votre demande." />
  </SiteShell>;
}