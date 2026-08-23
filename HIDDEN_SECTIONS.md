# Gizlenen Bölümler

Public siteden geçici olarak kaldırılan bölümlerin envanteri. Bileşen dosyaları, API endpoint'leri, admin ekranları ve DB tabloları **silinmedi** — yalnızca sayfa render'ları kaldırıldı.

Geri açmak için ilgili sayfa dosyasında yorum satırındaki import'u geri ekleyin ve `<BölümAdı />` satırını JSX'e yerleştirin. Ardından `npm run build:deploy` (+ API publish) ile deploy edin.

---

## StatsSection (`components/sections/StatsSection.tsx`)

| Alan | Değer |
|------|--------|
| **Kaldırıldığı sayfalar** | Ana sayfa (`app/page.tsx`), Hakkımızda (`app/hakkimizda/page.tsx`), Başarılarımız / Müşteri Yorumları (`app/basarilarimiz/page.tsx`) |
| **Neden gizlendi** | Seed/mock istatistikler (150+ müşteri, ₺50M+ bütçe, %90+ ROAS vb.) kanıtlanamaz pazarlama iddiaları içeriyordu. Gerçek rakamlar olmadan gösterilmemesi kararlaştırıldı. |
| **Geri açma** | Her sayfada: `import { StatsSection } from "@/components/sections/StatsSection";` ve uygun sıraya `<StatsSection />` (genelde hero/hizmetler sonrası, CTA öncesi). |
| **Ön koşul** | `Stats` tablosunda doğrulanmış gerçek metrikler; admin CRUD ekranı yok — veri SQL veya yeni admin ekranı ile güncellenmeli. |

---

## GooglePartner (`components/sections/GooglePartner.tsx`)

| Alan | Değer |
|------|--------|
| **Kaldırıldığı sayfa** | `app/basarilarimiz/page.tsx` |
| **Neden gizlendi** | "Resmî Google Partner" statüsü ve "garantisidir" gibi ifadeler doğrulanamayan / abartılı partner iddiaları içeriyordu. |
| **Geri açma** | `app/basarilarimiz/page.tsx`: `import { GooglePartner } from "@/components/sections/GooglePartner";` ve `<ReviewsSlider />` ile `<CtaSection />` arasına `<GooglePartner />`. |
| **Ön koşul** | Resmî Google Partner statüsü doğrulanmış olmalı; metinler iddia yerine doğrulanabilir ifadelerle güncellenmeli (`GooglePartner.tsx` içeriği revize edilmeli). |

---

## CaseStudies (`components/sections/CaseStudies.tsx`)

| Alan | Değer |
|------|--------|
| **Kaldırıldığı sayfa** | `app/basarilarimiz/page.tsx` |
| **Neden gizlendi** | Seed vaka çalışmaları (+380% büyüme, ROAS 5.2 vb.) gerçek müşteri verisi değil; sayfa gerçek içerik (Armut yorumları) odaklı hale getirildi. |
| **Geri açma** | `app/basarilarimiz/page.tsx`: `import { CaseStudies } from "@/components/sections/CaseStudies";` ve `<ReviewsSlider />` sonrasına `<CaseStudies />`. |
| **Ön koşul** | Admin → Vaka Çalışmaları (`/admin/case-studies`) üzerinden gerçek, onaylı müşteri vakaları girilmiş olmalı; seed verisi canlıda kullanılmamalı. |

---

## VideoTestimonials (`components/sections/VideoTestimonials.tsx`)

| Alan | Değer |
|------|--------|
| **Kaldırıldığı sayfa** | `app/basarilarimiz/page.tsx` |
| **Neden gizlendi** | Seed video referansları placeholder YouTube embed ve uydurma alıntılar içeriyordu; gerçek video referansı yok. |
| **Geri açma** | `app/basarilarimiz/page.tsx`: `import { VideoTestimonials } from "@/components/sections/VideoTestimonials";` ve `<ReviewsSlider />` sonrasına `<VideoTestimonials />`. |
| **Ön koşul** | Admin → Video Referanslar (`/admin/video-testimonials`) üzerinden gerçek müşteri videoları ve embed URL'leri eklenmiş olmalı. |

---

## TestimonialsSection — ana sayfadan kaldırıldı (2026 revizyon)

| Alan | Değer |
|------|--------|
| **Eski konum** | Ana sayfa (`app/page.tsx`) — `TestimonialsSection` + `/api/testimonials` (seed/mock yazılı referanslar) |
| **Yeni durum** | Ana sayfada `ReviewsSlider` (`variant="grid"`, `useReviews` → `/api/reviews`) ile gerçek Armut yorumları gösteriliyor. Admin → Armut Yorumları (`/admin/reviews`) ile senkron. |
| **Bileşen dosyası** | `components/sections/TestimonialsSection.tsx` silinmedi — başka sayfada render edilmiyor. |
| **Geri açma** | `app/page.tsx`: `ReviewsSlider` yerine `import { TestimonialsSection } from "@/components/sections/TestimonialsSection";` ve `<TestimonialsSection />`. |
| **Ön koşul** | Admin → Referanslar (`/admin/testimonials`) üzerinden doğrulanmış yazılı referanslar; seed verisi canlıda kullanılmamalı. |

---

## LogoMarquee (`components/sections/LogoMarquee.tsx`)

| Alan | Değer |
|------|--------|
| **Konum** | Ana sayfa (yorum bölümünün hemen üstü), `/basarilarimiz` (hero altı) |
| **Veri** | `useReferenceCompanies()` → `GET /api/reference-companies` (yorumlardan bağımsız `ReferenceCompany` entity) |
| **Görünürlük** | **3 veya daha fazla aktif firma** admin'de kayıtlıysa otomatik render; aksi halde bölüm hiç gösterilmez |
| **Admin** | `/admin/reference-companies` — logo dosya yükleme, sıralama, aktif/pasif |
| **Gizleme** | Admin'de aktif firma sayısını 2'nin altına düşürmek yeterli; kod değişikliği gerekmez |

---

## Hızlı referans — `/basarilarimiz` mevcut yapı (2026)

Aktif: `PageHero` → `LogoMarquee` (3+ firma) → `ReviewsSlider` → `CtaSection`

Gizli (yorum satırında): StatsSection, GooglePartner, VideoTestimonials, CaseStudies

URL değişmedi: `/basarilarimiz` — menü etiketi: **Referanslarımız** (`lib/site.ts` → `navItems`)
