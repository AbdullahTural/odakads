"use client";

import { Check } from "lucide-react";
import { useServices } from "@/lib/api/hooks";
import { getIcon } from "@/lib/icons";
import { GlowCard } from "@/components/ui/glow-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CardSkeletonGrid } from "@/components/ui/skeleton";
import { SectionError } from "@/components/sections/StatsSection";

/** Hizmetler sayfasinda 8 hizmetin tamamini gosterir */
export function ServicesGrid() {
  const { data, isLoading, isError } = useServices();

  return (
    <section className="section-pad">
      <div className="container">
        {isLoading && <CardSkeletonGrid count={8} />}
        {isError && <SectionError />}
        {data && (
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((svc, i) => {
              const Icon = getIcon(svc.icon);
              return (
                <RevealItem key={svc.id}>
                  <GlowCard
                    glow={i % 2 === 0 ? "blue" : "purple"}
                    className="flex h-full flex-col"
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
                    <h3 className="mt-5 font-display text-lg font-semibold">
                      {svc.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {svc.description}
                    </p>
                    <ul className="mt-5 space-y-2 border-t border-border pt-4">
                      {svc.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-foreground/80"
                        >
                          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </GlowCard>
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
