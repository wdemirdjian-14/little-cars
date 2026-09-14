import Link from "next/link";
import type { CSSProperties } from "react";
import { Photo } from "@/components/Photo";
import { Checklist, JsonLd, PageHero, SplitWords, TextLink } from "@/components/ui";
import { atouts } from "@/content/pages";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/les-5-atouts-de-la-gamme-ebox/";
export const metadata = pageMetadata({ ...atouts.seo, path: PATH, image: atouts.hero.image.src });

export default function AtoutsPage() {
  const crumbs = [{ name: "Les 5 atouts EBOX", path: PATH }];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={atouts.hero} crumbs={crumbs} />

      {atouts.items.map((item, i) => (
        <section key={item.title} className={`section ${i % 2 ? "section--fog" : ""}`}>
          <div className="wrap split-2" style={{ alignItems: "start" }}>
            <div className="stack" style={{ gap: 28, order: i % 2 ? 2 : 1 }}>
              <p className="hud eyebrow">Atout {i + 1} sur 5</p>
              <SplitWords as="h2" className="h2" text={item.title} />
              {item.paragraphs.map((p) => (
                <p className="lead" key={p} data-in="rise">
                  {p}
                </p>
              ))}
              {item.list && (
                <div data-in="rise">
                  <Checklist items={item.list} />
                </div>
              )}
            </div>
            <div className="media frame" data-in="wipe" style={{ aspectRatio: "4 / 3", order: i % 2 ? 1 : 2 }}>
              <div data-parallax="0.12" style={{ height: "100%" }}>
                <Photo src={item.image.src} alt={item.image.alt} sizes="(max-width: 860px) 100vw, 50vw" style={{ transform: "scale(1.12)" }} />
              </div>
            </div>
          </div>
          {item.sectors && (
            <div className="wrap" style={{ marginTop: "clamp(48px, 6vw, 88px)" }}>
              <div className="pillars" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" }}>
                {item.sectors.map((s, si) => (
                  <article className="pillar" key={s.title} data-in="rise" style={{ "--d": `${(si % 4) * 80}ms` } as CSSProperties}>
                    <h3 className="h3">{s.title}</h3>
                    <p>{s.text}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}

      <section className="section section--night2">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Nos engagements</p>
            <SplitWords as="h2" className="h2" text="Made in France, homologué, réparable" />
          </div>
          <div className="pillars">
            {atouts.commitments.map((c, i) => (
              <article className="pillar" key={c.title} data-in="rise" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <h3 className="h3">{c.title}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
          <div className="actions" style={{ marginTop: 40 }}>
            <TextLink href="/little/">Découvrir Little</TextLink>
            <TextLink href="/programme-reborn/">Le programme REBORN</TextLink>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Technologie</p>
            <SplitWords as="h2" className="h2" text="Le meilleur de la technologie pour des performances inégalées" />
          </div>
          <div className="cards">
            {atouts.tech.map((t, i) => (
              <article className="card" key={t.title} data-in="rise" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <div className="card__media">
                  <Photo src={t.image.src} alt={t.image.alt} sizes="(max-width: 700px) 100vw, 33vw" />
                </div>
                <div className="card__body">
                  <h3 className="h3">{t.title}</h3>
                  <p>{t.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Configurations</p>
            <SplitWords as="h2" className="h2" text="Choisissez votre modèle" />
          </div>
          <div className="option-grid">
            {atouts.models.map((m) => (
              <Link className="option" href={m.href} key={m.title} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="option__media" style={{ aspectRatio: "16 / 10" }}>
                  <Photo src={m.image.src} alt={m.image.alt} sizes="(max-width: 700px) 100vw, 33vw" style={{ objectFit: "contain", mixBlendMode: "multiply" }} />
                </div>
                <div className="option__body">
                  <h3 style={{ fontFamily: "var(--f-display)", textTransform: "uppercase", fontSize: 22, lineHeight: 1 }}>{m.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
