"use client";

import { useEffect, useRef, useState } from "react";

type Point = { jour: string; visiteurs: number; vues: number };

const SERIES = [
  { key: "visiteurs", label: "Visiteurs", color: "var(--series-1)" },
  { key: "vues", label: "Pages vues", color: "var(--series-2)" },
] as const;

const nf = new Intl.NumberFormat("fr-FR");
const shortDay = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
const longDay = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const asDate = (jour: string) => new Date(`${jour}T00:00:00Z`);

/** Borne supérieure « ronde » de l'axe : 4, 10, 20, 25, 50, 100… */
function niceMax(v: number) {
  if (v <= 4) return 4;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}

/**
 * Fréquentation quotidienne : deux courbes sur un seul axe (même unité),
 * ligne de repère qui suit le pointeur, infobulle avec toutes les séries.
 * Le tableau équivalent est rendu par la page, sous le graphique.
 */
export function TrafficChart({ data }: { data: Point[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(300, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = 250;
  const M = { t: 12, r: 12, b: 28, l: 44 };
  const iw = width - M.l - M.r;
  const ih = H - M.t - M.b;
  const last = data.length - 1;
  const max = niceMax(Math.max(1, ...data.map((d) => Math.max(d.vues, d.visiteurs))));
  const x = (i: number) => M.l + (last <= 0 ? iw / 2 : (i * iw) / last);
  const y = (v: number) => M.t + ih - (v / max) * ih;
  const path = (key: "visiteurs" | "vues") => data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join("");
  const area = `${path("visiteurs")}L${x(last).toFixed(1)},${y(0)}L${x(0).toFixed(1)},${y(0)}Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const every = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(iw / 80))));

  const pick = (clientX: number) => {
    const rect = box.current?.getBoundingClientRect();
    if (!rect || last < 0) return null;
    const rel = clientX - rect.left - M.l;
    return Math.min(last, Math.max(0, Math.round(last <= 0 ? 0 : (rel / iw) * last)));
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setActive((a) => Math.min(last, Math.max(0, (a ?? last) + (e.key === "ArrowRight" ? 1 : -1))));
  };

  const point = active !== null ? data[active] : null;
  const tipLeft = active !== null ? Math.min(width - 180, Math.max(0, x(active) + 12)) : 0;

  return (
    <div
      ref={box}
      className="bo-chart"
      onPointerMove={(e) => setActive(pick(e.clientX))}
      onPointerLeave={() => setActive(null)}
    >
      <svg
        width={width}
        height={H}
        role="img"
        aria-label="Visiteurs et pages vues par jour. Flèches gauche et droite pour parcourir les jours."
        tabIndex={0}
        onKeyDown={onKey}
        onFocus={() => setActive(last)}
        onBlur={() => setActive(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={M.l} x2={width - M.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--axis)" : "var(--grid)"} strokeWidth={1} />
            <text x={M.l - 8} y={y(t) + 4} textAnchor="end">
              {nf.format(Math.round(t))}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          (i % every === 0 && last - i >= every / 2) || i === last ? (
            <text key={d.jour} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"}>
              {shortDay.format(asDate(d.jour))}
            </text>
          ) : null,
        )}

        <path d={area} fill="var(--series-1)" opacity={0.1} />
        {[...SERIES].reverse().map((s) => (
          <path key={s.key} d={path(s.key)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {last >= 0 &&
          SERIES.map((s) => <circle key={s.key} cx={x(last)} cy={y(data[last][s.key])} r={4} fill={s.color} stroke="#ffffff" strokeWidth={2} />)}

        {point && active !== null && (
          <g>
            <line x1={x(active)} x2={x(active)} y1={M.t} y2={M.t + ih} stroke="var(--bo-line-2)" strokeWidth={1} />
            {SERIES.map((s) => (
              <circle key={s.key} cx={x(active)} cy={y(point[s.key])} r={4.5} fill={s.color} stroke="#ffffff" strokeWidth={2} />
            ))}
          </g>
        )}
      </svg>

      {point && (
        <div className="bo-chart__tip" style={{ left: tipLeft, top: 8 }} role="status">
          <p className="bo-small bo-muted">{longDay.format(asDate(point.jour))}</p>
          {SERIES.map((s) => (
            <p className="row" key={s.key} style={{ "--c": s.color } as React.CSSProperties}>
              <i />
              <b>{nf.format(point[s.key])}</b>
              <span className="bo-muted">{s.label.toLowerCase()}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
