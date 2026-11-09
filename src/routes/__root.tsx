import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ArrowRight, Home } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { site } from "@/config/site";
import { agencyJsonLd } from "@/lib/seo";
import { SiteLayout, useInLayout } from "@/components/layout";
import { AppLink } from "@/components/brand/blocks";
import { Arcs, ArrowSlide, Container, pill } from "@/components/brand/primitives";

function NotFoundContent() {
  return (
    <section className="relative overflow-hidden bg-white">
      <Container className="relative grid min-h-[70vh] place-items-center py-20 text-center">
        <div className="relative">
          <Arcs className="left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2" />
          <p aria-hidden="true" className="display-font relative text-[clamp(7rem,22vw,14rem)] font-semibold leading-none tracking-tighter text-transparent [-webkit-text-stroke:2px_var(--primary)]">404</p>
          <h1 className="h2-display relative mt-4 text-brand-navy">Cette page s'est <span className="text-primary">égarée.</span></h1>
          <p className="lead relative mx-auto mt-5 max-w-md">Le lien a peut-être changé. Retrouvez nos assurances depuis l'accueil, ou demandez directement votre devis gratuit.</p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            <AppLink to="/" className={pill()}><Home />Accueil</AppLink>
            <AppLink to="/devis" className={pill({ variant: "ghost" })}>Demander un devis <ArrowSlide icon={ArrowRight} /></AppLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Works both inside the root layout (fuzzy not-found) and when rendered on its own. */
function NotFoundComponent() {
  const inLayout = useInLayout();
  return inLayout ? <NotFoundContent /> : <SiteLayout><NotFoundContent /></SiteLayout>;
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-sand px-4">
      <div className="max-w-md text-center">
        <h1 className="h2-display text-brand-navy">Cette page n'a pas pu s'afficher.</h1>
        <p className="mt-4 text-ink">Un incident technique est survenu. Vous pouvez réessayer ou revenir à l'accueil.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => { router.invalidate(); reset(); }} className={pill()}>Réessayer</button>
          <a href="/" className={pill({ variant: "ghost" })}>Retour à l'accueil</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Each content route sets its own title, description, canonical and og:image via pageHead().
    // Never add og:image or twitter:image here.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0B2A45" },
      { title: `${site.name} | Agent général ${site.insurer} à Tanger` },
      { name: "description", content: `${site.name}, agent général ${site.insurer} à Tanger : assurances auto, habitation, santé, voyage et solutions professionnelles.` },
      { name: "author", content: site.name },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(agencyJsonLd()) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteLayout>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </SiteLayout>
    </QueryClientProvider>
  );
}
