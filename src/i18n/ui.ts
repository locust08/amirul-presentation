export const LANGS = ["en", "zh"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

/** BCP 47 tags for <html lang> and hreflang. */
export const HTML_LANG: Record<Lang, string> = { en: "en-MY", zh: "zh-Hans-MY" };
export const OG_LOCALE: Record<Lang, string> = { en: "en_MY", zh: "zh_CN" };

export function isLang(value: unknown): value is Lang {
	return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

/** Prefix a site path for a language. `path` must start with "/". */
export function localePath(lang: Lang, path: string): string {
	if (lang === DEFAULT_LANG) return path;
	return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** Strip a language prefix, returning the language-neutral path. */
export function neutralPath(pathname: string): string {
	const trimmed = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
	for (const lang of LANGS) {
		if (lang === DEFAULT_LANG) continue;
		if (trimmed === `/${lang}`) return "/";
		if (trimmed.startsWith(`/${lang}/`)) return trimmed.slice(lang.length + 1);
	}
	return trimmed || "/";
}

const en = {
	"site.name": "DAFU",
	"site.description":
		"DAFU 大福 brings Hong Kong and Macau food to Genting Highlands: dai pai dong seafood, Cantonese congee, Macau bakes and a Lan Kwai Fong-style bar.",
	"nav.home": "Home",
	"nav.restaurants": "Restaurants",
	"nav.promotions": "Promotions",
	"nav.about": "About",
	"nav.contact": "Find us",
	"nav.menu": "Menu",
	"nav.close": "Close",
	"nav.skip": "Skip to content",
	"lang.switch": "中文",
	"lang.switchLabel": "阅读中文版",

	"home.title": "Hong Kong & Macau restaurants in Genting Highlands",
	"home.heading": "Hong Kong and Macau flavours, up in Genting Highlands",
	"home.lede":
		"Wok-fired seafood, slow-cooked congee and a Lan Kwai Fong night out. Three DAFU restaurants, one short walk apart at the top of the hill.",
	"home.ctaRestaurants": "Choose a restaurant",
	"home.ctaDirections": "Get directions",
	"home.restaurantsHeading": "Pick your table",
	"home.restaurantsLede": "Every DAFU restaurant does one thing the way Hong Kong and Macau do it best.",
	"home.signaturesHeading": "Dishes people come back for",
	"home.storyHeading": "Named for a dinner-table blessing",
	"home.storyBody":
		"大福 — “great fortune” — is the wish you hear when glasses are raised across a Hong Kong or Macau table. We brought that table to Malaysia.",
	"home.storyLink": "Read our story",
	"home.promosHeading": "What’s on",
	"home.promosLink": "See all promotions and news",
	"home.visitHeading": "Find us in Genting Highlands",
	"home.visitLink": "All locations and contact details",

	"restaurants.title": "Our restaurants",
	"restaurants.heading": "Our restaurants",
	"restaurants.lede":
		"Hong Kong street-kitchen seafood, Cantonese congee with Macau bakes, and a Lan Kwai Fong-style bar — all in Genting Highlands.",
	"restaurants.view": "View restaurant",
	"restaurants.menu": "Menu",
	"restaurants.signatures": "Signature dishes",
	"restaurants.gallery": "Inside the restaurant",
	"restaurants.visit": "Visit",
	"restaurants.hours": "Opening hours",
	"restaurants.address": "Address",
	"restaurants.phone": "Phone",
	"restaurants.directions": "Directions on Google Maps",
	"restaurants.whatsapp": "WhatsApp us",
	"restaurants.call": "Call",
	"restaurants.menuPdf": "Download the full menu (PDF)",
	"restaurants.priceRange": "Price range",
	"restaurants.promos": "Current promotions",
	"restaurants.others": "Also at DAFU",
	"restaurants.mapTitle": "Map showing",
	"restaurants.menuNote": "Prices in Malaysian ringgit. Seasonal seafood is charged at the day’s price.",
	"restaurants.empty": "Restaurants will appear here once they are published in the admin.",

	"promotions.title": "Promotions & news",
	"promotions.heading": "Promotions & news",
	"promotions.lede": "Offers, new openings and announcements from DAFU restaurants.",
	"promotions.kind.promotion": "Promotion",
	"promotions.kind.opening": "New opening",
	"promotions.kind.announcement": "Announcement",
	"promotions.validUntil": "Valid until",
	"promotions.from": "From",
	"promotions.read": "Read more",
	"promotions.back": "All promotions and news",
	"promotions.allRestaurants": "All DAFU restaurants",
	"promotions.empty": "No promotions right now. Check back soon, or visit one of our restaurants.",
	"promotions.at": "At",

	"contact.title": "Locations & contact",
	"contact.heading": "Find a DAFU restaurant",
	"contact.lede":
		"All our restaurants are in Genting Highlands for now, with Klang Valley outlets coming. Tap an address for directions.",
	"contact.groupHeading": "Group enquiries",
	"contact.groupBody":
		"For group bookings, events, partnerships or media, message the restaurant directly or reach the DAFU team using the details below.",

	"about.title": "About DAFU",

	"footer.tagline": "Hong Kong and Macau-inspired restaurants in Genting Highlands and the Klang Valley.",
	"footer.explore": "Explore",
	"footer.restaurants": "Restaurants",
	"footer.rights": "All rights reserved.",

	"notFound.title": "Page not found",
	"notFound.body": "This page doesn’t exist or has moved. Try one of our restaurants instead.",
	"notFound.home": "Go to the homepage",

	"breadcrumb.home": "Home",
	"common.genting": "Genting Highlands",
};

export type UIKey = keyof typeof en;

const zh: Record<UIKey, string> = {
	"site.name": "大福",
	"site.description":
		"大福 DAFU 把港澳美食带到云顶高原：大排档海鲜、广式粥品、澳门烘焙，以及兰桂坊风格酒吧。",
	"nav.home": "首页",
	"nav.restaurants": "餐厅",
	"nav.promotions": "优惠与资讯",
	"nav.about": "关于大福",
	"nav.contact": "地点与联系",
	"nav.menu": "菜单",
	"nav.close": "关闭",
	"nav.skip": "跳至内容",
	"lang.switch": "EN",
	"lang.switchLabel": "Read in English",

	"home.title": "云顶高原港澳风味餐厅",
	"home.heading": "港澳好味道，就在云顶高原",
	"home.lede": "猛火海鲜、慢熬靓粥、兰桂坊之夜。三家大福餐厅，就在山顶，步行即达。",
	"home.ctaRestaurants": "选择餐厅",
	"home.ctaDirections": "查看路线",
	"home.restaurantsHeading": "今天吃哪家？",
	"home.restaurantsLede": "每家大福餐厅，都以港澳最地道的方式，做好一件事。",
	"home.signaturesHeading": "回头客必点",
	"home.storyHeading": "以饭桌上的祝福为名",
	"home.storyBody": "“大福”是港澳饭桌举杯时最常听到的祝愿。我们把这张饭桌搬到了马来西亚。",
	"home.storyLink": "了解我们的故事",
	"home.promosHeading": "最新动态",
	"home.promosLink": "查看全部优惠与资讯",
	"home.visitHeading": "云顶高原分店",
	"home.visitLink": "全部地点与联系方式",

	"restaurants.title": "我们的餐厅",
	"restaurants.heading": "我们的餐厅",
	"restaurants.lede": "香港大排档海鲜、广式粥品配澳门烘焙，以及兰桂坊风格酒吧——都在云顶高原。",
	"restaurants.view": "查看餐厅",
	"restaurants.menu": "菜单",
	"restaurants.signatures": "招牌菜",
	"restaurants.gallery": "店内环境",
	"restaurants.visit": "到访",
	"restaurants.hours": "营业时间",
	"restaurants.address": "地址",
	"restaurants.phone": "电话",
	"restaurants.directions": "在 Google 地图查看路线",
	"restaurants.whatsapp": "WhatsApp 联系",
	"restaurants.call": "致电",
	"restaurants.menuPdf": "下载完整菜单（PDF）",
	"restaurants.priceRange": "人均消费",
	"restaurants.promos": "当前优惠",
	"restaurants.others": "更多大福餐厅",
	"restaurants.mapTitle": "地图：",
	"restaurants.menuNote": "价格以马币计算。时令海鲜按当日时价。",
	"restaurants.empty": "餐厅在后台发布后会显示在这里。",

	"promotions.title": "优惠与资讯",
	"promotions.heading": "优惠与资讯",
	"promotions.lede": "大福各餐厅的优惠、新店开幕与最新消息。",
	"promotions.kind.promotion": "优惠",
	"promotions.kind.opening": "新店开幕",
	"promotions.kind.announcement": "公告",
	"promotions.validUntil": "有效期至",
	"promotions.from": "起",
	"promotions.read": "阅读详情",
	"promotions.back": "全部优惠与资讯",
	"promotions.allRestaurants": "大福全线餐厅",
	"promotions.empty": "目前没有优惠活动，欢迎稍后再来看看，或直接光临我们的餐厅。",
	"promotions.at": "适用于",

	"contact.title": "地点与联系",
	"contact.heading": "找到大福餐厅",
	"contact.lede": "目前所有餐厅位于云顶高原，巴生谷分店即将开业。点击地址即可查看路线。",
	"contact.groupHeading": "团体与合作查询",
	"contact.groupBody": "团体订座、活动、合作或媒体查询，请直接联系相关餐厅，或通过以下方式联系大福团队。",

	"about.title": "关于大福",

	"footer.tagline": "云顶高原与巴生谷的港澳风味餐厅。",
	"footer.explore": "浏览",
	"footer.restaurants": "餐厅",
	"footer.rights": "版权所有。",

	"notFound.title": "找不到页面",
	"notFound.body": "此页面不存在或已移动。不如看看我们的餐厅？",
	"notFound.home": "返回首页",

	"breadcrumb.home": "首页",
	"common.genting": "云顶高原",
};

const dictionaries: Record<Lang, Record<UIKey, string>> = { en, zh };

export function useTranslations(lang: Lang) {
	return (k: UIKey) => dictionaries[lang][k] ?? en[k];
}

export function formatDate(date: Date | string | null | undefined, lang: Lang): string {
	if (!date) return "";
	const d = typeof date === "string" ? new Date(date) : date;
	if (Number.isNaN(d.getTime())) return "";
	return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-MY", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "Asia/Kuala_Lumpur",
	}).format(d);
}
