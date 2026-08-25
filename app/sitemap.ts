import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllBlogPosts } from "@/lib/blog/build-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/hakkimizda",
    "/hizmetler",
    "/basarilarimiz",
    "/blog",
    "/iletisim",
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  // Yalnizca yayindaki + indekslenebilir yazilar; dogru lastModified ile.
  const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts()
    .filter((post) => !post.noIndex)
    .map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || now),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...blogRoutes];
}
