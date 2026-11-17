/**
 * Generates seed/seed.json — the EmDash schema plus first-launch content
 * in English (default) and Simplified Chinese.
 *
 *   node scripts/build-seed.mjs
 *
 * The seed is only applied to an empty database. After launch, the team edits
 * everything in the admin at /_emdash/admin; this script is for resetting a
 * fresh environment.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// ---------- Portable Text helpers ----------
let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}`;
const block = (style, text) => ({
	_type: "block",
	_key: key(),
	style,
	markDefs: [],
	children: [{ _type: "span", _key: key(), text, marks: [] }],
});
const p = (text) => block("normal", text);
const h2 = (text) => block("h2", text);
const quote = (text) => block("blockquote", text);

// ---------- Shared option lists ----------
const ACCENTS = ["red", "gold", "neon", "jade"];
const AREAS = ["Genting Highlands", "Klang Valley"];
const PROMO_KINDS = ["promotion", "opening", "announcement"];
const RESTAURANT_SLUGS = ["all", "dafu-seafood", "dafu-congee", "dafu-sing-bar"];

// ---------- Schema ----------
const collections = [
	{
		slug: "restaurants",
		label: "Restaurants",
		labelSingular: "Restaurant",
		sortOrder: 1,
		supports: ["drafts", "revisions", "search", "seo"],
		urlPattern: "/restaurants/{slug}",
		fields: [
			{ slug: "name", label: "Name", type: "string", required: true, searchable: true },
			{
				slug: "name_zh",
				label: "Chinese name (shown on the signboard)",
				type: "string",
				required: true,
				translatable: false,
			},
			{ slug: "tagline", label: "Tagline", type: "string", searchable: true },
			{ slug: "summary", label: "Short description (cards and search results)", type: "text", searchable: true },
			{ slug: "cuisine", label: "Cuisine (used for Google rich results)", type: "string" },
			{
				slug: "accent",
				label: "Signboard colour",
				type: "select",
				translatable: false,
				validation: { options: ACCENTS },
				defaultValue: "red",
			},
			{ slug: "sort_order", label: "Order on the site", type: "integer", translatable: false, defaultValue: 10 },
			{ slug: "price_range", label: "Price range (e.g. RM30–RM80 per person)", type: "string" },
			{ slug: "hero_image", label: "Main photo", type: "image", translatable: false },
			{ slug: "story", label: "Concept / story", type: "portableText", searchable: true },
			{
				slug: "signatures",
				label: "Signature dishes",
				type: "repeater",
				validation: {
					maxItems: 8,
					subFields: [
						{ slug: "name", label: "Dish", type: "string", required: true },
						{ slug: "name_zh", label: "Chinese name", type: "string" },
						{ slug: "description", label: "Description", type: "text" },
						{ slug: "price", label: "Price", type: "string" },
						{ slug: "image", label: "Photo", type: "image" },
					],
				},
			},
			{
				slug: "menu",
				label: "Menu",
				type: "repeater",
				validation: {
					subFields: [
						{ slug: "section", label: "Menu section", type: "string", required: true },
						{ slug: "name", label: "Item", type: "string", required: true },
						{ slug: "name_zh", label: "Chinese name", type: "string" },
						{ slug: "description", label: "Description", type: "text" },
						{ slug: "price", label: "Price", type: "string" },
					],
				},
			},
			{ slug: "menu_pdf", label: "Full menu (PDF, optional)", type: "file", translatable: false },
			{
				slug: "gallery",
				label: "Photo gallery",
				type: "repeater",
				translatable: false,
				validation: {
					maxItems: 12,
					subFields: [
						{ slug: "image", label: "Photo", type: "image", required: true },
						{ slug: "caption", label: "Caption", type: "string" },
					],
				},
			},
			{
				slug: "outlets",
				label: "Outlets",
				type: "repeater",
				validation: {
					subFields: [
						{ slug: "name", label: "Outlet name", type: "string", required: true },
						{ slug: "area", label: "Area", type: "select", options: AREAS, required: true },
						{ slug: "address", label: "Address", type: "text", required: true },
						{ slug: "hours", label: "Opening hours (as shown to guests)", type: "text" },
						{ slug: "hours_schema", label: "Opening hours for Google (e.g. Mo-Su 11:30-23:00)", type: "string" },
						{ slug: "phone", label: "Phone", type: "string" },
						{ slug: "whatsapp", label: "WhatsApp number (digits only, e.g. 60123456789)", type: "string" },
						{ slug: "maps_url", label: "Google Maps link", type: "url" },
						{ slug: "map_query", label: "Map search text (place name or address)", type: "string" },
					],
				},
			},
		],
	},
	{
		slug: "promotions",
		label: "Promotions & News",
		labelSingular: "Promotion / news item",
		sortOrder: 2,
		supports: ["drafts", "revisions", "search", "seo", "scheduling"],
		urlPattern: "/promotions/{slug}",
		fields: [
			{ slug: "title", label: "Title", type: "string", required: true, searchable: true },
			{
				slug: "kind",
				label: "Type",
				type: "select",
				translatable: false,
				validation: { options: PROMO_KINDS },
				defaultValue: "promotion",
			},
			{
				slug: "restaurant",
				label: "Restaurant (slug, or “all”)",
				type: "select",
				translatable: false,
				validation: { options: RESTAURANT_SLUGS },
				defaultValue: "all",
			},
			{ slug: "excerpt", label: "Summary", type: "text", searchable: true },
			{ slug: "image", label: "Image", type: "image", translatable: false },
			{ slug: "valid_from", label: "Valid from", type: "datetime", translatable: false },
			{ slug: "valid_until", label: "Valid until", type: "datetime", translatable: false },
			{ slug: "content", label: "Details", type: "portableText", searchable: true },
		],
	},
	{
		slug: "pages",
		label: "Pages",
		labelSingular: "Page",
		sortOrder: 3,
		supports: ["drafts", "revisions", "search", "seo"],
		urlPattern: "/{slug}",
		fields: [
			{ slug: "title", label: "Title", type: "string", required: true, searchable: true },
			{ slug: "intro", label: "Intro", type: "text", searchable: true },
			{ slug: "hero_image", label: "Main photo", type: "image", translatable: false },
			{ slug: "content", label: "Content", type: "portableText", searchable: true },
		],
	},
];

// ---------- Content ----------
const restaurants = [
	{
		id: "r-seafood",
		slug: "dafu-seafood",
		shared: { name_zh: "大福海鲜大排档", accent: "red", sort_order: 1 },
		en: {
			name: "DAFU Seafood",
			tagline: "Hong Kong dai pai dong seafood, wok-fired to order",
			summary:
				"Live seafood cooked the way Hong Kong’s open-air street kitchens do it: high flame, quick hands, and plenty of garlic. Made for big tables and late dinners in Genting Highlands.",
			cuisine: "Hong Kong, Cantonese, Seafood",
			price_range: "RM60–RM150 per person",
			story: [
				p("Dai pai dong are Hong Kong’s licensed street kitchens: a roaring wok, folding tables, and seafood picked straight from the tank. DAFU Seafood brings that energy indoors to Genting Highlands, with the same respect for fresh catch and fierce wok heat."),
				p("Choose your crab, prawns or fish from the day’s selection and tell us how you like it — typhoon-shelter style with crispy garlic, salt and pepper, ginger and scallion, or steamed Hong Kong style with superior soy."),
				quote("Big tables, loud conversation, food meant for sharing."),
			],
			signatures: [
				{ name: "Typhoon Shelter Crab", name_zh: "避风塘炒蟹", description: "Mud crab wok-fried with a mountain of golden garlic, chilli and fermented black beans.", price: "Seasonal price" },
				{ name: "Salt & Pepper Mantis Prawn", name_zh: "椒盐濑尿虾", description: "Crisp-fried and tossed with garlic, chilli and spring onion.", price: "RM68" },
				{ name: "Hong Kong Steamed Grouper", name_zh: "港式清蒸石斑", description: "Steamed whole, finished with sizzling oil and superior soy.", price: "Seasonal price" },
				{ name: "Ginger & Scallion Lobster with Noodles", name_zh: "姜葱龙虾伊面", description: "Lobster tossed in a ginger-scallion sauce over braised e-fu noodles.", price: "Seasonal price" },
			],
			menu: [
				{ section: "Live seafood", name: "Typhoon Shelter Crab", name_zh: "避风塘炒蟹", price: "Seasonal" },
				{ section: "Live seafood", name: "Steamed Garlic Scallops (6 pcs)", name_zh: "蒜蓉蒸扇贝", price: "RM48" },
				{ section: "Live seafood", name: "Salt & Pepper Mantis Prawn", name_zh: "椒盐濑尿虾", price: "RM68" },
				{ section: "Live seafood", name: "Hong Kong Steamed Grouper", name_zh: "港式清蒸石斑", price: "Seasonal" },
				{ section: "Wok & claypot", name: "Claypot Chicken Rice", name_zh: "瓦煲鸡饭", price: "RM32" },
				{ section: "Wok & claypot", name: "Black Pepper Beef Hor Fun", name_zh: "黑椒牛河", price: "RM26" },
				{ section: "Wok & claypot", name: "Sweet & Sour Pork", name_zh: "咕噜肉", price: "RM28" },
				{ section: "Vegetables", name: "Stir-fried Kailan with Garlic", name_zh: "蒜蓉炒芥兰", price: "RM18" },
				{ section: "Drinks", name: "Iced Lemon Tea", name_zh: "冻柠茶", price: "RM8" },
			],
			outlets: [
				{
					name: "DAFU Seafood, Genting Highlands",
					area: "Genting Highlands",
					address: "Genting Highlands, 69000 Pahang, Malaysia",
					hours: "Daily, 11:30am – 11:00pm",
					hours_schema: "Mo-Su 11:30-23:00",
					map_query: "DAFU Seafood Genting Highlands",
				},
			],
		},
		zh: {
			name: "大福海鲜大排档",
			tagline: "香港大排档风味，猛火现炒海鲜",
			summary: "鲜活海鲜，按香港大排档的方式烹调：猛火、快手、蒜香十足。适合云顶高原的大桌聚餐与宵夜。",
			cuisine: "港式、粤菜、海鲜",
			price_range: "每人约 RM60–RM150",
			story: [
				p("大排档是香港街头的持牌露天厨房：熊熊炉火、折叠桌椅、现捞现煮的海鲜。大福海鲜大排档把这份热闹带进云顶高原，同样讲究新鲜渔获与镬气。"),
				p("从当日海鲜中挑选螃蟹、大虾或鲜鱼，告诉我们您喜欢的做法——避风塘金蒜、椒盐、姜葱，或港式清蒸。"),
				quote("大桌、热闹、一起分享。"),
			],
			signatures: [
				{ name: "避风塘炒蟹", name_zh: "避风塘炒蟹", description: "肉蟹配大量金黄蒜蓉、辣椒与豆豉猛火爆炒。", price: "时价" },
				{ name: "椒盐濑尿虾", name_zh: "椒盐濑尿虾", description: "酥炸后以蒜蓉、辣椒、葱花翻炒。", price: "RM68" },
				{ name: "港式清蒸石斑", name_zh: "港式清蒸石斑", description: "原条清蒸，淋上热油与蒸鱼豉油。", price: "时价" },
				{ name: "姜葱龙虾伊面", name_zh: "姜葱龙虾伊面", description: "姜葱龙虾配焖伊面。", price: "时价" },
			],
			menu: [
				{ section: "生猛海鲜", name: "避风塘炒蟹", name_zh: "Typhoon Shelter Crab", price: "时价" },
				{ section: "生猛海鲜", name: "蒜蓉蒸扇贝（6只）", name_zh: "Steamed Garlic Scallops", price: "RM48" },
				{ section: "生猛海鲜", name: "椒盐濑尿虾", name_zh: "Salt & Pepper Mantis Prawn", price: "RM68" },
				{ section: "生猛海鲜", name: "港式清蒸石斑", name_zh: "Hong Kong Steamed Grouper", price: "时价" },
				{ section: "小炒与煲仔", name: "瓦煲鸡饭", name_zh: "Claypot Chicken Rice", price: "RM32" },
				{ section: "小炒与煲仔", name: "黑椒牛河", name_zh: "Black Pepper Beef Hor Fun", price: "RM26" },
				{ section: "小炒与煲仔", name: "咕噜肉", name_zh: "Sweet & Sour Pork", price: "RM28" },
				{ section: "蔬菜", name: "蒜蓉炒芥兰", name_zh: "Stir-fried Kailan", price: "RM18" },
				{ section: "饮品", name: "冻柠茶", name_zh: "Iced Lemon Tea", price: "RM8" },
			],
			outlets: [
				{
					name: "大福海鲜大排档（云顶高原）",
					area: "Genting Highlands",
					address: "Genting Highlands, 69000 Pahang, Malaysia",
					hours: "每日 上午11:30 – 晚上11:00",
					hours_schema: "Mo-Su 11:30-23:00",
					map_query: "DAFU Seafood Genting Highlands",
				},
			],
		},
	},
	{
		id: "r-congee",
		slug: "dafu-congee",
		shared: { name_zh: "粥大福", accent: "gold", sort_order: 2 },
		en: {
			name: "DAFU Congee",
			tagline: "Silky Hong Kong congee, noodles and Macau bakes",
			summary:
				"A warm bowl for cool highland mornings. Slow-cooked Cantonese congee, wonton noodles, Macau pork chop buns, egg tarts and proper Hong Kong milk tea.",
			cuisine: "Hong Kong, Macanese, Congee, Noodles",
			price_range: "RM15–RM40 per person",
			story: [
				p("In Hong Kong, a congee shop is where the city starts its day and where it ends a long night. Rice is cooked down for hours until it turns silky, then finished to order with fresh fish, pork or century egg."),
				p("At DAFU Congee we pair those bowls with the comforts of Macau and Hong Kong’s cha chaan teng: crisp youtiao, pork chop buns, flaky egg tarts and milk tea pulled strong and smooth. It’s the place to warm up after a cold morning at the top of Genting Highlands."),
			],
			signatures: [
				{ name: "Century Egg & Pork Congee", name_zh: "皮蛋瘦肉粥", description: "The Hong Kong classic: silky congee with century egg and tender marinated pork.", price: "RM16.90" },
				{ name: "Sampan Congee", name_zh: "艇仔粥", description: "Fish, squid, pork skin and peanuts, as served on Canton’s old river boats.", price: "RM18.90" },
				{ name: "Macau Pork Chop Bun", name_zh: "澳门猪扒包", description: "Garlic-marinated pork chop in a crusty bun.", price: "RM15.90" },
				{ name: "Portuguese Egg Tart", name_zh: "葡式蛋挞", description: "Flaky pastry and a caramelised custard top, baked through the day.", price: "RM5.90" },
			],
			menu: [
				{ section: "Congee", name: "Century Egg & Pork Congee", name_zh: "皮蛋瘦肉粥", price: "RM16.90" },
				{ section: "Congee", name: "Sampan Congee", name_zh: "艇仔粥", price: "RM18.90" },
				{ section: "Congee", name: "Fresh Fish Slice Congee", name_zh: "生滚鱼片粥", price: "RM19.90" },
				{ section: "Noodles & rice rolls", name: "Shrimp Wonton Noodles", name_zh: "鲜虾云吞面", price: "RM17.90" },
				{ section: "Noodles & rice rolls", name: "Shrimp Cheung Fun", name_zh: "鲜虾肠粉", price: "RM13.90" },
				{ section: "Sides & bakes", name: "Youtiao", name_zh: "油条", price: "RM4.90" },
				{ section: "Sides & bakes", name: "Macau Pork Chop Bun", name_zh: "澳门猪扒包", price: "RM15.90" },
				{ section: "Sides & bakes", name: "Portuguese Egg Tart", name_zh: "葡式蛋挞", price: "RM5.90" },
				{ section: "Drinks", name: "Hong Kong Milk Tea", name_zh: "港式奶茶", price: "RM7.90" },
				{ section: "Drinks", name: "Yuenyeung (coffee & tea)", name_zh: "鸳鸯", price: "RM7.90" },
			],
			outlets: [
				{
					name: "DAFU Congee, Genting Highlands",
					area: "Genting Highlands",
					address: "Genting Highlands, 69000 Pahang, Malaysia",
					hours: "Daily, 7:00am – 10:00pm",
					hours_schema: "Mo-Su 07:00-22:00",
					map_query: "DAFU Congee Genting Highlands",
				},
			],
		},
		zh: {
			name: "粥大福",
			tagline: "绵滑港式粥品、面食与澳门烘焙",
			summary: "高原清晨的一碗暖粥。慢火熬煮的广式生滚粥、云吞面、澳门猪扒包、葡挞，还有地道港式奶茶。",
			cuisine: "港式、澳门风味、粥品、面食",
			price_range: "每人约 RM15–RM40",
			story: [
				p("在香港，粥店是城市一天的开始，也是长夜的终点。米粒熬煮数小时至绵滑，再按单加入鲜鱼、猪肉或皮蛋生滚。"),
				p("粥大福把这些粥品与澳门、香港茶餐厅的经典放在一起：香脆油条、猪扒包、酥皮蛋挞，以及浓滑港式奶茶。在云顶高原寒冷的早晨，来这里暖一暖。"),
			],
			signatures: [
				{ name: "皮蛋瘦肉粥", name_zh: "皮蛋瘦肉粥", description: "香港经典：绵滑粥底配皮蛋与腌瘦肉。", price: "RM16.90" },
				{ name: "艇仔粥", name_zh: "艇仔粥", description: "鱼片、鱿鱼、猪皮与花生，昔日广州艇家风味。", price: "RM18.90" },
				{ name: "澳门猪扒包", name_zh: "澳门猪扒包", description: "蒜香腌猪扒夹脆皮面包。", price: "RM15.90" },
				{ name: "葡式蛋挞", name_zh: "葡式蛋挞", description: "酥皮与焦糖蛋面，全日新鲜出炉。", price: "RM5.90" },
			],
			menu: [
				{ section: "粥品", name: "皮蛋瘦肉粥", name_zh: "Century Egg & Pork Congee", price: "RM16.90" },
				{ section: "粥品", name: "艇仔粥", name_zh: "Sampan Congee", price: "RM18.90" },
				{ section: "粥品", name: "生滚鱼片粥", name_zh: "Fresh Fish Slice Congee", price: "RM19.90" },
				{ section: "面食与肠粉", name: "鲜虾云吞面", name_zh: "Shrimp Wonton Noodles", price: "RM17.90" },
				{ section: "面食与肠粉", name: "鲜虾肠粉", name_zh: "Shrimp Cheung Fun", price: "RM13.90" },
				{ section: "小食与烘焙", name: "油条", name_zh: "Youtiao", price: "RM4.90" },
				{ section: "小食与烘焙", name: "澳门猪扒包", name_zh: "Macau Pork Chop Bun", price: "RM15.90" },
				{ section: "小食与烘焙", name: "葡式蛋挞", name_zh: "Portuguese Egg Tart", price: "RM5.90" },
				{ section: "饮品", name: "港式奶茶", name_zh: "Hong Kong Milk Tea", price: "RM7.90" },
				{ section: "饮品", name: "鸳鸯", name_zh: "Yuenyeung", price: "RM7.90" },
			],
			outlets: [
				{
					name: "粥大福（云顶高原）",
					area: "Genting Highlands",
					address: "Genting Highlands, 69000 Pahang, Malaysia",
					hours: "每日 早上7:00 – 晚上10:00",
					hours_schema: "Mo-Su 07:00-22:00",
					map_query: "DAFU Congee Genting Highlands",
				},
			],
		},
	},
	{
		id: "r-singbar",
		slug: "dafu-sing-bar",
		shared: { name_zh: "兰桂坊", accent: "neon", sort_order: 3 },
		en: {
			name: "DAFU Sing Bar",
			tagline: "A Lan Kwai Fong night out, with live Canto-pop",
			summary:
				"Neon, cocktails and a stage. Inspired by Hong Kong’s Lan Kwai Fong, DAFU Sing Bar is where Genting Highlands nights carry on — live singers, Canto-pop classics and bar bites from our kitchens.",
			cuisine: "Bar, Hong Kong bar bites",
			price_range: "RM40–RM120 per person",
			story: [
				p("Lan Kwai Fong is Hong Kong’s most famous few streets for a night out: neon signs, packed bars and music spilling onto the slope. DAFU Sing Bar borrows that spirit for Genting Highlands."),
				p("Expect live singers every night, a song list full of Canto-pop and Mandopop favourites, cocktails built on Hong Kong flavours, and snacks from the DAFU kitchens to keep the table going."),
			],
			signatures: [
				{ name: "Lemon Tea Highball", name_zh: "柠茶 Highball", description: "Our Hong Kong lemon tea, whisky and soda over ice.", price: "RM32" },
				{ name: "Yuenyeung Espresso Martini", name_zh: "鸳鸯马天尼", description: "Coffee, milk tea and vodka, shaken cold.", price: "RM38" },
				{ name: "Salt & Pepper Squid", name_zh: "椒盐鲜鱿", description: "Crisp squid tossed with garlic and chilli — made for sharing.", price: "RM28" },
			],
			menu: [
				{ section: "Signature cocktails", name: "Lemon Tea Highball", name_zh: "柠茶 Highball", price: "RM32" },
				{ section: "Signature cocktails", name: "Yuenyeung Espresso Martini", name_zh: "鸳鸯马天尼", price: "RM38" },
				{ section: "Signature cocktails", name: "Lychee Rose Spritz", name_zh: "荔枝玫瑰气泡", price: "RM34" },
				{ section: "Beer & bottles", name: "Draught beer (pint)", name_zh: "生啤", price: "RM30" },
				{ section: "Beer & bottles", name: "Bottle service", name_zh: "整瓶酒", price: "Ask our team" },
				{ section: "Bar bites", name: "Salt & Pepper Squid", name_zh: "椒盐鲜鱿", price: "RM28" },
				{ section: "Bar bites", name: "Curry Fish Balls", name_zh: "咖喱鱼蛋", price: "RM16" },
				{ section: "Bar bites", name: "Prawn Toast", name_zh: "虾多士", price: "RM22" },
			],
			outlets: [
				{
					name: "DAFU Sing Bar, Genting Highlands",
					area: "Genting Highlands",
					address: "Genting Highlands, 69000 Pahang, Malaysia",
					hours: "Daily, 6:00pm – 2:00am",
					hours_schema: "Mo-Su 18:00-02:00",
					map_query: "DAFU Sing Bar Genting Highlands",
				},
			],
		},
		zh: {
			name: "兰桂坊",
			tagline: "兰桂坊之夜，现场粤语金曲",
			summary: "霓虹、鸡尾酒与舞台。灵感来自香港兰桂坊，DAFU Sing Bar 让云顶高原的夜晚继续——驻唱歌手、粤语金曲与大福厨房的下酒小食。",
			cuisine: "酒吧、港式小食",
			price_range: "每人约 RM40–RM120",
			story: [
				p("兰桂坊是香港最著名的夜生活街区：霓虹招牌、热闹酒吧、音乐飘满斜街。DAFU Sing Bar 把这份气氛带到云顶高原。"),
				p("每晚都有驻唱歌手，歌单满是粤语与国语金曲，鸡尾酒融入港式风味，还有大福厨房的小食陪您畅饮。"),
			],
			signatures: [
				{ name: "柠茶 Highball", name_zh: "柠茶 Highball", description: "港式柠檬茶、威士忌与苏打加冰。", price: "RM32" },
				{ name: "鸳鸯马天尼", name_zh: "鸳鸯马天尼", description: "咖啡、奶茶与伏特加冰摇。", price: "RM38" },
				{ name: "椒盐鲜鱿", name_zh: "椒盐鲜鱿", description: "香脆鲜鱿配蒜蓉辣椒，适合分享。", price: "RM28" },
			],
			menu: [
				{ section: "招牌鸡尾酒", name: "柠茶 Highball", name_zh: "Lemon Tea Highball", price: "RM32" },
				{ section: "招牌鸡尾酒", name: "鸳鸯马天尼", name_zh: "Yuenyeung Espresso Martini", price: "RM38" },
				{ section: "招牌鸡尾酒", name: "荔枝玫瑰气泡", name_zh: "Lychee Rose Spritz", price: "RM34" },
				{ section: "啤酒与整瓶", name: "生啤（一品脱）", name_zh: "Draught beer", price: "RM30" },
				{ section: "啤酒与整瓶", name: "整瓶酒", name_zh: "Bottle service", price: "请询问店员" },
				{ section: "下酒小食", name: "椒盐鲜鱿", name_zh: "Salt & Pepper Squid", price: "RM28" },
				{ section: "下酒小食", name: "咖喱鱼蛋", name_zh: "Curry Fish Balls", price: "RM16" },
				{ section: "下酒小食", name: "虾多士", name_zh: "Prawn Toast", price: "RM22" },
			],
			outlets: [
				{
					name: "DAFU Sing Bar 兰桂坊（云顶高原）",
					area: "Genting Highlands",
					address: "Genting Highlands, 69000 Pahang, Malaysia",
					hours: "每日 晚上6:00 – 凌晨2:00",
					hours_schema: "Mo-Su 18:00-02:00",
					map_query: "DAFU Sing Bar Genting Highlands",
				},
			],
		},
	},
];

const promotions = [
	{
		id: "p-singbar-open",
		slug: "dafu-sing-bar-now-open",
		shared: { kind: "opening", restaurant: "dafu-sing-bar", valid_from: "2026-11-01T00:00:00.000Z" },
		en: {
			title: "DAFU Sing Bar is now open in Genting Highlands",
			excerpt: "Live singers every night, Canto-pop classics and Hong Kong-inspired cocktails. Our Lan Kwai Fong-style bar is open from 6pm.",
			content: [
				p("Our newest concept brings a Lan Kwai Fong night out to the highlands. Find a table, pick a song, and order a Lemon Tea Highball."),
				p("Open daily from 6:00pm until 2:00am. Walk-ins welcome; for groups of eight or more, message us to hold a table."),
			],
		},
		zh: {
			title: "DAFU Sing Bar 兰桂坊 云顶高原盛大开幕",
			excerpt: "每晚驻唱、粤语金曲、港式风味鸡尾酒。兰桂坊风格酒吧晚上6点起营业。",
			content: [
				p("我们最新的品牌把兰桂坊之夜带到高原。找张桌子、点首歌，再来一杯柠茶 Highball。"),
				p("每日晚上6:00至凌晨2:00营业。欢迎直接光临；八位以上请先联系我们留位。"),
			],
		},
	},
	{
		id: "p-congee-breakfast",
		slug: "congee-breakfast-set",
		shared: { kind: "promotion", restaurant: "dafu-congee", valid_from: "2026-11-01T00:00:00.000Z", valid_until: "2027-01-31T15:59:59.000Z" },
		en: {
			title: "Highland breakfast set at DAFU Congee",
			excerpt: "Any congee with youtiao and a hot Hong Kong milk tea, from 7am to 11am daily.",
			content: [
				p("Start a cold Genting morning properly: choose any congee from the menu, add crisp youtiao, and finish with a hot Hong Kong milk tea or yuenyeung."),
				p("Available daily from 7:00am to 11:00am while stocks last. Not valid with other promotions."),
			],
		},
		zh: {
			title: "粥大福 高原早餐套餐",
			excerpt: "任选粥品配油条及热港式奶茶，每日早上7点至11点供应。",
			content: [
				p("在云顶寒冷的早晨好好开始：任选一款粥品，配香脆油条，再来一杯热港式奶茶或鸳鸯。"),
				p("每日早上7:00至11:00供应，售完即止。不可与其他优惠同时使用。"),
			],
		},
	},
	{
		id: "p-crab-weekend",
		slug: "typhoon-shelter-crab-weekends",
		shared: { kind: "promotion", restaurant: "dafu-seafood", valid_from: "2026-11-01T00:00:00.000Z", valid_until: "2026-12-31T15:59:59.000Z" },
		en: {
			title: "Typhoon shelter crab weekends",
			excerpt: "Every Friday to Sunday, order a typhoon shelter crab and get claypot rice for the table on us.",
			content: [
				p("Our most-ordered dish, fried with a mountain of golden garlic. Order one typhoon shelter crab, Friday to Sunday, and we’ll add a claypot chicken rice for the table."),
				p("One claypot rice per table. Crab is charged at the day’s seasonal price."),
			],
		},
		zh: {
			title: "周末避风塘炒蟹",
			excerpt: "逢星期五至星期日，点避风塘炒蟹即送瓦煲鸡饭一份。",
			content: [
				p("我们最受欢迎的招牌菜，配满满金黄蒜蓉。星期五至星期日点一份避风塘炒蟹，即送瓦煲鸡饭一份。"),
				p("每桌限送一份。螃蟹按当日时价计算。"),
			],
		},
	},
	{
		id: "p-more-brands",
		slug: "more-dafu-restaurants-coming",
		shared: { kind: "announcement", restaurant: "all", valid_from: "2026-11-15T00:00:00.000Z" },
		en: {
			title: "More DAFU restaurants are on the way",
			excerpt: "New Hong Kong and Macau-inspired concepts are coming to Genting Highlands and the Klang Valley. Follow along for opening dates.",
			content: [
				p("DAFU started with three restaurants in Genting Highlands. Over the coming months we will introduce new brands and new outlets, including our first locations in the Klang Valley."),
				p("We will announce each opening here first."),
			],
		},
		zh: {
			title: "更多大福餐厅即将登场",
			excerpt: "更多港澳风味新品牌即将进驻云顶高原与巴生谷，开幕日期敬请关注。",
			content: [
				p("大福从云顶高原的三家餐厅起步。接下来几个月，我们将推出新品牌与新分店，包括在巴生谷的首批据点。"),
				p("每一次开幕，我们都会第一时间在这里公布。"),
			],
		},
	},
];

const pages = [
	{
		// Holds the homepage hero photo (the headline itself is set in src/pages/index.astro).
		id: "pg-home",
		slug: "home",
		en: {
			title: "Hong Kong and Macau flavours, up in Genting Highlands",
			intro: "Wok-fired seafood, slow-cooked congee and a Lan Kwai Fong night out. Three DAFU restaurants at the top of the hill.",
		},
		zh: {
			title: "港澳好味道，就在云顶高原",
			intro: "猛火海鲜、慢熬靓粥、兰桂坊之夜。三家大福餐厅，就在山顶。",
		},
	},
	{
		// Holds the contact page's "Group enquiries" text.
		id: "pg-contact",
		slug: "contact",
		en: {
			title: "Find a DAFU restaurant",
			intro: "All our restaurants are in Genting Highlands for now, with Klang Valley outlets coming. Tap an address for directions.",
			content: [
				p("For group bookings, events, partnerships or media, message the restaurant directly using the WhatsApp button above, or email the DAFU team at hello@dafu.com.my."),
			],
		},
		zh: {
			title: "找到大福餐厅",
			intro: "目前所有餐厅位于云顶高原，巴生谷分店即将开业。点击地址即可查看路线。",
			content: [p("团体订座、活动、合作或媒体查询，请通过上方 WhatsApp 按钮直接联系餐厅，或发送电邮至 hello@dafu.com.my 联系大福团队。")],
		},
	},
	{
		id: "pg-about",
		slug: "about",
		en: {
			title: "About DAFU",
			intro: "大福 means great fortune. We named our group after the wish you hear at every Hong Kong and Macau dinner table — and we cook to make it come true.",
			content: [
				h2("Where we come from"),
				p("Our founders grew up on the food of Hong Kong and Macau: steaming dai pai dong woks, early-morning congee shops, cha chaan teng milk tea, Portuguese egg tarts on Macau side streets, and late nights in Lan Kwai Fong."),
				p("DAFU brings those places to Malaysia, starting at the top of Genting Highlands, where visitors from across Malaysia and the region come to eat, play and stay up late."),
				h2("What we care about"),
				p("Each DAFU restaurant does one thing well, the way the original would. Wok heat at the seafood kitchen. Patience at the congee pot. Atmosphere at the bar. Recipes and techniques come from Hong Kong and Macau; the welcome is Malaysian."),
				h2("What’s next"),
				p("DAFU Seafood, DAFU Congee and DAFU Sing Bar are the first three. More brands and outlets will follow in Genting Highlands and the Klang Valley."),
			],
		},
		zh: {
			title: "关于大福",
			intro: "“大福”是港澳饭桌上最常听到的祝福。我们以此命名，也用每一道菜去实现它。",
			content: [
				h2("我们的由来"),
				p("我们的创办人在港澳饮食中长大：大排档的猛火镬气、清晨的粥店、茶餐厅奶茶、澳门街头的葡挞，还有兰桂坊的不夜天。"),
				p("大福把这些地方带到马来西亚，第一站就在云顶高原——来自全国与区域各地的旅客在这里吃喝玩乐、通宵达旦。"),
				h2("我们坚持的"),
				p("每一家大福餐厅都专注做好一件事，就像原汁原味的港澳老店：海鲜厨房的镬气、粥锅前的耐心、酒吧里的气氛。食谱与技艺源自港澳，招待则是马来西亚式的热情。"),
				h2("下一步"),
				p("大福海鲜大排档、粥大福与兰桂坊是我们的首三个品牌。更多品牌与分店将陆续进驻云顶高原及巴生谷。"),
			],
		},
	},
];

// ---------- Assemble ----------
function localized(items, collection) {
	const out = [];
	for (const item of items) {
		const base = { slug: item.slug, status: "published" };
		out.push({ ...base, id: `${item.id}-en`, locale: "en", data: { ...(item.shared ?? {}), ...item.en } });
		out.push({
			...base,
			id: `${item.id}-zh`,
			locale: "zh",
			translationOf: `${item.id}-en`,
			data: { ...(item.shared ?? {}), ...item.zh },
		});
	}
	return out;
}

const menuItems = (lang) => {
	const zh = lang === "zh";
	const prefix = zh ? "/zh" : "";
	return [
		{ type: "custom", label: zh ? "餐厅" : "Restaurants", url: `${prefix}/restaurants` },
		{ type: "custom", label: zh ? "优惠与资讯" : "Promotions", url: `${prefix}/promotions` },
		{ type: "custom", label: zh ? "关于大福" : "About", url: `${prefix}/about` },
		{ type: "custom", label: zh ? "地点与联系" : "Find us", url: `${prefix}/contact` },
	];
};

const seed = {
	$schema: "https://emdashcms.com/seed.schema.json",
	version: "1",
	meta: {
		name: "DAFU 大福",
		description: "Hong Kong and Macau-inspired restaurants in Genting Highlands and the Klang Valley.",
		author: "DAFU Group",
	},
	settings: {
		title: "DAFU 大福",
		tagline: "Hong Kong and Macau-inspired restaurants in Genting Highlands",
		timezone: "Asia/Kuala_Lumpur",
	},
	collections,
	menus: [
		{ id: "menu-en", name: "primary", label: "Main navigation", locale: "en", items: menuItems("en") },
		{ id: "menu-zh", name: "primary", label: "Main navigation", locale: "zh", translationOf: "menu-en", items: menuItems("zh") },
	],
	content: {
		restaurants: localized(restaurants),
		promotions: localized(promotions),
		pages: localized(pages),
	},
};

const target = fileURLToPath(new URL("../seed/seed.json", import.meta.url));
writeFileSync(target, `${JSON.stringify(seed, null, "\t")}\n`);
console.log(`Wrote ${target}`);
