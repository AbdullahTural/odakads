import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * Odak Ads marka logosu — amblem (lacivert daire + çubuk grafik + turuncu yükselen ok) + kelime işareti.
 * Amblem, markanın gerçek logosuna göre yeniden çizilmiş vektördür (renkler sabit; temadan bağımsız).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span className="relative grid h-10 w-10 place-items-center transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 64 64" className="h-10 w-10 drop-shadow-sm" role="img" aria-hidden>
          <circle cx="32" cy="32" r="29.5" fill="#f7f3ea" stroke="#1e2c50" strokeWidth="4.5" />
          <g fill="#1e2c50">
            <rect x="16.5" y="37" width="6" height="9.5" rx="1.3" />
            <rect x="25" y="32" width="6" height="14.5" rx="1.3" />
            <rect x="33.5" y="27" width="6" height="19.5" rx="1.3" />
            <rect x="42" y="21.5" width="6" height="25" rx="1.3" />
          </g>
          <g
            fill="none"
            stroke="#e8912a"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 41.5 C 23 40, 27.5 28, 47 17.5" />
            <path d="M39 17 L 47.6 16.6 L 47.2 25.2" />
          </g>
        </svg>
      </span>
      <span className="font-display text-base font-bold leading-none tracking-tight text-foreground">
        Odak <span className="text-primary">Ads</span> Reklam
      </span>
    </Link>
  );
}
