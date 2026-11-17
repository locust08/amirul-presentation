This is the DAFU 大福 restaurant group website: an EmDash CMS site on Astro (Node adapter, SQLite, local media), bilingual English (default, no prefix) and Simplified Chinese (`/zh`).

## Commands

```bash
npm run dev           # dev server; admin at http://localhost:4321/_emdash/admin
npm run typecheck     # astro check
npm run seed:build    # regenerate seed/seed.json from scripts/build-seed.mjs
npm run routes        # regenerate src/pages route wrappers from scripts/gen-routes.mjs
```

## How it fits together

- Content types (`restaurants`, `promotions`, `pages`) and launch content are defined in `scripts/build-seed.mjs`. Never hand-edit `seed/seed.json`.
- Pages are rendered by views in `src/views/*View.astro` that take a `lang` prop. `src/pages/**` files are generated wrappers — change the generator, not the files.
- Query content through `src/lib/content.ts` (`getLocalizedCollection`, `getLocalizedEntry`, `getRestaurants`, `getPromotions`). It falls back to English for untranslated entries and normalises translated ids (EmDash returns `zh/<slug>`) back to the plain slug.
- UI strings live in `src/i18n/ui.ts`; add every key in both `en` and `zh`.
- Outlets are a repeater on each restaurant; promotions link to a restaurant via the `restaurant` select (slug or `all`).
- `src/pages/sitemap.xml.ts` overrides EmDash's sitemap so static pages are included. The dev server must be restarted after adding/removing a route override.
- Signboards stack characters in a flex column instead of `writing-mode` — the web CJK font subset lacks vertical metrics.

## Rules (from EmDash)

- All pages are server-rendered; no `getStaticPaths()` for CMS content.
- Image fields are objects — render with `<Image image={...} />` from `emdash/ui` (or the `Photo` component, which adds a placeholder).
- Agent skills for EmDash are in `.agents/skills/`. Live docs: `https://docs.emdashcms.com/mcp`.
