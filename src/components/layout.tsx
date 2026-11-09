import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ArrowUp, ArrowUpRight, ChevronDown, Clock3, FileText, LifeBuoy, Mail, MapPin, Menu, MessageCircle, Phone, X,
} from "lucide-react";
import logo from "@/assets/sanlam-logo.png";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { mailLink, mapsUrl, site, telLink, whatsappLink } from "@/config/site";
import { images } from "@/data/images";
import { businessOffers, individualOffers, type Offer } from "@/data/offers";
import { AppLink } from "@/components/brand/blocks";
import { Arcs, ArrowSlide, Container, ImageWithFallback, pill } from "@/components/brand/primitives";
import { ChatLauncher } from "@/components/chat/launcher";

const LayoutContext = createContext(false);
export const useInLayout = () => useContext(LayoutContext);

const NAV = [
  { label: "Accueil", to: "/" },
  { label: "Assurances", to: "mega" },
  { label: "Sinistres", to: "/sinistres" },
  { label: "Conseils", to: "/conseils" },
  { label: "L'agence", to: "/agence" },
  { label: "Contact", to: "/contact" },
] as const;

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  if (to === "mega") return pathname.startsWith("/assurances") || pathname === "/particuliers" || pathname === "/professionnels";
  return pathname === to || pathname.startsWith(`${to}/`);
}

/* ---------------------------------------------------------------- Opening status (Tanger time) */

// index = Date.getDay(): dimanche fermé, jeudi dès 8h, sinon 9h–20h
const OPENING: ReadonlyArray<readonly [number, number] | null> = [null, [9, 20], [9, 20], [9, 20], [8, 20], [9, 20], [9, 20]];

/** Client-only (avoids SSR hydration mismatch), refreshed every minute. */
export function useOpenStatus() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const update = () => {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" }));
      const slot = OPENING[now.getDay()];
      const minutes = now.getHours() * 60 + now.getMinutes();
      setOpen(Boolean(slot && minutes >= slot[0] * 60 && minutes < slot[1] * 60));
    };
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return open;
}

function OpenDot({ light = false }: { light?: boolean }) {
  const open = useOpenStatus();
  if (open === null) return null;
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold", open ? (light ? "text-emerald-300" : "text-emerald-700") : light ? "text-white/60" : "text-muted-foreground")}>
      <span className="relative flex size-2">
        {open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />}
        <span className={cn("relative inline-flex size-2 rounded-full", open ? "bg-emerald-400" : "bg-white/40")} />
      </span>
      {open ? "Ouvert maintenant" : "Fermé actuellement"}
    </span>
  );
}

/* ---------------------------------------------------------------- Logo */

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <AppLink to="/" aria-label={`${site.name} — accueil`} className="group flex min-w-0 shrink-0 items-center gap-3 no-underline">
      <img
        src={logo}
        alt={`Logo ${site.insurer}`}
        width={48}
        height={48}
        className={cn("size-11 shrink-0 object-contain transition-transform duration-500 group-hover:rotate-[-6deg] sm:size-12", light && "brightness-0 invert")}
      />
      <span className="min-w-0 leading-tight">
        <span className={cn("display-font block truncate text-[1.05rem] font-semibold tracking-tight sm:text-lg", light ? "text-white" : "text-brand-navy")}>{site.name}</span>
        <span className={cn("block truncate text-xs", light ? "text-white/60" : "text-muted-foreground")}>{site.descriptor}</span>
      </span>
    </AppLink>
  );
}

/* ---------------------------------------------------------------- Header */

function useScrollState() {
  const [state, setState] = useState({ scrolled: false, hideTop: false, progress: 0 });
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setState({ scrolled: y > 12, hideTop: y > 120 && y > last, progress: max > 0 ? Math.min(1, y / max) : 0 });
        last = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return state;
}

function TopBar() {
  return (
    <div className="hidden h-9 bg-brand-navy-900 text-[0.8rem] text-white/75 lg:block">
      <Container className="flex h-full items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <OpenDot light />
          <span className="inline-flex items-center gap-2"><Clock3 className="size-3.5 text-brand-sky" aria-hidden="true" />{site.hoursShort}</span>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 text-white/75 no-underline hover:text-white xl:inline-flex">
            <MapPin className="size-3.5 text-brand-sky" aria-hidden="true" />Av. Moulay Rachid, Tanger
          </a>
        </div>
        <div className="flex items-center gap-5">
          <a href={telLink} className="inline-flex items-center gap-2 text-white/75 no-underline hover:text-white"><Phone className="size-3.5 text-brand-sky" aria-hidden="true" />{site.phone}</a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/75 no-underline hover:text-white"><MessageCircle className="size-3.5 text-brand-sky" aria-hidden="true" />WhatsApp</a>
          <a href={mailLink} className="hidden items-center gap-2 text-white/75 no-underline hover:text-white xl:inline-flex"><Mail className="size-3.5 text-brand-sky" aria-hidden="true" />{site.email}</a>
        </div>
      </Container>
    </div>
  );
}

