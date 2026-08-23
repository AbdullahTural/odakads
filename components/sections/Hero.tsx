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

const badges = [
  { icon: BadgeCheck, label: "Google Ads Uzmanlığı" },
  { icon: Users, label: "Birebir İlgilenilen Sınırlı Müşteri" },
  { icon: Wallet, label: "Şeffaf Bütçe Yönetimi" },
  { icon: TrendingUp, label: "Veriye Dayalı Optimizasyon" },
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
              Performans Odaklı Google Ads Ajansı
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-4xl font-bold leading-[1.18] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Google Ads ile{" "}
            <span className="text-gradient">Büyümenizi</span> Hızlandırıyoruz.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 text-lg leading-relaxed text-muted-foreground"
          >
            İşletmenize uygun anahtar kelimelerle reklamlarınızı doğru hedef
            kitleye ulaştırıyoruz. Manuel kampanya yönetimiyle sürdürülebilir
            büyüme sağlıyoruz.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Button asChild size="lg">
              <Link href="/iletisim">
                Ücretsiz Analiz Al
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/basarilarimiz">
                <PlayCircle className="h-4 w-4" />
                Başarı Hikayeleri
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
                key={b.label}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-3 text-sm"
              >
                <b.icon className="h-4 w-4 shrink-0 text-primary" />
                <span className="font-medium text-foreground/90">{b.label}</span>
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
