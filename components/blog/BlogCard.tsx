import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import type { BlogListItemDto } from "@/lib/api/types";
import { formatBlogDate, isoDate, readingLabel } from "@/lib/blog/format";

/** Blog listeleme karti — kapak, kategori, baslik, ozet, tarih, okuma suresi. */
export function BlogCard({ post, eager = false }: { post: BlogListItemDto; eager?: boolean }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="group glow-border relative flex h-full flex-col overflow-hidden rounded-2xl border border-border card-gradient transition-transform duration-300 hover:-translate-y-1">
      <Link href={href} className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          {post.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImageUrl}
              alt={post.coverImageAlt || post.title}
              width={640}
              height={360}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-purple-500/20">
              <span className="font-display text-lg font-semibold text-muted-foreground">
                {post.category || "Blog"}
              </span>
            </div>
          )}
          {post.category && (
            <span className="absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
              {post.category}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-semibold leading-snug tracking-tight line-clamp-2 transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            {post.publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                <time dateTime={isoDate(post.publishedAt)}>{formatBlogDate(post.publishedAt)}</time>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {readingLabel(post.readingMinutes)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
