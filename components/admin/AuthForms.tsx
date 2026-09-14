"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "./api";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await api("POST", "/api/admin/session/", { email: form.get("email"), motDePasse: form.get("motDePasse") });
      router.replace("/admin/");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form className="bo-stack" onSubmit={submit}>
      <div className="bo-field">
        <label htmlFor="login-email">E-mail</label>
        <input id="login-email" className="bo-input" name="email" type="email" autoComplete="username" required autoFocus />
      </div>
      <div className="bo-field">
        <label htmlFor="login-mdp">Mot de passe</label>
        <input id="login-mdp" className="bo-input" name="motDePasse" type="password" autoComplete="current-password" required />
      </div>
      {error && (
        <p className="bo-alert bo-alert--error" role="alert">
          {error}
        </p>
      )}
      <button className="bo-btn" type="submit" disabled={busy}>
        {busy ? "Connexion…" : "Se connecter"}
      </button>
      <p className="bo-small bo-muted">Mot de passe oublié ? Un administrateur peut vous envoyer un lien de réinitialisation.</p>
    </form>
  );
}

export function ActivationForm({ jeton, nom, min }: { jeton: string; nom: string; min: number }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("motDePasse") !== form.get("confirmation")) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api("POST", "/api/admin/activation/", { jeton, nom: form.get("nom"), motDePasse: form.get("motDePasse") });
      router.replace("/admin/");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form className="bo-stack" onSubmit={submit}>
      <div className="bo-field">
        <label htmlFor="act-nom">Votre nom</label>
        <input id="act-nom" className="bo-input" name="nom" defaultValue={nom} autoComplete="name" required />
      </div>
      <div className="bo-field">
        <label htmlFor="act-mdp">Mot de passe</label>
        <input id="act-mdp" className="bo-input" name="motDePasse" type="password" minLength={min} autoComplete="new-password" required />
      </div>
      <div className="bo-field">
        <label htmlFor="act-conf">Confirmation</label>
        <input id="act-conf" className="bo-input" name="confirmation" type="password" minLength={min} autoComplete="new-password" required />
      </div>
      {error && (
        <p className="bo-alert bo-alert--error" role="alert">
          {error}
        </p>
      )}
      <button className="bo-btn" type="submit" disabled={busy}>
        {busy ? "Activation…" : "Activer mon compte"}
      </button>
    </form>
  );
}

export function PasswordForm({ min }: { min: number }) {
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget;
    const form = new FormData(el);
    if (form.get("nouveau") !== form.get("confirmation")) {
      setMessage({ ok: false, text: "Les deux nouveaux mots de passe ne correspondent pas." });
      return;
    }
    setBusy(true);
    try {
      await api("POST", "/api/admin/compte/", { actuel: form.get("actuel"), nouveau: form.get("nouveau") });
      el.reset();
      setMessage({ ok: true, text: "Mot de passe modifié. Vos autres sessions ont été fermées." });
    } catch (err) {
      setMessage({ ok: false, text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="bo-stack" onSubmit={submit} style={{ maxWidth: 420 }}>
      <div className="bo-field">
        <label htmlFor="pw-actuel">Mot de passe actuel</label>
        <input id="pw-actuel" className="bo-input" name="actuel" type="password" autoComplete="current-password" required />
      </div>
      <div className="bo-field">
        <label htmlFor="pw-nouveau">Nouveau mot de passe</label>
        <input id="pw-nouveau" className="bo-input" name="nouveau" type="password" minLength={min} autoComplete="new-password" required />
        <span className="bo-field__hint">Au moins {min} caractères.</span>
      </div>
      <div className="bo-field">
        <label htmlFor="pw-conf">Confirmation</label>
        <input id="pw-conf" className="bo-input" name="confirmation" type="password" minLength={min} autoComplete="new-password" required />
      </div>
      {message && (
        <p className={`bo-alert ${message.ok ? "bo-alert--ok" : "bo-alert--error"}`} role="status">
          {message.text}
        </p>
      )}
      <div>
        <button className="bo-btn" type="submit" disabled={busy}>
          {busy ? "Enregistrement…" : "Changer le mot de passe"}
        </button>
      </div>
    </form>
  );
}
