import { Icon } from "@/components/Icons";
import { ButtonLink, JsonLd, PageHero, SplitWords } from "@/components/ui";
import { faq } from "@/content/pages";
import { breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo";

const PATH = "/faq/";
export const metadata = pageMetadata({ ...faq.seo, path: PATH, image: faq.hero.image.src });

export default function FaqPage() {
  const crumbs = [{ name: "FAQ", path: PATH }];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(faq.groups.flatMap((g) => g.items))} />
      <PageHero hero={faq.hero} crumbs={crumbs} short />

      <section className="section section--paper">
        <div className="wrap stack" style={{ gap: "clamp(56px, 7vw, 96px)" }}>
          {faq.groups.map((g) => (
            <div className="split-2" key={g.title} style={{ alignItems: "start" }}>
              <SplitWords as="h2" className="h2" text={g.title} />
              <div className="faq">
                {g.items.map((it) => (
                  <details key={it.q}>
                    <summary>
                      <span>{it.q}</span>
                      <Icon name="plus" />
                    </summary>
                    <p>{it.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap split-2">
          <SplitWords as="p" className="h3" text="Vous ne trouvez pas la réponse à votre question ?" />
          <div className="actions" style={{ justifyContent: "flex-end" }}>
            <ButtonLink href="/little-contact/">Contactez-nous</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
