import type { CSSProperties } from "react";
import { Photo } from "@/components/Photo";
import { ButtonLink, JsonLd, PageHero, SplitWords } from "@/components/ui";
import { reborn } from "@/content/pages";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/programme-reborn/";
export const metadata = pageMetadata({ ...reborn.seo, path: PATH, image: reborn.hero.image.src });

export default function RebornPage() {
  const crumbs = [
    { name: "SAV & services", path: "/services-apres-vente-et-services-little/" },
    { name: "Programme REBORN", path: PATH },
  ];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={reborn.hero} crumbs={crumbs} />

      <section className="section">
        <div className="wrap split-2">
          <div className="stack" style={{ gap: 28 }}>
            <p className="hud eyebrow">Économie circulaire</p>
            <SplitWords as="h2" className="h2" text="Donnez à votre EBOX une seconde vie, et même une troisième" />
            {reborn.intro.map((p) => (
              <p className="lead" key={p} data-in="rise">
                {p}
              </p>
            ))}
          </div>
          <div className="media frame" data-in="wipe" style={{ aspectRatio: "4 / 3" }}>
            <Photo src={reborn.image.src} alt={reborn.image.alt} sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="section section--night2">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Le programme</p>
            <SplitWords as="h2" className="h2" text="Quatre chantiers, un véhicule transformé" />
          </div>
          <ol className="steps">
            {reborn.steps.map((s, i) => (
              <li key={s.title} data-in="rise" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <h3 className="h3">{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--fog">
        <div className="wrap split-2">
          <SplitWords as="p" className="h2" text={reborn.warranty} />
          <div className="actions" style={{ justifyContent: "flex-end" }}>
            <ButtonLink href="/little-contact/" variant="ink">
              Demander un devis REBORN
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
