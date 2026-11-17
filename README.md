# DAFU 大福 — website

The website for DAFU, a Malaysian F&B group serving Hong Kong and Macau-inspired food in Genting Highlands and the Klang Valley.

Built with [Astro](https://astro.build) and [EmDash CMS](https://github.com/emdash-cms/emdash). Every restaurant, menu, outlet, promotion and page is edited in the admin at **`/_emdash/admin`** — no code changes needed to add a dish, a promotion, a new outlet or a whole new restaurant brand.

## Site map

| Page | English | 中文 |
| --- | --- | --- |
| Home | `/` | `/zh` |
| Our restaurants | `/restaurants` | `/zh/restaurants` |
| Restaurant details (concept, signature dishes, menu, gallery, hours, map) | `/restaurants/dafu-seafood` | `/zh/restaurants/dafu-seafood` |
| Promotions & news (filter by restaurant) | `/promotions` | `/zh/promotions` |
| Promotion / news item | `/promotions/<slug>` | `/zh/promotions/<slug>` |
| About us | `/about` | `/zh/about` |
| Locations & contact | `/contact` | `/zh/contact` |
| Any other page created under *Pages* | `/<slug>` | `/zh/<slug>` |

## Getting started

Requires Node.js 22.16 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:4321/_emdash/admin and create the first admin account. On first run against an empty database EmDash applies `seed/seed.json`, which creates the content types and the launch content for the three Phase 1 restaurants in English and Chinese.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / run it (Node standalone server) |
| `npm run typecheck` | Type-check the project |
| `npm run seed:build` | Regenerate `seed/seed.json` from `scripts/build-seed.mjs` |
| `npm run seed:apply` | Apply the seed to `./data.db` (only creates what is missing) |
| `npm run routes` | Regenerate the thin EN/中文 route files in `src/pages` |

## Editing content (for the DAFU team)

All content lives in three collections in the admin:

- **Restaurants** — one entry per brand. Fields: name, Chinese name (drives the signboard), tagline, short description, cuisine, signboard colour (red / gold / neon / jade), order on the site, price range, main photo, concept story, **signature dishes**, **menu** (items grouped by *Menu section*), optional menu PDF, photo gallery and **outlets** (name, area, address, opening hours, phone, WhatsApp, Google Maps link).
- **Promotions & News** — type (promotion / new opening / announcement), which restaurant it belongs to, summary, image, valid from/until and details. Items past their *Valid until* date drop off the site automatically. Scheduling lets you publish in advance.
- **Pages** — *About*, plus two special entries: `home` (homepage headline, intro and hero photo) and `contact` (contact page intro and the *Group enquiries* text). Any other page you create appears at `/<slug>`.

**Chinese version.** Open an entry and use the language switcher to add its 中文 translation. Anything not translated yet falls back to English automatically, so a new restaurant can go live in English first. Photos, signboard colour and order are shared between languages.

**SEO.** Each entry has an SEO panel (title, description, social image). Leave it empty to use the built-in defaults, which already include the restaurant name and "Genting Highlands".

**Navigation** is under *Menus → primary* (one per language).

### Phase 2: adding a restaurant brand or outlet

- **New outlet for an existing brand**: open the restaurant, add a row under *Outlets*. Choose *Klang Valley* as the area and the contact page grows a Klang Valley section automatically.
- **New brand**: create a new *Restaurants* entry, add its 中文 translation, then add its slug to the *Restaurant* options of the Promotions collection (*Content types → Promotions & News → Restaurant*) so promotions can be tagged to it.

## Before launch: content to confirm

The launch content was written from the brief. These details are placeholders and must be checked or filled in through the admin:

- [ ] **Photography** — no photos are uploaded yet. Until they are, restaurants and dishes show lettered signboard-style placeholders. Upload: a main photo per restaurant, a photo per signature dish, gallery photos, a homepage hero (Pages → home), promotion images, and a logo/favicon (Settings).
- [ ] **Outlet addresses** — currently `Genting Highlands, 69000 Pahang, Malaysia`. Add the exact address (e.g. building and lot), and paste each outlet's **Google Maps link** so directions open the right pin.
- [ ] **Phone and WhatsApp numbers** — empty; the call/WhatsApp buttons appear once filled.
- [ ] **Opening hours** — sample hours per outlet, plus the Google-format line (e.g. `Mo-Su 11:30-23:00`) used for search results.
- [ ] **Menus and prices** — sample items and prices.
- [ ] **Promotions** — four sample items (Sing Bar opening, congee breakfast set, crab weekends, upcoming brands). Edit or unpublish.
- [ ] **About text** and the **group enquiries email** (`hello@dafu.com.my` is a placeholder).
- [ ] **Domain** — set `SITE_URL` (see below). The default is `https://www.dafu.com.my`.

## SEO

Built in:

- Server-rendered HTML with unique, keyword-led `<title>` and description per page and language
- `hreflang` alternates (`en-MY`, `zh-Hans-MY`, `x-default`) and canonical URLs
- schema.org JSON-LD: `Organization`, `Restaurant` / `BarOrPub` per outlet (address, opening hours, cuisine, price range, menu, map), `ItemList`, `NewsArticle`, `BreadcrumbList`
- `/sitemap.xml` covering every page in both languages; `/robots.txt`
- Expired promotions and filtered listings are `noindex`
- Mobile-first layout, sticky *Menu / Directions / Call* bar on restaurant pages, lazy-loaded maps, responsive images

The 30 target keywords are mapped to pages in [`docs/seo-keywords.md`](docs/seo-keywords.md).

## Deployment

The site is a standard Node server (`@astrojs/node` standalone) with SQLite and local media storage — suitable for any VPS or container host.

```bash
npm ci
npm run build
SITE_URL=https://www.dafu.com.my HOST=0.0.0.0 PORT=4321 npm start
```

Persist `data.db` and the `uploads/` directory (they hold all CMS content and media), and back them up. Put the server behind HTTPS (Nginx, Caddy or a CDN).

To move to Cloudflare Workers (D1 database + R2 media) later, swap the adapter and database/storage in `astro.config.mjs` as described in the EmDash docs — the site code does not change.

## Project structure

```
astro.config.mjs        Astro + EmDash config, i18n (en, zh), fonts
seed/seed.json          Generated schema + launch content (do not edit by hand)
scripts/build-seed.mjs  Source for the seed: content types and bilingual content
scripts/gen-routes.mjs  Generates src/pages route files for each language
src/i18n/ui.ts          Interface text in English and Chinese, URL helpers
src/lib/content.ts      Content queries with English fallback, outlet helpers
src/lib/seo.ts          JSON-LD builders
src/layouts/Base.astro  <head>, SEO tags, header and footer
src/components/         Signboard, Photo, cards, outlet + map
src/views/              One view per page type, shared by both languages
src/pages/              Thin generated routes (/, /zh/...) + sitemap
src/styles/global.css   Design tokens and base styles
```
