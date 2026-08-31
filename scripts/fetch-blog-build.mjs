/**
 * Build oncesi yayindaki blog yazilarini API'den ceker → lib/blog-build-data.json
 * Static export (generateStaticParams / sitemap / detay) bu dosyayi build sirasinda okur.
 *
 * Ortam:
 *   BUILD_BLOG_API_URL / BUILD_SEO_API_URL / NEXT_PUBLIC_API_BASE_URL — API kok URL (or. http://localhost:5085)
 *   SKIP_SEO_FETCH=true veya SKIP_BLOG_FETCH=true — atla (API'siz / CI build)
 *
 * API kapali veya bos ise: mevcut lib/blog-build-data.json korunur, yoksa bos dizi yazilir.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(repoRoot, "lib", "blog-build-data.json");

function ensureFallbackFile() {
  if (!existsSync(outPath)) {
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, "[]\n", "utf8");
    console.log("[fetch:blog] Bos lib/blog-build-data.json olusturuldu.");
  }
}

if (process.env.SKIP_SEO_FETCH === "true" || process.env.SKIP_BLOG_FETCH === "true") {
  console.log("[fetch:blog] Atlandi (SKIP_*_FETCH=true).");
  ensureFallbackFile();
  process.exit(0);
}

const base = (
  process.env.BUILD_BLOG_API_URL ||
  process.env.BUILD_SEO_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5085"
).replace(/\/$/, "");

async function getJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json?.data ?? json;
}

try {
  const list = await getJson(`${base}/api/blogs`);
  if (!Array.isArray(list)) throw new Error("Beklenen liste alinmadi.");

  const posts = [];
  for (const item of list) {
    if (!item?.slug) continue;
    try {
      const detail = await getJson(`${base}/api/blogs/${encodeURIComponent(item.slug)}`);
      if (detail?.slug) posts.push(detail);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[fetch:blog] ${item.slug}: ${msg}`);
    }
  }

  // API basariyla ama 0 yayin dondurduyse mevcut (commit'li) icerigi EZME.
  // Boylece DB henuz seed edilmeden yapilan bir build, hazir bloglari silmez.
  if (posts.length === 0) {
    console.warn(
      "[fetch:blog] API 0 yayindaki yazi dondurdu — mevcut lib/blog-build-data.json korunuyor (ezilmedi).",
    );
    ensureFallbackFile();
    process.exit(0);
  }

  // Kurate icerik korumasi: API, commit'li dosyadaki yazi sayisindan DAHA AZ dondurduyse ezme.
  // (Deploy sirasinda backend henuz yeni bloglari seed etmemis olabilir; hazir icerik silinmesin.)
  let committedCount = 0;
  try {
    if (existsSync(outPath)) committedCount = JSON.parse(readFileSync(outPath, "utf8")).length || 0;
  } catch {
    // bozuk/okunamaz dosya — yok say
  }
  if (committedCount > 0 && posts.length < committedCount) {
    console.warn(
      `[fetch:blog] API ${posts.length} yazi dondurdu ama mevcut dosyada ${committedCount} var — ` +
        "kurate icerik korunuyor (ezilmedi).",
    );
    process.exit(0);
  }

  writeFileSync(outPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  console.log(`[fetch:blog] ${posts.length} yayindaki yazi yazildi → lib/blog-build-data.json (${base})`);
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.warn(
    `[fetch:blog] API'den blog alinamadi (${base}): ${msg}. ` +
      "Mevcut lib/blog-build-data.json korunuyor veya bos fallback kullanilir.",
  );
  ensureFallbackFile();
  process.exit(0);
}
