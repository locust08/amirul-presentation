This is the DAFU 大福 restaurant group website: an EmDash CMS site on Astro (Node adapter, SQLite, local media), bilingual English (default, no prefix) and Simplified Chinese (`/zh`), with Stacki Studio for visual page layout.

## Commands

```bash
npm run dev           # dev server; admin at http://localhost:4321/_emdash/admin
npm run typecheck     # astro check
npm run studio        # Stacki visual editor on the real files, http://localhost:4350/studio
npm run seed:build    # regenerate seed/seed.json from scripts/build-seed.mjs
```

For a logged-in editor in local dev (click-to-edit testing), open `/_emdash/api/setup/dev-bypass?redirect=/`.

## How it fits together

- Content types (`restaurants`, `promotions`, `pages`) and launch content are defined in `scripts/build-seed.mjs`. Never hand-edit `seed/seed.json`.
- Pages in `src/pages/**` are flat lists of section components from `src/components/sections/`, so Stacki can edit them visually. Keep page markup simple: sections with literal props. Logic belongs in the section components or `src/lib/`, not in page markup. English and Chinese pages are separate files; change both.
- Section components declare `interface Props` with a short comment per prop; Stacki builds its settings panel from that.
- Page SEO comes from `src/lib/pageMeta.ts`; restaurant/promotion/CMS pages load their entry in the page frontmatter and pass it to sections as `entry`.
- Query content through `src/lib/content.ts` (`getLocalizedCollection`, `getLocalizedEntry`, `getRestaurants`, `getPromotions`). It falls back to English for untranslated entries and normalises translated ids (EmDash returns `zh/<slug>`) back to the plain slug.
- Click-to-edit: spread `{...entry.edit?.<field>}` on the element that shows a field. Text and images edit inline; repeaters (`signatures`, `menu`, `outlets`, `gallery`) open the admin. Portable Text is editable automatically.
- UI strings live in `src/i18n/ui.ts`; add every key in both `en` and `zh`.
- `src/pages/sitemap.xml.ts` overrides EmDash's sitemap so static pages are included. Restart the dev server after adding or removing a route override.
- Signboards stack characters in a flex column instead of `writing-mode`: the web CJK font subset lacks vertical metrics.
- `studio/` is Stacki's own source (MIT, v1.4.5). Don't edit it by hand; update it with Stacki's update CLI.

## Rules (from EmDash)

- All pages are server-rendered; no `getStaticPaths()` for CMS content.
- Image fields are objects. Render them with `<Image image={...} />` from `emdash/ui` (or the `Photo` component, which adds a placeholder).
- Agent skills for EmDash are in `.agents/skills/`. Live docs: `https://docs.emdashcms.com/mcp`.
