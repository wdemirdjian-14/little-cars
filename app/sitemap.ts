import type { MetadataRoute } from "next";
import { occasions } from "@/content/pages";
import { vehicles } from "@/content/vehicles";
import { absolute } from "@/lib/seo";

/** Pages indexables uniquement : ni remerciement ni landing pages Ads. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: [string, number][] = [
    ["/", 1],
    ["/les-utilitaires-electriques-par-usage/", 0.9],
    ...vehicles.map((v) => [`/${v.slug}/`, 0.9] as [string, number]),
    ["/accessoires-ebox/", 0.7],
    ["/les-5-atouts-de-la-gamme-ebox/", 0.7],
    ["/location-longue-duree-little/", 0.8],
    ["/nos-vehicules-doccasion/", 0.7],
    ...occasions.items.map((o) => [`/vehicules-occasions/${o.slug}/`, 0.5] as [string, number]),
    ["/services-apres-vente-et-services-little/", 0.7],
    ["/contrats-dentretien-de-maintenance-little/", 0.6],
    ["/pieces-dorigine-little/", 0.6],
    ["/programme-reborn/", 0.6],
    ["/faire-une-demande-de-sav/", 0.5],
    ["/fiches-techniques/", 0.6],
    ["/faq/", 0.6],
    ["/little/", 0.7],
    ["/little-contact/", 0.8],
    ["/mentions-legales/", 0.2],
    ["/politique-de-confidentialite/", 0.2],
  ];
  return pages.map(([path, priority]) => ({ url: absolute(path), lastModified, priority }));
}
