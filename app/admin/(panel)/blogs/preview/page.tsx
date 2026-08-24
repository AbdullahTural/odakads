"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, Loader2 } from "lucide-react";
import { useBlogPost } from "@/lib/admin/hooks";
import type { BlogAdminDetail, BlogStatus } from "@/lib/admin/types";
import type { BlogDetailDto } from "@/lib/api/types";
import { BlogArticle } from "@/components/blog/BlogArticle";

const STATUS_LABEL: Record<BlogStatus, string> = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşiv",
};

function toDetail(d: BlogAdminDetail): BlogDetailDto {
  return {
    id: d.id,
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt,
    content: d.content,
    coverImageUrl: d.coverImageUrl,
    coverImageAlt: d.coverImageAlt,
    category: d.category,
    tags: d.tags ?? [],
    author: d.author,
    readingMinutes: d.readingMinutes,
    publishedAt: d.publishedAt,
    updatedAt: d.updatedDate,
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
    canonicalUrl: d.canonicalUrl,
    ogTitle: d.ogTitle,
    ogDescription: d.ogDescription,
    ogImageUrl: d.ogImageUrl,
    noIndex: d.noIndex,
  };
}

export default function BlogPreviewPage() {
  return (
    <React.Suspense
      fallback={
        <div className="grid min-h-[50vh] place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <BlogPreview />
    </React.Suspense>
  );
}

function BlogPreview() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data, isLoading, isError } = useBlogPost(id);

  // Önizleme sayfasi asla indekslenmemeli (robots /admin/ zaten engelliyor — ekstra güvence)
  React.useEffect(() => {
    const m = document.createElement("meta");
    m.name = "robots";
    m.content = "noindex, nofollow";
    document.head.appendChild(m);
    return () => {
      document.head.removeChild(m);
    };
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-amber-300">
          <Eye className="h-4 w-4" />
          <span className="font-medium">Önizleme</span>
          {data && <span className="text-amber-300/80">— Durum: {STATUS_LABEL[data.status] ?? data.status}</span>}
        </div>
        <Link
          href={id ? `/admin/blogs/editor?id=${id}` : "/admin/blogs"}
          className="inline-flex items-center gap-2 text-sm font-medium text-amber-300 hover:text-amber-200"
        >
          <ArrowLeft className="h-4 w-4" /> Düzenlemeye dön
        </Link>
      </div>

      {isLoading && (
        <div className="grid min-h-[40vh] place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      {isError && <p className="py-10 text-center text-sm text-red-400">Yazı yüklenemedi.</p>}

      {data && (
        <div className="rounded-2xl border border-white/10 bg-background/40 p-4 sm:p-8">
          <BlogArticle post={toDetail(data)} />
        </div>
      )}
    </div>
  );
}
