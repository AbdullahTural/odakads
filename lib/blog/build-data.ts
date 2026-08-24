/**
 * Build-time blog verisi okuyucu.
 *
 * `scripts/fetch-blog-build.mjs` yayindaki yazilari API'den cekip
 * `lib/blog-build-data.json`'a yazar; bu modul static export sirasinda okur
 * (generateStaticParams, /blog listesi, /blog/[slug] detay, sitemap).
 *
 * Not: JSON build oncesi uretildiginden burada ekstra ag istegi yoktur —
 * icerik arama motorlarina JS calistirmadan (server-rendered) sunulur.
 */
import buildData from "@/lib/blog-build-data.json";
import type { BlogDetailDto } from "@/lib/api/types";

const allPosts: BlogDetailDto[] = (buildData as unknown as BlogDetailDto[])
  .filter((p) => p && p.slug && p.publishedAt)
  .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

/** Tum yayindaki yazilar (yayin tarihine gore azalan). */
export function getAllBlogPosts(): BlogDetailDto[] {
  return allPosts;
}

/** generateStaticParams icin slug listesi. */
export function getBlogSlugs(): string[] {
  return allPosts.map((p) => p.slug);
}

export function getBlogPost(slug: string): BlogDetailDto | undefined {
  return allPosts.find((p) => p.slug === slug);
}

/** Ilgili yazilar — once ayni kategori, sonra en yeniler; kendisi haric. */
export function getRelatedBlogPosts(slug: string, category: string, limit = 3): BlogDetailDto[] {
  const others = allPosts.filter((p) => p.slug !== slug);
  const sameCategory = category ? others.filter((p) => p.category === category) : [];
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, limit);
}

/** Yayindaki yazilarda kullanilan benzersiz kategoriler. */
export function getBlogCategories(): string[] {
  return Array.from(new Set(allPosts.map((p) => p.category).filter(Boolean)));
}

export function hasBlogPosts(): boolean {
  return allPosts.length > 0;
}
