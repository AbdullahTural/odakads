"use client";

import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { useConversion, useResolvedSiteSettings, useSiteContent } from "@/lib/api/hooks";
import { pickContent } from "@/lib/content/fields";

export function CtaSection() {
  const { data } = useConversion();
  const { data: contact } = useResolvedSiteSettings();
  const { data: c } = useSiteContent();
  const ctaTitle = pickContent(c, "cta.title");

  // Birincil CTA: Calendly aktifse Calendly, degilse ayardaki URL ya da /iletisim.
  const primaryText = data?.primaryCtaText?.trim() || "Ücretsiz Analiz Al";
  const primaryUrl =
    data?.isCalendlyEnabled && data.calendlyUrl?.trim()
      ? data.calendlyUrl.trim()
      : data?.primaryCtaUrl?.trim() || "/iletisim";
  const primaryExternal = /^https?:\/\//.test(primaryUrl);

  return (
    <section className="section-pad">
      <div className="container">
        <Reveal>
          <div className="glow-border relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/25 blur-[110px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-secondary/25 blur-[110px]"
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl lg:text-5xl">
                {ctaTitle ? (
                  ctaTitle
                ) : (
                  <>
                    Reklam bütçenizi{" "}
                    <span className="text-gradient">birlikte</span> analiz edelim
                  </>
                )}
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                {pickContent(
                  c,
                  "cta.subtitle",
                  "Ücretsiz hesap analizi ile mevcut kampanyalarınızdaki verimlilik noktalarını ve bütçe koruma stratejilerini birlikte inceleyelim.",
                )}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg">
                  {primaryExternal ? (
                    <a href={primaryUrl} target="_blank" rel="noopener noreferrer">
                      {primaryText}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link href={primaryUrl}>
                      {primaryText}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={contact.phoneHref}>
                    <PhoneCall className="h-4 w-4" />
                    Hemen Arayın
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
