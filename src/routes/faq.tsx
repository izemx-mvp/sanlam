import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutGroup, motion } from "framer-motion";
import { ArrowRight, FileText, LifeBuoy, MapPin, MessageCircle, MessagesSquare, Phone, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { faqJsonLd, pageHead } from "@/lib/seo";
import { site, telLink, whatsappLink } from "@/config/site";
import { images } from "@/data/images";
import { faqCategories, faqItems, type FaqCategory } from "@/data/faq";
import { normalize } from "@/data/chatbot";
import { AppLink, CTABand, FAQAccordion, PageHero } from "@/components/brand/blocks";
import { Arcs, Container, ImageWithFallback, Reveal, pill } from "@/components/brand/primitives";
import { openChat } from "@/components/chat/store";
import { advisorContact } from "@/data/agency";

export const Route = createFileRoute("/faq")({
  head: () => pageHead({
    title: `FAQ assurance : vos questions | ${site.name} Tanger`,
    description: `Devis, contrats, sinistres, paiement, agence : les réponses aux ${faqItems.length} questions les plus fréquentes de nos clients.`,
    path: "/faq",
    image: images.devis.advisor,
    breadcrumbs: [{ name: "FAQ", path: "/faq" }],
    jsonLd: [faqJsonLd(faqItems)],
  }),
  component: FaqPage,
});

const ALL = "Toutes" as const;
type Filter = FaqCategory | typeof ALL;
const SUGGESTIONS = ["délai", "constat", "paiement", "attestation", "résiliation"];

function FaqPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Filter>(ALL);

  const counts = useMemo(() => {
    const map: Record<string, number> = { [ALL]: faqItems.length };
    for (const item of faqItems) map[item.category] = (map[item.category] ?? 0) + 1;
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return faqItems.filter((item) => (category === ALL || item.category === category) && (!q || normalize(`${item.q} ${item.a}`).includes(q)));
  }, [query, category]);

  const groups = faqCategories.map((c) => ({ category: c, items: filtered.filter((i) => i.category === c) })).filter((g) => g.items.length);
  const reset = () => { setQuery(""); setCategory(ALL); };

  return (
    <>
      <PageHero
        variant="compact"
        breadcrumbs={[{ name: "FAQ", path: "/faq" }]}
        eyebrow="Questions fréquentes"
        title={<>Toutes les réponses, au même <span className="text-primary">endroit.</span></>}
        description="Devis, contrats, sinistres, paiement : retrouvez les questions que nos clients nous posent le plus souvent."
      >
        <div className="relative mt-8 max-w-xl">
          <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="faq-search" className="sr-only">Rechercher une question</label>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher : délai, constat, paiement…"
            className="h-14 w-full rounded-full border border-brand-navy/10 bg-white pl-14 pr-14 text-base text-brand-navy shadow-[var(--card-shadow)] outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Effacer la recherche" className="absolute right-4 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-brand-sand text-brand-navy hover:bg-brand-ice">
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Recherches fréquentes :</span>
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => setQuery(s)} className="rounded-full border border-brand-navy/10 bg-white px-3 py-1 font-medium text-brand-navy transition-colors hover:border-primary/40 hover:text-primary">
              {s}
            </button>
          ))}
        </div>
      </PageHero>

      {/* Sticky category filter */}
      <div className="z-30 border-y border-brand-navy/8 bg-white/90 backdrop-blur-xl lg:sticky lg:top-[76px]">
        <Container>
          <div role="group" aria-label="Filtrer par catégorie" className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 py-3">
            <LayoutGroup id="faq-filters">
              {([ALL, ...faqCategories] as Filter[]).map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(c)}
                    className="relative shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {active && <motion.span layoutId="faq-filter-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                    <span className={cn("relative inline-flex items-center gap-2", active ? "text-white" : "text-brand-navy hover:text-primary")}>
                      {c}
                      <span className={cn("rounded-full px-1.5 text-[0.7rem] leading-5", active ? "bg-white/20 text-white" : "bg-brand-sand text-brand-navy/70")}>{counts[c] ?? 0}</span>
                    </span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
        </Container>
      </div>

      <section className="bg-white py-14 sm:py-20">
        <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] lg:gap-14">
          <div>
            <p aria-live="polite" className="mb-8 text-sm text-muted-foreground">
              {query || category !== ALL
                ? `${filtered.length} question${filtered.length > 1 ? "s" : ""} trouvée${filtered.length > 1 ? "s" : ""}${query ? ` pour « ${query} »` : ""}`
                : `${faqItems.length} questions, classées par thème.`}
            </p>
            {groups.length === 0 ? (
              <div className="rounded-[24px] bg-brand-sand p-10 text-center">
                <p className="display-font text-xl font-semibold text-brand-navy">Aucune question ne correspond à « {query} ».</p>
                <p className="mt-2 text-ink">Essayez un autre mot, ou posez-la directement à notre assistant ou à un conseiller.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={reset} className={pill({ variant: "ghost" })}>Voir toutes les questions</button>
                  <button type="button" onClick={() => openChat()} className={pill()}><MessagesSquare />Poser ma question</button>
                </div>
              </div>
            ) : (
              <div className="space-y-14">
                {groups.map((g) => (
                  <Reveal key={g.category}>
                    <div className="mb-5 flex items-center gap-3">
                      <h2 className="display-font text-2xl font-semibold text-brand-navy">{g.category}</h2>
                      <span className="rounded-full bg-brand-ice px-2.5 py-0.5 text-sm font-semibold text-primary">{g.items.length}</span>
                      <span aria-hidden="true" className="h-px flex-1 bg-brand-navy/10" />
                    </div>
                    <FAQAccordion items={g.items} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-44">
            <div className="relative overflow-hidden rounded-[28px] navy-glow p-8 text-white">
              <Arcs light className="-right-24 -top-24 size-64" count={2} />
              <div className="relative flex items-center gap-4">
                <ImageWithFallback image={advisorContact.photo} objectPosition="50% 20%" className="size-16 shrink-0 rounded-2xl ring-2 ring-white/20" />
                <span className="leading-tight">
                  <span className="block font-semibold text-white">{advisorContact.name}</span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/70"><span className="size-2 rounded-full bg-emerald-400" />Répond du lundi au samedi</span>
                </span>
              </div>
              <h2 className="display-font relative mt-6 text-2xl font-semibold !text-white">Vous ne trouvez pas ?</h2>
              <p className="relative mt-3 text-white/70">{advisorContact.name} et l'équipe vous répondent directement sur WhatsApp.</p>
              <div className="relative mt-7 grid gap-3">
                <a href={whatsappLink("Bonjour, j'ai une question sur mon assurance.")} target="_blank" rel="noopener noreferrer" className={pill({ variant: "gradient", size: "sm" })}><MessageCircle />Écrire sur WhatsApp</a>
                <button type="button" onClick={() => openChat()} className={pill({ variant: "outline", size: "sm" })}><MessagesSquare />Demander à l'assistant</button>
                <a href={telLink} className="inline-flex items-center justify-center gap-2 py-1 text-sm font-semibold text-white/80 no-underline hover:text-white"><Phone className="size-4" aria-hidden="true" />{site.phone}</a>
              </div>
            </div>

            <nav aria-label="Accès rapides" className="rounded-[24px] border border-brand-navy/10 p-3">
              {[
                { to: "/devis", icon: FileText, title: "Demander un devis", text: "Gratuit, réponse sous 24 h" },
                { to: "/sinistres", icon: LifeBuoy, title: "Déclarer un sinistre", text: "Étapes et formulaire en ligne" },
                { to: "/agence", icon: MapPin, title: "Venir à l'agence", text: "Adresse, horaires, accès" },
              ].map(({ to, icon: Icon, title, text }) => (
                <AppLink key={to} to={to} className="group flex items-center gap-4 rounded-2xl p-3 text-brand-navy no-underline transition-colors hover:bg-brand-sand">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-ice text-primary transition-colors group-hover:bg-primary group-hover:text-white"><Icon className="size-5" aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <strong className="block font-semibold">{title}</strong>
                    <span className="text-sm text-muted-foreground">{text}</span>
                  </span>
                  <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </AppLink>
              ))}
            </nav>
          </aside>
        </Container>
      </section>
      <CTABand />
    </>
  );
}