import type { Metadata } from "next";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { siteConfig } from "@/lib/site";

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};
