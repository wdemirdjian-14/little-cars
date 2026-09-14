import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Chakra_Petch, Instrument_Sans } from "next/font/google";
import { home } from "@/content/pages";
import { INDEXABLE, SITE_URL } from "@/lib/seo";
import "./globals.css";

// Polices auto-hébergées au build : aucune requête vers Google côté visiteur.
const display = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
  fallback: ["Arial Narrow", "Roboto Condensed", "sans-serif"],
  adjustFontFallback: false,
});
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const hud = Chakra_Petch({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-hud", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${home.seo.title} - Little Cars`, template: "%s - Little Cars" },
  description: home.seo.description,
  applicationName: "Little Cars",
  formatDetection: { telephone: false },
  robots: INDEXABLE ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#06100d",
  colorScheme: "dark",
};

/** Racine commune au site public (groupe (site)) et au back-office (admin). */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${hud.variable}`}>
      <body>{children}</body>
    </html>
  );
}
