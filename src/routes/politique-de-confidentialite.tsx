import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { site } from "@/config/site";
import { images } from "@/data/images";
import { privacyPolicy } from "@/data/legal";
import { LegalPage } from "@/components/brand/legal";

export const Route = createFileRoute("/politique-de-confidentialite")({
  head: () => pageHead({
    title: `Politique de confidentialité | ${site.name}`,
    description: `Comment ${site.name} traite vos données personnelles : données collectées, finalités, conservation et vos droits au titre de la loi 09-08.`,
    path: "/politique-de-confidentialite",
    image: images.agence.hero,
    breadcrumbs: [{ name: "Politique de confidentialité", path: "/politique-de-confidentialite" }],
  }),
  component: () => (
    <LegalPage
      title={<>Politique de <span className="text-primary">confidentialité.</span></>}
      description="Vos données vous appartiennent. Voici comment nous les utilisons et comment exercer vos droits."
      path="/politique-de-confidentialite"
      sections={privacyPolicy}
      updated="2 novembre 2026"
    />
  ),
});
