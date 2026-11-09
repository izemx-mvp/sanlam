import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutGroup, motion } from "framer-motion";
import { ArrowRight, Calendar, Clock3, MessageCircle, MessagesSquare, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";
import { site, whatsappLink } from "@/config/site";
import { normalize } from "@/data/chatbot";
import { formatPostDate, postCategories, posts } from "@/data/posts";
import { AppLink, ArticleCard, CTABand, PageHero } from "@/components/brand/blocks";
import { Arcs, Container, ImageWithFallback, Reveal, Stagger, StaggerItem, pill } from "@/components/brand/primitives";
import { openChat } from "@/components/chat/store";

export const Route = createFileRoute("/conseils/")({
  head: () => pageHead({
    title: `Conseils assurance : guides pratiques | ${site.name}`,
    description: "Formule auto, habitation, complémentaire santé, visa Schengen, assurances des TPE : nos guides pour mieux comprendre et choisir vos assurances au Maroc.",
    path: "/conseils",
    image: posts[0]!.cover,
    breadcrumbs: [{ name: "Conseils", path: "/conseils" }],
  }),
  component: BlogIndex,
});

type Post = (typeof posts)[number];
const ALL = "Tous";

function BlogIndex() {
  const [category, setCategory] = useState<string>(ALL);
  const [query, setQuery] = useState("");
  const [featured, second, third, ...rest] = posts;

  const counts = useMemo(() => {
    const map: Record<string, number> = { [ALL]: posts.length };
    for (const p of posts) map[p.category] = (map[p.category] ?? 0) + 1;
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return posts.filter((p) => (category === ALL || p.category === category) && (!q || normalize(`${p.title} ${p.excerpt} ${p.category}`).includes(q)));
  }, [category, query]);

  const browsing = category === ALL && !query;
  const grid = browsing ? rest : filtered;
  const side = [second, third].filter((p): p is Post => Boolean(p));

  return (
    <>
      <PageHero
        variant="compact"
        breadcrumbs={[{ name: "Conseils", path: "/conseils" }]}
        eyebrow="Conseils"
        title={<>Comprendre pour mieux se <span className="text-primary">protéger.</span></>}
        description="Des guides concrets, écrits par l'équipe de l'agence, pour faire les bons choix sans jargon."
      />

      {/* Featured + two highlights */}
      {browsing && featured && (
        <section className="bg-white pt-14 sm:pt-20">
          <Container className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Reveal className="h-full">
              <FeaturedCard post={featured} />
            </Reveal>
            <div className="flex flex-col gap-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">À lire aussi</p>
              <Stagger className="flex flex-1 flex-col gap-4">
                {side.map((post) => <StaggerItem key={post.slug} className="flex-1"><MiniCard post={post} /></StaggerItem>)}
              </Stagger>
            </div>
          </Container>
        </section>
      )}

      {/* Filters */}
      <div className="z-30 mt-14 border-y border-brand-navy/8 bg-white/90 backdrop-blur-xl sm:mt-20 lg:sticky lg:top-[76px]">
        <Container className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filtrer par catégorie" className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4">
            <LayoutGroup id="blog-filters">
              {[ALL, ...postCategories].map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(c)}
                    className="relative shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {active && <motion.span layoutId="blog-filter-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                    <span className={cn("relative inline-flex items-center gap-2", active ? "text-white" : "text-brand-navy hover:text-primary")}>
                      {c}
                      <span className={cn("rounded-full px-1.5 text-[0.7rem] leading-5", active ? "bg-white/20 text-white" : "bg-brand-sand text-brand-navy/70")}>{counts[c] ?? 0}</span>
                    </span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
          <div className="relative lg:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="blog-search" className="sr-only">Rechercher un article</label>
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher : visa, constat, AMO…"
              className="h-12 w-full rounded-full border border-brand-navy/10 bg-white pl-11 pr-11 text-[0.95rem] text-brand-navy outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Effacer la recherche" className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-brand-sand text-brand-navy hover:bg-brand-ice">
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </Container>
      </div>

      {/* Grid */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <p aria-live="polite" className="mb-8 text-sm text-muted-foreground">
            {browsing
              ? "Tous nos guides, du plus récent au plus ancien."
              : `${filtered.length} article${filtered.length > 1 ? "s" : ""}${category !== ALL ? ` dans « ${category} »` : ""}${query ? ` pour « ${query} »` : ""}`}
          </p>
          {grid.length === 0 ? (
            <div className="rounded-[24px] bg-brand-sand p-10 text-center">
              <p className="display-font text-xl font-semibold text-brand-navy">Aucun article ne correspond à votre recherche.</p>
              <p className="mt-2 text-ink">Essayez un autre mot, ou posez directement votre question à l'agence.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => { setQuery(""); setCategory(ALL); }} className={pill({ variant: "ghost" })}>Voir tous les articles</button>
                <button type="button" onClick={() => openChat({})} className={pill()}><MessagesSquare />Poser ma question</button>
              </div>
            </div>
          ) : (
            <Stagger key={`${category}-${query}`} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {grid.map((post) => <StaggerItem key={post.slug} className="h-full"><ArticleCard post={post} /></StaggerItem>)}
              <StaggerItem className="h-full"><AskCard /></StaggerItem>
            </Stagger>
          )}
        </Container>
      </section>
      <CTABand />
    </>
  );
}

/* ---------------------------------------------------------------- cards */

function FeaturedCard({ post }: { post: Post }) {
  return (
    <AppLink to={`/conseils/${post.slug}`} className="group zoom-media relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-[28px] text-white no-underline shadow-[0_30px_60px_-36px_rgba(11,42,69,0.7)] sm:min-h-[30rem]">
      <ImageWithFallback image={post.cover} priority className="!absolute inset-0 h-full w-full" sizes="(min-width: 1024px) 60vw, 100vw" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/45 to-transparent" />
      <div className="relative p-7 sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
          <span className="size-1.5 rounded-full bg-brand-sky" aria-hidden="true" />À la une · {post.category}
        </span>
        <h2 className="h2-display mt-5 max-w-2xl !text-white">{post.title}</h2>
        <p className="mt-4 max-w-xl text-white/80">{post.excerpt}</p>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <p className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5"><Calendar className="size-4" aria-hidden="true" />{formatPostDate(post.date)}</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" aria-hidden="true" />{post.readingTime} min de lecture</span>
          </p>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors group-hover:bg-brand-ice">
            Lire l'article <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </AppLink>
  );
}

function MiniCard({ post }: { post: Post }) {
  return (
    <AppLink to={`/conseils/${post.slug}`} className="group card-surface card-hover zoom-media flex h-full gap-4 overflow-hidden p-3 text-brand-navy no-underline sm:gap-5">
      <div className="relative w-32 shrink-0 overflow-hidden rounded-[18px] sm:w-40">
        <ImageWithFallback image={post.cover} className="!absolute inset-0 h-full w-full" sizes="160px" />
      </div>
      <div className="flex min-w-0 flex-col justify-center py-2 pr-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{post.category}</span>
        <h3 className="display-font mt-2 line-clamp-3 text-lg font-semibold leading-snug transition-colors group-hover:text-primary">{post.title}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"><Clock3 className="size-3.5" aria-hidden="true" />{post.readingTime} min</p>
      </div>
    </AppLink>
  );
}

function AskCard() {
  return (
    <div className="relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-[24px] navy-glow p-7 text-white">
      <Arcs light className="-right-24 -top-24 size-72" count={2} />
      <div className="relative">
        <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-brand-sky"><MessagesSquare className="size-6" aria-hidden="true" /></span>
        <h3 className="display-font mt-6 text-2xl font-semibold !text-white">Votre question n'est pas dans nos guides ?</h3>
        <p className="mt-3 text-white/75">Un conseiller de l'agence vous répond directement, du lundi au samedi.</p>
      </div>
      <div className="relative mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={() => openChat({})} className={pill({ variant: "gradient", size: "sm" })}><MessagesSquare />Assistant</button>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10">
          <MessageCircle className="size-4" aria-hidden="true" />WhatsApp
        </a>
      </div>
    </div>
  );
}