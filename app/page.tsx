import type { CSSProperties } from "react";
import { HeroScroll } from "@/components/HeroScroll";
import { Horizontal } from "@/components/Horizontal";
import { Icon, type IconName } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { UsageList } from "@/components/UsageList";
import { VehicleCard } from "@/components/VehicleCard";
import { VideoLite } from "@/components/VideoLite";
import { ButtonLink, Checklist, SplitWords, TextLink } from "@/components/ui";
import { home, testimonials } from "@/content/pages";
import { keyFigures } from "@/content/site";
import { vehicles } from "@/content/vehicles";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({ ...home.seo, path: "/", image: home.scenes[0].image.src }),
  title: { absolute: `${home.seo.title} - Little Cars` },
};

const ATOUT_ICONS: Record<string, IconName> = { silence: "silence", force: "force", metier: "target", agile: "agile", duree: "shield" };

export default function HomePage() {
  const half = Math.ceil(home.drift.length / 2);

  return (
    <>
      <HeroScroll h1={home.h1} scenes={home.scenes} />

      {/* Gamme EBOX ------------------------------------------------------------- */}
      <section className="section">
        <div className="wrap split-2" style={{ alignItems: "start" }}>
          <div className="stack" style={{ gap: 28 }}>
            <p className="hud eyebrow">{home.intro.eyebrow}</p>
            <SplitWords as="h2" className="h2" text={home.intro.title} />
            <div className="stack" data-in="rise">
              {home.intro.paragraphs.map((p) => (
                <p className="lead" key={p}>
                  {p}
                </p>
              ))}
            </div>
            <div className="actions" data-in="rise">
              <ButtonLink href="/les-utilitaires-electriques-par-usage/">Découvrir la gamme</ButtonLink>
              <TextLink href="/les-5-atouts-de-la-gamme-ebox/">Les 5 atouts EBOX</TextLink>
            </div>
          </div>
          <div className="media frame" data-in="wipe" style={{ aspectRatio: "4 / 5" }}>
            <div data-parallax="0.2" style={{ height: "100%" }}>
              <Photo src={home.intro.image.src} alt={home.intro.image.alt} sizes="(max-width: 860px) 100vw, 45vw" style={{ transform: "scale(1.15)" }} />
            </div>
          </div>
        </div>
        <div className="wrap" style={{ marginTop: "clamp(64px, 8vw, 120px)" }}>
          <p className="hud muted" style={{ marginBottom: 18 }}>
            Il y aura toujours un EBOX adapté à votre besoin
          </p>
          <div className="figures">
            {keyFigures.range.map((f) => (
              <div className="figure" key={f.label}>
                <span className="figure__value">
                  <em data-count={f.value}>{f.value}</em>
                </span>
                <span className="hud muted">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamme horizontale -------------------------------------------------------- */}
      <Horizontal
        className="range"
        trackClassName="range__track"
        head={
          <div className="wrap range__head section-head section-head--split" style={{ marginBottom: 0 }}>
            <div className="stack">
              <p className="hud eyebrow">06 modèles · 2 & 4 roues motrices</p>
              <SplitWords as="h2" className="h2" text="Une gamme, tous les terrains" />
            </div>
            <p className="lead">Du compact 2 places au BEGO tout-terrain, en passant par l&apos;EBOX qui roule sur les rails : choisissez votre outil.</p>
          </div>
        }
      >
        {vehicles.map((v) => (
          <VehicleCard key={v.slug} v={v} />
        ))}
      </Horizontal>

      {/* Usages ------------------------------------------------------------------ */}
      <section className="section section--fog">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div className="stack">
              <p className="hud eyebrow">Tous les modèles en 2, 3, 6 et 9 places</p>
              <SplitWords as="h2" className="h2" text="Des utilitaires 100 % électriques adaptés à chaque besoin" />
            </div>
            <p className="lead">Agriculture, élevage, haras, chasse, domaines viticoles, industrie, collectivités : trouvez la configuration qui correspond à votre métier.</p>
          </div>
          <UsageList items={home.usages} hrefBase="/les-utilitaires-electriques-par-usage/" />
        </div>
      </section>

      {/* Photos en dérive ---------------------------------------------------------- */}
      <section className="drift" aria-label="Little sur le terrain">
        <div className="drift__row" data-drift="1">
          {home.drift.slice(0, half).map((img) => (
            <div className="drift__item" key={img.src}>
              <Photo src={img.src} alt={img.alt} sizes="32vw" />
            </div>
          ))}
        </div>
        <div className="drift__row" data-drift="-1">
          {home.drift.slice(half).map((img) => (
            <div className="drift__item" key={img.src}>
              <Photo src={img.src} alt={img.alt} sizes="32vw" />
            </div>
          ))}
        </div>
      </section>

      {/* 5 atouts ------------------------------------------------------------------ */}
      <section className="section section--paper">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div className="stack">
              <p className="hud eyebrow">Made in France</p>
              <SplitWords as="h2" className="h2" text="Les 5 atouts de la gamme EBOX" />
            </div>
            <div className="actions">
              <TextLink href="/les-5-atouts-de-la-gamme-ebox/">Découvrir les 5 atouts</TextLink>
            </div>
          </div>
          <div className="atouts">
            {home.atouts.map((a, i) => (
              <article className="atout" key={a.key} data-in="rise" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <Icon name={ATOUT_ICONS[a.key]} strokeWidth={1.2} />
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages ---------------------------------------------------------------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div className="stack">
              <p className="hud eyebrow">Ils roulent en Little</p>
              <SplitWords as="h2" className="h2" text="Nos clients témoignent" />
            </div>
            <p className="lead">Haras, pépinières, écuries, chantiers souterrains : ils racontent leur EBOX au quotidien.</p>
          </div>
          <div className="videos">
            {testimonials.map((v, i) => (
              <div key={v.id} data-in="rise" style={{ "--d": `${(i % 2) * 120}ms` } as CSSProperties}>
                <VideoLite video={v} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location longue durée ------------------------------------------------------------ */}
      <section className="lld-band">
        <div className="lld-band__media">
          <div data-parallax="0.15" style={{ position: "absolute", inset: 0 }}>
            <Photo src={home.lld.image.src} alt={home.lld.image.alt} sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
        </div>
        <div className="lld-band__body">
          <p className="hud eyebrow">{home.lld.eyebrow}</p>
          <SplitWords as="h2" className="h2" text={home.lld.title} />
          <p className="lead">{home.lld.text}</p>
          <div className="lld-band__price">
            <div>
              <span className="hud muted">À partir de</span>
              <strong>
                <span data-count={keyFigures.lld.from}>{keyFigures.lld.from}</span> €
              </strong>
              <span className="hud muted">HT / mois</span>
            </div>
            <div>
              <span className="hud muted">Durée</span>
              <strong>
                {keyFigures.lld.minMonths}–{keyFigures.lld.maxMonths}
              </strong>
              <span className="hud muted">mois</span>
            </div>
          </div>
          <Checklist items={home.lld.list} />
          <div className="actions">
            <ButtonLink href="/location-longue-duree-little/">Découvrir l&apos;offre LLD</ButtonLink>
          </div>
        </div>
      </section>

      {/* SAV ---------------------------------------------------------------------- */}
      <section className="section section--night2">
        <div className="wrap split-2">
          <div className="media frame" data-in="wipe" style={{ aspectRatio: "3 / 2" }}>
            <Photo src={home.sav.image.src} alt={home.sav.image.alt} sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
          <div className="stack" style={{ gap: 28 }}>
            <p className="hud eyebrow">{home.sav.eyebrow}</p>
            <SplitWords as="h2" className="h2" text={home.sav.title} />
            <p className="lead">{home.sav.text}</p>
            <div className="actions">
              <ButtonLink href="/services-apres-vente-et-services-little/">Découvrir nos services</ButtonLink>
              <TextLink href="/faire-une-demande-de-sav/">Faire une demande de SAV</TextLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
