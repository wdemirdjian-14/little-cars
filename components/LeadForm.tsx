"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { forms, type FormId } from "@/content/forms";
import { Icon } from "./Icons";

/** Formulaire de demande (contact, SAV, devis) envoyé à /api/demande/. */
export function LeadForm({ id, context }: { id: FormId; context?: string }) {
  const def = forms[id];
  const router = useRouter();
  // Heure d'affichage : un envoi en moins de 2,5 s trahit un robot.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/demande/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, formulaire: id, page: context ?? window.location.pathname, duree_ms: Date.now() - startedAt.current }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "L'envoi a échoué.");
      }
      router.push("/merci-pour-votre-demande/");
    } catch (err) {
      setError(
        `${err instanceof Error ? err.message : "L'envoi a échoué."} Réessayez, ou appelez-nous au 02 38 31 82 58.`,
      );
      setSending(false);
    }
  }

  return (
    <form className="form" onSubmit={submit} noValidate={false}>
      {def.fields.map((f) => {
        const fid = `${id}-${f.name}`;
        return (
          <div key={f.name} className={`field${f.half ? " field--half" : ""}`}>
            <label className="hud" htmlFor={fid}>
              {f.label} {f.required && <b aria-hidden="true">*</b>}
            </label>
            {f.type === "select" ? (
              <select id={fid} name={f.name} required={f.required} defaultValue="">
                <option value="" disabled>
                  Choisir…
                </option>
                {f.options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea id={fid} name={f.name} required={f.required} maxLength={4000} />
            ) : (
              <input id={fid} name={f.name} type={f.type} required={f.required} autoComplete={f.autoComplete} maxLength={200} />
            )}
          </div>
        );
      })}

      {/* Piège à robots : invisible pour un humain, rempli par les robots. */}
      <div className="form__trap" aria-hidden="true">
        <label htmlFor={`${id}-site`}>Ne pas remplir</label>
        <input id={`${id}-site`} name="site_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p className="form__error" role="alert">
          {error}
        </p>
      )}

      <div className="form__foot">
        <p className="form__legal">
          Les champs marqués * sont obligatoires. Vos données servent uniquement à traiter votre demande :{" "}
          <Link href="/politique-de-confidentialite/">politique de confidentialité</Link>.
        </p>
        <button className="btn" type="submit" disabled={sending}>
          {sending ? "Envoi en cours…" : def.submitLabel}
          <Icon name="arrow" />
        </button>
      </div>
    </form>
  );
}
