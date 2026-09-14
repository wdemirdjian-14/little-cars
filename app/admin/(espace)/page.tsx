import Link from "next/link";
import type { CSSProperties } from "react";
import { formatDate } from "@/components/admin/api";
import { TrafficChart } from "@/components/admin/TrafficChart";
import * as A from "@/lib/analytics";
import { SOURCE_LABEL, messagesBySource, recentUnhandled } from "@/lib/messages";

export const metadata = { title: "Tableau de bord" };

const PERIODES = [7, 30, 90];
const nf = new Intl.NumberFormat("fr-FR");
const pct = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 1 });
const shortDay = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });

type Props = { searchParams: Promise<{ periode?: string }> };

function Delta({ now, before, days, points }: { now: number; before: number; days: number; points?: boolean }) {
  if (!before && !now) return <span className="bo-kpi__delta">Aucune donnée</span>;
  if (!before) return <span className="bo-kpi__delta">Pas de comparaison possible</span>;
  const diff = points ? (now - before) * 100 : ((now - before) / before) * 100;
  const trend = diff > 0.05 ? "up" : diff < -0.05 ? "down" : "flat";
  const value = points ? `${diff > 0 ? "+" : ""}${diff.toFixed(1).replace(".", ",")} pt` : `${diff > 0 ? "+" : ""}${Math.round(diff)} %`;
  return (
    <span className="bo-kpi__delta" data-trend={trend}>
      <b>{value}</b> vs les {days} jours précédents
    </span>
  );
}

