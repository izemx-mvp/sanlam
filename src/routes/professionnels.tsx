import { createFileRoute } from "@tanstack/react-router";
import { faqJsonLd, pageHead } from "@/lib/seo";
import { site } from "@/config/site";
import { images } from "@/data/images";
import { hubFaqs } from "@/data/packs";
import { HubPage } from "@/components/brand/hub";

export const Route = createFileRoute("/professionnels")({
  head: () => pageHead({
    title: `Assurances professionnelles à Tanger | ${site.name}`,
    description: `Multirisque pro, flotte, responsabilité civile, accidents du travail et santé collective : ${site.name} protège les entreprises de Tanger et de la zone franche.`,
    path: "/professionnels",
    image: images.hubs.professionnels,
    breadcrumbs: [{ name: "Professionnels", path: "/professionnels" }],
    jsonLd: [faqJsonLd(hubFaqs.Professionnels)],
  }),
  component: () => <HubPage audience="Professionnels" image={images.hubs.professionnels} path="/professionnels" />,
});
