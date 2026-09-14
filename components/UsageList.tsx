"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Img } from "@/content/types";
import { Icon } from "./Icons";
import { Photo } from "./Photo";

type Usage = { id: string; title: string; image: Img };

/** Grande liste d'usages : l'image du métier suit le pointeur au survol. */
export function UsageList({ items, hrefBase }: { items: Usage[]; hrefBase: string }) {
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const move = (e: React.PointerEvent) => {
    const el = preview.current;
    if (el) el.style.translate = `${e.clientX}px ${e.clientY}px`;
  };

  return (
    <div onPointerMove={move} onPointerLeave={() => setActive(null)}>
      <ul className="usage-list">
        {items.map((u, i) => (
          <li key={u.id} data-in="rise" style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
            <Link href={`${hrefBase}#${u.id}`} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}>
              <span className="usage-list__index hud">{String(i + 1).padStart(2, "0")}</span>
              <span className="usage-list__thumb">
                <Photo src={u.image.src} alt="" sizes="96px" />
              </span>
              <span className="usage-list__title">{u.title}</span>
              <Icon name="arrow-up-right" />
            </Link>
          </li>
        ))}
      </ul>
      <div ref={preview} className="usage-preview frame" data-visible={active !== null} aria-hidden="true">
        {items.map((u, i) => (
          <Photo key={u.id} src={u.image.src} alt="" sizes="420px" data-active={active === i} />
        ))}
      </div>
    </div>
  );
}
