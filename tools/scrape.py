#!/usr/bin/env python3
"""Aspirateur little-cars.fr

Récupère, pour reconstruire le site from scratch :
  - les données brutes de l'API WordPress (pages, CPT, médias, SEO Yoast)
  - chaque page rendue (HTML) + une version texte propre (Markdown) + métadonnées
  - le menu, le header et le footer
  - la médiathèque complète en qualité originale (images, PDF)
  - les CSS du thème et des « design tokens » (couleurs, polices)
  - des inventaires CSV (pages, médias) et un contrôle des liens internes

Usage : python3 scrape.py --out ./scrape [--no-media]
Dépendances : Python 3.8+ (stdlib uniquement). Relançable : les médias déjà
téléchargés sont ignorés.
"""
import argparse
import csv
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser

BASE = "https://little-cars.fr"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128 Safari/537.36")

UPLOAD_RE = re.compile(
    r'(?:https?:)?(?://(?:www\.)?little-cars\.fr)?/wp-content/uploads/'
    r'[^"\'()\s<>,]+?\.(?:jpe?g|png|gif|webp|avif|svg|ico|pdf|mp4|webm|mov|mp3|zip|docx?|xlsx?)',
    re.I)
SIZE_RE = re.compile(r'-(?:\d+x\d+|scaled)(\.\w+)$', re.I)
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "source", "track", "wbr", "param"}
SKIP_TAGS = {"script", "style", "noscript", "svg", "iframe", "template", "head",
             "form", "nav", "select", "button"}
BLOCK_TAGS = {"p", "div", "section", "article", "ul", "ol", "table", "tr",
              "blockquote", "figure", "figcaption", "dl", "dt", "dd", "main"}
# Pages techniques / de test présentes sur le site actuel, à ne pas reprendre.
NOT_TO_REBUILD = {"404-2", "z-divi-test-contact-form-7", "bonjour-tout-le-monde"}

OUT = "scrape"


def ssl_context():
    """Le Python de python.org sur macOS n'embarque pas les certificats racines."""
    import ssl
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        pass
    for cafile in ("/etc/ssl/cert.pem", "/usr/local/etc/openssl/cert.pem"):
        if os.path.exists(cafile):
            return ssl.create_default_context(cafile=cafile)
    return ssl.create_default_context()


SSL_CTX = ssl_context()


# --------------------------------------------------------------------------- HTTP
def fetch(url, tries=3, method="GET"):
    safe = urllib.parse.quote(url, safe=":/?&=%#~+@,;!$'()*[]")
    err = None
    for i in range(tries):
        try:
            req = urllib.request.Request(safe, headers={"User-Agent": UA}, method=method)
            with urllib.request.urlopen(req, timeout=90, context=SSL_CTX) as r:
                return r.status, r.headers, (r.read() if method == "GET" else b"")
        except urllib.error.HTTPError as e:
            if e.code in (400, 401, 403, 404, 405, 410):
                return e.code, e.headers, b""
            err = e
        except Exception as e:  # réseau, timeout…
            err = e
        time.sleep(2 * (i + 1))
    print(f"  ! échec {url} : {err}", file=sys.stderr)
    return 0, {}, b""


def api_all(endpoint, params=""):
    items, page = [], 1
    while True:
        st, hd, body = fetch(f"{BASE}/wp-json/wp/v2/{endpoint}?per_page=100&page={page}{params}")
        if st != 200:
            break
        data = json.loads(body)
        if isinstance(data, dict):
            return data
        items += data
        if page >= int(hd.get("X-WP-TotalPages", 1) or 1):
            break
        page += 1
    return items


