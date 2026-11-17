/**
 * SEO data for each kind of page: <title>, description, social image and
 * JSON-LD. Pages spread the result onto <Base>, e.g.
 *   const meta = restaurantMeta(entry, "en", Astro);
 *   <Base lang="en" {...meta}>
 */
import { getSeoMeta } from "emdash";
import { accentOf, getRestaurants, outletsOf, type AnyEntry } from "./content";
import { breadcrumbJsonLd, imageUrl, itemListJsonLd, restaurantJsonLd } from "./seo";
import { localePath, useTranslations, type Lang } from "../i18n/ui";

type AstroLike = { site?: URL; url: URL; cache?: any };

export interface PageMeta {
	title?: string;
	description?: string | null;
	image?: string | null;
	pageType?: "website" | "article";
	jsonLd?: Record<string, unknown>[];
	noindex?: boolean;
}

const SITE = "DAFU 大福";
const originOf = (astro: AstroLike) => (astro.site ?? astro.url).origin;
const stripSite = (title?: string) => title?.replace(/\s*\|\s*DAFU 大福$/, "");

function crumbs(lang: Lang, origin: string, trail: { name: string; path: string }[]) {
	const t = useTranslations(lang);
	return breadcrumbJsonLd([{ name: t("breadcrumb.home"), path: localePath(lang, "/") }, ...trail], origin);
}

/** Static pages: title/description given by the page, plus breadcrumbs. */
export function staticMeta(
	lang: Lang,
	astro: AstroLike,
	opts: { title?: string; description?: string; crumb?: string; path?: string; jsonLd?: Record<string, unknown>[] },
): PageMeta {
	const origin = originOf(astro);
	const jsonLd = [...(opts.jsonLd ?? [])];
	if (opts.crumb && opts.path) jsonLd.push(crumbs(lang, origin, [{ name: opts.crumb, path: localePath(lang, opts.path) }]));
	return { title: opts.title, description: opts.description, jsonLd };
}

/** Homepage and restaurant listing: an ItemList of restaurants. */
export async function restaurantsListJsonLd(lang: Lang, astro: AstroLike) {
	return itemListJsonLd(await getRestaurants(lang, astro), lang, originOf(astro));
}

/** Locations page: Restaurant data for every outlet. */
export async function allOutletsJsonLd(lang: Lang, astro: AstroLike) {
	const origin = originOf(astro);
	return (await getRestaurants(lang, astro)).flatMap((r) => restaurantJsonLd(r, lang, origin));
}

export function restaurantMeta(entry: AnyEntry, lang: Lang, astro: AstroLike): PageMeta {
	const t = useTranslations(lang);
	const origin = originOf(astro);
	const d = entry.data;
	const path = localePath(lang, `/restaurants/${entry.id}`);
	const isBar = accentOf(entry) === "neon";
	const firstCuisine = d.cuisine ? String(d.cuisine).split(/[,，、]/)[0].trim() : "";
	const area =
		outletsOf(entry)[0]?.area === "Klang Valley"
			? lang === "zh" ? "巴生谷" : "Klang Valley"
			: lang === "zh" ? "云顶高原" : "Genting Highlands";
	// e.g. "DAFU Congee 粥大福 — Hong Kong restaurant in Genting Highlands" / "粥大福｜云顶高原港式餐厅"
	const defaultTitle =
		lang === "zh"
			? `${d.name}${d.name_zh !== d.name ? ` ${d.name_zh}` : ""}｜${area}${isBar ? "酒吧" : `${firstCuisine.replace(/[、，]/g, "")}餐厅`}`
			: `${d.name} ${d.name_zh} — ${isBar ? "Bar" : `${firstCuisine || "Chinese"} restaurant`} in ${area}`;
	const seo = getSeoMeta(entry as any, { siteTitle: SITE, siteUrl: origin, path, defaultTitle, defaultDescription: d.summary } as any) as any;
	return {
		title: stripSite(seo.title) ?? d.name,
		description: seo.description ?? d.summary,
		image: imageUrl(d.hero_image, origin),
		jsonLd: [
			...restaurantJsonLd(entry, lang, origin),
			crumbs(lang, origin, [
				{ name: t("nav.restaurants"), path: localePath(lang, "/restaurants") },
				{ name: d.name, path },
			]),
		],
	};
}

export function promotionMeta(entry: AnyEntry, lang: Lang, astro: AstroLike): PageMeta {
	const t = useTranslations(lang);
	const origin = originOf(astro);
	const d = entry.data;
	const path = localePath(lang, `/promotions/${entry.id}`);
	const seo = getSeoMeta(entry as any, { siteTitle: SITE, siteUrl: origin, path, defaultDescription: d.excerpt } as any) as any;
	const image = imageUrl(d.image, origin);
	return {
		title: stripSite(seo.title) ?? d.title,
		description: seo.description ?? d.excerpt,
		image,
		pageType: "article",
		noindex: !!d.valid_until && new Date(d.valid_until).getTime() < Date.now(),
		jsonLd: [
			{
				"@context": "https://schema.org",
				"@type": "NewsArticle",
				headline: d.title,
				description: d.excerpt,
				datePublished: d.publishedAt ? new Date(d.publishedAt).toISOString() : undefined,
				dateModified: d.updatedAt ? new Date(d.updatedAt).toISOString() : undefined,
				...(image ? { image } : {}),
				publisher: { "@id": `${origin}/#organization` },
				mainEntityOfPage: new URL(path, origin).href,
			},
			crumbs(lang, origin, [
				{ name: t("nav.promotions"), path: localePath(lang, "/promotions") },
				{ name: d.title, path },
			]),
		],
	};
}

export function cmsPageMeta(entry: AnyEntry, lang: Lang, astro: AstroLike): PageMeta {
	const origin = originOf(astro);
	const d = entry.data;
	const path = localePath(lang, `/${entry.id}`);
	const seo = getSeoMeta(entry as any, { siteTitle: SITE, siteUrl: origin, path, defaultDescription: d.intro } as any) as any;
	return {
		title: stripSite(seo.title) ?? d.title,
		description: seo.description ?? d.intro,
		image: imageUrl(d.hero_image, origin),
		jsonLd: [crumbs(lang, origin, [{ name: d.title, path }])],
	};
}
