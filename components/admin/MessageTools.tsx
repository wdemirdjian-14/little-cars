"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icons";
import { api } from "./api";

const STATUTS = [
  { value: "nouveau", label: "Nouveau" },
  { value: "en_cours", label: "En cours" },
  { value: "traite", label: "Traité" },
  { value: "archive", label: "Archivé" },
];

export function MessageSide({ id, statut, note }: { id: number; statut: string; note: string }) {
  const router = useRouter();
  const [value, setValue] = useState(statut);
  const [text, setText] = useState(note);
  const [info, setInfo] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(patch: { statut?: string; note?: string }, done: string) {
    setBusy(true);
    try {
      await api("PATCH", `/api/admin/messages/${id}/`, patch);
      setInfo({ ok: true, text: done });
      router.refresh();
    } catch (err) {
      setInfo({ ok: false, text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bo-card bo-stack" style={{ gap: 12 }}>
      <div className="bo-field">
        <label htmlFor="msg-statut">Statut</label>
        <select
          id="msg-statut"
          className="bo-select"
          value={value}
          disabled={busy}
          onChange={(e) => {
            setValue(e.target.value);
            save({ statut: e.target.value }, "Statut mis à jour.");
          }}
        >
          {STATUTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="bo-field">
        <label htmlFor="msg-note">Note interne</label>
        <textarea id="msg-note" className="bo-textarea" value={text} onChange={(e) => setText(e.target.value)} maxLength={5000} placeholder="Visible uniquement par l'équipe : rappel prévu, devis envoyé…" />
      </div>
      <div className="bo-row" style={{ justifyContent: "space-between" }}>
        <button className="bo-btn bo-btn--ghost bo-btn--small" type="button" disabled={busy || text === note} onClick={() => save({ note: text }, "Note enregistrée.")}>
          Enregistrer la note
        </button>
      </div>
      {info && (
        <p className={`bo-alert ${info.ok ? "bo-alert--ok" : "bo-alert--error"}`} role="status">
          {info.text}
        </p>
      )}
    </section>
  );
}

export function ReplyComposer({ id, email, sujet, corps, smtp }: { id: number; email: string; sujet: string; corps: string; smtp: boolean }) {
  const router = useRouter();
  const [subject, setSubject] = useState(sujet);
  const [body, setBody] = useState(corps);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<{ tone: "ok" | "warn" | "error"; text: string } | null>(null);

  async function send() {
    setBusy(true);
    setInfo(null);
    try {
      const res = await api<{ envoyee: boolean; erreur: string | null }>("POST", `/api/admin/messages/${id}/reponses/`, { sujet: subject, corps: body });
      setInfo(
        res.envoyee
          ? { tone: "ok", text: `Réponse envoyée à ${email}.` }
          : { tone: "warn", text: `Réponse enregistrée mais non envoyée : ${res.erreur}. Utilisez « Ouvrir dans ma messagerie » en attendant.` },
      );
      if (res.envoyee) setBody(corps);
      router.refresh();
    } catch (err) {
      setInfo({ tone: "error", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <section className="bo-card bo-stack" style={{ gap: 12 }}>
      <div className="bo-card__head" style={{ marginBottom: 0 }}>
        <h2 className="bo-card__title">Répondre à {email}</h2>
      </div>
      {!smtp && (
        <p className="bo-alert bo-alert--warn">
          L&apos;envoi d&apos;e-mails n&apos;est pas encore configuré sur le serveur : la réponse sera enregistrée ici, à envoyer depuis votre messagerie.
        </p>
      )}
      <div className="bo-field">
        <label htmlFor="rep-sujet">Objet</label>
        <input id="rep-sujet" className="bo-input" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} />
      </div>
      <div className="bo-field">
        <label htmlFor="rep-corps">Message</label>
        <textarea id="rep-corps" className="bo-textarea" rows={10} value={body} onChange={(e) => setBody(e.target.value)} maxLength={20000} />
      </div>
      {info && (
        <p className={`bo-alert bo-alert--${info.tone}`} role="status">
          {info.text}
        </p>
      )}
      <div className="bo-row" style={{ justifyContent: "space-between" }}>
        <a className="bo-btn bo-btn--ghost" href={mailto}>
          Ouvrir dans ma messagerie
        </a>
        <button className="bo-btn" type="button" onClick={send} disabled={busy || !body.trim() || !subject.trim()}>
          <Icon name="send" /> {busy ? "Envoi…" : smtp ? "Envoyer la réponse" : "Enregistrer la réponse"}
        </button>
      </div>
    </section>
  );
}
