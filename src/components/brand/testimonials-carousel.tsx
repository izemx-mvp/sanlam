import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/data/testimonials";
import { TestimonialCard } from "@/components/brand/blocks";

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [viewportRef, api] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const paused = useRef(false);
  const reduced = useReducedMotion();

  const onSelect = useCallback(() => { if (api) setSelected(api.selectedScrollSnap()); }, [api]);

  useEffect(() => {
    if (!api) return;
    setSnaps(api.scrollSnapList());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", () => { setSnaps(api.scrollSnapList()); onSelect(); });
    return () => { api.off("select", onSelect); };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api || reduced) return;
    const timer = setInterval(() => { if (!paused.current && document.visibilityState === "visible") api.scrollNext(); }, 6000);
    return () => clearInterval(timer);
  }, [api, reduced]);

  return (
    <div
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onFocusCapture={() => { paused.current = true; }}
      onBlurCapture={() => { paused.current = false; }}
      role="region"
      aria-roledescription="carrousel"
      aria-label="Avis de nos clients"
    >
      <div ref={viewportRef} className="overflow-hidden">
        <div className="-ml-5 flex">
          {items.map((item, i) => (
            <div key={item.name} className="min-w-0 shrink-0 grow-0 basis-full pl-5 md:basis-1/2 xl:basis-1/3" role="group" aria-roledescription="avis" aria-label={`${i + 1} sur ${items.length}`}>
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          {snaps.map((_, i) => (
            <button key={i} type="button" onClick={() => api?.scrollTo(i)} aria-label={`Afficher l'avis ${i + 1}`} aria-current={i === selected}
              className={cn("h-2 rounded-full transition-all duration-300", i === selected ? "w-8 bg-primary" : "w-2 bg-brand-navy/20 hover:bg-brand-navy/40")} />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => api?.scrollPrev()} aria-label="Avis précédent" className="grid size-12 place-items-center rounded-full border border-brand-navy/15 bg-white text-brand-navy transition-colors hover:border-primary hover:bg-primary hover:text-white"><ArrowLeft className="size-5" /></button>
          <button type="button" onClick={() => api?.scrollNext()} aria-label="Avis suivant" className="grid size-12 place-items-center rounded-full border border-brand-navy/15 bg-white text-brand-navy transition-colors hover:border-primary hover:bg-primary hover:text-white"><ArrowRight className="size-5" /></button>
        </div>
      </div>
    </div>
  );
}
