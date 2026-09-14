import { Icon } from "@/components/Icons";
import { LeadForm } from "@/components/LeadForm";
import { JsonLd, PageHero } from "@/components/ui";
import { forms } from "@/content/forms";
import { getContent } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const PATH = "/little-contact/";
export async function generateMetadata() {
  const contact = await getContent("contact");
  return pageMetadata({ ...contact.seo, path: PATH, image: contact.hero.image.src });
}

export default async function ContactPage() {
  const [contact, { company }] = await Promise.all([getContent("contact"), getContent("site")]);
  const crumbs = [{ name: "Contact", path: PATH }];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero hero={contact.hero} crumbs={crumbs} short />

      <section className="section">
        <div className="wrap form-panel">
          <div className="stack" style={{ gap: 36 }}>
            <div className="stack">
              <p className="hud eyebrow">Contact et horaires</p>
              <p className="lead">{forms.contact.intro}</p>
            </div>
            <ul className="contact-list">
              <li>
                <Icon name="phone" />
                <a href={`tel:${company.phoneIntl}`} className="h3">
                  {company.phone}
                </a>
              </li>
              <li>
                <Icon name="mail" />
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
              <li>
                <Icon name="pin" />
                <address style={{ fontStyle: "normal" }}>
                  {company.address.street}
                  <br />
                  {company.address.postalCode} {company.address.city}
                </address>
              </li>
              <li>
                <Icon name="clock" />
                <span>
                  {company.hours.label}
                  <br />
                  {company.hours.slots.join(" / ")}
                </span>
              </li>
            </ul>
            <p className="muted" style={{ fontSize: 14 }}>
              Little est une marque de la {company.legalForm} {company.legalName} au capital de {company.capital}, SIRET {company.siret}.
            </p>
          </div>
          <div className="stack" style={{ gap: 24 }}>
            <h2 className="h2">{forms.contact.title}</h2>
            <LeadForm id="contact" />
          </div>
        </div>
      </section>
    </>
  );
}
