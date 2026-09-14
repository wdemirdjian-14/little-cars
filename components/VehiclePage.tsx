import Link from "next/link";
import type { CSSProperties } from "react";
import { Horizontal } from "./Horizontal";
import { Icon } from "./Icons";
import { LeadForm } from "./LeadForm";
import { Photo } from "./Photo";
import { VehicleCard } from "./VehicleCard";
import { VideoLite } from "./VideoLite";
import { ButtonLink, JsonLd, SplitWords, euro } from "./ui";
import { getContent, getVehicles } from "@/lib/content";
import type { Spec, Vehicle } from "@/content/types";
import { breadcrumbLd, vehicleLd } from "@/lib/seo";

/** Échelle de chaque jauge du tableau de bord (valeur pleine). */
const SCALE: Record<string, number> = {
  "Charge utile": 1200,
  "Traction 4WD": 5000,
  Autonomie: 200,
  "Rayon de braquage": 10,
  Encombrement: 4,
  "Temps de charge": 8,
  "Garde au sol": 50,
  "Angles d'attaque et de fuite": 60,
  Configuration: 9,
  Benne: 2.5,
};

function level(s: Spec) {
  const nums = (s.value.match(/\d[\d\s]*(?:,\d+)?/g) ?? []).map((n) => parseFloat(n.replace(/\s/g, "").replace(",", ".")));
  const v = Math.max(0, ...nums.filter((n) => !Number.isNaN(n)));
  return Math.min(1, Math.max(0.08, v / (SCALE[s.label] ?? (v * 1.25 || 1))));
}

