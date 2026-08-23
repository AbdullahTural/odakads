/**
 * Site geneli sabitler: marka bilgileri, navigasyon, iletisim.
 * Tek noktadan yonetilir; tum layout/section'lar buradan beslenir.
 */

export const siteConfig = {
  name: "Odak Ads Reklam",
  shortName: "Odak",
  title: "Odak Ads Reklam",
  description:
    "Google Ads ile büyümenizi hızlandırıyoruz. Performans odaklı arama, görüntülü, YouTube ve Performance Max kampanyalarıyla ROAS'ınızı yükseltin.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://odakadsreklam.com",
  locale: "tr_TR",
  keywords: [
    "Google Ads ajansı",
    "Google Ads yönetimi",
    "dijital reklam ajansı",
    "Performance Max",
    "ROAS artışı",
    "arama ağı reklamları",
    "yeniden pazarlama",
    "Google Partner",
  ],
  contact: {
    phone: "+90 (212) 000 00 00",
    phoneHref: "tel:+902120000000",
    email: "info@odakadsreklam.com",
    emailHref: "mailto:info@odakadsreklam.com",
    address: "Maslak Mah. Büyükdere Cad. No:255, Sarıyer / İstanbul",
    workingHours: "Pazartesi – Cuma, 09:00 – 18:00",
    mapEmbed:
      "https://www.google.com/maps?q=Maslak%20Istanbul&output=embed",
  },
  social: {
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
    x: "https://x.com/",
    youtube: "https://www.youtube.com/",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "Referanslarımız", href: "/basarilarimiz" },
  { label: "İletişim", href: "/iletisim" },
];
