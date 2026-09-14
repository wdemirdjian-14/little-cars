import Link from "next/link";
import { formatDate } from "@/components/admin/api";
import { Icon } from "@/components/Icons";
import { SOURCE_LABEL, STATUT_LABEL, STATUTS, countByStatut, listMessages, type Statut } from "@/lib/messages";

export const metadata = { title: "Messages" };

type Props = { searchParams: Promise<{ statut?: string; q?: string }> };

export default async function MessagesPage({ searchParams }: Props) {
  const { statut: raw, q = "" } = await searchParams;
  const statut = (STATUTS as readonly string[]).includes(raw ?? "") ? (raw as Statut) : "tous";
  const counts = countByStatut();
  const messages = listMessages({ statut, q, limit: 200 });
  const tabs: { key: Statut | "tous"; label: string; n: number }[] = [
    { key: "tous", label: "À suivre", n: counts.nouveau + counts.en_cours + counts.traite },
    ...STATUTS.map((s) => ({ key: s, label: STATUT_LABEL[s], n: counts[s] })),
  ];
  const href = (s: string) => `/admin/messages/?statut=${s}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <div className="bo-stack" style={{ gap: 20 }}>
      <header className="bo-head">
        <div>
          <h1 className="bo-title">Messages</h1>
          <p className="bo-sub">Demandes reçues par le widget et les formulaires du site.</p>
        </div>
        <form className="bo-row" role="search">
          <input type="hidden" name="statut" value={statut} />
          <label className="sr-only" htmlFor="recherche-messages">
            Rechercher
          </label>
          <input id="recherche-messages" className="bo-input" name="q" defaultValue={q} placeholder="Nom, e-mail, mot du message…" style={{ width: 260 }} />
          <button className="bo-btn bo-btn--ghost" type="submit">
            <Icon name="search" /> Rechercher
          </button>
        </form>
      </header>

      <nav className="bo-segment" aria-label="Filtrer par statut" style={{ flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <Link key={t.key} href={href(t.key)} aria-current={t.key === statut ? "true" : undefined}>
            {t.label} <span>{t.n}</span>
          </Link>
        ))}
      </nav>

      <section className="bo-card" style={{ padding: 0 }}>
        {messages.length === 0 ? (
          <p className="bo-empty">{q ? `Aucun message ne correspond à « ${q} ».` : "Aucun message dans cette catégorie."}</p>
        ) : (
          <ul className="bo-inbox">
            {messages.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/messages/${m.id}/`}>
                  <span className="bo-inbox__dot" data-read={!!m.lu_le} aria-label={m.lu_le ? undefined : "Non lu"} />
                  <span className="bo-inbox__who" data-read={!!m.lu_le}>
                    <strong>{m.nom || m.email || "Sans nom"}</strong>
                    <span className="bo-small bo-muted">{SOURCE_LABEL[m.source] ?? m.source}</span>
                  </span>
                  <span className="bo-inbox__excerpt">
                    {m.sujet ? `${m.sujet} — ` : ""}
                    {m.corps}
                  </span>
                  <span className="bo-inbox__meta">
                    <span>{formatDate(m.cree_le)}</span>
                    <span className="bo-row" style={{ gap: 6 }}>
                      {m.nb_reponses > 0 && (
                        <span className="bo-chip" title="Réponses envoyées">
                          <Icon name="send" /> {m.nb_reponses}
                        </span>
                      )}
                      <span className={`bo-chip bo-chip--${m.statut}`}>{STATUT_LABEL[m.statut]}</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