export async function VehiclePage({ v }: { v: Vehicle }) {
  const [vehicleVideos, { company }, vehicles] = await Promise.all([getContent("videos-vehicules"), getContent("site"), getVehicles()]);
  const video = vehicleVideos[v.slug];
  const others = vehicles.filter((o) => o.slug !== v.slug);
  const sheet = v.docs.find((d) => d.kind === "Fiche technique") ?? v.docs.find((d) => d.kind === "Brochure");
  const crumbs = [
    { name: "Véhicules", path: "/les-utilitaires-electriques-par-usage/" },
    { name: v.name, path: `/${v.slug}/` },
  ];

  return (
    <>
      <JsonLd data={vehicleLd(v)} />
      <JsonLd data={breadcrumbLd(crumbs)} />

      <section className="page-hero">
        <div className="page-hero__media" data-parallax="0.18">
          <Photo src={v.slides[0].src} alt={v.slides[0].alt} priority />
        </div>
        <div className="page-hero__shade" />
        <div className="wrap page-hero__content">
          <nav aria-label="Fil d'Ariane">
            <ol className="breadcrumb hud">
              <li>
                <Link href="/">Accueil</Link>
              </li>
              <li>
                <Link href={crumbs[0].path}>{crumbs[0].name}</Link>
              </li>
              <li>
                <span aria-current="page">{v.name}</span>
              </li>
            </ol>
          </nav>
          <p className="hud eyebrow">Utilitaire électrique Little</p>
          <h1 className="h1 page-hero__title">{v.name}</h1>
          <p className="lead">{v.tagline}</p>
          <div className="v-hero__price">
            {v.priceLld ? (
              <>
                <div>
                  <span className="hud muted">En LLD dès</span>
                  <strong>
                    <em>{v.priceLld} €</em> HT/mois
                  </strong>
                </div>
                <div>
                  <span className="hud muted">À l&apos;achat dès</span>
                  <strong>{euro(v.priceBuy!)} € HT</strong>
                </div>
              </>
            ) : (
              <div>
                <span className="hud muted">Tarif</span>
                <strong>Sur demande</strong>
              </div>
            )}
          </div>
          <div className="actions">
            <ButtonLink href="#demande">Demander un essai</ButtonLink>
            {sheet && (
              <a className="link" href={sheet.href} target="_blank" rel="noopener">
                {sheet.kind} (PDF) <Icon name="download" />
              </a>
            )}
          </div>
          {v.priceNote && <p className="hud muted" style={{ letterSpacing: "0.08em", textTransform: "none" }}>{v.priceNote}</p>}
        </div>
      </section>

      {/* Tableau de bord ---------------------------------------------------------- */}
      <section className="section section--tight">
        <div className="wrap stack" style={{ gap: 24 }}>
          <p className="hud eyebrow">Caractéristiques clés</p>
          <dl className="dashboard" data-in="bars" style={{ margin: 0 }}>
            {v.specs.map((s, i) => (
              <div className="gauge" key={s.label} style={{ "--v": level(s), "--i": i } as CSSProperties}>
                <dt className="hud gauge__label">{s.label}</dt>
                <dd className="gauge__value" style={{ margin: 0 }}>
                  {s.value}
                  {s.unit && <small>{s.unit}</small>}
                </dd>
                <span className="gauge__bar" aria-hidden="true">
                  <i />
                </span>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Photos en défilement horizontal --------------------------------------------- */}
      {v.slides.length > 2 && (
        <Horizontal className="range range--gallery" trackClassName="range__track" head={<h2 className="sr-only">{v.name} en images</h2>}>
          {v.slides.map((img, i) => (
            <figure className="hscroll__item" key={img.src} data-hparallax style={{ margin: 0 }}>
              <Photo src={img.src} alt={img.alt} sizes="70vw" loading={i < 2 ? "eager" : "lazy"} />
            </figure>
          ))}
        </Horizontal>
      )}

      {/* Présentation -------------------------------------------------------------------- */}
      <section className="section section--fog">
        <div className="wrap stack" style={{ gap: "clamp(56px, 7vw, 104px)" }}>
          <div className="text-blocks">
            {v.blocks.map((b) => (
              <div className="text-block" key={b.title}>
                <SplitWords as="h2" className="h3" text={b.title} />
                {b.paragraphs.map((p) => (
                  <p key={p} data-in="rise">
                    {p}
                  </p>
                ))}
                {b.list && (
                  <ul className="checklist" data-in="rise">
                    {b.list.map((it) => (
                      <li key={it}>
                        <Icon name="check" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          {video && (
            <div data-in="rise" style={{ maxWidth: 1080 }}>
              <VideoLite video={video} />
            </div>
          )}
        </div>
      </section>

      {/* Options -------------------------------------------------------------------------- */}
      {v.optionGroups.length > 0 && (
        <section className="section section--paper">
          <div className="wrap">
            <div className="section-head section-head--split">
              <div className="stack">
                <p className="hud eyebrow">Configurations & options</p>
                <SplitWords as="h2" className="h2" text="Adaptez votre EBOX à vos besoins" />
              </div>
              <div className="actions">
                <Link className="link" href="/accessoires-ebox/">
                  Tous les accessoires <Icon name="arrow" />
                </Link>
              </div>
            </div>
            <div className="options">
              {v.optionGroups.map((g) => (
                <div className="option-group" key={g.title}>
                  <h3 className="h3">{g.title}</h3>
                  <div className="option-grid">
                    {g.items.map((o) => (
                      <article className="option" key={o.title}>
                        <div className="option__media">
                          {o.image ? <Photo src={o.image} alt={o.title} sizes="(max-width: 700px) 100vw, 25vw" /> : <div className="option__placeholder hud">Photo à venir</div>}
                        </div>
                        <div className="option__body">
                          <h4>{o.title}</h4>
                          <p>{o.text}</p>
                          {o.dims && (
                            <div className="option__dims">
                              {o.dims.map((d) => (
                                <span className="chip" key={d}>
                                  {d}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dimensions ------------------------------------------------------------------------ */}
      <section className={`section ${v.optionGroups.length > 0 ? "section--fog" : "section--paper"}`}>
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Plans cotés</p>
            <SplitWords as="h2" className="h2" text={`Dimensions ${v.name}`} />
          </div>
          <div className="blueprint" data-in="wipe">
            {v.dimensions.map((d) => (
              <figure key={d.src}>
                <Photo src={d.src} alt={d.alt} sizes="(max-width: 700px) 100vw, 50vw" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Documents --------------------------------------------------------------------- */}
      {v.docs.length > 0 && (
        <section className="section section--tight">
          <div className="wrap split-2" style={{ alignItems: "start" }}>
            <div className="stack">
              <p className="hud eyebrow">Documentation</p>
              <SplitWords as="h2" className="h2" text="À télécharger" />
            </div>
            <ul className="downloads">
              {v.docs.map((d) => (
                <li key={d.href}>
                  <a href={d.href} target="_blank" rel="noopener">
                    <span className="hud muted">{d.kind}</span>
                    <span className="downloads__title">{d.label}</span>
                    <Icon name="download" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Galerie --------------------------------------------------------------------------- */}
      <section className="section section--night2">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Sur le terrain</p>
            <SplitWords as="h2" className="h2" text={`${v.name} en images`} />
          </div>
          <div className="gallery">
            {v.gallery.map((g, i) => (
              <figure key={g.src} data-in="wipe" style={{ "--d": `${(i % 3) * 90}ms` } as CSSProperties}>
                <Photo src={g.src} alt={g.alt} sizes="(max-width: 700px) 100vw, 60vw" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Demande ---------------------------------------------------------------------------- */}
      <section className="section" id="demande">
        <div className="wrap form-panel">
          <div className="stack" style={{ gap: 24 }}>
            <p className="hud eyebrow">Essai & devis</p>
            <SplitWords as="h2" className="h2" text={`Essayez l'${v.name.startsWith("EBOX") ? "" : "utilitaire "}${v.name}`} />
            <p className="lead">Un conseiller Little vous rappelle pour préparer un essai et une proposition adaptée à votre activité.</p>
            <p className="hud muted">
              Ou appelez-nous au{" "}
              <a href={`tel:${company.phoneIntl}`} style={{ color: "var(--volt)" }}>
                {company.phone}
              </a>
            </p>
          </div>
          <LeadForm id="devis" context={`/${v.slug}/`} />
        </div>
      </section>

      {/* Autres modèles ---------------------------------------------------------------------- */}
      <Horizontal
        className="range"
        trackClassName="range__track"
        head={
          <div className="wrap range__head">
            <p className="hud eyebrow">Toute la gamme</p>
            <SplitWords as="h2" className="h2" text="Les autres modèles" />
          </div>
        }
      >
        {others.map((o) => (
          <VehicleCard key={o.slug} v={o} />
        ))}
      </Horizontal>
    </>
  );
}
