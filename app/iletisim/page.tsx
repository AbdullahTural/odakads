import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ContactHero } from "@/components/sections/ContactHero";
import { ContactInfo } from "@/components/sections/ContactInfo";
import { MapSection } from "@/components/sections/MapSection";
import { getPageMetadata } from "@/lib/api/server";

const ContactForm = dynamic(
  () => import("@/components/forms/ContactForm").then((m) => m.ContactForm),
  { loading: () => <div className="skeleton h-[520px] w-full rounded-2xl" /> },
);

const CtaSection = dynamic(
  () => import("@/components/sections/CtaSection").then((m) => m.CtaSection),
  { loading: () => <div className="skeleton h-48 w-full rounded-2xl" /> },
);

export const metadata: Metadata = getPageMetadata("contact", {
  title: "İletişim | Odak Ads Reklam",
  description:
    "Ücretsiz Google Ads hesap analizi için bizimle iletişime geçin. Formu doldurun, 24 saat içinde dönüş yapalım.",
  canonical: "/iletisim",
});

export default function ContactPage() {
  return (
    <>
      <ContactHero>
        <ContactForm
          title="Bize Mesaj Gönderin"
          subtitle="Formu doldurun, en kısa sürede size dönüş yapalım."
        />
      </ContactHero>

      <section className="py-12 sm:py-16">
        <div className="container grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <ContactInfo />
          <MapSection />
        </div>
      </section>

      <CtaSection />
    </>
  );
}
