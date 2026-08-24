import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { name: string; href: string };

/** Gorunur breadcrumb (BreadcrumbList JSON-LD ile uyumlu). Son oge aktif sayfadir. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="font-medium text-foreground/80 line-clamp-1">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="transition-colors hover:text-primary">
                    {item.name}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
