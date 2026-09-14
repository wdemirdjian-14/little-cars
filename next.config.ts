import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

const indexable = process.env.SITE_INDEXABLE === "true";

/**
 * Anciennes URLs WordPress sans équivalent direct : 301 vers la page la plus
 * proche pour conserver le jus SEO des liens entrants.
 */
const legacyRedirects = [
  { source: "/2022/10/05/bonjour-tout-le-monde/", destination: "/" },
  { source: "/404-2/", destination: "/" },
  { source: "/author/:slug*", destination: "/little/" },
  { source: "/category/:slug*", destination: "/" },
  { source: "/z-divi-test-contact-form-7/", destination: "/little-contact/" },
  { source: "/gamme-ebox/", destination: "/les-5-atouts-de-la-gamme-ebox/" },
  { source: "/ebox-industrie/", destination: "/utilitaire-electrique-ebox-industrie-2-et-3-places/" },
  { source: "/vehicules-occasions/", destination: "/nos-vehicules-doccasion/" },
  { source: "/sitemap_index.xml", destination: "/sitemap.xml" },
  { source: "/page-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/wp-sitemap.xml", destination: "/sitemap.xml" },
].map((r) => ({ ...r, permanent: true }));

/**
 * Photos d'origine (/wp-content/uploads/…jpg) → leur version WebP optimisée.
 * Généré par `npm run media` ; Google Images garde ainsi ses références.
 */
function mediaRedirects() {
  const file = path.join(process.cwd(), "content", "media-redirects.json");
  if (!fs.existsSync(file)) return [];
  const map: Record<string, string> = JSON.parse(fs.readFileSync(file, "utf8"));
  return Object.entries(map).map(([source, destination]) => ({ source, destination, permanent: true }));
}

const nextConfig: NextConfig = {
  // Autonome : le build GitHub Actions embarque son propre serveur Node.
  output: "standalone",
  // Les URLs WordPress se terminent toutes par « / » : on les garde à l'identique.
  trailingSlash: true,
  poweredByHeader: false,
  // Les WebP sont produits en amont par scripts/import-media.mjs : pas
  // d'optimiseur (ni de sharp) à faire tourner sur le VPS.
  images: { unoptimized: true },

  async redirects() {
    return [...legacyRedirects, ...mediaRedirects()];
  },

  async headers() {
    const common = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    if (!indexable) common.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });
    return [
      { source: "/:path*", headers: common },
      { source: "/media/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
