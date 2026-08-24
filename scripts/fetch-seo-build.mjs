/**
 * Build oncesi admin SEO ayarlarini API'den ceker → lib/seo-build-overrides.json
 * Static export metadata bu dosyayi build sirasinda okur.
 *
 * Ortam:
 *   BUILD_SEO_API_URL veya NEXT_PUBLIC_API_BASE_URL — API kok URL (or. http://localhost:5085)
 *   SKIP_SEO_FETCH=true — atla (CI/onlinesiz build)
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PAGE_KEYS = ["home", "about", "services", "success", "contact", "blog"];
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(repoRoot, "lib", "seo-build-overrides.json");

if (process.env.SKIP_SEO_FETCH === "true") {
  console.log("[fetch:seo] Atlandi (SKIP_SEO_FETCH=true).");
  process.exit(0);
}

const base = (
  process.env.BUILD_SEO_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5085"
).replace(/\/$/, "");

/** @type {Record<string, { title: string; description: string; canonicalUrl: string; keywords?: string }>} */
const overrides = {};

let fetched = 0;

for (const pageKey of PAGE_KEYS) {
  try {
    const res = await fetch(`${base}/api/seo-settings/${pageKey}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn(`[fetch:seo] ${pageKey}: HTTP ${res.status}`);
      continue;
    }
    const json = await res.json();
    const d = json?.data;
    if (!d?.isActive || !d.title?.trim()) continue;

    overrides[pageKey] = {
      title: d.title.trim(),
      description: (d.description ?? "").trim(),
      canonicalUrl: (d.canonicalUrl ?? "").trim(),
      keywords: (d.keywords ?? "").trim() || undefined,
    };
    fetched++;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[fetch:seo] ${pageKey}: ${msg}`);
  }
}

if (fetched === 0) {
  console.warn(
    `[fetch:seo] API'den aktif SEO alinamadi (${base}). ` +
      "Mevcut lib/seo-build-overrides.json korunuyor veya bos fallback kullanilir.",
  );
  if (!existsSync(outPath)) {
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, "{}\n", "utf8");
    console.log("[fetch:seo] Bos lib/seo-build-overrides.json olusturuldu.");
  }
  process.exit(0);
}

writeFileSync(outPath, `${JSON.stringify(overrides, null, 2)}\n`, "utf8");
console.log(`[fetch:seo] ${fetched} sayfa yazildi → lib/seo-build-overrides.json (${base})`);
