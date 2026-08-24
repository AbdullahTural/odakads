import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { BlogList } from "@/components/blog/BlogList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import { getPageMetadata } from "@/lib/api/server";
import { getAllBlogPosts, getBlogCategories, hasBlogPosts } from "@/lib/blog/build-data";
import { blogCollectionLd, breadcrumbLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = getPageMetadata("blog", {
  title: "Blog | Odak Ads Reklam",
  description:
    "Google Ads, dijital reklam, SEO ve dönüşüm optimizasyonu üzerine güncel rehberler, ipuçları ve sektör içerikleri.",
  canonical: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  const categories = getBlogCategories();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Ana Sayfa", url: "/" },
            { name: "Blog", url: "/blog" },
          ]),
          blogCollectionLd(),
        ]}
      />

      <PageHero
        eyebrow="Blog"
        title={
          <>
            Dijital reklamda <span className="text-gradient">bilgi ve içgörü</span>
          </>
        }
        description="Google Ads, SEO ve dönüşüm optimizasyonu üzerine sade, uygulanabilir rehberler; kampanyalarınızı daha verimli yönetmeniz için hazırlandı."
      />

      <section className="section-pad">
        <div className="container">
          {hasBlogPosts() ? (
            <BlogList posts={posts} categories={categories} />
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-border card-gradient p-10 text-center">
              <h2 className="font-display text-xl font-semibold">Yakında yeni içerikler</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Blog içeriklerimiz hazırlanıyor. Bu arada dijital reklam stratejinizi konuşmak
                isterseniz ücretsiz analiz için bize ulaşabilirsiniz.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/iletisim">Ücretsiz Analiz Al</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
