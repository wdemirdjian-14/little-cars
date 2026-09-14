import Link from "next/link";
import { Fragment, createElement, type CSSProperties, type ReactNode } from "react";
import { Icon } from "./Icons";
import { Photo } from "./Photo";
import type { Hero } from "@/content/pages";

/** Données structurées schema.org. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Titre dont les mots montent un à un quand il entre à l'écran. */
export function SplitWords({
  text,
  as = "h2",
  className = "",
  id,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  id?: string;
}) {
  const words = text.split(" ");
  return createElement(
    as,
    { className: `split ${className}`, "data-in": "split", id },
    words.map((w, i) => (
      <Fragment key={i}>
        <span className="w">
          <span style={{ "--i": i } as CSSProperties}>{w}</span>
        </span>
        {i < words.length - 1 ? " " : null}
      </Fragment>
    )),
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="hud eyebrow">{children}</p>;
}

export function ButtonLink({ href, children, variant }: { href: string; children: ReactNode; variant?: "light" | "ink" }) {
  const external = href.startsWith("http") || href.endsWith(".pdf");
  const cls = `btn${variant ? ` btn--${variant}` : ""}`;
  const content = (
    <>
      {children}
      <Icon name="arrow" />
    </>
  );
  return external ? (
    <a className={cls} href={href} target={href.endsWith(".pdf") ? "_blank" : undefined} rel="noopener">
      {content}
    </a>
  ) : (
    <Link className={cls} href={href}>
      {content}
    </Link>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="link" href={href}>
      {children}
      <Icon name="arrow" />
    </Link>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="checklist">
      {items.map((it) => (
        <li key={it}>
          <Icon name="check" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function PageHero({ hero, crumbs, short, children }: { hero: Hero; crumbs?: { name: string; path: string }[]; short?: boolean; children?: ReactNode }) {
  return (
    <section className={`page-hero${short ? " page-hero--short" : ""}`}>
      <div className="page-hero__media" data-parallax="0.18">
        <Photo src={hero.image.src} alt={hero.image.alt} priority />
      </div>
      <div className="page-hero__shade" />
      <div className="wrap page-hero__content">
        {crumbs && (
          <nav aria-label="Fil d'Ariane">
            <ol className="breadcrumb hud">
              <li>
                <Link href="/">Accueil</Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.path}>{i === crumbs.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.path}>{c.name}</Link>}</li>
              ))}
            </ol>
          </nav>
        )}
        <p className="hud eyebrow">{hero.eyebrow}</p>
        <h1 className="h1 page-hero__title">{hero.title}</h1>
        {hero.lead && <p className="lead">{hero.lead}</p>}
        {children}
      </div>
    </section>
  );
}

export const euro = (n: number) => new Intl.NumberFormat("fr-FR").format(n).replace(/ /g, " ");
