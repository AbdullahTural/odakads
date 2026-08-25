"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  PlayCircle,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/api/hooks";
import { pickContent } from "@/lib/content/fields";

// Recharts agir oldugu icin dashboard lazy yuklenir
const HeroDashboard = dynamic(
  () => import("@/components/sections/HeroDashboard").then((m) => m.HeroDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="skeleton h-[460px] w-full rounded-[1.75rem]" />
    ),
  },
);

// Güven rozetleri — ikon sabit, metin admin "Site İçeriği"nden ezilebilir
const badges = [
  { icon: BadgeCheck, key: "hero.badge1", label: "Google Ads Uzmanlığı" },
  { icon: Users, key: "hero.badge2", label: "Birebir İlgilenilen Sınırlı Müşteri" },
  { icon: Wallet, key: "hero.badge3", label: "Şeffaf Bütçe Yönetimi" },
  { icon: TrendingUp, key: "hero.badge4", label: "Veriye Dayalı Optimizasyon" },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  const { data: c } = useSiteContent();

  const badge = pickContent(c, "hero.badge", "Performans Odaklı Google Ads Ajansı");
  const titleOverride = pickContent(c, "hero.title");
  const subtitle = pickContent(
    c,
    "hero.subtitle",
    "İşletmenize uygun anahtar kelimelerle reklamlarınızı doğru hedef kitleye ulaştırıyoruz. Manuel kampanya yönetimiyle sürdürülebilir büyüme sağlıyoruz.",
  );
  const primaryText = pickContent(c, "hero.primaryText", "Ücretsiz Analiz Al");
  const primaryUrl = pickContent(c, "hero.primaryUrl", "/iletisim");
  const secondaryText = pickContent(c, "hero.secondaryText", "Başarı Hikayeleri");
  const secondaryUrl = pickContent(c, "hero.secondaryUrl", "/basarilarimiz");

  return (
    <section className="relative overflow-hidden">
      {/* arka plan dekor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern bg-[size:40px_40px] [mask-image:radial-gradient(60%_50%_at_50%_0%,#000,transparent)]"
      />
      <div className="container grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
        {/* Sol: metin */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              {badge}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-4xl font-bold leading-[1.18] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {titleOverride ? (
              titleOverride
            ) : (
              <>
                Google Ads ile{" "}
                <span className="text-gradient">Büyümenizi</span> Hızlandırıyoruz.
              </>
            )}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 text-lg leading-relaxed text-muted-foreground"
          >
            {subtitle}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Button asChild size="lg">
              <Link href={primaryUrl}>
                {primaryText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={secondaryUrl}>
                <PlayCircle className="h-4 w-4" />
                {secondaryText}
              </Link>
            </Button>
          </motion.div>

          {/* Guven rozetleri */}
          <motion.ul
            variants={item}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2"
          >
            {badges.map((b) => (
              <li
                key={b.key}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-3 text-sm"
              >
                <b.icon className="h-4 w-4 shrink-0 text-primary" />
                <span className="font-medium text-foreground/90">
                  {pickContent(c, b.key, b.label)}
                </span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Sag: dashboard */}
        <div className="lg:pl-6">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}