function MegaMenu({ open, onClose, onEnter, onLeave }: { open: boolean; onClose: () => void; onEnter: () => void; onLeave: () => void }) {
  const [preview, setPreview] = useState<Offer | null>(null);
  const reduced = useReducedMotion();
  const column = (title: string, list: Offer[], hub: "/particuliers" | "/professionnels") => (
    <div>
      <AppLink to={hub} onClick={onClose} className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary no-underline hover:text-primary-600">
        <span aria-hidden="true" className="h-px w-6 bg-current" />{title}
        <span className="rounded-full bg-brand-ice px-1.5 text-[0.65rem] leading-5">{list.length}</span>
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </AppLink>
      <ul className="space-y-1">
        {list.map((offer) => {
          const Icon = getIcon(offer.icon);
          const isPreview = preview?.slug === offer.slug;
          return (
            <li key={offer.slug}>
              <AppLink
                to={`/assurances/${offer.slug}`}
                onClick={onClose}
                onMouseEnter={() => setPreview(offer)}
                onFocus={() => setPreview(offer)}
                className={cn("group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-brand-navy no-underline transition-colors hover:bg-brand-ice", isPreview && "bg-brand-ice")}
              >
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl transition-colors group-hover:bg-primary group-hover:text-white", isPreview ? "bg-primary text-white" : "bg-brand-ice text-primary")}>
                  <Icon className="size-[1.1rem]" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.95rem] font-semibold">{offer.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{offer.short}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
              </AppLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mega-menu"
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={onEnter}
          onMouseLeave={() => { onLeave(); setPreview(null); }}
          className="absolute inset-x-0 top-full hidden border-t border-brand-navy/8 bg-white shadow-[0_30px_60px_-30px_rgba(11,42,69,0.35)] lg:block"
        >
          <Container className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.95fr)] gap-8 py-8">
            {column("Particuliers", individualOffers, "/particuliers")}
            {column("Professionnels", businessOffers, "/professionnels")}
            <div className="relative overflow-hidden rounded-[24px] bg-brand-navy text-white">
              <div className="relative">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={preview?.slug ?? "promo"}
                    initial={reduced ? false : { opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ImageWithFallback image={preview?.heroImage ?? images.menu.promo} alt={preview ? preview.heroImage.alt : images.menu.promo.alt} className="aspect-[4/3]" sizes="380px" />
                  </motion.div>
                </AnimatePresence>
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/20 to-transparent" />
                {preview && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-navy">{preview.title}</span>}
              </div>
              <div className="relative -mt-14 p-6">
                <p className="display-font text-xl font-semibold !text-white">Un devis en 2 minutes</p>
                <p className="mt-2 text-sm text-white/70">{preview ? preview.short : "Gratuit et sans engagement, réponse de votre conseiller sous 24 h."}</p>
                <AppLink to={preview ? `/devis?produit=${preview.slug}` : "/devis"} onClick={onClose} className={cn(pill({ variant: "gradient", size: "sm" }), "mt-5")}>
                  Demander un devis <ArrowSlide icon={ArrowRight} />
                </AppLink>
              </div>
            </div>
          </Container>
          <div className="border-t border-brand-navy/8 bg-brand-sand/60">
            <Container className="flex items-center justify-between gap-6 py-3.5 text-sm">
              <p className="flex items-center gap-2 text-brand-navy">
                <LifeBuoy className="size-4 text-primary" aria-hidden="true" />
                Un sinistre ?{" "}
                <AppLink to="/sinistres" onClick={onClose} className="font-semibold text-primary no-underline hover:text-primary-600">Déclarez-le en ligne</AppLink>
              </p>
              <div className="flex items-center gap-5">
                <AppLink to="/faq" onClick={onClose} className="font-medium text-brand-navy no-underline hover:text-primary">Questions fréquentes</AppLink>
                <a href={telLink} className="inline-flex items-center gap-2 font-semibold text-brand-navy no-underline hover:text-primary"><Phone className="size-4 text-primary" aria-hidden="true" />{site.phone}</a>
              </div>
            </Container>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileNav({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const [assurOpen, setAssurOpen] = useState(false);
  const reduced = useReducedMotion();
  const quick = [
    { to: "/devis", icon: FileText, label: "Devis gratuit", primary: true },
    { to: "/sinistres", icon: LifeBuoy, label: "Déclarer un sinistre", primary: false },
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          id="mobile-nav"
          aria-label="Navigation mobile"
          initial={reduced ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-x-0 top-full h-[calc(100dvh-76px)] overflow-y-auto border-t border-brand-navy/8 bg-white px-4 pb-32 pt-5 lg:hidden"
        >
          <div className="mx-auto max-w-lg">
            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              {quick.map(({ to, icon: Icon, label, primary }) => (
                <AppLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={cn("flex flex-col gap-3 rounded-[20px] p-4 font-semibold no-underline", primary ? "bg-brand-gradient text-white" : "bg-brand-sand text-brand-navy")}
                >
                  <Icon className={cn("size-5", primary ? "text-white" : "text-primary")} aria-hidden="true" />
                  {label}
                </AppLink>
              ))}
            </div>

            <ul className="mt-4">
              {NAV.map((item) => item.to === "mega" ? (
                <li key="mega" className="border-b border-brand-navy/8">
                  <button type="button" aria-expanded={assurOpen} onClick={() => setAssurOpen(!assurOpen)} className={cn("flex w-full items-center justify-between py-4 text-lg font-medium", isActive(pathname, "mega") ? "text-primary" : "text-brand-navy")}>
                    Assurances <ChevronDown className={cn("size-5 text-primary transition-transform", assurOpen && "rotate-180")} aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {assurOpen && (
                      <motion.div
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-5 pb-5">
                          {(["Particuliers", "Professionnels"] as const).map((group) => {
                            const list = group === "Particuliers" ? individualOffers : businessOffers;
                            const hub = group === "Particuliers" ? "/particuliers" : "/professionnels";
                            return (
                              <div key={group}>
                                <AppLink to={hub} onClick={onClose} className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-primary no-underline">
                                  {group}<span className="inline-flex items-center gap-1 normal-case tracking-normal">Tout voir <ArrowRight className="size-3.5" aria-hidden="true" /></span>
                                </AppLink>
                                <ul className="grid grid-cols-2 gap-2">
                                  {list.map((offer) => {
                                    const Icon = getIcon(offer.icon);
                                    return (
                                      <li key={offer.slug}>
                                        <AppLink to={`/assurances/${offer.slug}`} onClick={onClose} className="flex h-full items-center gap-2.5 rounded-2xl bg-brand-sand px-3 py-3 text-sm font-medium leading-snug text-brand-navy no-underline active:bg-brand-ice">
                                          <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />{offer.title}
                                        </AppLink>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={item.to} className="border-b border-brand-navy/8">
                  <AppLink to={item.to} onClick={onClose} aria-current={isActive(pathname, item.to) ? "page" : undefined} className={cn("flex items-center justify-between py-4 text-lg font-medium no-underline", isActive(pathname, item.to) ? "text-primary" : "text-brand-navy")}>
                    {item.label}<ArrowUpRight className="size-5 text-primary" aria-hidden="true" />
                  </AppLink>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <a href={telLink} className={pill({ variant: "ghost", size: "sm" })}><Phone />Appeler</a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={pill({ variant: "ghost", size: "sm" })}><MessageCircle />WhatsApp</a>
            </div>
            <div className="mt-6 space-y-2 rounded-[20px] bg-brand-sand p-4 text-sm text-ink">
              <OpenDot />
              <p className="flex items-center gap-2"><Clock3 className="size-4 text-primary" aria-hidden="true" />{site.hoursShort}</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-ink no-underline"><MapPin className="size-4 text-primary" aria-hidden="true" />{site.address}</a>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { scrolled, hideTop, progress } = useScrollState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaButton = useRef<HTMLButtonElement>(null);

  const enter = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setMegaOpen(true); };
  const leave = () => { closeTimer.current = setTimeout(() => setMegaOpen(false), 160); };

  useEffect(() => { setMegaOpen(false); setMobileOpen(false); }, [pathname]);
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  useEffect(() => {
    if (!megaOpen && !mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMegaOpen(false); setMobileOpen(false); megaButton.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaOpen, mobileOpen]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const glass = scrolled || megaOpen || mobileOpen;
  return (
    <div className={cn("sticky top-0 z-50 transition-[top] duration-300", hideTop && !megaOpen && "lg:-top-9")}>
      <TopBar />
      <header
        className={cn(
          "relative border-b transition-[background-color,border-color,box-shadow] duration-300",
          glass ? "border-brand-navy/8 bg-white/80 shadow-[0_10px_30px_-20px_rgba(11,42,69,0.35)] backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-white",
        )}
      >
        <Container className="flex h-[76px] items-center justify-between gap-6">
          <Brand />
          <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
            <LayoutGroup id="main-nav">
              {NAV.map((item) => {
                const active = isActive(pathname, item.to);
                const indicator = active ? (
                  <motion.span layoutId="nav-indicator" aria-hidden="true" className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-primary xl:inset-x-4" transition={{ type: "spring", stiffness: 420, damping: 36 }} />
                ) : null;
                if (item.to === "mega") {
                  return (
                    <div key="mega" onMouseEnter={enter} onMouseLeave={leave}>
                      <button
                        ref={megaButton}
                        type="button"
                        aria-expanded={megaOpen}
                        aria-controls="mega-menu"
                        onClick={() => setMegaOpen(!megaOpen)}
                        className={cn("relative inline-flex items-center gap-1 rounded-full px-3 py-3 text-[0.95rem] font-medium transition-colors hover:text-primary xl:px-4", active || megaOpen ? "text-primary" : "text-brand-navy")}
                      >
                        Assurances <ChevronDown className={cn("size-4 transition-transform duration-300", megaOpen && "rotate-180")} aria-hidden="true" />
                        {indicator}
                      </button>
                    </div>
                  );
                }
                return (
                  <AppLink
                    key={item.to}
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn("relative rounded-full px-3 py-3 text-[0.95rem] font-medium no-underline transition-colors hover:text-primary xl:px-4", active ? "text-primary" : "text-brand-navy")}
                  >
                    {item.label}
                    {indicator}
                  </AppLink>
                );
              })}
            </LayoutGroup>
          </nav>
          <div className="hidden items-center gap-5 lg:flex">
            <a href={telLink} className="hidden items-center gap-2 whitespace-nowrap text-sm font-semibold text-brand-navy no-underline hover:text-primary 2xl:inline-flex">
              <Phone className="size-4 text-primary" aria-hidden="true" />{site.phone}
            </a>
            <AppLink to="/devis" className={pill({ size: "sm" })}>Devis gratuit <ArrowSlide icon={ArrowUpRight} /></AppLink>
          </div>
          <button
            type="button"
            className={cn("grid size-11 place-items-center rounded-full border text-brand-navy transition-colors lg:hidden", mobileOpen ? "border-primary bg-primary text-white" : "border-brand-navy/12")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </Container>
        {/* Page scroll progress */}
        <div aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-0.5 transition-opacity duration-300", scrolled && !mobileOpen ? "opacity-100" : "opacity-0")}>
          <div className="h-full origin-left bg-brand-gradient" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} onEnter={enter} onLeave={leave} />
        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
      </header>
    </div>
  );
}

/* ---------------------------------------------------------------- Footer */

const USEFUL_LINKS = [
  ["Sinistres", "/sinistres"], ["Conseils", "/conseils"], ["FAQ", "/faq"], ["Contact", "/contact"], ["L'agence", "/agence"], ["Demander un devis", "/devis"],
] as const;

export function SiteFooter() {
  const linkClass = "text-white/65 no-underline transition-colors hover:text-white";
  const reduced = useReducedMotion();
  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  return (
    <footer className="bg-brand-navy-900 text-white">
      <Container className="pt-16">
        <div className="relative overflow-hidden rounded-[28px] navy-glow px-6 py-12 sm:px-12">
          <Arcs light className="-right-32 -top-32 size-[28rem]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="h2-display !text-white">Parlons de votre <span className="text-brand-sky">protection.</span></p>
              <p className="mt-3 max-w-lg text-white/70">Un conseiller vous répond du lundi au samedi, de 9h à 20h.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <AppLink to="/devis" className={pill({ variant: "gradient" })}>Devis gratuit <ArrowSlide icon={ArrowRight} /></AppLink>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={pill({ variant: "outline" })}><MessageCircle />WhatsApp</a>
              <a href={telLink} className={pill({ variant: "outline" })}><Phone />Appeler</a>
            </div>
          </div>
        </div>
      </Container>

      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <Brand light />
          <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-white/65">
            Agence de proximité au cœur de Tanger depuis {site.foundedYear}. Nous conseillons, souscrivons et gérons vos contrats {site.insurer}.
          </p>
          <address className="mt-6 space-y-2.5 text-[0.95rem] not-italic text-white/65">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={cn(linkClass, "flex gap-2.5")}><MapPin className="mt-1 size-4 shrink-0 text-brand-sky" aria-hidden="true" />{site.address}</a>
            <p className="flex gap-2.5"><Clock3 className="mt-1 size-4 shrink-0 text-brand-sky" aria-hidden="true" />{site.hours}</p>
            <a href={telLink} className={cn(linkClass, "flex gap-2.5")}><Phone className="mt-1 size-4 shrink-0 text-brand-sky" aria-hidden="true" />{site.phone}</a>
            <a href={mailLink} className={cn(linkClass, "flex gap-2.5")}><Mail className="mt-1 size-4 shrink-0 text-brand-sky" aria-hidden="true" />{site.email}</a>
          </address>
          <p className="mt-5 text-sm"><OpenDot light /></p>
        </div>
        <div>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] !text-white">Particuliers</h2>
          <ul className="space-y-3 text-[0.95rem]">{individualOffers.map((o) => <li key={o.slug}><AppLink to={`/assurances/${o.slug}`} className={linkClass}>{o.title}</AppLink></li>)}</ul>
        </div>
        <div>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] !text-white">Professionnels</h2>
          <ul className="space-y-3 text-[0.95rem]">{businessOffers.map((o) => <li key={o.slug}><AppLink to={`/assurances/${o.slug}`} className={linkClass}>{o.title}</AppLink></li>)}</ul>
        </div>
        <div>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] !text-white">Liens utiles</h2>
          <ul className="space-y-3 text-[0.95rem]">
            {USEFUL_LINKS.map(([label, to]) => <li key={to}><AppLink to={to} className={linkClass}>{label}</AppLink></li>)}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center gap-4 py-6 pb-28 text-sm text-white/55 lg:flex-row lg:justify-between lg:pb-6">
          <p className="text-center lg:text-left">© {new Date().getFullYear()} {site.name} · Agent général {site.insurer} · {site.partner}</p>
          <div className="flex items-center gap-5">
            <AppLink to="/mentions-legales" className={linkClass}>Mentions légales</AppLink>
            <AppLink to="/politique-de-confidentialite" className={linkClass}>Confidentialité</AppLink>
            <button type="button" onClick={toTop} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-white/75 transition-colors hover:border-white/40 hover:text-white">
              <ArrowUp className="size-3.5" aria-hidden="true" />Haut de page
            </button>
          </div>
        </Container>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- Floating actions */

function useShowAfter(offset: number) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return show;
}

const WhatsAppIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41" /></svg>
);

function FloatingActions() {
  const showTop = useShowAfter(900);
  const reduced = useReducedMotion();
  return (
    <>
      <div className="fixed bottom-[5.5rem] right-4 z-40 flex flex-col items-end gap-3 sm:right-6 lg:bottom-6">
        <AnimatePresence>
          {showTop && (
            <motion.button
              type="button"
              aria-label="Revenir en haut de la page"
              onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
              initial={reduced ? false : { opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.9 }}
              className="hidden size-11 place-items-center rounded-full border border-brand-navy/10 bg-white text-brand-navy shadow-[0_10px_24px_-12px_rgba(7,28,47,0.45)] transition-colors hover:text-primary lg:grid"
            >
              <ArrowUp className="size-4" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
        <ChatLauncher />
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Écrire à l'agence sur WhatsApp"
          className="group relative hidden size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-12px_rgba(7,28,47,0.55)] transition-transform hover:scale-105 lg:grid"
        >
          <WhatsAppIcon className="size-7" />
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-brand-navy px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            Une question ? WhatsApp
          </span>
        </a>
      </div>
      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_1fr_1.3fr] gap-2 border-t border-brand-navy/8 bg-white/90 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <a href={telLink} className={pill({ variant: "ghost", size: "sm" })}><Phone />Appeler</a>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 text-sm font-semibold text-white no-underline">
          <WhatsAppIcon className="size-4" />WhatsApp
        </a>
        <AppLink to="/devis" className={pill({ size: "sm" })}>Devis gratuit</AppLink>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Shell */

let hydrated = false;

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduced = useReducedMotion();
  useEffect(() => { hydrated = true; }, []);
  return (
    <LayoutContext.Provider value>
      <a href="#contenu" className="sr-only z-[100] rounded-full bg-primary px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Aller au contenu</a>
      <SiteHeader />
      <motion.main
        id="contenu"
        key={pathname}
        initial={hydrated && !reduced ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.main>
      <SiteFooter />
      <FloatingActions />
    </LayoutContext.Provider>
  );
}