"use client";

/* eslint-disable @next/next/no-img-element -- vignettes WebP déjà optimisées */
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icons";
import { api, formatDate, prepareImage } from "./api";

type Item = { ref: string; url: string; nom: string; largeur: number; hauteur: number; origine: "televersee" | "site"; cree_le?: string };

function useMedia() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const res = await api<{ items: Item[] }>("GET", `/api/admin/medias/?q=${encodeURIComponent(query)}`);
      setItems(res.items);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(q), 250);
    return () => clearTimeout(t);
  }, [q, load]);

  return { items, setItems, q, setQ, loading, error, setError, reload: () => load(q) };
}

function Uploader({ onUploaded }: { onUploaded: (item: Item) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [status, setStatus] = useState<{ tone: "info" | "error"; text: string } | null>(null);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (!list.length) {
      setStatus({ tone: "error", text: "Déposez des fichiers image (JPEG, PNG, WebP, HEIC)." });
      return;
    }
    for (const [i, file] of list.entries()) {
      setStatus({ tone: "info", text: `Envoi ${i + 1}/${list.length} : ${file.name}…` });
      try {
        const form = new FormData();
        form.append("fichier", await prepareImage(file));
        const res = await api<{ item: Item }>("POST", "/api/admin/medias/", form);
        onUploaded(res.item);
      } catch (err) {
        setStatus({ tone: "error", text: `${file.name} : ${(err as Error).message}` });
        return;
      }
    }
    setStatus(null);
  }

  return (
    <div className="bo-stack" style={{ gap: 8 }}>
      <div
        className="mg-drop"
        data-over={over}
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          upload(e.dataTransfer.files);
        }}
      >
        <Icon name="upload" width={24} height={24} />
        <strong>Déposez vos photos ici ou cliquez pour choisir</strong>
        <span className="bo-small bo-muted">Réduites automatiquement et converties en WebP.</span>
      </div>
      <input ref={input} type="file" accept="image/*,.heic,.heif" multiple hidden onChange={(e) => e.target.files && upload(e.target.files)} />
      {status && (
        <p className={`bo-alert bo-alert--${status.tone}`} role="status">
          {status.text}
        </p>
      )}
    </div>
  );
}

export function MediaPicker({ onSelect, onClose }: { onSelect: (ref: string) => void; onClose: () => void }) {
  const { items, setItems, q, setQ, loading, error } = useMedia();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="bo-modal" role="dialog" aria-modal="true" aria-labelledby="picker-title" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bo-modal__box">
        <div className="bo-row" style={{ justifyContent: "space-between" }}>
          <h2 id="picker-title" className="bo-card__title" style={{ fontSize: 18 }}>
            Choisir une image
          </h2>
          <button type="button" className="bo-btn bo-btn--ghost bo-btn--small" onClick={onClose}>
            Fermer
          </button>
        </div>
        <div className="bo-grid" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)" }}>
          <Uploader
            onUploaded={(item) => {
              setItems((all) => [item, ...all]);
              onSelect(item.ref);
            }}
          />
          <div className="bo-field">
            <label htmlFor="picker-q">Rechercher dans la médiathèque</label>
            <input id="picker-q" className="bo-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ebox, bego, atelier…" />
            <span className="bo-field__hint">{loading ? "Chargement…" : `${items.length} images`}</span>
          </div>
        </div>
        {error && <p className="bo-alert bo-alert--error">{error}</p>}
        <div className="mg">
          {items.map((m) => (
            <button key={m.ref} type="button" className="mg-item" onClick={() => onSelect(m.ref)} title={m.ref}>
              <img src={m.url} alt="" loading="lazy" />
              <span>{m.nom}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MediaLibrary() {
  const { items, setItems, q, setQ, loading, error, setError } = useMedia();
  const [filter, setFilter] = useState<"toutes" | "televersee" | "site">("toutes");
  const [selected, setSelected] = useState<Item | null>(null);
  const [copied, setCopied] = useState(false);

  const shown = items.filter((m) => filter === "toutes" || m.origine === filter);

  async function remove(item: Item) {
    if (!confirm(`Supprimer définitivement « ${item.nom} » ?`)) return;
    try {
      await api("DELETE", "/api/admin/medias/", { ref: item.ref });
      setItems((all) => all.filter((m) => m.ref !== item.ref));
      setSelected(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="bo-stack" style={{ gap: 16 }}>
      <Uploader
        onUploaded={(item) => {
          setItems((all) => [item, ...all]);
          setSelected(item);
        }}
      />
      <div className="bo-row" style={{ justifyContent: "space-between" }}>
        <nav className="bo-segment" aria-label="Origine des images">
          {(
            [
              ["toutes", "Toutes"],
              ["televersee", "Téléversées"],
              ["site", "Site d'origine"],
            ] as const
          ).map(([k, label]) => (
            <a
              key={k}
              href="#"
              aria-current={filter === k ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setFilter(k);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        <input className="bo-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" aria-label="Rechercher une image" style={{ width: 240 }} />
      </div>
      {error && (
        <p className="bo-alert bo-alert--error" role="alert">
          {error}
        </p>
      )}
      <div className="bo-grid" style={{ gridTemplateColumns: selected ? "minmax(0, 1fr) minmax(0, 320px)" : "minmax(0, 1fr)", alignItems: "start" }}>
        <div className="mg" style={{ maxHeight: "none" }}>
          {loading && !items.length && <p className="bo-muted">Chargement…</p>}
          {shown.map((m) => (
            <button key={m.ref} type="button" className="mg-item" aria-pressed={selected?.ref === m.ref} onClick={() => setSelected(m)}>
              <img src={m.url} alt="" loading="lazy" />
              <span>{m.nom}</span>
            </button>
          ))}
        </div>
        {selected && (
          <aside className="bo-card bo-stack" style={{ position: "sticky", top: 16, gap: 12 }}>
            <img src={selected.url} alt="" style={{ width: "100%", borderRadius: 6 }} />
            <dl className="bo-dl">
              <dt>Nom</dt>
              <dd>{selected.nom}</dd>
              <dt>Dimensions</dt>
              <dd>
                {selected.largeur} × {selected.hauteur} px
              </dd>
              <dt>Origine</dt>
              <dd>{selected.origine === "site" ? "Site d'origine" : `Téléversée le ${formatDate(selected.cree_le)}`}</dd>
              <dt>Référence</dt>
              <dd style={{ fontFamily: "var(--f-hud)", fontSize: 12 }}>{selected.ref}</dd>
            </dl>
            <div className="bo-row">
              <button
                type="button"
                className="bo-btn bo-btn--ghost bo-btn--small"
                onClick={async () => {
                  await navigator.clipboard.writeText(selected.ref);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                <Icon name="copy" /> {copied ? "Copiée" : "Copier la référence"}
              </button>
              {selected.origine === "televersee" && (
                <button type="button" className="bo-btn bo-btn--danger bo-btn--small" onClick={() => remove(selected)}>
                  <Icon name="trash" /> Supprimer
                </button>
              )}
            </div>
            <p className="bo-small bo-muted">Pour utiliser une image, ouvrez un contenu et cliquez sur « Changer l&apos;image ».</p>
          </aside>
        )}
      </div>
    </div>
  );
}