function Bars({ items, empty, format = (l: string) => l }: { items: { label: string; n: number }[]; empty: string; format?: (l: string) => string }) {
  if (!items.length) return <p className="bo-empty">{empty}</p>;
  const max = Math.max(...items.map((i) => i.n));
  return (
    <ul className="bo-bars">
      {items.map((i) => (
        <li key={i.label}>
          <div className="bo-bars__top">
            <span title={i.label}>{format(i.label)}</span>
            <b>{nf.format(i.n)}</b>
          </div>
          <div className="bo-bars__track">
            <div className="bo-bars__fill" style={{ width: `${(i.n / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const DEVICE_COLOR: Record<string, string> = { ordinateur: "var(--series-1)", mobile: "var(--series-2)", tablette: "var(--series-3)" };
const pageLabel = (p: string) => (p === "/" ? "Accueil" : p.replace(/^\/|\/$/g, "").replace(/-/g, " "));

export default async function DashboardPage({ searchParams }: Props) {
  const { periode } = await searchParams;
  const days = PERIODES.includes(Number(periode)) ? Number(periode) : 30;
  const { current, previous } = A.periodOf(days);

  const now = A.audienceTotals(current);
  const before = A.audienceTotals(previous);
  const series = A.dailySeries(current);
  const pages = A.topPages(current, 8);
  const sources = A.topSources(current, 8);
  const devices = A.devices(current);
  const deviceTotal = devices.reduce((s, d) => s + d.n, 0);
  const events = A.eventCounts(current);
  const downloads = A.topDownloads(current);
  const bySource = messagesBySource(current.from, current.to);
  const conversions = A.conversionPages(current);
  const todo = recentUnhandled(5);
  const live = A.liveVisitors();

  return (
    <div className="bo-stack" style={{ gap: 20 }}>
      <header className="bo-head">
        <div>
          <h1 className="bo-title">Tableau de bord</h1>
          <p className="bo-sub">
            Du {shortDay.format(new Date(`${current.from}T00:00:00Z`))} au {shortDay.format(new Date(`${current.to}T00:00:00Z`))} · mesure sans cookie
          </p>
        </div>
        <div className="bo-row" style={{ gap: 16 }}>
          <span className="bo-live">
            <i aria-hidden="true" /> {nf.format(live)} visiteur{live > 1 ? "s" : ""} en ce moment
          </span>
          <nav className="bo-segment" aria-label="Période">
            {PERIODES.map((p) => (
              <Link key={p} href={`/admin/?periode=${p}`} aria-current={p === days ? "true" : undefined}>
                {p} jours
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="bo-kpis" aria-label="Indicateurs clés">
        <div className="bo-card bo-kpi">
          <span className="bo-kpi__label">Visiteurs</span>
          <span className="bo-kpi__value">{nf.format(now.visiteurs)}</span>
          <Delta now={now.visiteurs} before={before.visiteurs} days={days} />
        </div>
        <div className="bo-card bo-kpi">
          <span className="bo-kpi__label">Pages vues</span>
          <span className="bo-kpi__value">{nf.format(now.vues)}</span>
          <Delta now={now.vues} before={before.vues} days={days} />
        </div>
        <div className="bo-card bo-kpi">
          <span className="bo-kpi__label">Demandes reçues</span>
          <span className="bo-kpi__value">{nf.format(now.demandes)}</span>
          <Delta now={now.demandes} before={before.demandes} days={days} />
        </div>
        <div className="bo-card bo-kpi">
          <span className="bo-kpi__label">Taux de conversion</span>
          <span className="bo-kpi__value">{pct.format(now.conversion)}</span>
          <Delta now={now.conversion} before={before.conversion} days={days} points />
        </div>
      </section>

      <section className="bo-card">
        <div className="bo-card__head">
          <h2 className="bo-card__title">Fréquentation par jour</h2>
          <div className="bo-legend">
            <span style={{ "--c": "var(--series-1)" } as CSSProperties}>
              <i /> Visiteurs
            </span>
            <span style={{ "--c": "var(--series-2)" } as CSSProperties}>
              <i /> Pages vues
            </span>
          </div>
        </div>
        {now.vues === 0 ? (
          <p className="bo-empty">Aucune visite enregistrée sur la période. Les statistiques apparaissent dès les premières visites du site.</p>
        ) : (
          <TrafficChart data={series} />
        )}
        <details className="bo-details">
          <summary>Voir les données en tableau</summary>
          <div className="bo-scroll">
            <table className="bo-table" style={{ marginTop: 10 }}>
              <thead>
                <tr>
                  <th>Jour</th>
                  <th className="num">Visiteurs</th>
                  <th className="num">Pages vues</th>
                </tr>
              </thead>
              <tbody>
                {[...series].reverse().map((d) => (
                  <tr key={d.jour}>
                    <td>{shortDay.format(new Date(`${d.jour}T00:00:00Z`))}</td>
                    <td className="num">{nf.format(d.visiteurs)}</td>
                    <td className="num">{nf.format(d.vues)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      <div className="bo-grid bo-grid--2">
        <section className="bo-card">
          <div className="bo-card__head">
            <h2 className="bo-card__title">Pages les plus consultées</h2>
            <span className="bo-card__hint">visiteurs</span>
          </div>
          <Bars items={pages} empty="Pas encore de données." format={pageLabel} />
        </section>
        <section className="bo-card">
          <div className="bo-card__head">
            <h2 className="bo-card__title">D&apos;où viennent les visiteurs</h2>
            <span className="bo-card__hint">première page de la visite</span>
          </div>
          <Bars items={sources} empty="Pas encore de données." />
        </section>
      </div>

      <div className="bo-grid bo-grid--3">
        <section className="bo-card">
          <div className="bo-card__head">
            <h2 className="bo-card__title">Appareils</h2>
          </div>
          {deviceTotal === 0 ? (
            <p className="bo-empty">Pas encore de données.</p>
          ) : (
            <>
              <div className="bo-split" role="img" aria-label={devices.map((d) => `${d.label} ${pct.format(d.n / deviceTotal)}`).join(", ")}>
                {devices.map((d) => (
                  <span key={d.label} title={`${d.label} : ${nf.format(d.n)}`} style={{ flex: d.n, "--c": DEVICE_COLOR[d.label] ?? "var(--bo-muted)" } as CSSProperties} />
                ))}
              </div>
              <ul className="bo-bars" style={{ gap: 6 }}>
                {devices.map((d) => (
                  <li key={d.label} className="bo-bars__top" style={{ display: "flex" }}>
                    <span className="bo-legend">
                      <span style={{ "--c": DEVICE_COLOR[d.label] ?? "var(--bo-muted)" } as CSSProperties}>
                        <i className="rect" /> {d.label.charAt(0).toUpperCase() + d.label.slice(1)}
                      </span>
                    </span>
                    <span>
                      <b>{pct.format(d.n / deviceTotal)}</b> <span className="bo-muted">({nf.format(d.n)})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="bo-card">
          <div className="bo-card__head">
            <h2 className="bo-card__title">Actions des visiteurs</h2>
          </div>
          <table className="bo-table">
            <tbody>
              {(
                [
                  ["Demandes envoyées", events.demande],
                  ["Clics sur le téléphone", events.appel],
                  ["Clics sur l'e-mail", events.email],
                  ["PDF téléchargés", events.pdf],
                  ["Vidéos lancées", events.video],
                  ["Ouvertures du widget", events.widget_ouvert],
                ] as const
              ).map(([label, n]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td className="num">
                    <b>{nf.format(n)}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="bo-card">
          <div className="bo-card__head">
            <h2 className="bo-card__title">Demandes par formulaire</h2>
          </div>
          <Bars items={bySource} empty="Aucune demande sur la période." format={(l) => SOURCE_LABEL[l] ?? l} />
          {conversions.length > 0 && (
            <>
              <p className="bo-label" style={{ margin: "18px 0 8px" }}>
                Pages d&apos;envoi
              </p>
              <Bars items={conversions} empty="" format={pageLabel} />
            </>
          )}
        </section>
      </div>

      <div className="bo-grid bo-grid--2">
        <section className="bo-card">
          <div className="bo-card__head">
            <h2 className="bo-card__title">Documents téléchargés</h2>
          </div>
          <Bars items={downloads} empty="Aucun téléchargement sur la période." />
        </section>
        <section className="bo-card">
          <div className="bo-card__head">
            <h2 className="bo-card__title">Messages à traiter</h2>
            <Link href="/admin/messages/" className="bo-small">
              Tous les messages
            </Link>
          </div>
          {todo.length === 0 ? (
            <p className="bo-empty">Rien en attente. Bravo.</p>
          ) : (
            <ul className="bo-inbox">
              {todo.map((m) => (
                <li key={m.id}>
                  <Link href={`/admin/messages/${m.id}/`}>
                    <span className="bo-inbox__dot" data-read={!!m.lu_le} aria-hidden="true" />
                    <span className="bo-inbox__who" data-read={!!m.lu_le}>
                      <strong>{m.nom || "Sans nom"}</strong>
                      <span className="bo-small bo-muted">{SOURCE_LABEL[m.source] ?? m.source}</span>
                    </span>
                    <span className="bo-inbox__excerpt">{m.sujet || m.corps}</span>
                    <span className="bo-inbox__meta">{formatDate(m.cree_le)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="bo-small bo-muted">
        Méthode : pas de cookie ni d&apos;adresse IP enregistrée. « Visiteurs » additionne les visiteurs uniques de chaque jour ; les robots et les membres connectés au
        back-office ne sont pas comptés.
      </p>
    </div>
  );
}
