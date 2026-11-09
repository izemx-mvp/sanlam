import { site, mapsUrl } from "@/config/site";
import { images, type SiteImage } from "@/data/images";

type Crumb = { name: string; path: string };

const abs = (path: string) => `${site.domain}${path === "/" ? "" : path}`;

export const agencyJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  "@id": `${site.domain}/#agence`,
  name: site.name,
  description: `${site.name}, agent général ${site.insurer} à Tanger : assurances auto, habitation, santé, voyage, épargne et solutions pour les professionnels.`,
  url: site.domain,
  image: abs(images.agence.hero.src),
  logo: abs("/favicon.png"),
  telephone: site.phoneHref,
  email: site.email,
  priceRange: "Devis gratuit",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.street,
    postalCode: site.postalCode,
    addressLocality: site.city,
    addressRegion: "Tanger-Tétouan-Al Hoceïma",
    addressCountry: "MA",
  },
  openingHours: site.openingHours,
  aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5 },
  hasMap: mapsUrl,
  areaServed: { "@type": "City", name: "Tanger" },
  founder: { "@type": "Person", name: site.director },
});

export const breadcrumbJsonLd = (items: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: abs(item.path),
  })),
});

export const faqJsonLd = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
});

export const articleJsonLd = (post: { title: string; excerpt: string; slug: string; date: string; author: string; cover: SiteImage }) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.excerpt,
  image: abs(post.cover.src),
  datePublished: post.date,
  dateModified: post.date,
  author: { "@type": "Person", name: post.author },
  publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: abs("/favicon.png") } },
  mainEntityOfPage: abs(`/conseils/${post.slug}`),
});

type HeadInput = {
  title: string;
  description: string;
  path: string;
  image: SiteImage;
  type?: "website" | "article";
  breadcrumbs?: Crumb[];
  jsonLd?: object[];
};

/** Per-page head: title, description, Open Graph (page hero as og:image), canonical and JSON-LD. */
export function pageHead({ title, description, path, image, type = "website", breadcrumbs, jsonLd = [] }: HeadInput) {
  const url = abs(path);
  const scripts = [...(breadcrumbs ? [breadcrumbJsonLd(breadcrumbs)] : []), ...jsonLd].map((data) => ({
    type: "application/ld+json",
    children: JSON.stringify(data),
  }));
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: abs(image.src) },
      { property: "og:image:width", content: String(image.width) },
      { property: "og:image:height", content: String(image.height) },
      { property: "og:image:alt", content: image.alt },
      { property: "og:locale", content: "fr_MA" },
      { property: "og:site_name", content: site.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: abs(image.src) },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}
