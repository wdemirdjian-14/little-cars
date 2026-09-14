import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { VehiclePage } from "@/components/VehiclePage";
import type { Seo } from "@/content/pages";
import type { Vehicle } from "@/content/types";
import { getContent, getVehicle } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

/**
 * URLs à la racine héritées de WordPress : fiches véhicules et landing pages
 * Google Ads. Toute autre valeur répond 404. Rendu à la demande : le contenu
 * vient du CMS.
 */

type Props = { params: Promise<{ slug: string }> };

type Found = { kind: "vehicule"; vehicle: Vehicle } | { kind: "landing"; seo: Seo; h1: string } | null;

async function resolve(slug: string): Promise<Found> {
  const vehicle = await getVehicle(slug);
  if (vehicle) return { kind: "vehicule", vehicle };
  const landings: Record<string, { seo: Seo; h1: string }> = await getContent("landings");
  const landing = landings[slug];
  return landing ? { kind: "landing", ...landing } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await resolve(slug);
  if (!found) return {};
  if (found.kind === "vehicule") return pageMetadata({ ...found.vehicle.seo, path: `/${slug}/`, image: found.vehicle.slides[0].src });
  return pageMetadata({ ...found.seo, path: `/${slug}/`, noindex: true });
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const found = await resolve(slug);
  if (!found) notFound();
  if (found.kind === "vehicule") return <VehiclePage v={found.vehicle} />;
  return <LandingPage slug={slug} h1={found.h1} />;
}
