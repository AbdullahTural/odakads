"use client";

import { AlertCircle } from "lucide-react";
import { useStats } from "@/lib/api/hooks";
import { getIcon } from "@/lib/icons";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsSection() {
  const { data, isLoading, isError } = useStats();

  return (
    <section className="section-pad">
      <div className="container">
        <Reveal>
          <p className="mb-12 text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Rakamlarla Odak Ads Reklam
          </p>
        </Reveal>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-8 text-center"
              >
                <Skeleton className="mx-auto h-10 w-10 rounded-xl" />
                <Skeleton className="mx-auto mt-4 h-9 w-24" />
                <Skeleton className="mx-auto mt-3 h-4 w-32" />
              </div>
            ))}
          </div>
        )}

        {isError && <SectionError />}

        {data && (
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((stat) => {
              const Icon = getIcon(stat.icon);
              return (
                <RevealItem key={stat.id}>
                  <div className="glow-border group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-8 text-center transition-transform hover:-translate-y-1">
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div className="mt-5 font-display text-4xl font-bold text-foreground sm:text-5xl">
                      <AnimatedCounter
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}

export function SectionError({
  message = "İçerik şu anda yüklenemedi. Lütfen daha sonra tekrar deneyin.",
}: {
  message?: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p>{message}</p>
    </div>
  );
}
