import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
import { Photo } from "@/components/Photo";
import { Checklist, JsonLd, SplitWords, euro } from "@/components/ui";
import { getContent } from "@/lib/content";
import { mediaUrl } from "@/lib/media";
import { absolute, breadcrumbLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

async function find(slug: string) {
  const occasions = await getContent("occasions");
  return occasions.items.find((o) => o.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const o = await find(slug);
  if (!o) return {};
  return pageMetadata({
    title: o.title,
    description: `${o.title} d'occasion, ${o.year}, ${euro(o.km)} km, ${euro(o.priceHt)} € HT. ${o.description.join(", ")}.`,
    path: `/vehicules-occasions/${slug}/`,
    image: o.images[0].src,
  });
}

export default async function UsedVehiclePage({ params }: Props) {
  const { slug } = await params;
  const o = await find(slug);
  if (!o) notFound();
  const path = `/vehicules-occasions/${slug}/`;
  const crumbs = [
    { name: "Occasion", path: "/nos-vehicules-doccasion/" },
    { name: o.title, path },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: o.title,
          brand: { "@type": "Brand", name: o.brand },
          description: o.description.join(". "),
          image: o.images.map((i) => absolute(mediaUrl(i.src, 1600))),
          offers: {
            "@type": "Offer",
            price: o.priceHt,
            priceCurrency: "EUR",
            itemCondition: "https://schema.org/UsedCondition",
            availability: "https://schema.org/InStock",
            url: absolute(path),
          },
        }}
      />

      <section className="section section--paper" style={{ paddingTop: "calc(var(--header-h) + clamp(40px, 6vw, 88px))" }}>
        <div className="wrap stack" style={{ gap: 32 }}>
          <nav aria-label="Fil d'Ariane">
            <ol className="breadcrumb hud" style={{ color: "var(--ink-3)" }}>
              <li>
                <Link href="/">Accueil</Link>
              </li>
              <li>
                <Link href="/nos-vehicules-doccasion/">Occasion</Link>
              </li>
              <li>
                <span aria-current="page">{o.title}</span>
              </li>
            </ol>
          </nav>
          <div className="split-2" style={{ alignItems: "start" }}>
            <div className="stack" style={{ gap: 16 }}>
              <div className="media frame" style={{ aspectRatio: "4 / 3" }}>
                <Photo src={o.images[0].src} alt={o.images[0].alt} sizes="(max-width: 860px) 100vw, 50vw" priority />
              </div>
              {o.images.length > 1 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
                  {o.images.slice(1).map((img) => (
                    <div className="media" key={img.src} style={{ aspectRatio: "1" }}>
                      <Photo src={img.src} alt={img.alt} sizes="16vw" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="stack" style={{ gap: 26 }}>
              <p className="hud eyebrow">Véhicule d&apos;occasion</p>
              <h1 className="h1" style={{ fontSize: "clamp(40px, 5vw, 80px)" }}>
                {o.title}
              </h1>
              <p className="h3" style={{ color: "var(--volt-ink)" }}>
                {euro(o.priceHt)} € HT <span style={{ color: "var(--ink-3)", fontSize: "0.6em" }}>/ {euro(Math.round(o.priceHt * 1.2))} € TTC</span>
              </p>
              <dl className="specs-table">
                <dt>Marque</dt>
                <dd>{o.brand}</dd>
                <dt>Modèle</dt>
                <dd>{o.model}</dd>
                <dt>Année</dt>
                <dd>{o.year}</dd>
                <dt>État</dt>
                <dd>{o.condition}</dd>
                <dt>Énergie</dt>
                <dd>{o.energy}</dd>
                <dt>Kilométrage</dt>
                <dd>{euro(o.km)} km</dd>
                {o.available && (
                  <>
                    <dt>Disponibilité</dt>
                    <dd>{o.available}</dd>
                  </>
                )}
              </dl>
              <Checklist items={o.description} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap form-panel">
          <div className="stack" style={{ gap: 24 }}>
            <p className="hud eyebrow">Ce véhicule vous intéresse ?</p>
            <SplitWords as="h2" className="h2" text="Réservez un essai" />
          </div>
          <LeadForm id="contact" context={path} />
        </div>
      </section>
    </>
  );
}
