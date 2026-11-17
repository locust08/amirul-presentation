import { localePath, type Lang } from "../i18n/ui";
import { outletsOf, directionsUrl } from "./content";

type Entry = { id: string; data: Record<string, any> };

const abs = (origin: string, path: string) => new URL(path, origin).href;

export function imageUrl(value: unknown, origin: string): string | null {
	const v = value as { src?: string } | null;
	return v?.src ? abs(origin, v.src) : null;
}

/** schema.org Restaurant / BarOrPub entries, one per outlet. */
export function restaurantJsonLd(entry: Entry, lang: Lang, origin: string) {
	const url = abs(origin, localePath(lang, `/restaurants/${entry.id}`));
	const isBar = entry.data.accent === "neon";
	const image = imageUrl(entry.data.hero_image, origin);
	return outletsOf(entry).map((outlet, i) => ({
		"@context": "https://schema.org",
		"@type": isBar ? "BarOrPub" : "Restaurant",
		"@id": `${url}#outlet-${i + 1}`,
		name: outlet.name || entry.data.name,
		alternateName: entry.data.name_zh,
		description: entry.data.summary,
		url,
		...(image ? { image } : {}),
		servesCuisine: entry.data.cuisine
			? String(entry.data.cuisine)
					.split(/[,，、]/)
					.map((s) => s.trim())
					.filter(Boolean)
			: undefined,
		priceRange: entry.data.price_range || undefined,
		telephone: outlet.phone || undefined,
		address: {
			"@type": "PostalAddress",
			streetAddress: outlet.address,
			addressLocality: outlet.area || "Genting Highlands",
			addressRegion: outlet.area === "Klang Valley" ? "Selangor" : "Pahang",
			addressCountry: "MY",
		},
		openingHours: outlet.hours_schema || undefined,
		hasMap: directionsUrl(outlet),
		hasMenu: `${url}#menu`,
		parentOrganization: { "@id": `${origin}/#organization` },
	}));
}

export function breadcrumbJsonLd(items: { name: string; path: string }[], origin: string) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: abs(origin, item.path),
		})),
	};
}

export function itemListJsonLd(entries: Entry[], lang: Lang, origin: string) {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: entries.map((e, i) => ({
			"@type": "ListItem",
			position: i + 1,
			url: abs(origin, localePath(lang, `/restaurants/${e.id}`)),
			name: e.data.name,
		})),
	};
}
