import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { VehiclePage } from "@/components/VehiclePage";
import { landings } from "@/content/pages";
import { vehicleBySlug, vehicles } from "@/content/vehicles";
import { pageMetadata } from "@/lib/seo";

/**
 * URLs à la racine héritées de WordPress : fiches véhicules et landing pages
 * Google Ads. Toute autre valeur répond 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return [...vehicles.map((v) => ({ slug: v.slug })), ...Object.keys(landings).map((slug) => ({ slug }))];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const v = vehicleBySlug(slug);
  if (v) return pageMetadata({ ...v.seo, path: `/${slug}/`, image: v.slides[0].src });
  const l = landings[slug];
  if (l) return pageMetadata({ ...l.seo, path: `/${slug}/`, noindex: true });
  return {};
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const v = vehicleBySlug(slug);
  if (v) return <VehiclePage v={v} />;
  const l = landings[slug];
  if (l) return <LandingPage slug={slug} h1={l.h1} />;
  notFound();
}
