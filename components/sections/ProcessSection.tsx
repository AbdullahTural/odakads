"use client";

import { useProcessSteps } from "@/lib/api/hooks";
import { getIcon } from "@/lib/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionError } from "@/components/sections/StatsSection";

export function ProcessSection() {
  const { data, isLoading, isError } = useProcessSteps();

  return (
    <section className="section-pad">
      <div className="container">
        <SectionHeading
          eyebrow="Çalışma Sürecimiz"
          title={
            <>
              Net bir yol haritası,{" "}
              <span className="text-gradient">öngörülebilir</span> sonuçlar
            </>
          }
          description="Her müşterimizle aynı disiplinli süreci işletiyoruz: keşiften ölçeklenmeye kadar şeffaf ve kanıta dayalı."
        />

        <div className="mt-16">
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <Skeleton className="mt-5 h-5 w-2/3" />
                  <Skeleton className="mt-3 h-4 w-full" />
                </div>
              ))}
            </div>
          )}
          {isError && <SectionError />}
          {data && (
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.map((step) => {
                const Icon = getIcon(step.icon);
                return (
                  <RevealItem key={step.id}>
                    <div className="group relative h-full rounded-2xl border border-border bg-card p-6">
                      <span className="absolute right-5 top-5 font-display text-5xl font-bold text-white/5 transition-colors group-hover:text-primary/10">
                        {String(step.step).padStart(2, "0")}
                      </span>
                      <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="relative mt-5 font-display text-lg font-semibold">
                        {step.title}
                      </h3>
                      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          )}
        </div>
      </div>
    </section>
  );
}
