import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { site } from "@/config/site";
import { images } from "@/data/images";
import { legalNotice } from "@/data/legal";
import { LegalPage } from "@/components/brand/legal";

export const Route = createFileRoute("/mentions-legales")({
  head: () => pageHead({
    title: `Mentions légales | ${site.name}`,
    description: `Mentions légales du site ${site.name}, agent général ${site.insurer} à Tanger : éditeur, activité réglementée, hébergement et propriété intellectuelle.`,
    path: "/mentions-legales",
    image: images.agence.hero,
    breadcrumbs: [{ name: "Mentions légales", path: "/mentions-legales" }],
  }),
  component: () => (
    <LegalPage
      title={<>Mentions <span className="text-primary">légales.</span></>}
      description="Les informations relatives à l'éditeur du site, à notre activité d'intermédiaire d'assurance et aux conditions d'utilisation."
      path="/mentions-legales"
      sections={legalNotice}
      updated="2 novembre 2026"
    />
  ),
});
