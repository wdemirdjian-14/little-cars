# Little Cars — little-cars.fr

Site vitrine de **Little**, constructeur français d'utilitaires électriques (EBOX, BEGO), reconstruit from scratch à partir du WordPress/Divi d'origine.

- Préproduction : https://little-cars.walautao.fr (non indexée)
- Production visée : https://little-cars.fr

## Stack

| Brique | Choix |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), sortie `standalone` |
| Rendu | Toutes les pages pré-générées en HTML au build (SEO) |
| Animations | GSAP ScrollTrigger + Lenis (défilement fluide), respect de « réduire les animations » |
| Styles | CSS natif (`app/globals.css`), polices auto-hébergées via `next/font` |
| Images | WebP pré-générés par `scripts/import-media.mjs` (pas de sharp en production) |
| Formulaires | `app/api/demande` → `data/demandes.jsonl` + e-mail SMTP optionnel |
| Hébergement | VPS IONOS, PM2 (Node 22) derrière nginx |

## Arborescence

```
app/                 pages (URLs identiques à l'ancien site), sitemap, robots, API
components/          composants (HeroScroll, Horizontal, VehiclePage, LeadForm…)
content/             TOUT le contenu : véhicules, pages, formulaires, textes légaux
  media-manifest.json  généré : dimensions des images
  media-redirects.json généré : anciennes URLs d'images → WebP (301)
lib/                 SEO (métadonnées, schema.org), médias
public/media/        WebP générés (versionnés)
public/wp-content/   PDF servis à leur URL WordPress d'origine
scripts/             import des médias, planche contact
tools/               aspiration du site d'origine (scrape.py, clean_content.py)
audit/               audit du site d'origine
deploy/              configuration nginx du VPS
scrape/              aspiration complète (121 Mo) — locale, non versionnée
```

Le dossier `content/` est la frontière avec le futur back-office : il remplacera ces fichiers en gardant les types de `content/types.ts`.

## Développer

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:3020
```

Après avoir ajouté une image dans `content/` (chemin `AAAA/MM/fichier.jpg` de l'aspiration) :

```bash
npm run media        # génère les WebP, le manifeste et les redirections
```

## Référencement : ce qui protège le SEO existant

- **URLs strictement identiques** à WordPress, barre finale comprise (`trailingSlash`).
- Titles et meta descriptions repris (orthographe corrigée), suffixe « - Little Cars » conservé.
- 301 pour les URLs supprimées (`/404-2/`, article par défaut, archives auteur/catégorie, `sitemap_index.xml`…) et pour chaque image `/wp-content/uploads/…` utilisée.
- PDF (fiches techniques, brochures) servis à leur URL d'origine.
- Données structurées : `AutomotiveBusiness`, `Product` + `Offer` par véhicule, `FAQPage`, `BreadcrumbList`.
- Un seul H1 par page, textes alternatifs sur les images, sitemap XML.
- Titres visibles jamais masqués par une animation (LCP), images principales préchargées.
- Préproduction : `noindex` (balise + en-tête `X-Robots-Tag`) et `robots.txt` bloquant, pilotés par `SITE_INDEXABLE`.

## Back-office (`/admin/`)

| Écran | Rôle |
| --- | --- |
| Tableau de bord | Audience sans cookie : visiteurs, pages vues, demandes, conversion, sources, appareils, actions (appels, e-mails, PDF, vidéos) |
| Messages | Boîte de réception du widget et des formulaires : statut, note interne, réponse par e-mail |
| Contenus | Textes, photos et SEO de chaque page, avec historique (30 versions) et retour au contenu d'origine |
| Médias | Photos du site d'origine et téléversements (réduits dans le navigateur, convertis en WebP) |
| Équipe | Invitations, liens de réinitialisation, désactivation (administrateurs uniquement) |

Tout est stocké dans `DATA_DIR` (SQLite `little-cars.db` + `uploads/`), hors des releases. Sur le serveur : `~/little-cars/shared/data`, **à sauvegarder**.

Le contenu par défaut reste dans `content/*.ts` : un document n'est écrit en base qu'après modification. L'éditeur déduit la forme de chaque document de sa valeur par défaut (`lib/content-schema.ts`) et refuse tout ce qui la casserait.

### Premier compte

Pas d'inscription libre : un lien d'invitation, valable 72 h, se crée en ligne de commande.

```bash
# en local
npm run admin:invite -- prenom.nom@exemple.fr "Prénom Nom"

# sur le serveur
cd ~/little-cars/current && DATA_DIR=~/little-cars/shared/data NEXT_PUBLIC_SITE_URL=https://little-cars.walautao.fr ~/.local/node22/bin/node scripts/admin-invite.mjs prenom.nom@exemple.fr "Prénom Nom"
```

Les invitations suivantes se font depuis l'écran Équipe.

## Versions et déploiement

Chaque **tag** `vX.Y.Z` déclenche `.github/workflows/deploy.yml` :
lint → build → release autonome → envoi sur le VPS → bascule du lien `current` → `pm2 reload` → contrôle de santé (retour automatique à la version précédente si le site ne répond pas) → release GitHub avec l'archive.

```bash
git tag v0.1.0
git push origin v0.1.0
```

Chaque push sur `main` passe par `.github/workflows/ci.yml` (lint + build).

### Secrets GitHub à créer (Settings → Secrets and variables → Actions)

| Secret | Valeur |
| --- | --- |
| `VPS_HOST` | `93.93.117.124` |
| `VPS_USER` | `warren` |
| `VPS_SSH_KEY` | clé privée de déploiement (entière) |
| `VPS_KNOWN_HOSTS` | sortie de `ssh-keyscan 93.93.117.124` |
| `VPS_PATH` | optionnel, défaut `/home/warren/little-cars` |

Variables (onglet *Variables*) pour la mise en production uniquement : `SITE_URL=https://little-cars.fr`, `SITE_INDEXABLE=true`.

### Préparation du serveur, une fois

1. Libérer de l'espace disque (le VPS était plein à 100 % le 14/09/2026).
2. `CERTBOT_EMAIL=… sudo -E bash deploy/setup-nginx.sh` (vhost + HTTPS).
3. Optionnel : `~/little-cars/shared/.env` pour le SMTP (voir `.env.example`).

### Bascule de little-cars.fr (plus tard)

Ne modifier que les enregistrements `A` de `little-cars.fr` et `www`. Conserver MX, autodiscover, DKIM, SPF, TXT (Google, Microsoft, Brevo) et les CNAME Stape (`data.`, `load.data.`). Passer `SITE_URL`/`SITE_INDEXABLE`, taguer, puis soumettre le sitemap dans la Search Console.
