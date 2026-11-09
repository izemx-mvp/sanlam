import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteImage } from "@/data/images";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------------------------------------- Buttons */

export const pill = cva(
  "group/btn inline-flex h-[52px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[0.95rem] font-semibold no-underline transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-[1.05rem] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white shadow-[0_10px_24px_-10px_rgba(10,117,187,0.7)] hover:bg-primary-600",
        gradient: "bg-brand-gradient text-white shadow-[0_10px_24px_-10px_rgba(10,117,187,0.7)] hover:brightness-105",
        outline: "border border-white/45 bg-transparent text-white hover:border-white hover:bg-white/10",
        ghost: "border border-brand-navy/15 bg-transparent text-brand-navy hover:border-primary/40 hover:bg-brand-ice",
        white: "bg-white text-brand-navy shadow-[0_10px_24px_-12px_rgba(7,28,47,0.5)] hover:bg-brand-ice",
      },
      size: {
        md: "",
        sm: "h-11 px-5 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
export type PillProps = VariantProps<typeof pill>;

/** Arrow that slides 4px when its parent pill is hovered */
export function ArrowSlide({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon aria-hidden="true" className="transition-transform duration-200 group-hover/btn:translate-x-1" />;
}

/* ---------------------------------------------------------------- Images */

type ImageProps = {
  image: SiteImage;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  objectPosition?: string;
  alt?: string;
};

/** <img> with explicit dimensions, lazy by default, falling back to a brand gradient if the file fails. */
export function ImageWithFallback({ image, className, imgClassName, priority = false, sizes, objectPosition, alt }: ImageProps) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);
  const label = alt ?? image.alt;
  return (
    <div className={cn("relative overflow-hidden bg-brand-ice", className)}>
      {failed ? (
        <div role="img" aria-label={label} className="absolute inset-0 bg-[linear-gradient(135deg,var(--brand-navy)_0%,var(--primary)_55%,var(--brand-sky)_100%)]" />
      ) : (
        <img
          ref={ref}
          src={image.src}
          alt={label}
          width={image.width}
          height={image.height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          {...(priority ? { fetchPriority: "high" as const } : {})}
          {...(sizes ? { sizes } : {})}
          onError={() => setFailed(true)}
          style={objectPosition ? { objectPosition } : undefined}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      )}
    </div>
  );
}

/** Clip-path reveal from the bottom with a slight zoom-out. */
export function PhotoReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  // The observed element must not carry the clip-path itself (a fully clipped target never intersects).
  return (
    <motion.div className={cn("h-full", className)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} style={{ overflow: "visible", clipPath: "none" }}>
      <motion.div
        className="h-full w-full overflow-hidden rounded-[inherit]"
        variants={{ hidden: { clipPath: "inset(100% 0% 0% 0%)" }, show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1, ease: EASE } } }}
      >
        <motion.div className="h-full w-full" variants={{ hidden: { scale: 1.08 }, show: { scale: 1, transition: { duration: 1.3, ease: EASE } } }}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- Motion */

