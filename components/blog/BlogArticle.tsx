import { CalendarDays, Clock, User } from "lucide-react";
import type { BlogDetailDto } from "@/lib/api/types";
import { formatBlogDate, isoDate, readingLabel } from "@/lib/blog/format";
import { BlogContent } from "./BlogContent";

/**
 * Blog yazisi govdesi — tek H1, kapak (alt metinli), yazar/tarih/okuma meta'si,
 * Markdown icerik ve etiketler. Public detayda (build) ve admin onizlemede kullanilir.
 */
export function BlogArticle({ post }: { post: BlogDetailDto }) {
  return (
    <article className="mx-auto max-w-3xl">
      <header>
        {post.category && (
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {post.category}
          </span>
        )}
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
          {post.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {post.author && (
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" aria-hidden />
              {post.author}
            </span>
          )}
          {post.publishedAt && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden />
              <time dateTime={isoDate(post.publishedAt)}>{formatBlogDate(post.publishedAt)}</time>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden />
            {readingLabel(post.readingMinutes)}
          </span>
        </div>
      </header>

      {post.coverImageUrl && (
        <figure className="mt-8">
          {/* LCP gorseli — lazy DEGIL: eager + yuksek oncelik */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImageUrl}
            alt={post.coverImageAlt || post.title}
            width={1200}
            height={630}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="aspect-[16/9] w-full rounded-2xl border border-border object-cover"
          />
          {post.coverImageAlt && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {post.coverImageAlt}
            </figcaption>
          )}
        </figure>
      )}

      <div className="mt-8">
        <BlogContent markdown={post.content} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
