#!/usr/bin/env python3
"""Nettoie les content.md produits par scrape.py.

Divi insère l'en-tête (réseaux sociaux, téléphone, logo), des menus flottants et
le pied de page (newsletter, liens, crédits) dans le corps de chaque page. Tout
bloc présent sur la majorité des pages est retiré des content.md et rangé une
seule fois dans layout/blocs-communs.md. L'original reste dans content-brut.md.

Usage : python3 clean_content.py [dossier_scrape]   (relançable)
"""
import glob
import os
import re
import sys
from collections import Counter

OUT = sys.argv[1] if len(sys.argv) > 1 else "scrape"
THRESHOLD = 0.6  # part des pages où un bloc doit apparaître pour être « commun »


def split(text):
    m = re.match(r"---\n.*?\n---\n", text, re.S)
    front = m.group(0) if m else ""
    return front, [b.strip() for b in re.split(r"\n\s*\n", text[len(front):]) if b.strip()]


pages = {}
for path in sorted(glob.glob(os.path.join(OUT, "pages", "*", "content.md"))):
    raw_path = path.replace("content.md", "content-brut.md")
    if not os.path.exists(raw_path):
        os.replace(path, raw_path)
    with open(raw_path, encoding="utf-8") as f:
        pages[path] = split(f.read())

presence = Counter(b for _, blocks in pages.values() for b in set(blocks))
common = {b for b, n in presence.items() if n >= THRESHOLD * len(pages)}

for path, (front, blocks) in pages.items():
    kept = [b for b in blocks if b not in common]
    with open(path, "w", encoding="utf-8") as f:
        f.write(front + "\n" + "\n\n".join(kept) + "\n")
    print(f"{os.path.basename(os.path.dirname(path)):55} {len(blocks) - len(kept):3} blocs communs retirés")

# Blocs communs dans l'ordre où ils apparaissent sur l'accueil (header puis footer).
home = next((p for p in pages if os.path.basename(os.path.dirname(p)) == "accueil"), None)
ordered = [b for b in dict.fromkeys(pages[home][1]) if b in common] if home else []
ordered += sorted(common - set(ordered), key=lambda b: -presence[b])
os.makedirs(os.path.join(OUT, "layout"), exist_ok=True)
for old in ("header-commun.md", "footer-commun.md"):
    old_path = os.path.join(OUT, "layout", old)
    if os.path.exists(old_path):
        os.remove(old_path)
with open(os.path.join(OUT, "layout", "blocs-communs.md"), "w", encoding="utf-8") as f:
    f.write("\n\n".join(ordered) + "\n")
print(f"{len(common)} blocs communs détectés sur {len(pages)} pages")
