"use client";

import { Compass, Rocket } from "lucide-react";
import { useAbout, useValues } from "@/lib/api/hooks";
import { getIcon } from "@/lib/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlowCard } from "@/components/ui/glow-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CardSkeletonGrid } from "@/components/ui/skeleton";
import { SectionError } from "@/components/sections/StatsSection";

const defaultMission =
  "İşletmelerin Google Ads yatırımlarını ölçülebilir, sürdürülebilir ve kârlı büyümeye dönüştürmek. Karmaşık reklam dünyasını sadeleştirip her müşterimize gerçek bir büyüme ortağı olmak.";
const defaultVision =
  "Google Ads yönetiminde güvenilir, şeffaf ve ölçülebilir bir iş ortağı olarak tanınmak; müşterilerimizin reklam yatırımını sürdürülebilir büyümeye dönüştürürken etik ve veriye dayalı bir çizgide kalmak.";

export function MissionVision() {
  const { data } = useAbout();
  const mission = data?.missionText;
  const vision = data?.visionText;

  return (
    <section className="section-pad">
      <div className="container grid gap-6 lg:grid-cols-2">
        <Reveal direction="right">
          <div className="glow-border relative h-full overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <Rocket className="h-6 w-6" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-bold">Misyonumuz</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {mission && mission.trim() ? mission : defaultMission}
            </p>
          </div>
        </Reveal>

        <Reveal direction="left">
          <div className="glow-border relative h-full overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary/10 text-secondary">
              <Compass className="h-6 w-6" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-bold">Vizyonumuz</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {vision && vision.trim() ? vision : defaultVision}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ValuesSection() {
  const { data, isLoading, isError } = useValues();

  return (
    <section className="section-pad">
      <div className="container">
        <SectionHeading
          eyebrow="Değerlerimiz"
          title={
            <>
              Bizi biz yapan <span className="text-gradient">ilkeler</span>
            </>
          }
          description="Her kararımızda ve her kampanyamızda rehberimiz olan dört temel değer."
        />

        <div className="mt-14">
          {isLoading && <CardSkeletonGrid count={4} />}
          {isError && <SectionError />}
          {data && (
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.map((v, i) => {
                const Icon = getIcon(v.icon);
                return (
                  <RevealItem key={v.id}>
                    <GlowCard glow={i % 2 === 0 ? "blue" : "purple"} className="h-full">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="mt-5 font-display text-lg font-semibold">
                        {v.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {v.description}
                      </p>
                    </GlowCard>
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