def save(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    mode = "wb" if isinstance(data, bytes) else "w"
    with open(path, mode, **({} if mode == "wb" else {"encoding": "utf-8"})) as f:
        f.write(data)


def save_json(path, obj):
    save(path, json.dumps(obj, ensure_ascii=False, indent=2))


def abs_url(u, keep_query=True):
    u = html.unescape((u or "").strip())
    if not u or u.startswith(("mailto:", "tel:", "javascript:", "#", "data:")):
        return u
    if u.startswith("//"):
        u = "https:" + u
    elif u.startswith("/"):
        u = BASE + u
    elif not re.match(r"^https?://", u):
        u = BASE + "/" + u
    u = re.sub(r"^http://", "https://", u).replace("://www.little-cars.fr", "://little-cars.fr")
    u = u.split("#")[0]
    return u if keep_query else u.split("?")[0]


def upload_url(u):
    return abs_url(u.replace("\\/", "/"), keep_query=False)


def local_media_path(u):
    rel = urllib.parse.unquote(u.split("/wp-content/uploads/", 1)[1])
    return os.path.join(OUT, "media", "uploads", rel)


def is_internal(u):
    return u.startswith(BASE)


# --------------------------------------------------------------------- Parsing
class Extract(HTMLParser):
    """HTML rendu -> texte Markdown réparti en header / main / footer + inventaires."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []  # (tag, region, skip)
        self.buf = {"header": [], "main": [], "footer": []}
        self.meta, self.title, self.canonical = {}, "", None
        self.images, self.links, self.iframes, self.forms, self.headings = [], [], [], [], []
        self.stylesheets = []
        self._title = False
        self._a = []  # (pos, href, region, skipped)
        self._h = None
        self._form = None

    def region(self):
        return self.stack[-1][1] if self.stack else "main"

    def skipping(self):
        return any(s for _, _, s in self.stack)

    def emit(self, s, region=None):
        if not self.skipping():
            self.buf[region or self.region()].append(s)

    def handle_starttag(self, tag, attrs):
        a = {k: (v or "") for k, v in attrs}
        cls = a.get("class", "")
        region = self.region()
        if tag == "header" or "et-l--header" in cls:
            region = "header"
        elif tag == "footer" or "et-l--footer" in cls:
            region = "footer"
        skip = (tag in SKIP_TAGS or "et_pb_menu" in cls or "et_mobile_nav" in cls
                or "screen-reader-text" in cls)

        if tag == "title":
            self._title = True
        elif tag == "meta":
            key = a.get("name") or a.get("property")
            if key:
                self.meta[key] = a.get("content", "")
        elif tag == "link":
            rel = a.get("rel", "")
            if "canonical" in rel:
                self.canonical = a.get("href")
            if "stylesheet" in rel and a.get("href"):
                self.stylesheets.append(abs_url(a["href"]))
        elif tag == "iframe":
            src = a.get("data-src") or a.get("src")
            if src:
                self.iframes.append(abs_url(src))
        elif tag == "form":
            self._form = {"id": a.get("id"), "action": a.get("action"), "class": cls, "fields": []}
            self.forms.append(self._form)
        elif tag in ("input", "textarea", "select") and self._form is not None:
            if a.get("type") not in ("hidden", "submit"):
                self._form["fields"].append({
                    "tag": tag, "type": a.get("type"), "name": a.get("name"),
                    "placeholder": a.get("placeholder"),
                    "required": "required" in a or "wpcf7-validates-as-required" in cls})
        elif tag == "img":
            src = a.get("data-src") or a.get("src") or ""
            srcset = a.get("data-srcset") or a.get("srcset") or ""
            if srcset:  # garde la plus grande variante
                cands = [c.strip().split(" ") for c in srcset.split(",") if c.strip()]
                cands = [(int(re.sub(r"\D", "", c[1]) or 0) if len(c) > 1 else 0, c[0]) for c in cands]
                src = max(cands)[1] if cands else src
            if src and not src.startswith("data:"):
                src = abs_url(src)
                self.images.append({"src": src, "alt": a.get("alt", ""), "region": region})
                if not skip:
                    self.emit(f"\n![{a.get('alt', '')}]({src})\n", region)
        elif tag == "a":
            href = abs_url(a.get("href", ""))
            self._a.append((len(self.buf[region]), href, region, self.skipping() or skip))
        elif tag == "br":
            self.emit("\n", region)
        elif re.fullmatch(r"h[1-6]", tag):
            self.emit("\n\n" + "#" * int(tag[1]) + " ", region)
            self._h = [int(tag[1]), []]
        elif tag == "li":
            self.emit("\n- ", region)
        elif tag in BLOCK_TAGS:
            self.emit("\n", region)

        if tag not in VOID:
            self.stack.append((tag, region, skip))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID and self.stack and self.stack[-1][0] == tag:
            self.stack.pop()

    def handle_endtag(self, tag):
        idx = next((i for i in range(len(self.stack) - 1, -1, -1) if self.stack[i][0] == tag), None)
        if idx is None:
            return
        _, region, _ = self.stack[idx]
        del self.stack[idx:]
        if tag == "title":
            self._title = False
        elif tag == "form":
            self._form = None
        elif tag == "a" and self._a:
            pos, href, reg, skipped = self._a.pop()
            text = re.sub(r"\s+", " ", "".join(self.buf[reg][pos:])).strip()
            if href and not href.startswith("#"):
                self.links.append({"href": href, "text": text[:120], "region": reg})
                if not skipped and text and href.startswith("http"):
                    self.buf[reg].insert(pos, "[")
                    self.buf[reg].append(f"]({href})")
        elif re.fullmatch(r"h[1-6]", tag) and self._h:
            text = re.sub(r"\s+", " ", "".join(self._h[1])).strip()
            if text:
                self.headings.append({"level": self._h[0], "text": text, "region": region})
            self._h = None
            self.emit("\n\n", region)
        elif tag in BLOCK_TAGS:
            self.emit("\n", region)

    def handle_data(self, d):
        if self._title:
            self.title += d
        if self.skipping():
            return
        text = re.sub(r"\s+", " ", d)
        if self._h is not None:
            self._h[1].append(text)
        self.buf[self.region()].append(text)

    def markdown(self, region):
        s = "".join(self.buf[region])
        s = "\n".join(line.strip() for line in s.splitlines())
        s = re.sub(r"\n(- \s*\n)+", "\n", s)
        s = re.sub(r"\n{3,}", "\n\n", s)
        return s.strip() + "\n"


class MenuParser(HTMLParser):
    """Arborescence du premier menu WordPress trouvé (menu principal desktop)."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tree, self.lists, self.items = [], [], []
        self.active = self.done = False
        self.in_a = None

    def handle_starttag(self, tag, attrs):
        if self.done:
            return
        a = {k: (v or "") for k, v in attrs}
        if tag == "ul" and not self.active and "menu" in a.get("id", "") + a.get("class", ""):
            self.active, self.lists = True, [self.tree]
            return
        if not self.active:
            return
        if tag == "ul":
            self.lists.append(self.items[-1]["children"] if self.items else self.lists[-1])
        elif tag == "li":
            node = {"label": "", "url": None, "children": []}
            self.lists[-1].append(node)
            self.items.append(node)
        elif tag == "a" and self.items:
            self.items[-1]["url"] = abs_url(a.get("href", ""))
            self.in_a = self.items[-1]

    def handle_endtag(self, tag):
        if not self.active or self.done:
            return
        if tag == "ul":
            self.lists.pop()
            if not self.lists:
                self.done = True
        elif tag == "li" and self.items:
            self.items.pop()
        elif tag == "a":
            self.in_a = None

    def handle_data(self, d):
        if self.in_a is not None and d.strip():
            self.in_a["label"] = (self.in_a["label"] + " " + d.strip()).strip()


# ------------------------------------------------------------------- Pipeline
def process_page(entry):
    st, _, body = fetch(entry["url"])
    raw = body.decode("utf-8", "replace")
    d = os.path.join(OUT, "pages", entry["key"])
    if raw:
        save(os.path.join(d, "page.html"), raw)
    ex = Extract()
    ex.feed(raw)
    uploads = sorted({upload_url(m) for m in UPLOAD_RE.findall(raw.replace("\\/", "/"))})
    main_md = ex.markdown("main")
    item = entry.get("api") or {}
    meta = {
        "url": entry["url"], "slug": entry["slug"], "type": entry["type"],
        "a_reprendre": entry["slug"] not in NOT_TO_REBUILD,
        "http_status": st,
        "modified": item.get("modified"),
        "template": item.get("template"),
        "title_tag": html.unescape(ex.title.strip()),
        "title_wp": html.unescape((item.get("title") or {}).get("rendered", "")),
        "meta_description": ex.meta.get("description"),
        "og_image": ex.meta.get("og:image"),
        "canonical": ex.canonical,
        "robots": ex.meta.get("robots"),
        "word_count": len(re.findall(r"\w+", re.sub(r"!\[[^\]]*\]\([^)]*\)|\]\([^)]*\)", "", main_md))),
        "headings": ex.headings,
        "images": ex.images,
        "uploads_referenced": uploads,
        "pdfs": sorted({l["href"] for l in ex.links if l["href"].lower().split("?")[0].endswith(".pdf")}),
        "links_internal": sorted({l["href"] for l in ex.links if is_internal(l["href"])}),
        "links_external": sorted({l["href"] for l in ex.links
                                  if l["href"].startswith("http") and not is_internal(l["href"])}),
        "phones_emails": sorted({l["href"] for l in ex.links if l["href"].startswith(("tel:", "mailto:"))}),
        "iframes": ex.iframes,
        "forms": ex.forms,
        "divi_modules": dict(Counter(re.findall(r"\b(et_pb_[a-z_]+?)(?:_\d+)?(?=[\s\"])", raw)).most_common(40)),
    }
    save_json(os.path.join(d, "meta.json"), meta)
    front = (f"---\ntitle: {json.dumps(meta['title_wp'] or meta['title_tag'], ensure_ascii=False)}\n"
             f"url: {entry['url']}\n"
             f"description: {json.dumps(meta['meta_description'] or '', ensure_ascii=False)}\n---\n\n")
    save(os.path.join(d, "content.md"), front + main_md)
    if item:
        save(os.path.join(d, "api-content.html"), (item.get("content") or {}).get("rendered", ""))
        if item.get("yoast_head_json"):
            save_json(os.path.join(d, "seo-yoast.json"), item["yoast_head_json"])
        extra = {k: v for k, v in item.items() if k in ("acf", "meta", "featured_media", "class_list")}
        if extra:
            save_json(os.path.join(d, "api-extra.json"), extra)
    print(f"  page {st} {entry['url']}")
    return meta, ex, raw


def analyse_css(urls):
    colors, fonts, uploads = Counter(), Counter(), set()
    for u in urls:
        if not is_internal(u):
            continue
        st, _, body = fetch(u)
        if st != 200:
            continue
        name = re.sub(r"[^\w.-]", "_", u.split("/wp-content/", 1)[-1].split("?")[0])
        css = body.decode("utf-8", "replace")
        save(os.path.join(OUT, "theme", "css", name), css)
        # Les CSS du thème Divi « parent » sont génériques : on ne compte que le spécifique au site.
        if "/themes/Divi/" in u or "/plugins/" in u:
            continue
        colors.update(c.lower() for c in re.findall(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\([^)]+\)", css))
        fonts.update(f.strip().strip("'\"") for f in re.findall(r"font-family:\s*([^;}!]+)", css))
        uploads |= {upload_url(m) for m in UPLOAD_RE.findall(css)}
    return colors, fonts, uploads


def main():
    global OUT
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="scrape")
    ap.add_argument("--no-media", action="store_true")
    ap.add_argument("--threads", type=int, default=6)
    args = ap.parse_args()
    OUT = os.path.abspath(args.out)
    os.makedirs(OUT, exist_ok=True)
    print(f"Sortie : {OUT}")

    # 1. API WordPress -------------------------------------------------------
    print("1/5 API WordPress")
    st, _, body = fetch(f"{BASE}/wp-json/")
    root = json.loads(body) if st == 200 else {}
    site = {k: root.get(k) for k in ("name", "description", "url", "home", "gmt_offset",
                                       "timezone_string", "site_logo", "site_icon", "site_icon_url",
                                       "namespaces")}
    save_json(os.path.join(OUT, "api", "site.json"), site)
    api = {}
    for ep in ("pages", "posts", "vehicules-occasions", "project", "media", "categories", "tags"):
        api[ep] = api_all(ep)
        save_json(os.path.join(OUT, "api", f"{ep}.json"), api[ep])
        print(f"  {ep}: {len(api[ep])}")
    for ep in ("types", "taxonomies"):
        save_json(os.path.join(OUT, "api", f"{ep}.json"), api_all(ep))

    # 2. Pages ---------------------------------------------------------------
    print("2/5 Pages")
    entries = []
    for ep in ("pages", "posts", "vehicules-occasions", "project"):
        for it in api[ep]:
            if it.get("status") != "publish":
                continue
            key = it["slug"] if ep == "pages" else f"{ep}__{it['slug']}"
            entries.append({"url": abs_url(it["link"]), "slug": it["slug"], "key": key,
                            "type": ep, "api": it})
    with ThreadPoolExecutor(4) as pool:
        results = list(pool.map(process_page, entries))

    home = next((r for e, r in zip(entries, results) if e["url"].rstrip("/") == BASE), results[0])
    _, home_ex, home_raw = home
    menu = MenuParser()
    menu.feed(home_raw)
    save_json(os.path.join(OUT, "layout", "menu.json"), menu.tree)
    save(os.path.join(OUT, "layout", "header.md"), home_ex.markdown("header"))
    save(os.path.join(OUT, "layout", "footer.md"), home_ex.markdown("footer"))

    # 3. Liens internes cassés -----------------------------------------------
    print("3/5 Contrôle des liens internes")
    known = {e["url"] for e in entries}
    link_src = defaultdict(set)
    for e, (m, _, _) in zip(entries, results):
        for l in m["links_internal"]:
            link_src[l.split("?")[0]].add(e["url"])
    to_check = sorted(u for u in link_src if u not in known)

    def head(u):
        st, _, _ = fetch(u, tries=2)
        return u, st
    with ThreadPoolExecutor(args.threads) as pool:
        checks = list(pool.map(head, to_check))
    broken = [{"url": u, "status": s, "found_on": sorted(link_src[u])} for u, s in checks if s != 200]
    save_json(os.path.join(OUT, "rapport", "liens-casses.json"), broken)
    print(f"  {len(to_check)} liens vérifiés, {len(broken)} en erreur")

    # 4. Thème / design tokens ------------------------------------------------
    print("4/5 CSS & design tokens")
    css_urls = sorted({u for _, ex, _ in results for u in ex.stylesheets})
    colors, fonts, css_uploads = analyse_css(css_urls)
    inline_css = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", home_raw, re.S))
    colors.update(c.lower() for c in re.findall(r"#[0-9a-fA-F]{6}\b|rgba?\([^)]+\)", inline_css))
    fonts.update(f.strip().strip("'\"") for f in re.findall(r"font-family:\s*([^;}!]+)", inline_css))
    save_json(os.path.join(OUT, "theme", "design-tokens.json"), {
        "couleurs_plus_utilisees": colors.most_common(30),
        "polices": fonts.most_common(15),
        "google_fonts": sorted({u for u in css_urls if "fonts.googleapis" in u}),
    })

    # 5. Médias --------------------------------------------------------------
    used_on = defaultdict(set)
    for e, (m, _, _) in zip(entries, results):
        for u in m["uploads_referenced"]:
            used_on[SIZE_RE.sub(r"\1", u)].add(e["key"])
    targets = {}
    for m in api["media"]:
        u = upload_url(m["source_url"])
        md = m.get("media_details") or {}
        info = {"id": m["id"], "mime": m.get("mime_type"), "width": md.get("width"),
                "height": md.get("height"), "filesize": md.get("filesize"),
                "alt": m.get("alt_text", ""), "title": html.unescape((m.get("title") or {}).get("rendered", "")),
                "date": m.get("date"), "in_library": True}
        targets[u] = info
        if md.get("original_image"):
            targets.setdefault(u.rsplit("/", 1)[0] + "/" + md["original_image"],
                               dict(info, note="original avant redimensionnement WP"))
    for u in set(used_on) | {SIZE_RE.sub(r"\1", x) for x in css_uploads} | set(
            u for m, _, _ in results for u in m["uploads_referenced"]):
        orig = SIZE_RE.sub(r"\1", u)
        if orig not in targets:
            targets[orig] = {"in_library": False, "fallback": u if u != orig else None}
    if site.get("site_icon_url"):
        targets.setdefault(upload_url(site["site_icon_url"]), {"in_library": False, "note": "favicon"})

    rows = []
    if not args.no_media:
        print(f"5/5 Médias : {len(targets)} fichiers")

        def dl(item):
            u, info = item
            path = local_media_path(u)
            if os.path.exists(path) and os.path.getsize(path) > 0:
                return u, path, "déjà là"
            st, _, body = fetch(u)
            if st != 200 and info.get("fallback"):
                u2 = info["fallback"]
                st, _, body = fetch(u2)
                path = local_media_path(u2)
            if st == 200 and body:
                save(path, body)
                return u, path, "ok"
            return u, None, f"erreur {st}"
        with ThreadPoolExecutor(args.threads) as pool:
            for n, (u, path, status) in enumerate(pool.map(dl, targets.items()), 1):
                if n % 50 == 0 or status.startswith("erreur"):
                    print(f"  [{n}/{len(targets)}] {status} {u}")
                info = targets[u]
                rows.append({
                    "fichier_local": os.path.relpath(path, OUT) if path else "",
                    "url": u, "statut": status, "type": info.get("mime", ""),
                    "largeur": info.get("width", ""), "hauteur": info.get("height", ""),
                    "octets": os.path.getsize(path) if path else "",
                    "alt": info.get("alt", ""), "titre": info.get("title", ""),
                    "mediatheque": "oui" if info.get("in_library") else "non",
                    "utilise_sur": " ".join(sorted(used_on.get(u, []))),
                    "note": info.get("note", ""),
                })
        with open(os.path.join(OUT, "inventaire-medias.csv"), "w", newline="", encoding="utf-8-sig") as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0].keys()), delimiter=";")
            w.writeheader()
            w.writerows(sorted(rows, key=lambda r: r["url"]))

    with open(os.path.join(OUT, "inventaire-pages.csv"), "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["url", "type", "a_reprendre", "http", "modifie", "title", "meta_description",
                    "h1", "nb_mots", "nb_images", "images_sans_alt", "pdf", "formulaires", "iframes",
                    "dossier"])
        for e, (m, _, _) in zip(entries, results):
            h1 = [h["text"] for h in m["headings"] if h["level"] == 1 and h["region"] == "main"]
            imgs = [i for i in m["images"] if i["region"] == "main"]
            w.writerow([m["url"], m["type"], "oui" if m["a_reprendre"] else "non", m["http_status"],
                        (m["modified"] or "")[:10], m["title_tag"], m["meta_description"] or "",
                        " | ".join(h1), m["word_count"], len(imgs), sum(1 for i in imgs if not i["alt"]),
                        len(m["pdfs"]), len(m["forms"]), len(m["iframes"]), f"pages/{e['key']}"])

    ok = sum(1 for r in rows if r["statut"] != "" and not r["statut"].startswith("erreur"))
    size = sum(r["octets"] or 0 for r in rows)
    summary = {
        "date": time.strftime("%Y-%m-%d %H:%M"),
        "pages": len(entries), "pages_a_reprendre": sum(1 for m, _, _ in results if m["a_reprendre"]),
        "medias_cibles": len(targets), "medias_ok": ok, "medias_mo": round(size / 1e6, 1),
        "liens_internes_casses": len(broken),
    }
    save_json(os.path.join(OUT, "rapport", "resume.json"), summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
