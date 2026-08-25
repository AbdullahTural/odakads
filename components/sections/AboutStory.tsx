"use client";

import { Check, Sparkles } from "lucide-react";
import { useAbout } from "@/lib/api/hooks";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

const defaultStory = [
  "Odak Ads Reklam, reklam bütçesinin ölçülebilir sonuç üretmesi gerektiğine inanan bir ekip olarak kuruldu. Her hesabı tek tek ele alıyor, kararları veriye ve şeffaflığa dayandırıyoruz.",
  "Henüz genç bir ajans olsak da müşterilerimizle birebir ilgilenmeyi önceliğimiz yapıyoruz. Büyük portföy iddiası yerine, atanan her projede net hedefler ve düzenli iletişim sunuyoruz.",
  "Google Ads tarafında güncel uygulamaları takip ediyor; kurulum, optimizasyon ve raporlamayı anlaşılır bir dille paylaşıyoruz. Amacımız abartılı vaatler değil, güvenilir ve sürdürülebilir çalışma.",
];

const sidebarHighlights = [
  "Hızlı kurulum ve ilk aksiyon",
  "Düzenli performans takibi",
  "Birebir iletişim",
  "Haftalık raporlama",
];

export function AboutStory() {
  const { data } = useAbout();
  const story = data?.companyStory;

  const paragraphs =
    story && story.trim().length > 0
      ? story.split("\n").map((p) => p.trim()).filter(Boolean)
      : defaultStory;

  return (
    <section className="section-pad">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="right">
          <div>
            <Badge variant="outline" className="uppercase tracking-wider">
              Hikâyemiz
            </Badge>
            <h2 className="mt-6 font-display text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl">
              Reklam harcamasını{" "}
              <span className="text-gradient">yatırıma</span> dönüştürme tutkusu
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal direction="left">
          <div className="glow-border relative overflow-hidden rounded-3xl border border-border bg-card p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-[90px]"
            />
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white">
                  <Sparkles className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold">
                    Neden Bizimle Çalışılıyor?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Şeffaf ve ölçülebilir çalışma
                  </p>
                </div>
              </div>
              <ul className="space-y-4">
                {sidebarHighlights.map((label) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                  >
                    <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span className="text-sm text-muted-foreground">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
