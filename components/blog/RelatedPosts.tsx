import type { BlogListItemDto } from "@/lib/api/types";
import { BlogCard } from "./BlogCard";

/** İlgili yazilar bolumu — bos ise render edilmez. */
export function RelatedPosts({ posts }: { posts: BlogListItemDto[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-16 border-t border-border pt-12">
      <h2 id="related-heading" className="font-display text-2xl font-bold tracking-tight">
        İlgili Yazılar
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
