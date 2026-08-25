import type { Metadata } from "next";
import { PageHeroDynamic } from "@/components/sections/PageHeroDynamic";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { getPageMetadata } from "@/lib/api/server";

export const metadata: Metadata = getPageMetadata("services", {
  title: "Hizmetler | Odak Ads Reklam",
  description:
    "Google Ads yönetimi, arama ağı, görüntülü, YouTube, Performance Max, yeniden pazarlama, dönüşüm takibi ve A/B testleri — uçtan uca performans pazarlaması hizmetleri.",
  canonical: "/hizmetler",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeroDynamic
        contentKey="services"
        eyebrow="Hizmetlerimiz"
        title={
          <>
            Tüm Google Ads ekosistemi{" "}
            <span className="text-gradient">tek çatı</span> altında
          </>
        }
        description="Kampanya kurulumundan optimizasyona, ölçümlemeden ölçeklenmeye kadar büyümeniz için ihtiyacınız olan her hizmet."
        image={{
          src: "/images/page-heroes/services-hero.webp",
          alt: "Google Ads hizmetleri neon teknoloji görseli",
          width: 1200,
          height: 850,
          maxWidth: "max-w-[780px] lg:max-w-[900px]",
          glow: "blue",
          scaleClass: "scale-100 md:scale-105",
        }}
      />
      <ServicesGrid />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
