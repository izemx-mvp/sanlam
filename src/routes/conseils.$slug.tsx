import { Fragment, useEffect, useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight, Calendar, Check, ChevronDown, Clock3, Lightbulb, Link2, MessageCircle, Share2, ThumbsDown, ThumbsUp, UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { articleJsonLd, pageHead } from "@/lib/seo";
import { site, whatsappLink } from "@/config/site";
import { normalize } from "@/data/chatbot";
import { findOffer } from "@/data/offers";
import { findPost, formatPostDate, posts, type PostBlock } from "@/data/posts";
import { AppLink, ArticleCard, Breadcrumbs, CTABand } from "@/components/brand/blocks";
import { Arcs, ArrowSlide, Container, ImageWithFallback, Reveal, SectionHeading, Stagger, StaggerItem, pill } from "@/components/brand/primitives";

export const Route = createFileRoute("/conseils/$slug")({
  loader: ({ params }) => {
    const post = findPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    const post = loaderData ?? posts[0]!;
    return pageHead({
      title: `${post.title} | Conseils ${site.name}`,
      description: post.excerpt,
      path: `/conseils/${post.slug}`,
      image: post.cover,
      type: "article",
      breadcrumbs: [{ name: "Conseils", path: "/conseils" }, { name: post.title, path: `/conseils/${post.slug}` }],
      jsonLd: [articleJsonLd(post)],
    });
  },
  component: ArticlePage,
});

type Heading = Extract<PostBlock, { type: "h2" }>;
type Offer = NonNullable<ReturnType<typeof findOffer>>;

const headingId = (text: string) => normalize(text).replace(/\s+/g, "-").slice(0, 60);

/* ---------------------------------------------------------------- hooks */

function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-brand-gradient" style={{ scaleX: reduced ? scrollYProgress : scaleX }} />;
}

function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}

/* ---------------------------------------------------------------- content blocks */

function Block({ block, first }: { block: PostBlock; first: boolean }) {
  switch (block.type) {
    case "h2":
      return <h2 id={headingId(block.text)} className="display-font mt-14 scroll-mt-32 text-2xl font-semibold text-brand-navy sm:text-[1.8rem]">{block.text}</h2>;
    case "p":
      return (
        <p className={cn("mt-5 text-[1.08rem] leading-[1.8] text-ink", first && "text-[1.2rem] leading-[1.75] text-brand-navy/85 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[3.6rem] first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-primary")}>
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul className="mt-6 space-y-3 rounded-[20px] border border-brand-navy/8 bg-white p-6">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[1.05rem] text-ink">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-ice text-primary"><Check className="size-3.5" aria-hidden="true" /></span>
              {item}
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <aside className="relative mt-8 overflow-hidden rounded-[24px] border border-primary/15 bg-brand-ice p-6 pl-7">
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-brand-gradient" />
          <div className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-white"><Lightbulb className="size-5" aria-hidden="true" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Le conseil de l'agence</p>
              <p className="mt-1 font-semibold text-brand-navy">{block.title}</p>
              <p className="mt-1.5 leading-relaxed text-ink">{block.text}</p>
            </div>
          </div>
        </aside>
      );
  }
}

/* ---------------------------------------------------------------- page */

