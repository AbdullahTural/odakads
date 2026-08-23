import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
// StatsSection: gecici olarak ana sayfada gizli (bilesen/API/DB korunuyor)
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { ReviewsSlider } from "@/components/sections/ReviewsSlider";
import { CtaSection } from "@/components/sections/CtaSection";
import { getPageMetadata } from "@/lib/api/server";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = getPageMetadata("home", {
  title: siteConfig.title,
  description: siteConfig.description,
  canonical: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <ProcessSection />
      <LogoMarquee />
      <ReviewsSlider
        variant="grid"
        limit={4}
        eyebrow="Referanslarımız"
        title={
          <>
            Müşterilerimiz{" "}
            <span className="text-gradient">ne diyor?</span>
          </>
        }
        description="Armut üzerinden hizmet alan müşterilerimizin bıraktığı gerçek, bağımsız platform değerlendirmeleri."
        showViewAllLink
      />
      <CtaSection />
    </>
  );
}
