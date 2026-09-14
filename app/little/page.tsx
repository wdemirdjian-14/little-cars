import type { CSSProperties } from "react";
import { Photo } from "@/components/Photo";
import { VideoLite } from "@/components/VideoLite";
import { ButtonLink, Checklist, JsonLd, PageHero, SplitWords } from "@/components/ui";
import { little } from "@/content/pages";
import { keyFigures } from "@/content/site";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/little/";
export const metadata = pageMetadata({ ...little.seo, path: PATH, image: little.hero.image.src });

export default function LittlePage() {
  const crumbs = [{ name: "Little", path: PATH }];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={little.hero} crumbs={crumbs} />

      <section className="section">
        <div className="wrap split-2" style={{ alignItems: "start" }}>
          <div className="stack" style={{ gap: 28 }}>
            <p className="hud eyebrow">Depuis 2000</p>
            <SplitWords as="h2" className="h2" text={little.knowHow.title} />
          </div>
          <div className="stack" data-in="rise">
            {little.knowHow.paragraphs.map((p) => (
              <p className="lead" key={p}>
                {p}
              </p>
            ))}
            <div className="actions">
              <ButtonLink href="/les-utilitaires-electriques-par-usage/">Toute la gamme</ButtonLink>
            </div>
          </div>
        </div>
        <div className="wrap" style={{ marginTop: "clamp(56px, 7vw, 104px)" }}>
          <div className="figures" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {keyFigures.company.map((f) => (
              <div className="figure" key={f.label}>
                <span className="figure__value">
                  <em data-count={f.value}>{f.value}</em>
                  {f.suffix}
                </span>
                <span className="hud muted">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--night2">
        <div className="wrap videos">
          {little.videos.map((v) => (
            <div key={v.id} data-in="rise">
              <VideoLite video={v} />
            </div>
          ))}
        </div>
      </section>

      <section className="section section--fog">
        <div className="wrap split-2">
          <div className="stack" style={{ gap: 28 }}>
            <p className="hud eyebrow">Recherche & développement</p>
            <SplitWords as="h2" className="h2" text={little.innovation.title} />
            <p className="lead">{little.innovation.lead}</p>
            <div data-in="rise">
              <Checklist items={little.innovation.list} />
            </div>
            {little.innovation.paragraphs.map((p) => (
              <p key={p} style={{ color: "var(--ink-2)" }}>
                {p}
              </p>
            ))}
          </div>
          <div className="stack" style={{ gap: 28 }}>
            <div className="media frame" data-in="wipe" style={{ aspectRatio: "4 / 3" }}>
              <Photo src={little.tests.image.src} alt={little.tests.image.alt} sizes="(max-width: 860px) 100vw, 50vw" />
            </div>
            <h3 className="h3">{little.tests.title}</h3>
            <p className="lead">{little.tests.lead}</p>
            <p style={{ color: "var(--ink-2)" }}>{little.tests.text}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Ce qui nous anime</p>
            <SplitWords as="h2" className="h2" text="Les valeurs de Little" />
          </div>
          <div className="pillars" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))" }}>
            {little.values.map((val, i) => (
              <article className="pillar" key={val.title} data-in="rise" style={{ "--d": `${(i % 3) * 90}ms` } as CSSProperties}>
                <h3 className="h3">{val.title}</h3>
                <p>{val.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="wrap stack" style={{ gap: "clamp(64px, 8vw, 120px)" }}>
          <div>
            <div className="section-head">
              <p className="hud eyebrow">Notre équipe</p>
              <SplitWords as="h2" className="h2" text="Les ingénieurs derrière chaque EBOX" />
            </div>
            <div className="team">
              {little.team.map((m, i) => (
                <article className="member" key={m.name} data-in="rise" style={{ "--d": `${i * 100}ms` } as CSSProperties}>
                  <div className="media">
                    <Photo src={m.image.src} alt={m.image.alt} sizes="(max-width: 700px) 100vw, 33vw" />
                  </div>
                  <h3 className="h3">{m.name}</h3>
                  <p className="hud" style={{ color: "var(--volt-ink)" }}>
                    {m.role}
                  </p>
                  <p>{m.bio}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="split-2" style={{ alignItems: "start" }}>
            <div className="stack" style={{ gap: 24 }}>
              <p className="hud eyebrow">Partenaires</p>
              <SplitWords as="h2" className="h2" text={little.partners.title} />
              <p className="lead">{little.partners.text}</p>
            </div>
            <div className="logos">
              {little.partners.logos.map((l) => (
                <div key={l.src}>
                  <Photo src={l.src} alt={l.alt} sizes="160px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Histoire</p>
            <SplitWords as="h2" className="h2" text="Little en quelques dates" />
          </div>
          <ol className="timeline">
            {[...little.timeline].reverse().map((t) => (
              <li key={t.date} data-in="rise">
                <time className="hud">{t.date}</time>
                <div>
                  <h3 className="h3">{t.title}</h3>
                  <p>{t.text}</p>
                </div>
                <div className="media">
                  <Photo src={t.image.src} alt={t.image.alt} sizes="(max-width: 900px) 100vw, 320px" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
