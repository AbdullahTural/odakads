"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { useVideoTestimonials } from "@/lib/api/hooks";
import type { VideoTestimonialDto } from "@/lib/api/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionError } from "@/components/sections/StatsSection";

export function VideoTestimonials() {
  const { data, isLoading, isError } = useVideoTestimonials();
  const [active, setActive] = React.useState<VideoTestimonialDto | null>(null);

  React.useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section className="section-pad">
      <div className="container">
        <SectionHeading
          eyebrow="Video Referanslar"
          title={
            <>
              Müşterilerimizden{" "}
              <span className="text-gradient">ilk ağızdan</span>
            </>
          }
          description="Birlikte çıktığımız büyüme yolculuğunu müşterilerimizin kendi sözleriyle dinleyin."
        />

        <div className="mt-14">
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded-2xl" />
              ))}
            </div>
          )}
          {isError && <SectionError />}
          {data && (
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((v) => (
                <RevealItem key={v.id}>
                  <button
                    type="button"
                    onClick={() => setActive(v)}
                    className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-card text-left"
                  >
                    <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600/30 via-card to-purple-600/30">
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-surface backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/80 group-hover:shadow-glow-blue">
                        <Play className="h-7 w-7 translate-x-0.5 fill-white text-white" />
                      </span>
                      <span className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
                        {v.duration}
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="text-sm leading-relaxed text-foreground/90">
                        “{v.quote}”
                      </p>
                      <p className="mt-3 text-sm font-semibold">{v.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {v.company}
                      </p>
                    </div>
                  </button>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card"
            >
              <button
                type="button"
                aria-label="Kapat"
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="aspect-video w-full">
                <iframe
                  src={active.videoUrl}
                  title={`${active.name} - ${active.company}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
