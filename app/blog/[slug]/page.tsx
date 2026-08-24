import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogPostMetadata } from "@/lib/api/server";
import { getBlogPost, getBlogSlugs, getRelatedBlogPosts } from "@/lib/blog/build-data";
import { blogPostingLd, breadcrumbLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/site";

/** Yalnizca build-time uretilen slug'lar; bilinmeyenler 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = getBlogSlugs();
  // Next.js (output: export) BOŞ generateStaticParams'i "eksik" sayıp build'i kırar.
  // Henüz yayın yokken sitenin build'inin bozulmaması için bir sentinel döneriz;
  // sayfa bu slug'ı bulamayıp notFound() ile 404 verir (kimse ziyaret etmez, linklenmez, sitemap'te yoktur).
  return slugs.length > 0 ? slugs.map((slug) => ({ slug })) : [{ slug: "__no-posts__" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Yazı bulunamadı" };
  return getBlogPostMetadata(post);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedBlogPosts(post.slug, post.category);
  const shareUrl = `${siteConfig.url}/blog/${post.slug}/`;

  const crumbs = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(crumbs.map((c) => ({ name: c.name, url: c.href }))),
          blogPostingLd(post),
        ]}
      />

      <section className="border-b border-border">
        <div className="container py-5">
          <Breadcrumbs items={crumbs} />
        </div>
      </section>

      <div className="container py-12 sm:py-16">
        <BlogArticle post={post} />

        <div className="mx-auto mt-10 max-w-3xl border-t border-border pt-6">
          <ShareButtons url={shareUrl} title={post.title} />
        </div>

        <div className="mx-auto max-w-5xl">
          <RelatedPosts posts={related} />
        </div>
      </div>
    </>
  );
}
