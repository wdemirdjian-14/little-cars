import { ButtonLink, JsonLd, PageHero, SplitWords, TextLink } from "@/components/ui";
import { maintenance, services } from "@/content/pages";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/contrats-dentretien-de-maintenance-little/";
export const metadata = pageMetadata({ ...maintenance.seo, path: PATH, image: maintenance.hero.image.src });

export default function MaintenancePage() {
  const crumbs = [
    { name: "SAV & services", path: "/services-apres-vente-et-services-little/" },
    { name: "Contrats d'entretien", path: PATH },
  ];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={maintenance.hero} crumbs={crumbs} short />

      <section className="section">
        <div className="wrap split-2" style={{ alignItems: "start" }}>
          <div className="stack" style={{ gap: 28 }}>
            <p className="hud eyebrow">Faites entretenir votre véhicule chez Little</p>
            <SplitWords as="h2" className="h2" text="Une révision à votre rythme" />
          </div>
          <p className="lead" data-in="rise">
            {maintenance.intro}
          </p>
        </div>
      </section>

      <section className="section section--fog">
        <div className="wrap text-blocks">
          {maintenance.blocks.map((b) => (
            <div className="text-block" key={b.title}>
              <SplitWords as="h2" className="h3" text={b.title} />
              {b.paragraphs.map((p) => (
                <p key={p} data-in="rise">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap split-2">
          <SplitWords as="p" className="h3" text={services.lldTeaser} />
          <div className="actions" style={{ justifyContent: "flex-end" }}>
            <ButtonLink href="/little-contact/">Réserver une révision</ButtonLink>
            <TextLink href="/location-longue-duree-little/">Nos offres LLD</TextLink>
          </div>
        </div>
      </section>
    </>
  );
}
