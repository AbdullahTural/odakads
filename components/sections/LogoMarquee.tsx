"use client";

import * as React from "react";
import Image from "next/image";
import { useReferenceCompanies } from "@/lib/api/hooks";
import type { ReferenceCompanyDto } from "@/lib/api/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const MIN_COMPANIES = 3;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function CompanyCard({ company }: { company: ReferenceCompanyDto }) {
  return (
    <div className="flex w-[168px] shrink-0 flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-5 sm:w-[184px]">
      <div className="logo-chip relative h-14 w-full">
        <Image
          src={company.logoUrl}
          alt=""
          width={120}
          height={48}
          className="max-h-10 w-auto max-w-full object-contain"
          unoptimized
        />
      </div>
      <p className="w-full truncate text-center text-xs font-medium text-muted-foreground">
        {company.name}
      </p>
    </div>
  );
}

export function LogoMarquee() {
  const { data, isLoading } = useReferenceCompanies();
  const reducedMotion = usePrefersReducedMotion();

  if (isLoading) {
    return (
      <section className="section-pad border-b border-border">
        <div className="container">
          <Skeleton className="mx-auto h-8 w-64" />
          <div className="mt-10 flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-[184px] shrink-0 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data || data.length < MIN_COMPANIES) return null;

  const items = reducedMotion ? data : [...data, ...data];

  return (
    <section className="section-pad border-b border-border">
      <div className="container">
        <SectionHeading
          eyebrow="Referans Firmalar"
          title={
            <>
              Güvenle çalıştığımız{" "}
              <span className="text-gradient">markalar</span>
            </>
          }
          description="Farklı sektörlerden işletmelerle sürdürülebilir reklam yönetimi ortaklıkları."
          align="center"
        />

        {reducedMotion ? (
          <div className="mt-12 flex flex-wrap items-stretch justify-center gap-4">
            {data.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        ) : (
          <div className="logo-marquee relative mt-12 overflow-hidden">
            <div
              className={cn("logo-marquee-track flex w-max gap-6")}
              aria-hidden={false}
            >
              {items.map((c, i) => (
                <CompanyCard key={`${c.id}-${i}`} company={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