export function Reveal({ children, className, delay = 0, as = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "li" | "section" }) {
  const reduced = useReducedMotion();
  const Comp = as === "li" ? motion.li : as === "section" ? motion.section : motion.div;
  return (
    <Comp
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduced ? 0 : 0.6, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

const staggerParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const staggerChild: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };

export function Stagger({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" | "ol" }) {
  const reduced = useReducedMotion();
  const Comp = as === "ul" ? motion.ul : as === "ol" ? motion.ol : motion.div;
  return (
    <Comp className={className} variants={staggerParent} initial={reduced ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.12 }}>
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const Comp = as === "li" ? motion.li : motion.div;
  return <Comp className={className} variants={staggerChild}>{children}</Comp>;
}

/** Number that counts up once when it scrolls into view. */
export function CountUp({ value, prefix = "", suffix = "", className }: { value: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const decimals = Number.isInteger(value) ? 0 : 1;
  const isYear = value > 1900 && value < 2100;
  const format = (n: number) =>
    isYear ? String(Math.round(n)) : n.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const [display, setDisplay] = useState(() => format(value));
  useEffect(() => {
    if (!inView || reduced) { setDisplay(format(value)); return; }
    const from = isYear ? value - 18 : 0;
    const controls = animate(from, value, { duration: 1.6, ease: EASE, onUpdate: (v) => setDisplay(format(v)) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, value]);
  return <span ref={ref} className={className}>{prefix}{display}{suffix}</span>;
}

/* ---------------------------------------------------------------- Type */

export function Eyebrow({ children, light = false, className }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <p className={cn("mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em]", light ? "text-brand-sky" : "text-primary", className)}>
      <span aria-hidden="true" className="h-px w-6 bg-current" />
      {children}
    </p>
  );
}

/** Highlighted word with a hand-drawn sky underline that draws in on reveal. */
export function Underline({ children, onLoad = false }: { children: ReactNode; onLoad?: boolean }) {
  const reduced = useReducedMotion();
  const path = "M2 9.5C40 4 95 2.5 150 4.5c22 .8 34 2 46 3.6";
  return (
    <span className="hl-underline">
      {children}
      <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" className={onLoad ? "hero-underline" : undefined}>
        {onLoad || reduced ? (
          <path d={path} pathLength={1} fill="none" stroke="var(--brand-sky)" strokeWidth="5" strokeLinecap="round" />
        ) : (
          <motion.path
            d={path}
            fill="none"
            stroke="var(--brand-sky)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
          />
        )}
      </svg>
    </span>
  );
}

export function Hl({ children }: { children: ReactNode }) {
  return <span className="text-primary">{children}</span>;
}

/** Highlights the last word of a plain title in primary. */
export function highlightLast(title: string, light = false) {
  const words = title.split(" ");
  const last = words.pop();
  return <>{words.join(" ")} <span className={light ? "text-brand-sky" : "text-primary"}>{last}</span></>;
}

export function SectionHeading({ eyebrow, title, description, center = false, light = false, className, action }: {
  eyebrow: string; title: ReactNode; description?: ReactNode; center?: boolean; light?: boolean; className?: string; action?: ReactNode;
}) {
  return (
    <Reveal className={cn("mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", center && "items-center text-center lg:flex-col lg:items-center", className)}>
      <div className={cn("max-w-2xl", center && "mx-auto")}>
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h2 className={cn("h2-display", light ? "text-white" : "text-brand-navy")}>{title}</h2>
        {description && <p className={cn("mt-5 text-lg leading-relaxed", light ? "text-white/70" : "text-ink")}>{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

/* ---------------------------------------------------------------- Decorative */

/** Thin concentric arcs taken from the logo circle — used to frame photos and bands. */
export function Arcs({ className, light = false, count = 3 }: { className?: string; light?: boolean; count?: number }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" aria-hidden="true" className={cn("pointer-events-none absolute", className)}>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx="200"
          cy="200"
          r={196 - i * 34}
          stroke={light ? "rgba(255,255,255,0.18)" : i === 0 ? "var(--brand-sky)" : "color-mix(in oklab, var(--primary) 30%, transparent)"}
          strokeWidth={i === 0 ? 1.4 : 1}
          strokeDasharray={i === 0 ? "620 612" : i === 1 ? "430 400" : undefined}
          strokeLinecap="round"
          opacity={1 - i * 0.18}
        />
      ))}
    </svg>
  );
}

/** Floating white chip over a photo: small icon + two lines. */
export function ProofChip({ icon: Icon, title, text, className, style }: { icon: LucideIcon; title: string; text: string; className?: string; style?: CSSProperties }) {
  return (
    <div style={style} className={cn("absolute z-10 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-18px_rgba(11,42,69,0.45)]", className)}>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-ice text-primary"><Icon className="size-5" aria-hidden="true" /></span>
      <span className="leading-tight">
        <strong className="block text-sm font-semibold text-brand-navy">{title}</strong>
        <span className="mt-0.5 block text-xs text-muted-foreground">{text}</span>
      </span>
    </div>
  );
}

export function Stars({ value, className, size = "size-4" }: { value: number; className?: string; size?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`Note de ${String(value).replace(".", ",")} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className={cn("relative inline-block", size)}>
            <Star className={cn("absolute inset-0 text-amber-400/35", size)} fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={cn("text-amber-400", size)} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("marquee relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]", className)}>
      <div className="marquee-track flex w-max shrink-0">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function IconTile({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-ice text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white", className)}>
      <Icon className="size-[1.35rem]" aria-hidden="true" />
    </span>
  );
}
