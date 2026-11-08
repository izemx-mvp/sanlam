import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { SiteShell, Breadcrumb, CTASection, Eyebrow, FAQList, IconWithCheck, OfferGrid } from "@/components/site";
import { Button } from "@/components/ui/button";
import { findOffer, offers } from "@/data/offers";

export const Route = createFileRoute("/assurances/$slug")({
  loader: ({ params }) => {
    const offer = findOffer(params.slug);
    if (!offer) throw notFound();
    return offer;
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title ?? "Assurance";
    const intro = loaderData?.intro ?? "Découvrez les assurances proposées par votre agence Sanlam à Casablanca.";
    return { meta: [
      { title: `${title} à Casablanca | Sanlam` },
      { name: "description", content: `${intro} Échangez avec votre agent Sanlam à Casablanca pour étudier votre besoin.` },
      { property: "og:title", content: `${title} à Casablanca | Sanlam` },
      { property: "og:description", content: intro },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: OfferPage,
});

function OfferPage() {
  const offer = Route.useLoaderData();
  return <SiteShell>
    <section className="bg-brand-ice"><div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8"><Breadcrumb current={offer.title} /><Eyebrow>{offer.group} · Assurance</Eyebrow><h1 className="display-font max-w-4xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">{offer.title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{offer.intro}</p><div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg" className="rounded-full"><Link to="/devis" search={{ produit: offer.slug }}>Demander un devis <ArrowRight className="size-4" /></Link></Button><Button asChild variant="outline" size="lg" className="rounded-full"><a href="tel:+212522471830">Parler à un conseiller</a></Button></div></div></section>
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_0.8fr] lg:px-8"><div><Eyebrow>À qui s'adresse cette assurance ?</Eyebrow><h2 className="display-font text-3xl font-semibold">Une réponse adaptée à votre situation.</h2><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{offer.audience}</p><h3 className="display-font mt-10 text-xl font-semibold">Les points à étudier ensemble</h3><ul className="mt-5 grid gap-4">{offer.coverages.map((item) => <li key={item}><IconWithCheck>{item}</IconWithCheck></li>)}</ul><div className="mt-10 border-l-2 border-primary pl-5"><h3 className="font-semibold">Pour préparer votre échange</h3><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{offer.prepare.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{item}</li>)}</ul></div></div><aside className="bg-brand-ice p-7 sm:p-9"><Eyebrow>Un agent à vos côtés</Eyebrow><h2 className="display-font text-2xl font-semibold">Comprendre avant de choisir.</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Les garanties, limites et exclusions varient selon le contrat. Votre conseiller vous présente les conditions correspondant à votre demande.</p><Button asChild className="mt-7 rounded-full"><Link to="/devis" search={{ produit: offer.slug }}>Préparer ma demande <ArrowRight className="size-4" /></Link></Button></aside></section>
    <section className="bg-brand-ice/60"><div className="mx-auto max-w-7xl px-6 py-16 lg:px-8"><div className="mx-auto max-w-3xl"><Eyebrow>Questions fréquentes</Eyebrow><h2 className="display-font mb-6 text-3xl font-semibold">À propos de {offer.title.toLowerCase()}</h2><FAQList items={offer.faqs} /></div></div></section>
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8"><h2 className="display-font mb-6 text-2xl font-semibold">Autres assurances</h2><OfferGrid group={offer.group === "Particuliers" ? "individual" : "business"} compact /></section>
    <CTASection title="Votre situation est unique." description="Un conseiller vous aide à examiner les garanties utiles et à préparer une proposition." />
  </SiteShell>;
}

export function getOfferRoutePaths() {
  return offers.map((offer) => `/assurances/${offer.slug}`);
}