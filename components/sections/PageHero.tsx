import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

type PageHeroImage = {
  src: string;
  alt: string;
  priority?: boolean;
  width?: number;
  height?: number;
  /** Gorsel kapsayicisinin max genisligi (responsive class). */
  maxWidth?: string;
  /** Arka glow rengi. */
  glow?: "blue" | "purple";
  /** Olcek class'i (orn: "scale-100 md:scale-105 lg:scale-110"). */
  scaleClass?: string;
};

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  /** Opsiyonel hero gorseli. Verilirse iki kolonlu (metin sol / gorsel sag) duzene gecer. */
  image?: PageHeroImage;
  /** Gorsel yerine sag blok (orn. Performans Ozeti paneli). image ile birlikte kullanilmaz. */
  aside?: React.ReactNode;
};

/** Alt sayfalar icin ortak hero basligi (opsiyonel sag gorsel veya aside ile) */
export function PageHero({ eyebrow, title, description, image, aside }: PageHeroProps) {
  const hasSide = Boolean(image || aside);

  if (!hasSide) {
    return (
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
        />
        <div className="container relative py-20 text-center sm:py-28">
          <Reveal>
            <Badge variant="outline" className="uppercase tracking-wider">
              {eyebrow}
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.18] tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Reveal>
        </div>
      </section>
    );
  }

  const isPurple = image?.glow === "purple";

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-0 h-72 w-[36rem] rounded-full bg-primary/15 blur-[120px]"
      />
      <div className="container relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:py-24">
        {/* Sol: metin */}
        <div className="text-center lg:text-left">
          <Reveal>
            <Badge variant="outline" className="uppercase tracking-wider">
              {eyebrow}
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.18] tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
              {description}
            </p>
          </Reveal>
        </div>

        {/* Sag: aside veya gorsel */}
        <Reveal delay={0.1} direction="left">
          {aside ? (
            <div className="flex w-full justify-center lg:justify-end">{aside}</div>
          ) : image ? (
            <SideImage image={image} isPurple={isPurple} />
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}

function SideImage({
  image,
  isPurple,
}: {
  image: PageHeroImage;
  isPurple: boolean;
}) {
  const dropShadow = isPurple
    ? "drop-shadow-[0_0_65px_rgba(139,92,246,0.40)]"
    : "drop-shadow-[0_0_60px_rgba(59,130,246,0.40)]";

  return (
    <div className="relative flex w-full items-center justify-center">
      <div
        className={cn(
          "relative w-full",
          image.maxWidth ?? "max-w-[760px] lg:max-w-[900px]",
        )}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-full blur-3xl",
            isPurple ? "bg-purple-500/20" : "bg-blue-500/20",
          )}
        />
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width ?? 1100}
          height={image.height ?? 780}
          priority={image.priority}
          sizes="(max-width: 1024px) 90vw, 55vw"
          className={cn(
            "h-auto w-full object-contain object-center",
            image.scaleClass,
            dropShadow,
          )}
        />
      </div>
    </div>
  );
}
