import { LeadForm } from "@/components/LeadForm";
import { Photo } from "@/components/Photo";
import { JsonLd, PageHero, TextLink } from "@/components/ui";
import { forms } from "@/content/forms";
import { savRequest } from "@/content/pages";
import { company } from "@/content/site";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/faire-une-demande-de-sav/";
export const metadata = pageMetadata({ ...savRequest.seo, path: PATH, image: savRequest.hero.image.src });

export default function SavPage() {
  const crumbs = [
    { name: "SAV & services", path: "/services-apres-vente-et-services-little/" },
    { name: "Demande de SAV", path: PATH },
  ];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={savRequest.hero} crumbs={crumbs} short />

      <section className="section">
        <div className="wrap form-panel">
          <div className="stack" style={{ gap: 28 }}>
            <div className="media frame" style={{ aspectRatio: "4 / 3" }}>
              <Photo src={savRequest.image.src} alt={savRequest.image.alt} sizes="(max-width: 960px) 100vw, 40vw" />
            </div>
            <p className="lead">{forms.sav.intro}</p>
            <div className="actions">
              <TextLink href="/faq/">Consulter la FAQ</TextLink>
              <a className="link" href={`tel:${company.phoneIntl}`}>
                {company.phone}
              </a>
            </div>
          </div>
          <div className="stack" style={{ gap: 24 }}>
            <h2 className="h2">{forms.sav.title}</h2>
            <LeadForm id="sav" />
          </div>
        </div>
      </section>
    </>
  );
}
