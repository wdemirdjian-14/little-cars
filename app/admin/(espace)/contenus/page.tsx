import Link from "next/link";
import { formatDate } from "@/components/admin/api";
import { listDocuments } from "@/lib/content";

export const metadata = { title: "Contenus" };

export default function ContenusPage() {
  const docs = listDocuments();
  const groupes = [...new Set(docs.map((d) => d.groupe))];

  return (
    <div className="bo-stack" style={{ gap: 20 }}>
      <header className="bo-head">
        <div>
          <h1 className="bo-title">Contenus</h1>
          <p className="bo-sub">Textes, photos et référencement de chaque page. Les modifications sont en ligne dès l&apos;enregistrement.</p>
        </div>
      </header>

      {groupes.map((g) => (
        <section key={g} className="bo-stack" style={{ gap: 8 }}>
          <h2 className="bo-label">{g}</h2>
          <ul className="bo-docs">
            {docs
              .filter((d) => d.groupe === g)
              .map((d) => (
                <li key={d.cle}>
                  <Link href={`/admin/contenus/${d.cle}/`}>
                    <strong>{d.label}</strong>
                    <span className="bo-small bo-muted" style={{ textAlign: "right" }}>
                      {d.modifie_le ? `Modifié le ${formatDate(d.modifie_le)}${d.modifie_par ? ` par ${d.modifie_par}` : ""}` : "Contenu d'origine"}
                    </span>
                    <span className="bo-small bo-muted">{d.aide ?? d.chemin}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
