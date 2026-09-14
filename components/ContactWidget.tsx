"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { forms } from "@/content/forms";
import { Icon } from "./Icons";
import { track } from "./Tracker";

/**
 * Widget de contact présent sur toutes les pages publiques. Les messages
 * arrivent dans la boîte de réception du back-office (source « widget »).
 */
export function ContactWidget() {
  const def = forms.widget;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const openedAt = useRef(0);
  const panel = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);

  // Changement de page : on referme.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    openedAt.current = Date.now();
    panel.current?.querySelector<HTMLElement>("input, textarea")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      launcher.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/demande/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(new FormData(form).entries()),
          formulaire: "widget",
          page: pathname,
          duree_ms: Date.now() - openedAt.current,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "L'envoi a échoué.");
      form.reset();
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "L'envoi a échoué.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        ref={launcher}
        type="button"
        className="cw-launch"
        aria-expanded={open}
        aria-controls="widget-contact"
        onClick={() => {
          if (!open) track("widget_ouvert", pathname);
          setOpen(!open);
          if (sent) setSent(false);
        }}
      >
        <span className="cw-launch__dot" aria-hidden="true" />
        <span className="cw-launch__label">{open ? "Fermer" : def.title}</span>
        <Icon name={open ? "close" : "mail"} />
      </button>

      {open && (
        <div id="widget-contact" ref={panel} className="cw-panel" role="dialog" aria-labelledby="widget-titre">
          <div className="stack" style={{ gap: 8 }}>
            <p className="hud eyebrow">Réponse sous 48 h ouvrées</p>
            <h2 id="widget-titre" className="h3">
              {def.title}
            </h2>
          </div>

          {sent ? (
            <div className="cw-sent" role="status">
              <Icon name="check" />
              <p>
                <strong>Message envoyé.</strong> Un conseiller Little vous répond à l&apos;adresse indiquée.
              </p>
              <button type="button" className="link" onClick={() => setSent(false)}>
                Écrire un autre message
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={submit}>
              <p className="cw-intro">{def.intro}</p>
              {def.fields.map((f) => {
                const id = `widget-${f.name}`;
                return (
                  <div className="field" key={f.name}>
                    <label className="hud" htmlFor={id}>
                      {f.label} {f.required && <b aria-hidden="true">*</b>}
                    </label>
                    {f.type === "textarea" ? (
                      <textarea id={id} name={f.name} required={f.required} maxLength={4000} />
                    ) : (
                      <input id={id} name={f.name} type={f.type} required={f.required} autoComplete={f.autoComplete} maxLength={200} />
                    )}
                  </div>
                );
              })}
              <div className="form__trap" aria-hidden="true">
                <label htmlFor="widget-site">Ne pas remplir</label>
                <input id="widget-site" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              {error && (
                <p className="form__error" role="alert">
                  {error}
                </p>
              )}
              <div className="form__foot">
                <button className="btn" type="submit" disabled={sending}>
                  {sending ? "Envoi…" : def.submitLabel}
                  <Icon name="arrow" />
                </button>
                <p className="form__legal">
                  Données utilisées uniquement pour vous répondre : <Link href="/politique-de-confidentialite/">confidentialité</Link>.
                </p>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
