"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/content/brand";
import { nav } from "@/content/site";
import { Icon } from "./Icons";
import { Photo } from "./Photo";

export function Header({ phone, phoneIntl }: { phone: string; phoneIntl: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  // Ferme le menu mobile à chaque navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
  }, [open]);

  // Jauge de charge : suit la progression dans la page.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      document.documentElement.style.setProperty("--scroll", p.toFixed(4));
      if (pct.current) pct.current.textContent = `${Math.round(p * 100)} %`;
      const el = header.current;
      if (el) {
        el.dataset.solid = String(y > 40);
        el.dataset.hidden = String(y > 480 && y > lastY + 2);
        if (y < lastY - 2 || y < 480) el.dataset.hidden = "false";
      }
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const isCurrent = (href: string, children?: { href: string }[]) =>
    pathname === href || !!children?.some((c) => c.href === pathname);

  return (
    <>
      <header ref={header} className="site-header" data-solid="false" data-hidden="false">
        <div className="wrap site-header__inner">
          <Link href="/" className="brand" aria-label="Little, retour à l'accueil">
            <Photo src={brand.logoLight.src} alt="" sizes="160px" priority />
          </Link>

          <nav className="nav" aria-label="Navigation principale">
            {nav.map((item) => (
              <div className="nav__item" key={item.label}>
                <Link className="nav__link" href={item.href} aria-current={isCurrent(item.href, item.children) ? "page" : undefined}>
                  {item.label}
                  {item.children && <Icon name="chevron" />}
                </Link>
                {item.children && (
                  <div className="nav__panel">
                    {item.children.map((c) => (
                      <Link key={c.href + c.label} href={c.href}>
                        {c.label}
                        <Icon name="arrow" width={14} height={14} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="header-tools">
            <span className="charge" title="Progression dans la page">
              <span className="charge__cell">
                <span className="charge__fill" />
              </span>
              <span className="charge__pct" ref={pct}>
                0 %
              </span>
            </span>
            <Link className="btn" href="/little-contact/">
              Demander un essai
            </Link>
          </div>

          <button className="burger" type="button" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? "close" : "menu"} />
            <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          </button>
        </div>
      </header>

      <div id="menu-mobile" className="mobile-menu" data-open={open} aria-hidden={!open}>
        <ul className="mobile-menu__top">
          {nav.map((item) => (
            <li key={item.label}>
              <Link href={item.href} tabIndex={open ? 0 : -1}>
                {item.label}
              </Link>
              {item.children && (
                <ul className="mobile-menu__sub">
                  {item.children.map((c) => (
                    <li key={c.href + c.label}>
                      <Link href={c.href} tabIndex={open ? 0 : -1}>
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li>
            <Link href="/little-contact/" tabIndex={open ? 0 : -1}>
              Contact
            </Link>
          </li>
        </ul>
        <a className="btn" href={`tel:${phoneIntl}`} tabIndex={open ? 0 : -1}>
          <Icon name="phone" /> {phone}
        </a>
      </div>
    </>
  );
}
