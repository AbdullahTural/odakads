import type { Metadata } from "next";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { siteConfig } from "@/lib/site";
import type { BlogDetailDto } from "@/lib/api/types";

type SeoBuildOverride = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string;
};

/** Build oncesi scripts/fetch-seo-build.mjs tarafindan uretilir (admin SEO → static metadata). */
function loadSeoBuildOverrides(): Record<string, SeoBuildOverride> {
  try {
    const path = join(process.cwd(), "lib", "seo-build-overrides.json");
    if (!existsSync(path)) return {};
    return JSON.parse(readFileSync(path, "utf8")) as Record<string, SeoBuildOverride>;
  } catch {
    return {};
  }
}

/**
 * Static export metadata — build-time degerleri.
 * Admin SEO: `npm run fetch:seo` (build:static icinde otomatik) → lib/seo-build-overrides.json
 */
export function getPageMetadata(
  pageKey: string,
  fallback: { title: string; description: string; canonical: string },
): Metadata {
  const override = loadSeoBuildOverrides()[pageKey];
  const title = override?.title?.trim() || fallback.title;
  const description = override?.description?.trim() || fallback.description;
  const canonical = override?.canonicalUrl?.trim() || fallback.canonical;
  const keywords = override?.keywords?.trim()
    ? override.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [...siteConfig.keywords];

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [siteConfig.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

/**
 * Blog yazisi metadata'si (static export, build-time).
 * SEO alanlari bostaysa gorunur icerikten guvenli varsayilanlar uretilir.
 */
export function getBlogPostMetadata(post: BlogDetailDto): Metadata {
  const title = post.seoTitle?.trim() || post.title;
  const description = post.seoDescription?.trim() || post.excerpt;
  const canonical = post.canonicalUrl?.trim() || `/blog/${post.slug}/`;
  const ogTitle = post.ogTitle?.trim() || title;
  const ogDescription = post.ogDescription?.trim() || description;
  const image = post.ogImageUrl?.trim() || post.coverImageUrl?.trim() || siteConfig.ogImage;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: post.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: ogTitle,
      description: ogDescription,
      images: image ? [image] : undefined,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt || undefined,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: image ? [image] : undefined,
    },
    ...(post.tags && post.tags.length ? { keywords: post.tags } : {}),
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};
