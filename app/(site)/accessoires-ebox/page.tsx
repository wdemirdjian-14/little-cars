import { Photo } from "@/components/Photo";
import { ButtonLink, JsonLd, PageHero, SplitWords } from "@/components/ui";
import { getContent } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/accessoires-ebox/";
export async function generateMetadata() {
  const accessoires = await getContent("accessoires");
  return pageMetadata({ ...accessoires.seo, path: PATH, image: accessoires.hero.image.src });
}

export default async function AccessoiresPage() {
  const accessoires = await getContent("accessoires");
  const crumbs = [
    { name: "Véhicules", path: "/les-utilitaires-electriques-par-usage/" },
    { name: "Accessoires EBOX", path: PATH },
  ];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={accessoires.hero} crumbs={crumbs}>
        <nav className="actions" aria-label="Catégories d'accessoires">
          {accessoires.groups.map((g, i) => (
            <a key={g.title} className="chip" href={`#accessoires-${i}`}>
              {g.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="section section--paper">
        <div className="wrap options">
          {accessoires.groups.map((g, i) => (
            <div className="option-group" key={g.title} id={`accessoires-${i}`} style={{ scrollMarginTop: 90 }}>
              <SplitWords as="h2" className="h2" text={g.title} />
              <div className="option-grid">
                {g.items.map((o) => (
                  <article className="option" key={o.title}>
                    <div className="option__media">
                      {o.image ? <Photo src={o.image} alt={o.title} sizes="(max-width: 700px) 100vw, 25vw" /> : <div className="option__placeholder hud">Photo à venir</div>}
                    </div>
                    <div className="option__body">
                      <h3 style={{ fontFamily: "var(--f-display)", textTransform: "uppercase", fontSize: 22, lineHeight: 1 }}>{o.title}</h3>
                      <p>{o.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap split-2">
          <SplitWords as="p" className="h3" text="Un équipement spécifique pour votre métier ?" />
          <div className="actions" style={{ justifyContent: "flex-end" }}>
            <ButtonLink href="/little-contact/">Parlons-en</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
