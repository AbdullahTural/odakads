# Odak Ads Reklam — Web Sitesi

Modern, koyu temalı, premium kurumsal tanıtım sitesi. **API-ready** mimaride
geliştirilmiştir: tüm bölümler bugün yerel mock veriden beslenir, yarın hiçbir
bileşen değişmeden **ASP.NET Core Web API**'ye geçirilebilir.

## Teknoloji

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **TailwindCSS v3** + shadcn/UI desenli bileşenler (Radix primitive'leri)
- **TanStack Query** — tüm veri çekme katmanı
- **Framer Motion** — scroll-reveal, sayaç, glow/float animasyonları
- **Recharts** — hero dashboard grafikleri · **Swiper** — yorum slider'ı
- **React Hook Form + Zod** — iletişim formu doğrulaması
- **Resend** — iletişim formu e-posta gönderimi · **Lucide** — ikonlar

## Kurulum

```bash
npm install
cp .env.example .env.local   # değerleri doldurun (zorunlu değil)
npm run dev                  # http://localhost:3000
```

Üretim derlemesi (statik export + wwwroot):

```bash
# API calisiyor olmali (admin SEO icin) — veya SKIP_SEO_FETCH=true
npm run build:deploy          # fetch:seo + next build + wwwroot kopya
npm run build:all             # + dotnet publish
```

Tek komut publish (frontend build dahil):

```bash
dotnet publish backend/src/API/HasanHabibSeyda.API.csproj -c Release -o backend/publish
```

## SEO ve static rebuild

Admin panelde SEO değiştirdikten sonra meta etiketlerinin canlıya yansıması için **rebuild** gerekir:

1. Backend API çalışır durumda olsun (SEO verisi DB'de)
2. `npm run build:deploy` — build öncesi `fetch:seo` API'den aktif SEO'yu çeker → `lib/seo-build-overrides.json`
3. `out/` → `backend/src/API/wwwroot/` kopyalanır; uygulama yeniden yayınlanır

API kapalıyken build: `SKIP_SEO_FETCH=true npm run build:static` (fallback metadata kullanılır).

| Değişken | Açıklama |
| --- | --- |
| `BUILD_SEO_API_URL` | SEO fetch için API adresi (varsayılan: `NEXT_PUBLIC_API_BASE_URL` veya `http://localhost:5085`) |
| `SKIP_SEO_FETCH` | `true` ise SEO fetch atlanır |

## Ortam Değişkenleri (`.env.local`)

| Değişken | Açıklama |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canlı adres (metadata, sitemap, canonical) |
| `NEXT_PUBLIC_USE_MOCK` | `true` = mock veri; production build'de `false` |
| `NEXT_PUBLIC_API_BASE_URL` | Dev'de backend URL. Production tek-host: **boş** |
| `BUILD_SEO_API_URL` | Static build SEO fetch API adresi (opsiyonel) |
| `SKIP_SEO_FETCH` | `true` = build sırasında SEO API fetch atla |

## Mimari

```
app/                 # sayfalar (Server Component) + metadata + api/contact route
components/
  layout/            # Navbar, Footer, Logo, MobileMenu
  sections/          # tüm sayfa bölümleri (veriyi hook'lardan çeker)
  ui/                # shadcn deseni primitive'ler + özel bileşenler
  forms/             # ContactForm (RHF + Zod)
lib/
  api/
    types.ts         # DTO/interface'ler (API JSON sözleşmesi)
    client.ts        # tipli fetch wrapper (apiClient) + USE_MOCK
    endpoints.ts     # kaynak fonksiyonları (mock <-> gerçek API)
    mock-data.ts     # GEÇİCİ statik veri (DTO tipinde)
    hooks.ts         # TanStack Query hook'ları
  validations.ts     # Zod şeması (client + server ortak)
  site.ts            # marka/nav/iletişim sabitleri
```

### Mock → Gerçek API geçişi

`NEXT_PUBLIC_API_BASE_URL` tanımlandığı an `lib/api/client.ts` içindeki
`USE_MOCK` bayrağı `false` olur ve `endpoints.ts` tüm istekleri gerçek API'ye
yönlendirir. **Section, hook ve DTO'lar değişmez.**

## FE ↔ BE Sözleşmesi (ASP.NET Core)

Frontend, aşağıdaki endpoint'lerin `ApiResponse<T>` (`{ data, success, message }`)
veya doğrudan `T` döndürmesini bekler. JSON alanları **camelCase** olmalıdır
(System.Text.Json varsayılanı).

| HTTP | Endpoint | Dönen Tip (TS) | C# DTO |
| --- | --- | --- | --- |
| GET | `/api/services` | `ServiceDto[]` | `ServiceDto` |
| GET | `/api/stats` | `StatDto[]` | `StatDto` |
| GET | `/api/process-steps` | `ProcessStepDto[]` | `ProcessStepDto` |
| GET | `/api/values` | `ValueDto[]` | `ValueDto` |
| GET | `/api/testimonials` | `TestimonialDto[]` | `TestimonialDto` |
| GET | `/api/reviews` | `ReviewDto[]` | `ReviewDto` |
| GET | `/api/video-testimonials` | `VideoTestimonialDto[]` | `VideoTestimonialDto` |
| GET | `/api/case-studies` | `CaseStudyDto[]` | `CaseStudyDto` |

> İletişim formu (`POST /api/contact`) Next.js'in kendi route'unda işlenir ve
> Resend ile e-posta gönderir; ASP.NET Core API'den bağımsızdır.

Tüm DTO tanımları için `lib/api/types.ts` kaynaktır. C# tarafında karşılık gelen
sınıflar birebir aynı alan adlarıyla (PascalCase property → camelCase JSON)
oluşturulmalıdır.

## Sayfalar

- `/` Ana Sayfa — Hero (Recharts dashboard), İstatistikler, Hizmetler, Süreç, Referanslar, CTA
- `/hakkimizda` — Hikâye, Misyon/Vizyon, Değerler, İstatistikler
- `/hizmetler` — 8 hizmet kartı, Süreç
- `/basarilarimiz` — Armut yorumları (Swiper), Video referanslar, Vaka çalışmaları, Google Partner
- `/blog` — Blog listesi · `/blog/yazi-slug` — Blog detay (SSG, build-time üretilir)
- `/iletisim` — İletişim formu, bilgiler, harita

## Bloglar (SSG + admin)

Blog içeriği backend DB'de tutulur; ziyaretçi tarafı **static export ile build-time** üretilir
(`generateStaticParams`), böylece içerik JS gerektirmeden server-rendered sunulur (SEO).

- **Yayın akışı:** Admin panelde yazı oluştur/yayınla → yeni yazının canlıya çıkması için **rebuild** gerekir
  (SEO akışıyla aynı): `npm run build:deploy`. Build öncesi `fetch:blog`, yayındaki yazıları API'den çekip
  `lib/blog-build-data.json`'a yazar (API kapalıysa güvenli boş fallback).
- **Yalnızca yayındakiler** listelenir/sitemap'e girer; taslak/arşiv üretilmez, `/admin/*` noindex.
- **Görsel deposu:** Kapak görselleri `wwwroot` **dışında** kalıcı bir klasöre yüklenir ve `/media/*` ile
  servis edilir (böylece `copy:wwwroot` yüklemeleri silmez). Konum: `appsettings → Media:RootPath`
  (production'da deploy klasörü dışında, kalıcı bir mutlak yol önerilir; varsayılan `App_Data/uploads`).

## Yönetim Paneli (`/admin`)

JWT korumalı admin panel (backend gerektirir — `NEXT_PUBLIC_API_BASE_URL` tanımlı olmalı).

- `/admin/login` — giriş (varsayılan: `admin@odakadsreklam.com` / `Admin123!`)
- `/admin/dashboard` — özet kartlar
- `/admin/services` · `/admin/testimonials` · `/admin/video-testimonials` · `/admin/case-studies`
  — tablo + ekle/düzenle/sil (arama + sayfalama)
- `/admin/contact-requests` — gelen form mesajları (görüntüle / okundu / sil)
- `/admin/site-settings` — iletişim & sosyal medya ayarları

Token'lar localStorage'da tutulur; 401'de refresh token ile otomatik yenilenir. `/admin`
rotalarında public navbar/footer gizlenir (`components/layout/AppShell.tsx`).
