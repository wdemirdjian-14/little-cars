"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icons";
import { blank, genericPath, labelFor, validate, type Schema } from "@/lib/content-schema";
import { mediaUrl } from "@/lib/media";
import { api, formatDate } from "./api";
import { MediaPicker } from "./MediaLibrary";

type Doc = {
  cle: string;
  label: string;
  chemin: string;
  aide: string | null;
  verrouilles: string[];
  schema: Schema;
  data: unknown;
  personnalise: boolean;
  modifie_le: string | null;
  modifie_par: string | null;
};

type Key = string | number;
type Json = unknown;

const LONG_KEYS = new Set(["text", "lead", "description", "bio", "a", "caption", "note", "intro", "priceNote", "footnote", "warranty", "lldTeaser", "paragraphs"]);
const PREVIEW_KEYS = ["title", "name", "word", "q", "label", "h1", "date", "author", "id"];
const LIMITS: Record<string, number> = { "seo.title": 60, "seo.description": 160 };

function setIn(obj: Json, path: Key[], value: Json): Json {
  if (!path.length) return value;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = [...obj];
    copy[head as number] = setIn(copy[head as number], rest, value);
    return copy;
  }
  const o = (obj ?? {}) as Record<string, Json>;
  return { ...o, [head]: setIn(o[head as string], rest, value) };
}

const toPath = (path: Key[]) => path.map((k) => (typeof k === "number" ? `[${k}]` : `.${k}`)).join("").replace(/^\./, "");

function preview(value: Json): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const o = value as Record<string, Json>;
  for (const k of PREVIEW_KEYS) if (typeof o[k] === "string" && o[k]) return o[k] as string;
  if (o.image && typeof o.image === "object") return preview(o.image);
  const first = Object.values(o).find((v) => typeof v === "string" && v);
  return (first as string) ?? "";
}

const isImage = (s: Schema) => s.t === "object" && s.fields.src?.s.t === "string" && s.fields.alt?.s.t === "string" && Object.keys(s.fields).length === 2;

