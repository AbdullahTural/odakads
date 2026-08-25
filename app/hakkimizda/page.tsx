import type { Metadata } from "next";
import { PageHeroDynamic } from "@/components/sections/PageHeroDynamic";
import { AboutStory } from "@/components/sections/AboutStory";
import {
  MissionVision,
  ValuesSection,
} from "@/components/sections/MissionVisionValues";
// StatsSection: gecici olarak gizli (bilesen/API/DB korunuyor)
import { CtaSection } from "@/components/sections/CtaSection";
import { getPageMetadata } from "@/lib/api/server";

export const metadata: Metadata = getPageMetadata("about", {
  title: "Hakkımızda | Odak Ads Reklam",
  description:
    "Odak Ads Reklam; veriye dayalı, şeffaf ve sonuç odaklı Google Ads yönetimiyle markaların büyümesini hızlandıran bir ajansıdır.",
  canonical: "/hakkimizda",
});

export default function AboutPage() {
  return (
    <>
      <PageHeroDynamic
        contentKey="about"
        eyebrow="Hakkımızda"
        title={
          <>
            Reklam süreçlerinizde{" "}
            <span className="text-gradient">birlikte çalışma</span>
          </>
        }
        description="Kampanyalarınızı yakından takip ederek bütçenizin verimli kullanılması için çalışıyoruz. Karmaşık raporlar yerine, reklam performansınızı net ve anlaşılır verilerle sizinle paylaşıyoruz."
        image={{
          src: "/images/page-heroes/about-hero.webp",
          alt: "Google Ads strateji ve optimizasyon görseli",
          width: 1920,
          height: 1280,
          maxWidth: "max-w-[760px] lg:max-w-[820px]",
          glow: "blue",
        }}
      />
      <AboutStory />
      <MissionVision />
      <ValuesSection />
      <CtaSection />
    </>
  );
}
