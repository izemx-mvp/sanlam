import { createFileRoute } from "@tanstack/react-router";
import { faqJsonLd, pageHead } from "@/lib/seo";
import { site } from "@/config/site";
import { images } from "@/data/images";
import { hubFaqs } from "@/data/packs";
import { HubPage } from "@/components/brand/hub";

export const Route = createFileRoute("/particuliers")({
  head: () => pageHead({
    title: `Assurances particuliers à Tanger | ${site.name}`,
    description: `Assurance auto, habitation, santé, voyage, épargne et prévoyance à Tanger : des solutions ${site.insurer} expliquées par votre conseiller ${site.name}.`,
    path: "/particuliers",
    image: images.hubs.particuliers,
    breadcrumbs: [{ name: "Particuliers", path: "/particuliers" }],
    jsonLd: [faqJsonLd(hubFaqs.Particuliers)],
  }),
  component: () => <HubPage audience="Particuliers" image={images.hubs.particuliers} path="/particuliers" />,
});
