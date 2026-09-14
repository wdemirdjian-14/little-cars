import type { CSSProperties } from "react";
import { Photo } from "@/components/Photo";
import { ButtonLink, JsonLd, PageHero, SplitWords } from "@/components/ui";
import { lld } from "@/content/pages";
import { keyFigures } from "@/content/site";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/location-longue-duree-little/";
export const metadata = pageMetadata({ ...lld.seo, path: PATH, image: lld.hero.image.src });

export default function LldPage() {
  const crumbs = [{ name: "Location longue durée", path: PATH }];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={lld.hero} crumbs={crumbs}>
        <div className="v-hero__price">
          <div>
            <span className="hud muted">À partir de</span>
            <strong>
              <em>{keyFigures.lld.from} €</em> HT/mois
            </strong>
          </div>
          <div>
            <span className="hud muted">Durée</span>
            <strong>
              {keyFigures.lld.minMonths} à {keyFigures.lld.maxMonths} mois
            </strong>
          </div>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div className="stack">
              <p className="hud eyebrow">LLD Full Service</p>
              <SplitWords as="h2" className="h2" text={lld.intro.title} />
            </div>
            <p className="lead">{lld.intro.text}</p>
          </div>
          <div className="pillars">
            {lld.pillars.map((p, i) => (
              <article className="pillar" key={p.title} data-in="rise" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <span className="hud pillar__index">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3">{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 24, fontSize: 14 }}>
            {lld.footnote}
          </p>
        </div>
      </section>

      <section className="section section--night2">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div className="stack">
              <p className="hud eyebrow">Exemples de financement</p>
              <SplitWords as="h2" className="h2" text="Offre complète, maintenance incluse" />
            </div>
            <div className="actions">
              <ButtonLink href="/little-contact/">Obtenir mon loyer</ButtonLink>
            </div>
          </div>
          <div className="cards">
            {lld.examples.map((ex, i) => (
              <article className="vcard" key={ex.title} data-in="rise" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <div className="vcard__media">
                  <Photo src={ex.image.src} alt={ex.image.alt} sizes="(max-width: 700px) 100vw, 33vw" />
                </div>
                <div className="vcard__body">
                  <span className="hud vcard__cat">{ex.subtitle}</span>
                  <h3 className="vcard__title">{ex.title}</h3>
                  <p className="vcard__tagline">{ex.note}</p>
                  <dl className="vcard__specs">
                    <div className="vcard__spec">
                      <dt>Vitesse</dt>
                      <dd>{ex.speed}</dd>
                    </div>
                    <div className="vcard__spec">
                      <dt>Charge</dt>
                      <dd>{ex.payload}</dd>
                    </div>
                    <div className="vcard__spec">
                      <dt>Autonomie</dt>
                      <dd>{ex.range}</dd>
                    </div>
                  </dl>
                  <p className="vcard__price">
                    À partir de <b>{ex.price} €</b> HT/mois
                    <br />
                    Full Service, hors options et accessoires
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
