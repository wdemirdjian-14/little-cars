import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSide, ReplyComposer } from "@/components/admin/MessageTools";
import { formatDate } from "@/components/admin/api";
import { forms, type FormId } from "@/content/forms";
import { requireUser } from "@/lib/auth";
import { mailConfigured } from "@/lib/mailer";
import { SOURCE_LABEL, STATUT_LABEL, getMessage, markRead } from "@/lib/messages";

export const metadata = { title: "Message" };

type Props = { params: Promise<{ id: string }> };

export default async function MessagePage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const found = getMessage(Number(id));
  if (!found) notFound();
  markRead(found.message.id);
  const { message: m, reponses, champs } = found;
  const def = forms[m.source as FormId];
  const labelOf = (name: string) => def?.fields.find((f) => f.name === name)?.label ?? name;
  const prenom = champs.prenom || m.nom.split(" ")[0] || "";

  return (
    <div className="bo-stack" style={{ gap: 20 }}>
      <header className="bo-head">
        <div>
          <Link href="/admin/messages/" className="bo-crumb">
            ← Messages
          </Link>
          <h1 className="bo-title" style={{ fontSize: 28 }}>
            {m.sujet || "Message"}
          </h1>
          <p className="bo-sub">
            {SOURCE_LABEL[m.source] ?? m.source} · reçu le {formatDate(m.cree_le)} · <span className={`bo-chip bo-chip--${m.statut}`}>{STATUT_LABEL[m.statut]}</span>
          </p>
        </div>
      </header>

      <div className="bo-grid" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 340px)", alignItems: "start" }}>
        <div className="bo-stack">
          <div className="bo-thread">
            <article className="bo-bubble">
              <div className="bo-bubble__meta">
                <strong>{m.nom || m.email}</strong>
                <span>{formatDate(m.cree_le)}</span>
              </div>
              {m.corps || <span className="bo-muted">(message vide)</span>}
            </article>
            {reponses.map((r) => (
              <article className="bo-bubble bo-bubble--reply" key={r.id}>
                <div className="bo-bubble__meta">
                  <strong>
                    {r.auteur ?? "Équipe Little"} · {r.sujet}
                  </strong>
                  <span>
                    {formatDate(r.cree_le)} · {r.envoyee ? "envoyée" : <span style={{ color: "var(--bo-danger)" }}>non envoyée{r.erreur ? ` : ${r.erreur}` : ""}</span>}
                  </span>
                </div>
                {r.corps}
              </article>
            ))}
          </div>

          {m.email ? (
            <ReplyComposer
              id={m.id}
              email={m.email}
              sujet={`Re : ${m.sujet || "votre demande"}`}
              corps={`Bonjour ${prenom},\n\n\n\nBien cordialement,\n${user.nom}\nLittle — 02 38 31 82 58`}
              smtp={mailConfigured()}
            />
          ) : (
            <p className="bo-alert bo-alert--warn">Ce message n&apos;a pas d&apos;adresse e-mail : rappelez la personne.</p>
          )}
        </div>

        <aside className="bo-stack">
          <section className="bo-card">
            <h2 className="bo-card__title" style={{ marginBottom: 12 }}>
              Contact
            </h2>
            <dl className="bo-dl">
              <dt>Nom</dt>
              <dd>{m.nom || "—"}</dd>
              <dt>E-mail</dt>
              <dd>{m.email ? <a href={`mailto:${m.email}`}>{m.email}</a> : "—"}</dd>
              <dt>Téléphone</dt>
              <dd>{m.telephone ? <a href={`tel:${m.telephone.replace(/\s/g, "")}`}>{m.telephone}</a> : "—"}</dd>
              <dt>Page</dt>
              <dd>
                {m.page ? (
                  <a href={m.page} target="_blank" rel="noopener">
                    {m.page}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </dl>
          </section>

          {Object.entries(champs).some(([k, v]) => v && !["prenom", "nom", "email", "telephone", "message"].includes(k)) && (
            <section className="bo-card">
              <h2 className="bo-card__title" style={{ marginBottom: 12 }}>
                Détails du formulaire
              </h2>
              <dl className="bo-dl">
                {Object.entries(champs)
                  .filter(([k, v]) => v && !["prenom", "nom", "email", "telephone", "message"].includes(k))
                  .map(([k, v]) => (
                    <div key={k} style={{ display: "contents" }}>
                      <dt>{labelOf(k)}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
              </dl>
            </section>
          )}

          <MessageSide id={m.id} statut={m.statut} note={m.note} />
        </aside>
      </div>
    </div>
  );
}
