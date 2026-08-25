/**
 * Schema.org yapilandirilmis veri (JSON-LD) ureticileri.
 * Yalnizca DOGRULANMIS isletme bilgileriyle uretilir; sosyal profiller
 * dogrulanmadigi icin `sameAs` bilincli olarak eklenmez.
 */
import { siteConfig, navItems } from "@/lib/site";
import type { BlogDetailDto } from "@/lib/api/types";

const SITE = siteConfig.url.replace(/\/$/, "");

/** Relatif URL'yi mutlak yapar. */
export function absoluteUrl(path: string): string {
  if (!path) return SITE;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE}${path.startsWith("/") ? "" : "/"}${path}`;
}

const telephoneE164 = siteConfig.contact.phoneHref.replace(/^tel:/, "");

/** Kurumsal / yerel isletme (reklam ajansi). */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE}/#organization`,
    name: siteConfig.name,
    url: `${SITE}/`,
    logo: absoluteUrl("/icon.svg"),
    image: absoluteUrl(siteConfig.ogImage),
    description: siteConfig.description,
    telephone: telephoneE164,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mimar Sinan Mah.",
      addressLocality: siteConfig.contact.addressLocality,
      addressRegion: siteConfig.contact.addressRegion,
      addressCountry: siteConfig.contact.addressCountry,
    },
    areaServed: ["Üsküdar", "İstanbul", "Türkiye"],
    // Yalnizca dogrulanmis profiller (Instagram: @odakads)
    sameAs: ["https://www.instagram.com/odakads/"],
  };
}

/**
 * Site geneli WebSite düğümü. Google'ın siteyi tek bir varlık olarak tanımasına yardımcı olur.
 * (Site içi arama sayfası olmadığı için SearchAction bilinçli olarak eklenmez.)
 */
export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: `${SITE}/`,
    name: siteConfig.name,
    inLanguage: "tr-TR",
    publisher: { "@id": `${SITE}/#organization` },
  };
}

/**
 * Ana menüyü (Ana Sayfa + alt sayfalar) Google'a tanıtan SiteNavigationElement grafiği.
 * Sitelink'leri Google otomatik seçer; bu, hangi sayfaların ana navigasyon olduğunu netleştirir.
 */
export function siteNavigationLd() {
  return {
    "@context": "https://schema.org",
    "@graph": navItems.map((item, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: item.label,
      url: absoluteUrl(item.href),
    })),
  };
}

export type Crumb = { name: string; url: string };

export function breadcrumbLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.url),
    })),
  };
}

/** /blog dizin sayfasi icin Blog yapilandirilmis verisi. */
export function blogCollectionLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE}/blog/#blog`,
    name: `${siteConfig.name} Blog`,
    description:
      "Google Ads, dijital reklam, SEO ve dönüşüm optimizasyonu üzerine rehberler ve güncel içerikler.",
    url: `${SITE}/blog/`,
    publisher: { "@id": `${SITE}/#organization` },
  };
}

/** Blog yazisi (BlogPosting) — gorunur icerikle uyumlu. */
export function blogPostingLd(post: BlogDetailDto) {
  const cover = post.ogImageUrl || post.coverImageUrl;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE}/blog/${post.slug}/`,
    },
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: cover ? absoluteUrl(cover) : absoluteUrl(siteConfig.ogImage),
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: {
      "@type": "Person",
      name: post.author || siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.svg"),
      },
    },
    ...(post.category ? { articleSection: post.category } : {}),
    ...(post.tags && post.tags.length ? { keywords: post.tags.join(", ") } : {}),
  };
}
