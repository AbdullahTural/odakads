"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useServices } from "@/lib/api/hooks";
import { getIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem, Reveal } from "@/components/ui/reveal";
import { CardSkeletonGrid } from "@/components/ui/skeleton";
import { SectionError } from "@/components/sections/StatsSection";

/** Ana sayfada hizmetlerin ilk 6'sini gosteren onizleme */
export function ServicesSection() {
  const { data, isLoading, isError } = useServices();
  const preview = data?.slice(0, 6);

  return (
    <section className="section-pad">
      <div className="container">
        <SectionHeading
          eyebrow="Hizmetlerimiz"
          title={
            <>
              Büyümeniz için{" "}
              <span className="text-gradient">uçtan uca</span> reklam yönetimi
            </>
          }
          description="Arama ağından Performance Max'e, dönüşüm takibinden A/B testlerine kadar tüm Google Ads ekosistemini sizin için yönetiyoruz."
        />

        <div className="mt-14">
          {isLoading && <CardSkeletonGrid count={6} />}
          {isError && <SectionError />}
          {preview && (
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {preview.map((svc, i) => {
                const Icon = getIcon(svc.icon);
                return (
                  <RevealItem key={svc.id}>
                    <GlowCard
                      glow={i % 2 === 0 ? "blue" : "purple"}
                      className="h-full"
                    >
                      <span
                        className={
                          i % 2 === 0
                            ? "grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"
                            : "grid h-12 w-12 place-items-center rounded-xl bg-secondary/10 text-secondary"
                        }
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="mt-5 font-display text-xl font-semibold">
                        {svc.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {svc.description}
                      </p>
                    </GlowCard>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          )}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/hizmetler">
                Tüm Hizmetleri Gör
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
