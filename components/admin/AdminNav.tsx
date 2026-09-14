"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { brand } from "@/content/brand";
import { api } from "./api";

const LINKS: { href: string; label: string; icon: IconName; admin?: boolean }[] = [
  { href: "/admin/", label: "Tableau de bord", icon: "chart" },
  { href: "/admin/messages/", label: "Messages", icon: "mail" },
  { href: "/admin/contenus/", label: "Contenus", icon: "edit" },
  { href: "/admin/medias/", label: "Médias", icon: "image" },
  { href: "/admin/equipe/", label: "Équipe", icon: "users", admin: true },
];

export function AdminNav({ nom, role, nouveaux }: { nom: string; role: string; nouveaux: number }) {
  const pathname = usePathname();
  const router = useRouter();

  const current = (href: string) => (href === "/admin/" ? pathname === href : pathname.startsWith(href));

  async function logout() {
    await api("DELETE", "/api/admin/session/").catch(() => {});
    router.replace("/admin/connexion/");
    router.refresh();
  }

  return (
    <aside className="bo-side">
      <Link href="/admin/" className="bo-side__brand">
        <Photo src={brand.logoLight.src} alt="Little" sizes="120px" />
        <span>Back-office</span>
      </Link>
      <nav className="bo-nav" aria-label="Back-office">
        {LINKS.filter((l) => !l.admin || role === "admin").map((l) => (
          <Link key={l.href} href={l.href} aria-current={current(l.href) ? "page" : undefined}>
            <Icon name={l.icon} />
            {l.label}
            {l.href === "/admin/messages/" && nouveaux > 0 && (
              <span className="bo-nav__count" aria-label={`${nouveaux} nouveaux`}>
                {nouveaux}
              </span>
            )}
          </Link>
        ))}
      </nav>
      <div className="bo-side__foot">
        <strong>{nom}</strong>
        <Link href="/admin/compte/">Mon compte</Link>
        <a href="/" target="_blank" rel="noopener">
          Voir le site ↗
        </a>
        <button type="button" onClick={logout}>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
