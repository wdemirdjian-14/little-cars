import { Markdown } from "@/components/Markdown";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Mentions légales",
  description: "Mentions légales du site little-cars.fr : éditeur, hébergeur, propriété intellectuelle.",
  path: "/mentions-legales/",
});

export default async function LegalPage() {
  const { markdown } = await getContent("mentions-legales");
  return (
    <>
      <section className="section section--tight" style={{ paddingTop: "calc(var(--header-h) + clamp(48px, 8vw, 120px))" }}>
        <div className="wrap stack">
          <p className="hud eyebrow">Informations légales</p>
          <h1 className="h1">Mentions légales</h1>
        </div>
      </section>
      <section className="section section--paper">
        <div className="wrap">
          <Markdown source={markdown} />
        </div>
      </section>
    </>
  );
}
