import Link from "next/link";
import { brand } from "@/content/brand";
import { footerColumns, legalLinks, type Company } from "@/content/site";
import { Icon } from "./Icons";
import { Photo } from "./Photo";

export function Footer({ company }: { company: Company }) {
  return (
    <footer className="site-footer">
      <div className="tricolor" />
      <div className="wrap footer-cta">
        <p className="hud eyebrow">Un projet, un essai, un devis</p>
        <Link href="/little-contact/" className="footer-cta__title h-mega">
          <span>Parlons</span>
          <span>de votre terrain</span>
        </Link>
        <div className="footer-cta__meta">
          <a href={`tel:${company.phoneIntl}`}>{company.phone}</a>
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <span className="hud muted">{company.coordinates} — Gien, Loiret</span>
        </div>
      </div>

      <div className="wrap footer-grid">
        <div className="footer-id">
          <Photo src={brand.logoLight.src} alt="Little" sizes="180px" />
          <address style={{ fontStyle: "normal" }}>
            {company.address.street}
            <br />
            {company.address.postalCode} {company.address.city}
          </address>
          <p>
            {company.hours.label}
            <br />
            {company.hours.slots.join(" · ")}
          </p>
          <div className="socials">
            <a href={company.socials.facebook} target="_blank" rel="noopener" aria-label="Little sur Facebook">
              <Icon name="facebook" />
            </a>
            <a href={company.socials.instagram} target="_blank" rel="noopener" aria-label="Little sur Instagram">
              <Icon name="instagram" />
            </a>
            <a href={company.socials.youtube} target="_blank" rel="noopener" aria-label="Little sur YouTube">
              <Icon name="youtube" />
            </a>
          </div>
        </div>
        {footerColumns.map((col) => (
          <div className="footer-col" key={col.title}>
            <h2 className="hud">{col.title}</h2>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} Little — une marque de {company.legalName}. Conçu et fabriqué en France.
        </span>
        <nav aria-label="Informations légales">
          {legalLinks.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
