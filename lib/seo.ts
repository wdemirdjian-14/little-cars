import type { Metadata } from "next";
import { brand } from "@/content/brand";
import { company } from "@/content/site";
import type { Vehicle } from "@/content/types";
import { mediaUrl } from "@/lib/media";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://little-cars.fr").replace(/\/$/, "");
/** Seule la production sur little-cars.fr doit être indexée. */
export const INDEXABLE = process.env.SITE_INDEXABLE === "true";

export const absolute = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p}`);

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** Page utile mais à garder hors de Google (remerciement, landing Ads). */
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, image, noindex }: PageMeta): Metadata {
  const images = image ? [{ url: absolute(mediaUrl(image, 1600)) }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: company.siteName, locale: "fr_FR", type: "website", images },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
    robots: !INDEXABLE ? { index: false, follow: false } : noindex ? { index: false, follow: true } : undefined,
  };
}

/* Données structurées schema.org ------------------------------------------ */

const ORG_ID = `${SITE_URL}/#organisation`;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": ORG_ID,
    name: company.siteName,
    alternateName: company.brand,
    legalName: company.legalName,
    url: `${SITE_URL}/`,
    logo: absolute(mediaUrl(brand.logoDark.src, 800)),
    image: absolute(mediaUrl("2023/01/Little-Header-Slider1-NEW.jpg", 1600)),
    description: "Constructeur français d'utilitaires électriques : SSV, mules et véhicules électriques professionnels homologués route.",
    foundingDate: String(company.foundingYear),
    telephone: company.phoneIntl,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      postalCode: company.address.postalCode,
      addressLocality: company.address.city,
      addressRegion: company.address.region,
      addressCountry: company.address.country,
    },
    openingHours: company.hours.schema,
    sameAs: Object.values(company.socials),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  };
}

export function vehicleLd(v: Vehicle) {
  const offers = v.priceBuy
    ? {
        "@type": "Offer",
        price: v.priceBuy,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: absolute(`/${v.slug}/`),
        priceSpecification: { "@type": "PriceSpecification", price: v.priceBuy, priceCurrency: "EUR", valueAddedTaxIncluded: false },
        seller: { "@id": ORG_ID },
      }
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Little ${v.name}`,
    description: v.seo.description,
    brand: { "@type": "Brand", name: company.brand },
    manufacturer: { "@id": ORG_ID },
    category: "Utilitaire électrique",
    url: absolute(`/${v.slug}/`),
    image: [v.card, ...v.slides.slice(0, 3)].map((i) => absolute(mediaUrl(i.src, 1600))),
    additionalProperty: v.specs.map((s) => ({ "@type": "PropertyValue", name: s.label, value: `${s.value} ${s.unit ?? ""}`.trim() })),
    ...(offers ? { offers } : {}),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
