import type { MetadataRoute } from "next";
import { INDEXABLE, absolute } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    // Préproduction : rien ne doit entrer dans l'index de Google.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/merci-pour-votre-demande/"] },
    sitemap: absolute("/sitemap.xml"),
  };
}
