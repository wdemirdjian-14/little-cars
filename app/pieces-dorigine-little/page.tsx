import { ButtonLink, Checklist, JsonLd, PageHero, SplitWords } from "@/components/ui";
import { pieces } from "@/content/pages";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/pieces-dorigine-little/";
export const metadata = pageMetadata({ ...pieces.seo, path: PATH, image: pieces.hero.image.src });

export default function PiecesPage() {
  const crumbs = [
    { name: "SAV & services", path: "/services-apres-vente-et-services-little/" },
    { name: "Pièces d'origine", path: PATH },
  ];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={pieces.hero} crumbs={crumbs} short />

      <section className="section">
        <div className="wrap split-2" style={{ alignItems: "start" }}>
          <div className="stack" style={{ gap: 28 }}>
            <p className="hud eyebrow">Le choix de l&apos;origine</p>
            <SplitWords as="h2" className="h2" text={pieces.why.title} />
            <p className="lead">{pieces.why.lead}</p>
          </div>
          <div className="stack" style={{ gap: 28 }} data-in="rise">
            <Checklist items={pieces.why.list} />
            {pieces.why.paragraphs.map((p) => (
              <p key={p} style={{ color: "var(--mist-2)" }}>
                {p}
              </p>
            ))}
            <div className="actions">
              <ButtonLink href="/little-contact/">Commander une pièce</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight section--fog">
        <div className="wrap split-2">
          <SplitWords as="h2" className="h2" text={pieces.eco.title} />
          <p className="lead" data-in="rise">
            {pieces.eco.text}
          </p>
        </div>
      </section>
    </>
  );
}
