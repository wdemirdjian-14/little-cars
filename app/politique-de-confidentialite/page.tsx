import { Markdown } from "@/components/Markdown";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Politique de confidentialité",
  description: "Comment Little collecte, utilise et protège les données transmises par les formulaires du site.",
  path: "/politique-de-confidentialite/",
});

export default function PrivacyPage() {
  return (
    <>
      <section className="section section--tight" style={{ paddingTop: "calc(var(--header-h) + clamp(48px, 8vw, 120px))" }}>
        <div className="wrap stack">
          <p className="hud eyebrow">Données personnelles</p>
          <h1 className="h1">Politique de confidentialité</h1>
        </div>
      </section>
      <section className="section section--paper">
        <div className="wrap">
          <Markdown file="legal/politique-de-confidentialite.md" />
        </div>
      </section>
    </>
  );
}
