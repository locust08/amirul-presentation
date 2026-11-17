import type { APIRoute } from "astro";
import { getLocalizedCollection, getPromotions } from "../lib/content";
import { DEFAULT_LANG, HTML_LANG, LANGS, localePath } from "../i18n/ui";

/** Pages entries that are rendered by their own routes, not /[slug]. */
const RESERVED_PAGES = new Set(["home", "contact"]);

export const GET: APIRoute = async ({ site, url }) => {
	const origin = (site ?? url).origin;

	const [restaurants, promotions, pages] = await Promise.all([
		getLocalizedCollection("restaurants", DEFAULT_LANG),
		getPromotions(DEFAULT_LANG),
		getLocalizedCollection("pages", DEFAULT_LANG),
	]);

	const lastmod = (e?: { data: Record<string, any> }) => {
		const d = e?.data.updatedAt ?? e?.data.publishedAt;
		return d ? new Date(d).toISOString() : undefined;
	};

	const entries: { path: string; lastmod?: string; priority: string }[] = [
		{ path: "/", priority: "1.0" },
		{ path: "/restaurants", priority: "0.9" },
		...restaurants.map((r) => ({ path: `/restaurants/${r.id}`, lastmod: lastmod(r), priority: "0.9" })),
		{ path: "/promotions", priority: "0.7" },
		...promotions.map((p) => ({ path: `/promotions/${p.id}`, lastmod: lastmod(p), priority: "0.6" })),
		{ path: "/contact", priority: "0.8" },
		...pages
			.filter((p) => !RESERVED_PAGES.has(p.id))
			.map((p) => ({ path: `/${p.id}`, lastmod: lastmod(p), priority: "0.6" })),
	];

	const urls = entries.flatMap((entry) =>
		LANGS.map((lang) => {
			const alternates = [
				...LANGS.map(
					(l) =>
						`    <xhtml:link rel="alternate" hreflang="${HTML_LANG[l]}" href="${new URL(localePath(l, entry.path), origin).href}"/>`,
				),
				`    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL(entry.path, origin).href}"/>`,
			].join("\n");
			return `  <url>
    <loc>${new URL(localePath(lang, entry.path), origin).href}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ""}
    <priority>${entry.priority}</priority>
${alternates}
  </url>`;
		}),
	);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
