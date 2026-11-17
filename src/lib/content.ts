import { getEmDashCollection, getEmDashEntry } from "emdash";
import { DEFAULT_LANG, type Lang } from "../i18n/ui";

export type AnyEntry = { id: string; data: Record<string, any>; edit?: any };

interface CacheTarget {
	cache?: { enabled?: boolean; set: (hint: any) => void };
}

/**
 * Translated entries come back with ids like "zh/dafu-congee". Give every entry
 * its plain slug as `id` so URLs and lookups are language-neutral.
 */
function normalize(entry: AnyEntry): AnyEntry {
	const slug = typeof entry.data?.slug === "string" && entry.data.slug ? entry.data.slug : entry.id;
	return slug === entry.id ? entry : { ...entry, id: slug };
}

function remember(astro: CacheTarget | undefined, hint: unknown) {
	if (hint && astro?.cache?.enabled) astro.cache.set(hint);
}

/**
 * Fetch a collection in `lang`, falling back to the English entry for anything
 * that has not been translated yet. Entries share a slug across languages.
 */
export async function getLocalizedCollection(
	collection: "restaurants" | "promotions" | "pages",
	lang: Lang,
	astro?: CacheTarget,
	options: { limit?: number; orderBy?: Record<string, "asc" | "desc"> } = {},
): Promise<AnyEntry[]> {
	const query = { status: "published", limit: options.limit ?? 100, orderBy: options.orderBy } as const;
	const base = await getEmDashCollection(collection as any, { ...query, locale: DEFAULT_LANG } as any);
	remember(astro, base.cacheHint);
	const baseEntries = ((base.entries ?? []) as unknown as AnyEntry[]).map(normalize);
	if (lang === DEFAULT_LANG) return baseEntries;

	const translated = await getEmDashCollection(collection as any, { ...query, locale: lang } as any);
	remember(astro, translated.cacheHint);
	const bySlug = new Map(
		((translated.entries ?? []) as unknown as AnyEntry[]).map(normalize).map((e) => [e.id, e]),
	);
	const merged = baseEntries.map((e) => bySlug.get(e.id) ?? e);
	// Entries that only exist in the translated language still get shown.
	for (const entry of bySlug.values()) {
		if (!baseEntries.some((e) => e.id === entry.id)) merged.push(entry);
	}
	return merged;
}

/** Fetch one entry by slug in `lang` (EmDash falls back to the default locale). */
export async function getLocalizedEntry(
	collection: "restaurants" | "promotions" | "pages",
	slug: string,
	lang: Lang,
	astro?: CacheTarget,
): Promise<AnyEntry | null> {
	const result = await getEmDashEntry(collection as any, slug, { locale: lang } as any);
	remember(astro, result.cacheHint);
	return result.entry ? normalize(result.entry as unknown as AnyEntry) : null;
}

export async function getRestaurants(lang: Lang, astro?: CacheTarget) {
	const entries = await getLocalizedCollection("restaurants", lang, astro);
	return entries.sort((a, b) => (a.data.sort_order ?? 99) - (b.data.sort_order ?? 99));
}

export async function getPromotions(lang: Lang, astro?: CacheTarget, limit?: number) {
	const entries = await getLocalizedCollection("promotions", lang, astro, {
		orderBy: { published_at: "desc" },
	});
	const now = Date.now();
	const live = entries.filter((e) => {
		const until = e.data.valid_until ? new Date(e.data.valid_until).getTime() : null;
		return until === null || Number.isNaN(until) || until >= now;
	});
	return typeof limit === "number" ? live.slice(0, limit) : live;
}

export interface Outlet {
	name: string;
	area?: string;
	address?: string;
	hours?: string;
	hours_schema?: string;
	phone?: string;
	whatsapp?: string;
	maps_url?: string;
	map_query?: string;
}

export function outletsOf(entry: AnyEntry): Outlet[] {
	return Array.isArray(entry.data.outlets) ? entry.data.outlets.filter((o: Outlet) => o?.name) : [];
}

export function directionsUrl(outlet: Outlet): string {
	if (outlet.maps_url) return outlet.maps_url;
	const q = outlet.map_query || `${outlet.name}, ${outlet.address ?? ""}`;
	return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
}

export function mapEmbedUrl(outlet: Outlet, lang: Lang): string {
	const q = outlet.map_query || `${outlet.name}, ${outlet.address ?? ""}`;
	return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&hl=${lang === "zh" ? "zh-CN" : "en"}&z=15&output=embed`;
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(number: string): string {
	return `https://wa.me/${number.replace(/\D/g, "")}`;
}

/** Group menu repeater rows by their section, preserving order. */
export function groupMenu(rows: Array<Record<string, any>> | undefined) {
	const sections: { title: string; items: Array<Record<string, any>> }[] = [];
	for (const row of rows ?? []) {
		if (!row?.name) continue;
		const title = row.section || "";
		let section = sections.find((s) => s.title === title);
		if (!section) {
			section = { title, items: [] };
			sections.push(section);
		}
		section.items.push(row);
	}
	return sections;
}

export type Accent = "red" | "gold" | "neon" | "jade";
export function accentOf(entry: AnyEntry | undefined | null): Accent {
	const a = entry?.data?.accent;
	return a === "gold" || a === "neon" || a === "jade" ? a : "red";
}

/** Lookup used to label promotions with their restaurant. */
export function restaurantLookup(entries: AnyEntry[]) {
	return new Map(
		entries.map((e) => [e.id, { name: e.data.name as string, name_zh: e.data.name_zh as string, accent: accentOf(e) }]),
	);
}

export function hasImage(value: unknown): boolean {
	return !!value && typeof value === "object" && !!((value as any).id || (value as any).src);
}
