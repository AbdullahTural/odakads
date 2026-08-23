import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PerformanceOverviewPanel } from "@/components/sections/PerformanceOverviewPanel";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { ReviewsSlider } from "@/components/sections/ReviewsSlider";
// VideoTestimonials: gecici olarak gizli (bilesen/API/DB korunuyor)
// CaseStudies: gecici olarak gizli (bilesen/API/DB korunuyor)
// StatsSection: gecici olarak gizli (bilesen/API/DB korunuyor)
// GooglePartner: gecici olarak gizli (bilesen korunuyor)
import { CtaSection } from "@/components/sections/CtaSection";
import { getPageMetadata } from "@/lib/api/server";

export const metadata: Metadata = getPageMetadata("success", {
  title: "Referanslarımız | Odak Ads Reklam",
  description:
    "Armut platformundaki doğrulanmış müşteri değerlendirmeleri. Google Ads hizmetimiz hakkında müşterilerimizin görüşlerini okuyun.",
  canonical: "/basarilarimiz",
});

export default function SuccessPage() {
  return (
    <>
      <PageHero
        eyebrow="Referanslarımız"
        title={
          <>
            Müşterilerimizin gözünden{" "}
            <span className="text-gradient">Odak Ads</span>
          </>
        }
        description="Armut üzerinden hizmet alan müşterilerimizin bıraktığı gerçek, bağımsız platform değerlendirmeleri."
        aside={<PerformanceOverviewPanel />}
      />
      <LogoMarquee />
      <ReviewsSlider
        eyebrow="Yorumlar"
        title="Armut üzerinden doğrulanmış yorumlar"
        description=""
      />
      <CtaSection />
    </>
  );
}
