import type { CSSProperties } from "react";
import { Icon } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { ButtonLink, JsonLd, PageHero, SplitWords } from "@/components/ui";
import { getContent } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/fiches-techniques/";
export async function generateMetadata() {
  const documentation = await getContent("documentation");
  return pageMetadata({ ...documentation.seo, path: PATH, image: documentation.hero.image.src });
}

export default async function DocumentationPage() {
  const documentation = await getContent("documentation");
  const crumbs = [{ name: "Fiches techniques", path: PATH }];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={documentation.hero} crumbs={crumbs} short />

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Brochures générales</p>
            <SplitWords as="h2" className="h2" text="Découvrez toute la gamme en détail" />
          </div>
          <div className="cards">
            {documentation.brochures.map((b, i) => (
              <a className="card" key={b.href} href={b.href} target="_blank" rel="noopener" data-in="rise" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <div className="card__media">
                  <Photo src={b.image.src} alt={b.image.alt} sizes="(max-width: 700px) 100vw, 33vw" />
                </div>
                <div className="card__body">
                  <span className="hud muted">Brochure · PDF {b.size}</span>
                  <h3 className="h3">{b.title}</h3>
                  <span className="link">
                    Télécharger <Icon name="download" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--fog">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Fiches techniques</p>
            <SplitWords as="h2" className="h2" text="Caractéristiques par modèle" />
          </div>
          <div className="cards">
            {documentation.sheets.map((s, i) => (
              <a className="card" key={s.href} href={s.href} target="_blank" rel="noopener" data-in="rise" style={{ "--d": `${(i % 3) * 90}ms` } as CSSProperties}>
                <div className="card__media">
                  <Photo src={s.image.src} alt={s.image.alt} sizes="(max-width: 700px) 100vw, 33vw" />
                </div>
                <div className="card__body">
                  <span className="hud muted">Fiche technique · PDF</span>
                  <h3 className="h3">{s.title}</h3>
                  <span className="link">
                    Télécharger <Icon name="download" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap split-2">
          <SplitWords as="p" className="h3" text="Vous souhaitez plus d'informations ou faire un essai ?" />
          <div className="actions" style={{ justifyContent: "flex-end" }}>
            <ButtonLink href="/little-contact/">Contactez-nous</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