/** Chemin lisible pour les messages d'erreur : « Scènes d'ouverture › 2 › Grand mot ». */
function humanPath(path: string) {
  return path
    .split(/\.|(?=\[)/)
    .filter(Boolean)
    .map((p) => (p.startsWith("[") ? String(Number(p.slice(1, -1)) + 1) : labelFor(p)))
    .join(" › ");
}

export function ContentEditor({ doc, history }: { doc: Doc; history: { id: number; enregistre_le: string; auteur: string | null }[] }) {
  const router = useRouter();
  const [data, setData] = useState<Json>(doc.data);
  const [saved, setSaved] = useState(() => JSON.stringify(doc.data));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "error" | "info"; text: string } | null>(null);
  const [picker, setPicker] = useState<((ref: string) => void) | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const dirty = useMemo(() => JSON.stringify(data) !== saved, [data, saved]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const locked = (path: Key[]) => {
    const g = genericPath(toPath(path));
    return doc.verrouilles.includes(g);
  };

  const update = (path: Key[], value: Json) => setData((d: Json) => setIn(d, path, value));

  async function save() {
    const issue = validate(data, doc.schema);
    if (issue) {
      setNotice({ tone: "error", text: `${humanPath(issue.path) || "Document"} : ${issue.message}.` });
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      await api("PUT", `/api/admin/contenus/${doc.cle}/`, { data });
      setSaved(JSON.stringify(data));
      setNotice({ tone: "ok", text: "Enregistré : la page est à jour sur le site." });
      router.refresh();
    } catch (err) {
      setNotice({ tone: "error", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    if (!confirm("Revenir au contenu d'origine ? La version actuelle restera disponible dans l'historique.")) return;
    setBusy(true);
    try {
      await api("DELETE", `/api/admin/contenus/${doc.cle}/`);
      router.refresh();
    } catch (err) {
      setNotice({ tone: "error", text: (err as Error).message });
      setBusy(false);
    }
  }

  async function restore(id: number) {
    if (dirty && !confirm("Vos modifications non enregistrées seront perdues. Continuer ?")) return;
    setBusy(true);
    try {
      await api("POST", `/api/admin/contenus/${doc.cle}/historique/${id}/`);
      router.refresh();
    } catch (err) {
      setNotice({ tone: "error", text: (err as Error).message });
      setBusy(false);
    }
  }

  /* Rendu récursif ------------------------------------------------------------------ */

  function renderString(name: Key, value: string, path: Key[], inList = false) {
    const id = `f-${toPath(path).replace(/[^\w-]/g, "_")}`;
    const key = String(name);
    const generic = genericPath(toPath(path));
    const limit = LIMITS[generic];
    const readOnly = locked(path);

    if (key === "image" || key === "src") {
      return renderImagePicker(value, path, key === "src" ? undefined : labelFor(key));
    }
    if (key === "markdown") {
      return (
        <div className="bo-field" key={id}>
          <label htmlFor={id}>{labelFor(key)}</label>
          <textarea id={id} className="bo-textarea" rows={24} value={value} onChange={(e) => update(path, e.target.value)} style={{ fontFamily: "var(--f-hud)", fontSize: 13 }} />
          <span className="bo-field__hint">## Titre de section · **gras** · - liste · [lien](https://…)</span>
        </div>
      );
    }
    const parentKey = path.length >= 2 ? String(path[path.length - 2]) : "";
    const long = LONG_KEYS.has(key) || LONG_KEYS.has(parentKey) || value.length > 90;
    const field = long ? (
      <textarea id={id} className="bo-textarea" rows={Math.min(10, Math.max(3, Math.ceil(value.length / 90)))} value={value} readOnly={readOnly} onChange={(e) => update(path, e.target.value)} />
    ) : (
      <input id={id} className="bo-input" value={value} readOnly={readOnly} onChange={(e) => update(path, e.target.value)} />
    );
    if (inList) return field;
    return (
      <div className="bo-field" key={id}>
        <label htmlFor={id}>
          {labelFor(key)} {readOnly && <span className="bo-muted">(verrouillé)</span>}
        </label>
        {field}
        {limit && (
          <span className="bo-count" data-over={value.length > limit}>
            {value.length} / {limit} caractères conseillés
          </span>
        )}
      </div>
    );
  }

  function renderImagePicker(src: string, path: Key[], label?: string) {
    return (
      <div className="bo-field" key={`img-${toPath(path)}`}>
        {label && <span className="bo-field__label">{label}</span>}
        <div className="bo-row" style={{ alignItems: "center" }}>
          <div className="ed-image__thumb" style={src ? { backgroundImage: `url(${mediaUrl(src, 800)})` } : undefined}>
            {!src && "Aucune image"}
          </div>
          <div className="bo-stack" style={{ gap: 6 }}>
            <button type="button" className="bo-btn bo-btn--ghost bo-btn--small" onClick={() => setPicker(() => (ref: string) => update(path, ref))}>
              <Icon name="image" /> {src ? "Changer l'image" : "Choisir une image"}
            </button>
            {src && label && (
              <button type="button" className="bo-btn bo-btn--ghost bo-btn--small" onClick={() => update(path, "")}>
                Retirer
              </button>
            )}
            <span className="bo-small bo-muted" style={{ maxWidth: 260, overflowWrap: "anywhere" }}>
              {src}
            </span>
          </div>
        </div>
      </div>
    );
  }

  function renderNode(name: Key, value: Json, schema: Schema, path: Key[], depth: number): React.ReactNode {
    const key = `n-${toPath(path)}`;
    switch (schema.t) {
      case "string":
        return renderString(name, typeof value === "string" ? value : "", path);
      case "number": {
        const id = `f-${toPath(path).replace(/[^\w-]/g, "_")}`;
        return (
          <div className="bo-field" key={key}>
            <label htmlFor={id}>{labelFor(String(name))}</label>
            <input id={id} className="bo-input" type="number" value={Number(value ?? 0)} onChange={(e) => update(path, e.target.value === "" ? 0 : Number(e.target.value))} style={{ maxWidth: 220 }} />
          </div>
        );
      }
      case "boolean":
        return (
          <label className="bo-row" key={key}>
            <input type="checkbox" checked={Boolean(value)} onChange={(e) => update(path, e.target.checked)} /> {labelFor(String(name))}
          </label>
        );
      case "object": {
        const obj = (value ?? {}) as Record<string, Json>;
        if (isImage(schema)) {
          const img = obj as { src: string; alt: string };
          return (
            <div className="ed-image" key={key} style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
              {typeof name === "string" && <span className="bo-field__label">{labelFor(name)}</span>}
              {renderImagePicker(img.src, [...path, "src"])}
              {renderString("alt", img.alt ?? "", [...path, "alt"])}
            </div>
          );
        }
        const fields = Object.entries(schema.fields).filter(([k]) => k in obj);
        const content = fields.map(([k, f]) => renderNode(k, obj[k], f.s, [...path, k], depth + 1));
        if (typeof name === "number") return <div className="bo-stack" style={{ gap: 12 }} key={key}>{content}</div>;
        return (
          <details className="ed-group" key={key} open={depth === 0 && ["seo", "hero"].includes(String(name))}>
            <summary>
              {labelFor(String(name))} <span className="bo-muted">{preview(obj)}</span>
            </summary>
            <div className="ed-body">{content}</div>
          </details>
        );
      }
      case "array": {
        const list = Array.isArray(value) ? value : [];
        const item = schema.item;
        const move = (from: number, to: number) => {
          const copy = [...list];
          const [x] = copy.splice(from, 1);
          copy.splice(to, 0, x);
          update(path, copy);
        };
        const remove = (i: number) => update(path, list.filter((_, j) => j !== i));
        const add = () => item && update(path, [...list, blank(item)]);
        const canRemove = list.length > schema.min;

        const controls = (i: number) => (
          <>
            <button type="button" className="bo-btn bo-btn--ghost bo-btn--icon" title="Monter" aria-label="Monter" disabled={i === 0} onClick={() => move(i, i - 1)}>
              <Icon name="up" />
            </button>
            <button type="button" className="bo-btn bo-btn--ghost bo-btn--icon" title="Descendre" aria-label="Descendre" disabled={i === list.length - 1} onClick={() => move(i, i + 1)}>
              <Icon name="chevron" />
            </button>
            <button type="button" className="bo-btn bo-btn--danger bo-btn--icon" title="Supprimer" aria-label="Supprimer" disabled={!canRemove} onClick={() => remove(i)}>
              <Icon name="trash" />
            </button>
          </>
        );

        const body =
          item?.t === "string" ? (
            <div className="ed-strings">
              {list.map((v, i) => (
                <div className="ed-string" key={i}>
                  {renderString(name, String(v ?? ""), [...path, i], true)}
                  <div className="bo-row" style={{ gap: 4 }}>
                    {controls(i)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            list.map((v, i) => (
              <div className="ed-item" key={i}>
                <div className="ed-item__head">
                  <span>
                    {i + 1}. {preview(v) || "Nouvel élément"}
                  </span>
                  {controls(i)}
                </div>
                {item && renderNode(i, v, item, [...path, i], depth + 1)}
              </div>
            ))
          );

        return (
          <details className="ed-group" key={key} open={depth === 0 && list.length <= 3}>
            <summary>
              {labelFor(String(name))} <span className="bo-muted">{list.length} élément{list.length > 1 ? "s" : ""}</span>
            </summary>
            <div className="ed-body">
              {body}
              {item ? (
                <div>
                  <button type="button" className="bo-btn bo-btn--ghost bo-btn--small" onClick={add}>
                    <Icon name="plus" /> Ajouter
                  </button>
                </div>
              ) : (
                <p className="bo-small bo-muted">Cette liste ne prend pas d&apos;éléments.</p>
              )}
            </div>
          </details>
        );
      }
    }
  }

  const root = doc.schema.t === "object" ? doc.schema : null;
  const rootData = (data ?? {}) as Record<string, Json>;

  return (
    <div className="ed">
      <div className="ed-bar">
        <div>
          <Link href="/admin/contenus/" className="bo-crumb">
            ← Contenus
          </Link>
          <h1 className="bo-title" style={{ fontSize: 26 }}>
            {doc.label}
          </h1>
          <p className="bo-small bo-muted" style={{ margin: 0 }}>
            {dirty ? (
              <strong style={{ color: "var(--bo-warn)" }}>Modifications non enregistrées</strong>
            ) : doc.personnalise ? (
              `Modifié le ${formatDate(doc.modifie_le)}${doc.modifie_par ? ` par ${doc.modifie_par}` : ""}`
            ) : (
              "Contenu d'origine"
            )}
          </p>
        </div>
        <div className="bo-row">
          <a className="bo-btn bo-btn--ghost" href={doc.chemin} target="_blank" rel="noopener">
            <Icon name="external" /> Voir la page
          </a>
          <button type="button" className="bo-btn bo-btn--ghost" onClick={() => setShowHistory((s) => !s)} aria-expanded={showHistory}>
            <Icon name="history" /> Historique ({history.length})
          </button>
          <button type="button" className="bo-btn" onClick={save} disabled={busy || !dirty}>
            {busy ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>

      {doc.aide && <p className="bo-alert bo-alert--info">{doc.aide}</p>}
      {notice && (
        <p className={`bo-alert bo-alert--${notice.tone}`} role="status">
          {notice.text}
        </p>
      )}

      {showHistory && (
        <section className="bo-card">
          <div className="bo-card__head">
            <h2 className="bo-card__title">Versions précédentes</h2>
            {doc.personnalise && (
              <button type="button" className="bo-btn bo-btn--danger bo-btn--small" onClick={reset} disabled={busy}>
                Revenir au contenu d&apos;origine
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="bo-muted">Aucune version précédente.</p>
          ) : (
            <table className="bo-table">
              <tbody>
                {history.map((h) => (
                  <tr key={h.id}>
                    <td>Version remplacée le {formatDate(h.enregistre_le)}</td>
                    <td>{h.auteur ?? "—"}</td>
                    <td className="num">
                      <button type="button" className="bo-btn bo-btn--ghost bo-btn--small" onClick={() => restore(h.id)} disabled={busy}>
                        Restaurer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {root
        ? Object.entries(root.fields)
            .filter(([k]) => k in rootData)
            .map(([k, f]) =>
              f.s.t === "object" || f.s.t === "array" ? (
                renderNode(k, rootData[k], f.s, [k], 0)
              ) : (
                <div className="bo-card" key={k}>
                  {renderNode(k, rootData[k], f.s, [k], 0)}
                </div>
              ),
            )
        : renderNode(doc.label, data, doc.schema, [], 0)}

      {picker && (
        <MediaPicker
          onClose={() => setPicker(null)}
          onSelect={(ref) => {
            picker(ref);
            setPicker(null);
          }}
        />
      )}
    </div>
  );
}
