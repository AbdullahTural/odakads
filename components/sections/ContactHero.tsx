"use client";

import * as React from "react";
import Image from "next/image";
import { ClipboardCheck, Target, Zap } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { useSiteContent } from "@/lib/api/hooks";
import { pickContent } from "@/lib/content/fields";

// Maddeler — ikon sabit, metin admin "Site İçeriği"nden ezilebilir
const bullets = [
  { icon: ClipboardCheck, key: "page.contact.bullet1", label: "Ücretsiz Hesap Analizi" },
  { icon: Target, key: "page.contact.bullet2", label: "Size Özel Strateji Önerileri" },
  { icon: Zap, key: "page.contact.bullet3", label: "Hızlı Geri Dönüş (24 Saat İçinde)" },
];

/**
 * İletişim sayfası hero'su (mockup düzeni): solda metin + maddeler + dekoratif neon görsel,
 * sağda iletişim formu (children olarak verilir). Metinler admin "Site İçeriği"nden düzenlenebilir.
 */
export function ContactHero({ children }: { children: React.ReactNode }) {
  const { data: c } = useSiteContent();
  const titleOverride = pickContent(c, "page.contact.title");

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-0 h-72 w-[36rem] rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-10 h-72 w-[32rem] rounded-full bg-secondary/15 blur-[120px]"
      />

      <div className="container relative grid items-center gap-8 pt-6 pb-12 sm:gap-10 sm:pt-8 sm:pb-14 lg:grid-cols-2 lg:gap-12 lg:pt-10 lg:pb-16">
        {/* Sol: metin + maddeler */}
        <div className="relative">
          <div className="relative z-10">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <span className="h-px w-6 bg-primary/70" />
                {pickContent(c, "page.contact.eyebrow", "İletişime Geçin")}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                {titleOverride ? (
                  titleOverride
                ) : (
                  <>
                    Birlikte Büyüyelim.{" "}
                    <span className="text-gradient">Markanızı Zirveye Taşıyalım.</span>
                  </>
                )}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {pickContent(
                  c,
                  "page.contact.subtitle",
                  "Google Ads uzmanlarımız, reklam hesaplarınızı analiz ederek size özel stratejilerle büyümeniz için hazır. Hedeflerinizi paylaşın, size en uygun çözümü birlikte planlayalım.",
                )}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="mt-8 space-y-4">
                {bullets.map((b) => (
                  <li key={b.key} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-glow-blue">
                      <b.icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-foreground/90 sm:text-base">
                      {pickContent(c, b.key, b.label)}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Dekoratif neon görsel — metinle çakışmayacak şekilde biraz aşağıda */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-2 top-[85%] z-0 hidden w-[17rem] -translate-y-1/2 opacity-65 xl:block 2xl:-right-4 2xl:w-[19rem]"
          >
            <Image
              src="/images/page-heroes/contact-hero.webp"
              alt=""
              width={800}
              height={1000}
              className="h-auto w-full object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]"
            />
          </div>
        </div>

        {/* Sağ: form */}
        <Reveal delay={0.1} direction="left" className="relative z-10">
          {children}
        </Reveal>
      </div>
    </section>
  );
}
