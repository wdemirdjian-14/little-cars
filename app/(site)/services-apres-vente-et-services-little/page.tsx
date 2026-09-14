import Link from "next/link";
import type { CSSProperties } from "react";
import { Photo } from "@/components/Photo";
import { ButtonLink, JsonLd, PageHero, SplitWords, TextLink } from "@/components/ui";
import { getContent } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/services-apres-vente-et-services-little/";
export async function generateMetadata() {
  const services = await getContent("services");
  return pageMetadata({ ...services.seo, path: PATH, image: services.hero.image.src });
}

export default async function ServicesPage() {
  const services = await getContent("services");
  const crumbs = [{ name: "SAV & services", path: PATH }];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={services.hero} crumbs={crumbs}>
        <div className="actions">
          <ButtonLink href="/faire-une-demande-de-sav/">Faire une demande de SAV</ButtonLink>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Le constructeur assure son SAV</p>
            <SplitWords as="h2" className="h2" text="Nous ne construisons pas des véhicules pour les jeter dans 5 ans" />
          </div>
          <div className="pillars">
            {services.pillars.map((p, i) => (
              <article className="pillar" key={p.title} data-in="rise" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <h3 className="h3">{p.title}</h3>
                <p>{p.text}</p>
                {p.href && <TextLink href={p.href}>{p.cta}</TextLink>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--fog">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Entretien, pièces & accessoires</p>
            <SplitWords as="h2" className="h2" text="Un véhicule toujours opérationnel" />
          </div>
          <div className="cards">
            {services.offers.map((o, i) => (
              <Link className="card" key={o.title} href={o.href!} data-in="rise" style={{ "--d": `${i * 80}ms` } as CSSProperties}>
                <div className="card__media">
                  <Photo src={o.image!.src} alt={o.image!.alt} sizes="(max-width: 700px) 100vw, 25vw" />
                </div>
                <div className="card__body">
                  <h3 className="h3">{o.title}</h3>
                  <p>{o.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="hud eyebrow">Témoignages</p>
            <SplitWords as="h2" className="h2" text="Nos clients partagent leur expérience" />
          </div>
          <div className="cards">
            {services.quotes.map((q, i) => (
              <figure className="quote" key={q.author} data-in="rise" style={{ margin: 0, "--d": `${i * 90}ms` } as CSSProperties}>
                <blockquote>{q.text}</blockquote>
                <figcaption className="hud muted">
                  {q.author} — {q.place}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight section--night2">
        <div className="wrap split-2">
          <SplitWords as="p" className="h3" text={services.lldTeaser} />
          <div className="actions" style={{ justifyContent: "flex-end" }}>
            <ButtonLink href="/location-longue-duree-little/">Découvrir nos offres LLD</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
