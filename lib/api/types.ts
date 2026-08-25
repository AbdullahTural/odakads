/**
 * API veri sozlesmesi (DTO/interface'ler).
 *
 * Bu tipler, gelecekteki ASP.NET Core Web API'nin dondurecegi JSON govdesini
 * birebir yansitir. ASP.NET Core'da System.Text.Json varsayilan olarak camelCase
 * serilestirdigi icin tum alanlar camelCase'dir.
 *
 * FE <-> BE sozlesme eslemesi (C# DTO adlari) icin README'ye bakiniz.
 */

/** Tum tekil/kompozit cevaplar icin standart sarmalayici (ApiResponse<T>) */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/** Sayfalanmis listeler icin sarmalayici */
export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

/** Lucide ikon adi (string) — FE tarafinda map'lenir */
export type IconName = string;

/** Hizmet karti — C#: ServiceDto */
export interface ServiceDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: IconName;
  features: string[];
  order: number;
}

/** Istatistik / metrik — C#: StatDto */
export interface StatDto {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: IconName;
}

/** Surec adimi — C#: ProcessStepDto */
export interface ProcessStepDto {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: IconName;
}

/** Sirket degeri — C#: ValueDto */
export interface ValueDto {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

/** Yazili musteri referansi — C#: TestimonialDto */
export interface TestimonialDto {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  rating: number; // 1-5
  content: string;
}

/** Armut platformu yorumu — C#: ReviewDto */
export interface ReviewDto {
  id: string;
  author: string;
  service: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO 8601
  source: string; // ornek: "Armut"
  companyLogoUrl?: string | null;
}

/** Referans firma logosu — C#: ReferenceCompanyDto */
export interface ReferenceCompanyDto {
  id: string;
  name: string;
  logoUrl: string;
  displayOrder?: number;
  isActive?: boolean;
}

/** Video referans — C#: VideoTestimonialDto */
export interface VideoTestimonialDto {
  id: string;
  name: string;
  company: string;
  thumbnailUrl?: string;
  videoUrl: string;
  duration: string; // ornek "2:14"
  quote: string;
}

/** Case study before/after metrigi */
export interface CaseStudyMetric {
  label: string;
  before: string;
  after: string;
}

/** Basari hikayesi / vaka calismasi — C#: CaseStudyDto */
export interface CaseStudyDto {
  id: string;
  client: string;
  industry: string;
  summary: string;
  metrics: CaseStudyMetric[];
  growth: string; // ornek "+380%"
  tags: string[];
}

/** Site geneli ayarlar — C#: SiteSettingsDto (GET /api/site-settings) */
export interface SiteSettingsDto {
  id: string;
  phone: string;
  email: string;
  address: string;
  googleMapEmbed: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
}

/** Blog liste ogesi — C#: BlogListItemDto (GET /api/blogs) */
export interface BlogListItemDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  coverImageAlt: string;
  category: string;
  tags: string[];
  author: string;
  readingMinutes: number;
  publishedAt: string | null; // ISO 8601
}

/** Blog detay — C#: BlogDetailDto (GET /api/blogs/{slug}) */
export interface BlogDetailDto extends BlogListItemDto {
  /** Markdown govde. */
  content: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  noIndex: boolean;
}

/** Sayfa SEO ayari — C#: SeoSettingDto (GET /api/seo-settings/{pageKey}) */
export interface SeoSettingDto {
  id: string;
  pageKey: string;
  pageName: string;
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  isActive: boolean;
  updatedDate: string;
}

/** Takip kodlari — C#: AnalyticsSettingDto (GET /api/analytics-settings) */
export interface AnalyticsSettingDto {
  id: string;
  googleAnalyticsMeasurementId?: string | null;
  googleTagManagerId?: string | null;
  googleSearchConsoleVerificationCode?: string | null;
  microsoftClarityProjectId?: string | null;
  metaPixelId?: string | null;
  linkedinInsightTagPartnerId?: string | null;
  isActive: boolean;
}

/** Donusum ayarlari — C#: ConversionSettingDto (GET /api/conversion-settings) */
export interface ConversionSettingDto {
  id: string;
  whatsappPhoneNumber?: string | null;
  whatsappDefaultMessage?: string | null;
  isWhatsappEnabled: boolean;
  isClickToCallEnabled: boolean;
  calendlyUrl?: string | null;
  isCalendlyEnabled: boolean;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
}

/** Hakkimizda metin ayarlari — C#: AboutSettingDto (GET /api/about-settings) */
export interface AboutSettingDto {
  id: string;
  founderName: string;
  founderTitle: string;
  founderDescription: string;
  companyStory: string;
  missionText: string;
  visionText: string;
}

/** Iletisim formu istek govdesi — C#: ContactRequestDto */
export interface ContactRequestDto {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  serviceType: string;
  message: string;
  /** spam korumasi (honeypot) — dolu gelirse istek reddedilir */
  website?: string;
  /** form yuklenme zamani (ISO) — cok hizli/bot gonderim tespiti icin */
  formLoadedAt?: string;
}

/** Iletisim formu cevabi — C#: ContactResponseDto */
export interface ContactResponseDto {
  success: boolean;
  message: string;
}

/** Site icerigi (anahtar-deger) — GET /api/content. Admin'den duzenlenebilen duz metinler. */
export type SiteContent = Record<string, string>;
