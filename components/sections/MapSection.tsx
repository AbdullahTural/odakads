"use client";

import { useResolvedSiteSettings } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";

/**
 * Harita kartı. Bir grid kolonu içinde kullanılabilir (kendi section sarmalı yoktur).
 */
export function MapSection({ className }: { className?: string }) {
  const { data: contact } = useResolvedSiteSettings();

  return (
    <div
      className={cn(
        "h-full min-h-[360px] overflow-hidden rounded-3xl border border-border bg-card",
        className,
      )}
    >
      <iframe
        title="Ofis Konumu"
        src={contact.mapEmbed}
        className="h-full min-h-[360px] w-full grayscale-[0.3] contrast-110"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
