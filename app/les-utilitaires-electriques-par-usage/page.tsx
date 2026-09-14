import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { ButtonLink, JsonLd, PageHero, SplitWords, euro } from "@/components/ui";
import { usages, type RangeItem } from "@/content/pages";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/les-utilitaires-electriques-par-usage/";
export const metadata = pageMetadata({ ...usages.seo, path: PATH, image: usages.hero.image.src });

function ItemCard({ item, i }: { item: RangeItem; i: number }) {
  return (
    <Link href={item.href} className="vcard" data-in="rise" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
      <div className="vcard__media">
        <Photo src={item.image.src} alt={item.image.alt} sizes="(max-width: 700px) 100vw, 33vw" />
      </div>
      <div className="vcard__body">
        <span className="hud vcard__cat">{item.subtitle}</span>
        <h3 className="vcard__title">{item.title}</h3>
        <p className="vcard__tagline">{item.note}</p>
        <dl className="vcard__specs">
          <div className="vcard__spec">
            <dt>Vitesse</dt>
            <dd>{item.speed}</dd>
          </div>
          <div className="vcard__spec">
            <dt>Charge</dt>
            <dd>{item.payload}</dd>
          </div>
          <div className="vcard__spec">
            <dt>Autonomie</dt>
            <dd>{item.range}</dd>
          </div>
        </dl>
        <div className="vcard__foot">
          <span className="vcard__price">
            {item.priceLld ? (
              <>
                Dès <b>{item.priceLld} €</b> HT/mois*
                <br />
                ou {euro(item.priceBuy!)} € HT*
              </>
            ) : (
              "Tarif sur demande"
            )}
          </span>
          <span className="vcard__go" aria-hidden="true">
            <Icon name="arrow" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function UsagesPage() {
  const crumbs = [{ name: "Véhicules par usage", path: PATH }];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={usages.hero} crumbs={crumbs}>
        <nav className="actions" aria-label="Aller à un usage">
          {usages.groups.map((g) => (
            <a key={g.id} className="chip" href={`#${g.id}`}>
              {g.title}
            </a>
          ))}
        </nav>
      </PageHero>

      {usages.groups.map((g, gi) => (
        <section key={g.id} id={g.id} className={`section ${gi % 2 ? "section--night2" : ""}`} style={{ scrollMarginTop: 80 }}>
          <div className="wrap">
            <div className="section-head section-head--split">
              <div className="stack">
                <p className="hud eyebrow">Usage {String(gi + 1).padStart(2, "0")}</p>
                <SplitWords as="h2" className="h2" text={g.title} />
              </div>
              <p className="lead">Tous les modèles existent en 2 et 4 roues motrices et se personnalisent selon votre activité.</p>
            </div>
            <div className="cards">
              {g.items.map((item, i) => (
                <ItemCard key={item.title} item={item} i={i} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section section--tight section--fog">
        <div className="wrap split-2">
          <p style={{ color: "var(--ink-3)", fontSize: 14 }}>{usages.footnote}</p>
          <div className="actions" style={{ justifyContent: "flex-end" }}>
            <ButtonLink href="/les-5-atouts-de-la-gamme-ebox/" variant="ink">
              Présentation de la gamme EBOX
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
