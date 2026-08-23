"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type ReviewAvatarProps = {
  author: string;
  companyLogoUrl?: string | null;
  className?: string;
};

function monogramLetter(name: string): string {
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase() || "?";
}

/** Logo yoksa yesil monogram; tum monogramlar ayni yesil ailesinde */
export function ReviewAvatar({ author, companyLogoUrl, className }: ReviewAvatarProps) {
  const initial = monogramLetter(author);
  const logo = companyLogoUrl?.trim();

  if (logo) {
    return (
      <span
        className={cn(
          "relative grid h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface ring-1 ring-white/10",
          className,
        )}
      >
        <Image
          src={logo}
          alt=""
          width={44}
          height={44}
          className="h-full w-full object-cover"
          unoptimized
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-500/15 font-display text-sm font-bold text-emerald-400 ring-1 ring-emerald-500/35",
        className,
      )}
      aria-hidden
    >
      {initial}
    </span>
  );
}
