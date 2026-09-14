import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Chakra_Petch, Instrument_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionRoot } from "@/components/MotionRoot";
import { JsonLd } from "@/components/ui";
import { home } from "@/content/pages";
import { INDEXABLE, SITE_URL, organizationLd } from "@/lib/seo";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${hud.variable}`}>
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <MotionRoot />
        <JsonLd data={organizationLd()} />
      </body>
    </html>
  );
}
