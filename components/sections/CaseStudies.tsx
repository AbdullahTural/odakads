"use client";

import { ArrowRight, TrendingUp } from "lucide-react";
import { useCaseStudies } from "@/lib/api/hooks";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionError } from "@/components/sections/StatsSection";

export function CaseStudies() {
  const { data, isLoading, isError } = useCaseStudies();

  return (
    <section className="section-pad">
      <div className="container">
        <SectionHeading
          eyebrow="Vaka Çalışmaları"
          title={
            <>
              Önce / Sonra:{" "}
              <span className="text-gradient">somut</span> büyüme
            </>
          }
          description="Gerçek müşteri verileriyle, çalışmamızın işletmelere kattığı ölçülebilir değer."
        />

        <div className="mt-14">
          {isLoading && (
            <div className="grid gap-6 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          )}
          {isError && <SectionError />}
          {data && (
            <RevealGroup className="grid gap-6 lg:grid-cols-3">
              {data.map((cs) => (
                <RevealItem key={cs.id}>
                  <article className="glow-border flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="border-b border-border bg-surface p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg font-semibold">
                            {cs.client}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {cs.industry}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-bold text-emerald-400">
                          <TrendingUp className="h-4 w-4" />
                          {cs.growth}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {cs.summary}
                      </p>
                    </div>

                    <div className="flex-1 space-y-3 p-6">
                      {cs.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="rounded-xl border border-border bg-surface p-4"
                        >
                          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {m.label}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground line-through decoration-destructive/60">
                              {m.before}
                            </span>
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <span className="font-display text-lg font-bold text-gradient">
                              {m.after}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-border p-6 pt-4">
                      {cs.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </div>
    </section>
  );
}
