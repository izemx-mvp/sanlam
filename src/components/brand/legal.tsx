import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { LegalSection } from "@/data/legal";
import { PageHero } from "@/components/brand/blocks";
import { Container } from "@/components/brand/primitives";

export function LegalPage({ title, description, path, sections, updated }: { title: React.ReactNode; description: string; path: string; sections: LegalSection[]; updated: string }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: "-25% 0px -65% 0px" });
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [sections]);
  const crumbName = typeof title === "string" ? title : path === "/mentions-legales" ? "Mentions légales" : "Politique de confidentialité";
  return (
    <>
      <PageHero variant="compact" breadcrumbs={[{ name: crumbName, path }]} eyebrow="Informations légales" title={title} description={description} />
      <section className="bg-white py-16 sm:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Sommaire</p>
            <nav aria-label="Sommaire">
              <ol className="space-y-1 border-l border-brand-navy/10">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className={cn("-ml-px block border-l-2 py-2 pl-4 text-[0.95rem] no-underline transition-colors", active === s.id ? "border-primary font-semibold text-primary" : "border-transparent text-ink hover:text-brand-navy")}>
                      {String(i + 1).padStart(2, "0")}. {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <p className="mt-6 text-sm text-muted-foreground">Dernière mise à jour : {updated}</p>
          </aside>
          <div className="max-w-3xl space-y-12">
            {sections.map((s, i) => (
              <article key={s.id} id={s.id} className="scroll-mt-32">
                <h2 className="display-font text-2xl font-semibold text-brand-navy"><span className="mr-2 text-primary">{String(i + 1).padStart(2, "0")}.</span>{s.title}</h2>
                {s.paragraphs.map((p) => <p key={p.slice(0, 32)} className="mt-4 leading-relaxed text-ink">{p}</p>)}
                {s.list && <ul className="mt-4 space-y-2">{s.list.map((item) => <li key={item} className="flex gap-3 text-ink"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />{item}</li>)}</ul>}
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
