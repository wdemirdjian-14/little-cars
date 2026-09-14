"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icons";
import { api, formatDate } from "./api";

type User = { id: number; email: string; nom: string; role: string; actif: number; derniere_connexion_le: string | null };

export function TeamManager({ users, meId, smtp }: { users: User[]; meId: number; smtp: boolean }) {
  const router = useRouter();
  const [link, setLink] = useState<{ email: string; lien: string; envoye: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function invite(email: string, nom: string, role: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await api<{ lien: string; envoye: boolean }>("POST", "/api/admin/equipe/", { email, nom, role });
      setLink({ email, ...res });
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function toggle(u: User) {
    setBusy(true);
    try {
      await api("PATCH", `/api/admin/equipe/${u.id}/`, { actif: !u.actif });
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bo-stack" style={{ gap: 16 }}>
      <section className="bo-card">
        <h2 className="bo-card__title" style={{ marginBottom: 12 }}>
          Inviter une personne
        </h2>
        <form
          className="bo-row"
          style={{ alignItems: "end" }}
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            invite(String(f.get("email")), String(f.get("nom")), String(f.get("role")));
            e.currentTarget.reset();
          }}
        >
          <div className="bo-field" style={{ flex: "1 1 220px" }}>
            <label htmlFor="inv-email">E-mail</label>
            <input id="inv-email" className="bo-input" name="email" type="email" required />
          </div>
          <div className="bo-field" style={{ flex: "1 1 180px" }}>
            <label htmlFor="inv-nom">Nom</label>
            <input id="inv-nom" className="bo-input" name="nom" />
          </div>
          <div className="bo-field" style={{ flex: "0 1 160px" }}>
            <label htmlFor="inv-role">Rôle</label>
            <select id="inv-role" className="bo-select" name="role" defaultValue="editeur">
              <option value="editeur">Éditeur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <button className="bo-btn" type="submit" disabled={busy}>
            <Icon name="send" /> Créer l&apos;invitation
          </button>
        </form>
        {error && (
          <p className="bo-alert bo-alert--error" role="alert" style={{ marginTop: 12 }}>
            {error}
          </p>
        )}
        {link && (
          <div className="bo-alert bo-alert--ok bo-stack" style={{ marginTop: 12, gap: 8 }} role="status">
            <span>
              Lien pour <strong>{link.email}</strong>, valable 72 h{link.envoye ? " (également envoyé par e-mail)" : smtp ? "" : " : transmettez-le vous-même, l'envoi d'e-mails n'est pas configuré"}.
            </span>
            <div className="bo-row">
              <input className="bo-input" readOnly value={link.lien} onFocus={(e) => e.currentTarget.select()} style={{ flex: 1 }} aria-label="Lien d'invitation" />
              <button type="button" className="bo-btn bo-btn--ghost bo-btn--small" onClick={() => navigator.clipboard.writeText(link.lien)}>
                <Icon name="copy" /> Copier
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="bo-card" style={{ padding: 0 }}>
        <div className="bo-scroll">
          <table className="bo-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>E-mail</th>
                <th>Rôle</th>
                <th>Dernière connexion</th>
                <th className="num">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ opacity: u.actif ? 1 : 0.55 }}>
                  <td>
                    {u.nom} {u.id === meId && <span className="bo-chip">vous</span>}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.role === "admin" ? "Administrateur" : "Éditeur"}</td>
                  <td>{formatDate(u.derniere_connexion_le)}</td>
                  <td className="num">
                    <div className="bo-row" style={{ justifyContent: "flex-end", gap: 6 }}>
                      <button type="button" className="bo-btn bo-btn--ghost bo-btn--small" disabled={busy} onClick={() => invite(u.email, u.nom, u.role)}>
                        Lien de réinitialisation
                      </button>
                      {u.id !== meId && (
                        <button type="button" className={`bo-btn bo-btn--small ${u.actif ? "bo-btn--danger" : "bo-btn--ghost"}`} disabled={busy} onClick={() => toggle(u)}>
                          {u.actif ? "Désactiver" : "Réactiver"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
