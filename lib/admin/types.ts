/** Admin paneli icin tipler (backend admin DTO'lariyla birebir). */

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AdminUser;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  order: number;
  isActive: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string | null;
  rating: number;
  content: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  source: string;
  companyLogoUrl?: string | null;
  isActive: boolean;
}

export interface ReferenceCompanyItem {
  id: string;
  name: string;
  logoUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export interface VideoItem {
  id: string;
  name: string;
  company: string;
  thumbnailUrl?: string | null;
  videoUrl: string;
  duration: string;
  quote: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CaseStudyMetric {
  label: string;
  before: string;
  after: string;
}

export interface CaseStudyItem {
  id: string;
  client: string;
  industry: string;
  summary: string;
  metrics: CaseStudyMetric[];
  growth: string;
  tags: string[];
  displayOrder: number;
  isActive: boolean;
}

export interface ContactItem {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  company: string;
  serviceType: string;
  message: string;
  createdDate: string;
  isRead: boolean;
}

export interface SiteSettingsItem {
  id: string;
  phone: string;
  email: string;
  address: string;
  googleMapEmbed: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
}

// --- Create/Update payload tipleri (id haric) ---
export type ServiceInput = Omit<ServiceItem, "id">;
export type TestimonialInput = Omit<TestimonialItem, "id">;
export type ReviewInput = Omit<ReviewItem, "id">;
export type ReferenceCompanyInput = Omit<ReferenceCompanyItem, "id">;
export type VideoInput = Omit<VideoItem, "id">;
export type CaseStudyInput = Omit<CaseStudyItem, "id">;
export type SiteSettingsInput = Omit<SiteSettingsItem, "id">;

// --- Phase 3 ---

export interface SeoSettingItem {
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
export type SeoSettingInput = Pick<
  SeoSettingItem,
  "pageName" | "title" | "description" | "keywords" | "canonicalUrl" | "isActive"
>;

export interface AnalyticsSettingItem {
  id: string;
  googleAnalyticsMeasurementId?: string | null;
  googleTagManagerId?: string | null;
  googleSearchConsoleVerificationCode?: string | null;
  microsoftClarityProjectId?: string | null;
  metaPixelId?: string | null;
  linkedinInsightTagPartnerId?: string | null;
  isActive: boolean;
}
export type AnalyticsSettingInput = Omit<AnalyticsSettingItem, "id">;

export interface ConversionSettingItem {
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
export type ConversionSettingInput = Omit<ConversionSettingItem, "id">;

export interface AboutSettingItem {
  id: string;
  companyStory: string;
  missionText: string;
  visionText: string;
}
export type AboutSettingInput = Omit<AboutSettingItem, "id">;

// --- Blog ---

export type BlogStatus = "draft" | "published" | "archived";

export interface BlogAdminListItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  status: BlogStatus;
  coverImageUrl: string;
  publishedAt: string | null;
  updatedDate: string;
}

export interface BlogAdminDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageAlt: string;
  category: string;
  tags: string[];
  author: string;
  readingMinutes: number;
  status: BlogStatus;
  publishedAt: string | null;
  archivedAt: string | null;
  createdDate: string;
  updatedDate: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  noIndex: boolean;
  previousSlugs: string[];
}

export interface BlogInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageAlt: string;
  category: string;
  tags: string[];
  author: string;
  status: BlogStatus;
  publishedAt: string | null;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  noIndex: boolean;
}

export interface BlogSlugCheck {
  slug: string;
  available: boolean;
}

export interface LeadChartPoint {
  date: string;
  count: number;
}

export interface DashboardSummary {
  totalLeads: number;
  unreadLeads: number;
  readLeads: number;
  totalCaseStudies: number;
  activeServices: number;
  latestContactRequests: ContactItem[];
  leadChart: LeadChartPoint[];
}
