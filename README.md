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
| `npm run studio` | Open the Stacki visual page editor at http://localhost:4350/studio |

## Three ways to edit

| What you want to change | Where |
| --- | --- |
| Restaurants, menus, prices, outlets, hours, promotions, photos, translations | **EmDash admin** at `/_emdash/admin` |
| A word or photo you can see on the site | **Click-to-edit** on the live site (see below) |
| Page layout: which sections a page has, their order, headings, button labels, colours and spacing | **Stacki Studio** (`npm run studio`) |

### Click-to-edit on the live site

Sign in to the admin, then open any page of the site. A small EmDash bar appears at the bottom; switch on **Edit mode**.

- Click any outlined text (restaurant name, tagline, price range, page titles, promotion titles…) and type. Rich text such as a restaurant's story is edited in place too.
- Click a photo to replace it from the media library or upload a new one.
- Click a list (signature dishes, menu, outlets, gallery) to open that list in the admin.
- Changes are saved as a **draft**; press **Publish** in the bar to make them live.
- On a `/zh` page you edit the Chinese version; the English page is unaffected.

### Stacki Studio (page layout)

[Stacki](https://github.com/flowtricks/stacki) is an open-source visual builder for Astro, installed in `studio/` (version 1.4.5). Run:

```bash
npm --prefix studio ci   # first time only: installs Studio's own dependencies
npm run studio           # → http://localhost:4350/studio
```

Every page is a list of sections (for example the homepage is `HomeHero`, `RestaurantGrid`, `SignatureStrip`, `StoryBand`, `LatestPromotions`, `Locations`). In Studio you can select a section, edit its settings (heading, intro, button labels and links, how many items to show), drag sections to reorder them, and add or remove sections from the component palette. Studio saves straight into the page files in `src/pages/`, so review the change with `git diff` and commit it like any other change. English and Chinese pages are separate files (`src/pages/…` and `src/pages/zh/…`), so update both.

Section content that comes from the CMS (restaurant names, dishes, promotions) is shown in Studio but edited in EmDash.

Known Stacki 1.4.5 issue: in a long, multi-line setting (such as the homepage headline), selecting all the text and typing a replacement keeps only the first letter, because the box switches to single-line mid-edit. Paste the new text instead, or edit within the existing text.

`npm run studio` edits the real files on your computer. Stacki's own `npm --prefix studio run dev` instead edits a temporary copy for its hosted (Cloudflare) workflow; see `studio/docs/cloudflare.md`.

## Editing content (for the DAFU team)

All content lives in three collections in the admin:

- **Restaurants** — one entry per brand. Fields: name, Chinese name (drives the signboard), tagline, short description, cuisine, signboard colour (red / gold / neon / jade), order on the site, price range, main photo, concept story, **signature dishes**, **menu** (items grouped by *Menu section*), optional menu PDF, photo gallery and **outlets** (name, area, address, opening hours, phone, WhatsApp, Google Maps link).
- **Promotions & News** — type (promotion / new opening / announcement), which restaurant it belongs to, summary, image, valid from/until and details. Items past their *Valid until* date drop off the site automatically. Scheduling lets you publish in advance.
- **Pages** — *About*, plus two special entries: `home` (the homepage hero photo) and `contact` (the *Group enquiries* text). Any other page you create appears at `/<slug>`. The homepage headline and other section headings are page settings, edited in Stacki Studio.

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
scripts/studio.mjs      Starts Stacki Studio on the project's own files
src/i18n/ui.ts          Interface text in English and Chinese, URL helpers
src/lib/content.ts      Content queries with English fallback, outlet helpers
src/lib/seo.ts          JSON-LD builders
src/lib/pageMeta.ts     <title>, description and JSON-LD for each kind of page
src/layouts/Base.astro  <head>, SEO tags, header and footer
src/components/         Signboard, Photo, cards, outlet + map
src/components/sections Page sections with editable settings (used by Stacki)
src/pages/              Pages as lists of sections: English at /, Chinese under zh/
studio/                 Stacki Studio source (its node_modules are not committed)
src/styles/global.css   Design tokens and base styles
```
