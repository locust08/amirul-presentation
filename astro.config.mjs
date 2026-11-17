import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, fontProviders } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

// Public origin used for canonical URLs, hreflang, sitemap and JSON-LD.
// Override per environment with SITE_URL (e.g. https://www.dafu.com.my).
const site = process.env.SITE_URL ?? "https://www.dafu.com.my";

export default defineConfig({
	site,
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	i18n: {
		defaultLocale: "en",
		locales: ["en", "zh"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			// Only pin the admin origin when deployed behind a proxy/CDN.
			...(process.env.SITE_URL ? { siteUrl: process.env.SITE_URL } : {}),
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Archivo",
			cssVariable: "--font-sans",
			weights: ["400 900"],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["system-ui", "sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "Noto Serif SC",
			cssVariable: "--font-han",
			weights: [700, 900],
			styles: ["normal"],
			fallbacks: ["Songti SC", "SimSun", "serif"],
		},
	],
	devToolbar: { enabled: false },
});
