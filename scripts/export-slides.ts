import { chromium } from "playwright";
import { spawn, execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const slides = ["cover", "contents", "why", "overview", "assist-tasks", "exciting", "challenge", "showcase", "conclusion", "future", "thank-you"];
const port = process.env.SLIDE_PORT || "3100";
const baseUrl = `http://127.0.0.1:${port}`;
const output = path.join(process.cwd(), "public", "exports");

async function waitForServer() {
  for (let attempt = 0; attempt < 45; attempt++) {
    try { const response = await fetch(baseUrl); if (response.ok) return; } catch { /* server is still starting */ }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`Next.js did not start at ${baseUrl}`);
}

async function main() {
  await mkdir(output, { recursive: true });
  const server = spawn("npm", ["run", "dev", "--", "-p", port], { shell: true, stdio: "inherit" });
  try {
    await waitForServer();
    const browser = await chromium.launch();
    const scale = Number(process.env.SLIDE_EXPORT_SCALE || "1");
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
    const failures: string[] = [];
    page.on("console", message => { if (message.type() === "error") failures.push(message.text()); });
    page.on("pageerror", error => failures.push(error.message));
    for (const [index, id] of slides.entries()) {
      await page.goto(`${baseUrl}/slides/${id}?export=1`, { waitUntil: "networkidle" });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map(image => image.complete ? image.decode().catch(() => undefined) : new Promise<void>(resolve => { image.addEventListener("load", () => resolve(), { once: true }); image.addEventListener("error", () => resolve(), { once: true }); })));
      });
      await page.waitForTimeout(150);
      const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
      if (dimensions.width > 1920 || dimensions.height > 1080) throw new Error(`${id} creates page overflow: ${dimensions.width}x${dimensions.height}`);
      const file = id === "thank-you" ? "final-thank-you.png" : `${String(index + 1).padStart(2, "0")}-${id}.png`;
      await page.locator(".slide-shell").screenshot({ path: path.join(output, file) });
    }
    await browser.close();
    if (failures.length) throw new Error(`Browser errors during export:\n${failures.join("\n")}`);
    console.log(`Exported ${slides.length} high-resolution PNG slides to ${output}`);
  } finally {
    if (process.platform === "win32" && server.pid) await new Promise(resolve => execFile("taskkill", ["/pid", String(server.pid), "/t", "/f"], () => resolve(null)));
    else server.kill();
  }
}
main().catch(error => { console.error(error); process.exit(1); });
