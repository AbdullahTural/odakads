import { BadgeCheck, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const perks = [
  {
    icon: ShieldCheck,
    title: "Doğrulanmış Uzmanlık",
    description:
      "Sertifikalı uzmanlardan oluşan, Google’ın yetkinlik sınavlarını geçmiş bir ekip.",
  },
  {
    icon: Sparkles,
    title: "Beta Özelliklere Erken Erişim",
    description:
      "Yeni reklam formatlarını ve beta araçlarını ilk uygulayanlardan biri olmak.",
  },
  {
    icon: Trophy,
    title: "Performans Standardı",
    description:
      "Partner statüsünü korumak için sürekli kanıtlanan harcama ve performans eşiği.",
  },
];

export function GooglePartner() {
  return (
    <section className="section-pad">
      <div className="container">
        <Reveal>
          <div className="glow-border relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/20 blur-[110px]"
            />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-400">
                  <BadgeCheck className="h-4 w-4" />
                  Resmî Google Partner
                </span>
                <h2 className="mt-6 font-display text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl">
                  Google’ın onayladığı bir{" "}
                  <span className="text-gradient">iş ortağı</span>
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Google Partner statüsü; sertifikasyon, harcama eşiği ve
                  kanıtlanmış performans gerektirir. Bu rozet, hesabınızın
                  alanında uzman ve güncel ellerde olduğunun garantisidir.
                </p>
              </div>

              <div className="grid gap-4">
                {perks.map((p) => (
                  <div
                    key={p.title}
                    className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-primary">
                      <p.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold">{p.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
