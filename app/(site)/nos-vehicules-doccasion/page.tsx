import Link from "next/link";
import { Icon } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { JsonLd, PageHero, SplitWords, euro } from "@/components/ui";
import { getContent } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/nos-vehicules-doccasion/";
export async function generateMetadata() {
  const occasions = await getContent("occasions");
  return pageMetadata({ ...occasions.seo, path: PATH, image: occasions.hero.image.src });
}

export default async function OccasionsPage() {
  const occasions = await getContent("occasions");
  const crumbs = [{ name: "Occasion", path: PATH }];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={occasions.hero} crumbs={crumbs} short />

      <section className="section section--paper">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div className="stack">
              <p className="hud eyebrow">{occasions.items.length} véhicules disponibles</p>
              <SplitWords as="h2" className="h2" text="Testés et garantis par nos techniciens" />
            </div>
            <p className="lead">Chaque véhicule d&apos;occasion est contrôlé dans nos ateliers avant sa remise en service.</p>
          </div>
          <div>
            {occasions.items.map((o) => (
              <Link className="used" href={`/vehicules-occasions/${o.slug}/`} key={o.slug} data-in="rise">
                <div className="media">
                  <Photo src={o.images[0].src} alt={o.images[0].alt} sizes="(max-width: 860px) 100vw, 55vw" />
                </div>
                <div className="stack" style={{ gap: 22 }}>
                  <h3 className="h3" style={{ fontSize: "clamp(28px, 3vw, 44px)" }}>
                    {o.title}
                  </h3>
                  <dl className="specs-table">
                    <dt>Marque</dt>
                    <dd>{o.brand}</dd>
                    <dt>Année</dt>
                    <dd>{o.year}</dd>
                    <dt>État</dt>
                    <dd>{o.condition}</dd>
                    <dt>Énergie</dt>
                    <dd>{o.energy}</dd>
                    <dt>Kilométrage</dt>
                    <dd>{euro(o.km)} km</dd>
                    <dt>Prix</dt>
                    <dd>{euro(o.priceHt)} € HT</dd>
                  </dl>
                  <span className="link">
                    Voir le véhicule <Icon name="arrow" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
