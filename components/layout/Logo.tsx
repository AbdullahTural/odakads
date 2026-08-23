import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-glow-blue transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {/* yukselen trend / buyume oku */}
          <path d="M3 17l6-6 4 4 7-7" />
          <path d="M14 7h6v6" />
        </svg>
        <span className="absolute -inset-1 -z-10 rounded-xl bg-blue-500/30 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </span>
      <span className="font-display text-base font-bold leading-none tracking-tight text-foreground">
        {siteConfig.name}
      </span>
    </Link>
  );
}
