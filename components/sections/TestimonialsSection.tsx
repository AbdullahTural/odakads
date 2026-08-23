"use client";

import { Quote, Star } from "lucide-react";
import { useTestimonials } from "@/lib/api/hooks";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlowCard } from "@/components/ui/glow-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CardSkeletonGrid } from "@/components/ui/skeleton";
import { SectionError } from "@/components/sections/StatsSection";

export function TestimonialsSection() {
  const { data, isLoading, isError } = useTestimonials();

  return (
    <section className="section-pad">
      <div className="container">
        <SectionHeading
          eyebrow="Başarı Hikayeleri"
          title={
            <>
              Müşterilerimiz{" "}
              <span className="text-gradient">sonuçlardan</span> bahsediyor
            </>
          }
          description="Farklı sektörlerden markalar, Google Ads yatırımlarının geri dönüşünü bizimle nasıl katladıklarını anlatıyor."
        />

        <div className="mt-14">
          {isLoading && <CardSkeletonGrid count={3} />}
          {isError && <SectionError />}
          {data && (
            <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {data.map((t, i) => (
                <RevealItem key={t.id}>
                  <GlowCard
                    glow={i % 2 === 0 ? "blue" : "purple"}
                    className="flex h-full flex-col"
                  >
                    <Quote className="h-8 w-8 text-primary/40" />
                    <div className="mt-3 flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <Star
                          key={s}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                      “{t.content}”
                    </p>
                    <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-display text-sm font-bold text-white">
                        {t.name.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role}, {t.company}
                        </p>
                      </div>
                    </div>
                  </GlowCard>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </div>
    </section>
  );
}