function ArticlePage() {
  const post = Route.useLoaderData();
  const offer = findOffer(post.relatedOffer);
  const toc = post.content.filter((b): b is Heading => b.type === "h2");
  const ids = toc.map((h) => headingId(h.text));
  const active = useActiveHeading(ids);
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const firstParagraph = post.content.findIndex((b) => b.type === "p");
  // Inline offer card goes just before the middle heading of the article.
  const middleHeading = toc[Math.floor(toc.length / 2)];
  const insertAt = toc.length >= 2 && middleHeading ? post.content.indexOf(middleHeading) : -1;

  return (
    <>
      <ReadingProgress />
      <article>
        <header className="relative overflow-hidden bg-white pt-10 sm:pt-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-20 h-[30rem] w-[40rem] rounded-full bg-brand-sand blur-3xl" />
          <Container className="relative">
            <Breadcrumbs items={[{ name: "Conseils", path: "/conseils" }, { name: post.category, path: `/conseils/${post.slug}` }]} />
            <div className="rise-in mx-auto mt-4 max-w-4xl text-center">
              <span className="inline-flex rounded-full bg-brand-ice px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{post.category}</span>
              <h1 className="h1-display mt-6 text-balance !text-[clamp(2.2rem,4.2vw,3.6rem)] text-brand-navy">{post.title}</h1>
              <p className="lead mx-auto mt-6 max-w-3xl text-pretty">{post.excerpt}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-brand-gradient text-white"><UserRound className="size-4" aria-hidden="true" /></span>
                  <span className="font-medium text-brand-navy">{post.author}</span>
                </span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="size-4" aria-hidden="true" /><time dateTime={post.date}>{formatPostDate(post.date)}</time></span>
                <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" aria-hidden="true" />{post.readingTime} min de lecture</span>
              </div>
            </div>
            <div className="hero-photo mt-12 overflow-hidden rounded-[32px] shadow-[0_40px_80px_-50px_rgba(11,42,69,0.7)]">
              <ImageWithFallback image={post.cover} priority className="aspect-[16/10] sm:aspect-[21/9]" sizes="100vw" />
            </div>
          </Container>
        </header>

        <Container className="grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-16">
          <div className="min-w-0 max-w-[46rem]">
            {toc.length > 0 && <MobileToc toc={toc} />}
            {post.content.map((block, i) => (
              <Fragment key={i}>
                {i === insertAt && offer && <InlineOffer offer={offer} />}
                <Block block={block} first={i === firstParagraph} />
              </Fragment>
            ))}
            <ArticleFooter title={post.title} author={post.author} />
          </div>

          <aside className="hidden space-y-6 lg:sticky lg:top-32 lg:block lg:self-start">
            {toc.length > 0 && (
              <nav aria-label="Dans cet article" className="rounded-[24px] bg-brand-sand p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Dans cet article</p>
                <ol className="mt-4 space-y-1 border-l-2 border-brand-navy/10">
                  {toc.map((h, i) => {
                    const id = ids[i] ?? "";
                    const isActive = active === id;
                    return (
                      <li key={h.text}>
                        <a
                          href={`#${id}`}
                          aria-current={isActive ? "true" : undefined}
                          className={cn(
                            "-ml-0.5 block border-l-2 py-1.5 pl-4 text-[0.95rem] leading-snug no-underline transition-colors",
                            isActive ? "border-primary font-semibold text-primary" : "border-transparent text-brand-navy/75 hover:text-primary",
                          )}
                        >
                          {h.text}
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}
            <div className="relative overflow-hidden rounded-[24px] navy-glow p-6 text-white">
              <Arcs light className="-right-20 -top-20 size-56" count={2} />
              <p className="display-font relative text-xl font-semibold !text-white">Besoin d'un avis personnalisé ?</p>
              <p className="relative mt-2 text-sm text-white/70">{offer ? `${offer.title} : votre` : "Votre"} devis gratuit sous 24 h, avec un conseiller de l'agence.</p>
              <AppLink to={offer ? `/devis?produit=${offer.slug}` : "/devis"} className={`${pill({ variant: "gradient", size: "sm" })} relative mt-5 w-full`}>
                Demander un devis <ArrowSlide icon={ArrowRight} />
              </AppLink>
            </div>
            <ShareBox title={post.title} />
          </aside>
        </Container>
      </article>

      <section className="bg-brand-sand py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="À lire aussi"
            title={<>D'autres conseils <span className="text-primary">utiles.</span></>}
            action={<AppLink to="/conseils" className={pill({ variant: "ghost" })}>Tous les articles <ArrowSlide icon={ArrowRight} /></AppLink>}
          />
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <StaggerItem key={p.slug} className="h-full"><ArticleCard post={p} /></StaggerItem>)}
          </Stagger>
        </Container>
      </section>
      <CTABand />
    </>
  );
}

/* ---------------------------------------------------------------- pieces */

function MobileToc({ toc }: { toc: Heading[] }) {
  return (
    <details className="group mb-10 rounded-[20px] bg-brand-sand p-5 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-brand-navy [&::-webkit-details-marker]:hidden">
        Dans cet article ({toc.length} parties)
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <ol className="mt-4 space-y-2.5">
        {toc.map((h, i) => (
          <li key={h.text} className="flex gap-3">
            <span className="text-sm font-semibold text-primary">{String(i + 1).padStart(2, "0")}</span>
            <a href={`#${headingId(h.text)}`} className="text-[0.95rem] leading-snug text-brand-navy no-underline hover:text-primary">{h.text}</a>
          </li>
        ))}
      </ol>
    </details>
  );
}

function InlineOffer({ offer }: { offer: Offer }) {
  return (
    <Reveal className="my-12">
      <AppLink to={`/assurances/${offer.slug}`} className="group card-surface card-hover zoom-media grid grid-cols-1 overflow-hidden text-brand-navy no-underline sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative aspect-[16/10] sm:aspect-auto">
          <ImageWithFallback image={offer.heroImage} className="!absolute inset-0 h-full w-full" sizes="(min-width: 640px) 320px, 100vw" />
        </div>
        <div className="p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Solution liée</p>
          <p className="display-font mt-2 text-xl font-semibold">{offer.title}</p>
          <p className="mt-2 text-[0.98rem] text-ink">{offer.tagline}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Découvrir l'offre <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </AppLink>
    </Reveal>
  );
}

function ArticleFooter({ title, author }: { title: string; author: string }) {
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  return (
    <div className="mt-16 space-y-6 border-t border-brand-navy/10 pt-10">
      <div className="flex flex-col gap-4 rounded-[24px] bg-brand-sand p-6 sm:flex-row sm:items-center sm:justify-between">
        {vote ? (
          <p aria-live="polite" className="font-medium text-brand-navy">
            {vote === "yes" ? "Merci ! Ravi que ce guide vous ait aidé." : "Merci pour votre retour. Un conseiller peut vous répondre sur WhatsApp."}
          </p>
        ) : (
          <>
            <p className="font-medium text-brand-navy">Cet article vous a-t-il été utile ?</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setVote("yes")} className={pill({ variant: "ghost", size: "sm" })}><ThumbsUp />Oui</button>
              <button type="button" onClick={() => setVote("no")} className={pill({ variant: "ghost", size: "sm" })}><ThumbsDown />Non</button>
            </div>
          </>
        )}
      </div>
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-gradient text-white"><UserRound className="size-5" aria-hidden="true" /></span>
        <div>
          <p className="text-sm text-muted-foreground">Rédigé par</p>
          <p className="font-semibold text-brand-navy">{author}</p>
          <p className="mt-1 text-[0.95rem] text-ink">L'équipe de {site.name} répond à vos questions d'assurance à Tanger, du lundi au samedi.</p>
          <a href={whatsappLink(`Bonjour ${site.name}, j'ai une question après avoir lu « ${title} ».`)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary no-underline hover:text-primary-600">
            <MessageCircle className="size-4" aria-hidden="true" />Poser une question sur cet article
          </a>
        </div>
      </div>
      <div className="lg:hidden"><ShareBox title={title} /></div>
    </div>
  );
}

function ShareBox({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    setUrl(window.location.href);
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  const share = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      /* share cancelled */
    }
  };
  const btn = "inline-flex items-center gap-2 rounded-full border border-brand-navy/10 bg-white px-4 py-2 text-sm font-semibold text-brand-navy no-underline transition-colors hover:border-primary/40 hover:bg-brand-ice";
  return (
    <div className="rounded-[24px] border border-brand-navy/10 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Partager</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer" className={btn}>
          <MessageCircle className="size-4" aria-hidden="true" />WhatsApp
        </a>
        <button type="button" onClick={() => void copy()} className={btn}>
          {copied ? <Check className="size-4 text-primary" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
          {copied ? "Lien copié" : "Copier le lien"}
        </button>
        {canShare && (
          <button type="button" onClick={() => void share()} className={btn}>
            <Share2 className="size-4" aria-hidden="true" />Plus
          </button>
        )}
      </div>
    </div>
  );
}