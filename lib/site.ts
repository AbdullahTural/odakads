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
  /** Varsayilan sosyal paylasim gorseli (og:image) — 1200x630 marka gorseli. */
  ogImage: "/images/og-default.png",
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
    phone: "+90 530 426 36 89",
    phoneHref: "tel:+905304263689",
    email: "info@odakadsreklam.com",
    emailHref: "mailto:info@odakadsreklam.com",
    address: "Mimar Sinan Mah., Üsküdar / İstanbul",
    addressLocality: "Üsküdar",
    addressRegion: "İstanbul",
    addressCountry: "TR",
    workingHours: "Pazartesi – Cuma, 09:00 – 18:00",
    mapEmbed:
      "https://www.google.com/maps?q=%C3%9Csk%C3%BCdar%20%C4%B0stanbul&output=embed",
  },
  social: {
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/odakads/",
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
  { label: "Bloglar", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
];
