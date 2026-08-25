"use client";

import * as React from "react";
import type { BlogListItemDto } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { BlogCard } from "./BlogCard";

/**
 * Yazi listesi + kategori filtresi.
 * Client bilesen olsa da static export'ta ilk HTML (tum kartlar) build'de
 * server-render edilir → SEO icin tum icerik hazir; filtre yalnizca gelistirmedir.
 */
export function BlogList({
  posts,
  categories,
}: {
  posts: BlogListItemDto[];
  categories: string[];
}) {
  const [active, setActive] = React.useState<string>("all");
  const filtered = active === "all" ? posts : posts.filter((p) => p.category === active);

  return (
    <div>
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <FilterChip label="Tümü" active={active === "all"} onClick={() => setActive("all")} />
          {categories.map((c) => (
            <FilterChip key={c} label={c} active={active === c} onClick={() => setActive(c)} />
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">Bu kategoride yazı bulunamadı.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <BlogCard key={post.slug} post={post} eager={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border bg-surface text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
