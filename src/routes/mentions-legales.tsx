import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, Breadcrumb, PageIntro } from "@/components/site";
import { site } from "@/config/site";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({ meta: [
    { title: "Mentions légales | Sanlam Casablanca" },
    { name: "description", content: "Informations légales et conditions d'utilisation du site de l'agence Sanlam à Casablanca." },
    { property: "og:title", content: "Mentions légales | Sanlam Casablanca" },
    { property: "og:description", content: "Informations concernant le site de l'agence Sanlam à Casablanca." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: LegalPage,
});

function LegalPage() {
  return <SiteShell><PageIntro eyebrow="Informations" title="Mentions légales." description="Les informations relatives au site et à son utilisation." /><section className="mx-auto max-w-4xl px-6 py-10 sm:py-14"><Breadcrumb current="Mentions légales" /><div className="space-y-10"><article><h2 className="display-font text-xl font-semibold">Éditeur du site</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Ce site présente l'agence {site.name} de Casablanca. Responsable de l'agence : {site.director}. Adresse : {site.address}. Téléphone : <a href={`tel:${site.phoneHref}`} className="text-primary">{site.phone}</a>. E-mail : <a href={`mailto:${site.email}`} className="text-primary">{site.email}</a>.</p></article><article><h2 className="display-font text-xl font-semibold">Assurances et informations</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Les informations présentées sont indicatives et ne constituent pas une offre contractuelle. Les garanties, exclusions, conditions, tarifs et modalités dépendent des contrats applicables et doivent être confirmés par l'agence.</p></article><article><h2 className="display-font text-xl font-semibold">Formulaires de demande</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Les formulaires de devis et de préparation de déclaration fonctionnent localement dans votre navigateur. Les données saisies ne sont ni envoyées à l'agence ni enregistrées par ce site. Pour transmettre une demande, contactez directement l'agence par téléphone, e-mail ou WhatsApp.</p></article><article><h2 className="display-font text-xl font-semibold">Données et droits</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Ce site n'enregistre pas les informations saisies dans ses formulaires. Pour toute question relative aux informations de l'agence ou aux assurances proposées, contactez-nous directement à l'adresse indiquée ci-dessus.</p></article><article><h2 className="display-font text-xl font-semibold">Création du site</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{site.partner}.</p></article></div></section></SiteShell>;
}