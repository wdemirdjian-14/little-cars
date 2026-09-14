import type { CSSProperties } from "react";
import { LeadForm } from "./LeadForm";
import { Photo } from "./Photo";
import { VideoLite } from "./VideoLite";
import { ButtonLink, Checklist, SplitWords } from "./ui";
import { getContent } from "@/lib/content";

/** Landing page de campagne Google Ads : hors index, tout converge vers le formulaire. */
export async function LandingPage({ slug, h1 }: { slug: string; h1: string }) {
  const [home, landingContent, testimonials, { company, keyFigures }] = await Promise.all([
    getContent("accueil"),
    getContent("landing-contenu"),
    getContent("temoignages"),
    getContent("site"),
  ]);
  return (
    <>
      <section className="page-hero">
        <div className="page-hero__media" data-parallax="0.18">
          <Photo src={home.scenes[0].image.src} alt={home.scenes[0].image.alt} priority />
        </div>
        <div className="page-hero__shade" />
        <div className="wrap page-hero__content">
          <p className="hud eyebrow">Constructeur français · Gien (45)</p>
          <h1 className="h1 page-hero__title">{h1}</h1>
          <p className="lead">{landingContent.lead}</p>
          <div className="actions">
            <ButtonLink href="#demande">Être rappelé</ButtonLink>
            <a className="link" href={`tel:${company.phoneIntl}`}>
              {company.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split-2" style={{ alignItems: "start" }}>
          <div className="stack" style={{ gap: 28 }}>
            <p className="hud eyebrow">EBOX 2 & 4 roues motrices</p>
            <SplitWords as="h2" className="h2" text="La plus vaste gamme professionnelle, jusqu'à 9 places homologuées route" />
          </div>
          <div className="stack" style={{ gap: 28 }} data-in="rise">
            <Checklist items={landingContent.points} />
          </div>
        </div>
        <div className="wrap" style={{ marginTop: "clamp(56px, 7vw, 104px)" }}>
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

      <section className="section section--night2">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Chez nos clients</p>
            <SplitWords as="h2" className="h2" text="Nos clients témoignent" />
          </div>
          <div className="videos">
            {testimonials.slice(0, 2).map((v) => (
              <VideoLite key={v.id} video={v} />
            ))}
          </div>
          <div className="gallery" style={{ marginTop: "clamp(40px, 5vw, 72px)" }}>
            {landingContent.gallery.map((g, i) => (
              <figure key={g.src} data-in="wipe" style={{ "--d": `${(i % 3) * 90}ms` } as CSSProperties}>
                <Photo src={g.src} alt={g.alt} sizes="(max-width: 700px) 100vw, 50vw" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--fog">
        <div className="wrap split-2">
          <div className="stack" style={{ gap: 28 }}>
            <p className="hud eyebrow">Achat ou LLD Full Service</p>
            <SplitWords as="h2" className="h2" text="Tous les modèles sont entièrement personnalisables" />
          </div>
          <div data-in="rise">
            <Checklist items={landingContent.benefits} />
          </div>
        </div>
      </section>

      <section className="section" id="demande">
        <div className="wrap form-panel">
          <div className="stack" style={{ gap: 24 }}>
            <p className="hud eyebrow">Contactez-nous</p>
            <SplitWords as="h2" className="h2" text="Il y a toujours un EBOX adapté à vos besoins" />
            <p className="lead">Dites-nous en plus sur votre activité : un conseiller vous rappelle rapidement.</p>
          </div>
          <LeadForm id="devis" context={`/${slug}/`} />
        </div>
      </section>
    </>
  );
}
