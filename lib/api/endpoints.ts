/**
 * Veri erisim katmani.
 *
 * Her fonksiyon once USE_MOCK bayragini kontrol eder:
 *  - USE_MOCK = true  -> yerel mock veriyi (NEXT_PUBLIC_USE_MOCK=true)
 *  - USE_MOCK = false -> apiClient ile gercek API'ye (relatif veya NEXT_PUBLIC_API_BASE_URL)
 *
 * Section'lar bu fonksiyonlari dogrudan cagirmaz; lib/api/hooks.ts uzerinden
 * TanStack Query ile tuketir.
 */

import { apiClient, USE_MOCK } from "./client";
import {
  mockCaseStudies,
  mockProcessSteps,
  mockReferenceCompanies,
  mockReviews,
  mockServices,
  mockStats,
  mockTestimonials,
  mockValues,
  mockVideoTestimonials,
} from "./mock-data";
import type {
  AboutSettingDto,
  AnalyticsSettingDto,
  CaseStudyDto,
  ContactRequestDto,
  ContactResponseDto,
  ProcessStepDto,
  ReferenceCompanyDto,
  ConversionSettingDto,
  ReviewDto,
  ServiceDto,
  SiteContent,
  SiteSettingsDto,
  StatDto,
  TestimonialDto,
  ValueDto,
  VideoTestimonialDto,
} from "./types";

/** Gercek API'nin async davranisini taklit eden yardimci */
function mock<T>(data: T, delay = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

export const endpoints = {
  getServices: (): Promise<ServiceDto[]> =>
    USE_MOCK
      ? mock([...mockServices].sort((a, b) => a.order - b.order))
      : apiClient.get<ServiceDto[]>("/api/services"),

  getStats: (): Promise<StatDto[]> =>
    USE_MOCK ? mock(mockStats) : apiClient.get<StatDto[]>("/api/stats"),

  getProcessSteps: (): Promise<ProcessStepDto[]> =>
    USE_MOCK
      ? mock([...mockProcessSteps].sort((a, b) => a.step - b.step))
      : apiClient.get<ProcessStepDto[]>("/api/process-steps"),

  getValues: (): Promise<ValueDto[]> =>
    USE_MOCK ? mock(mockValues) : apiClient.get<ValueDto[]>("/api/values"),

  getTestimonials: (): Promise<TestimonialDto[]> =>
    USE_MOCK
      ? mock(mockTestimonials)
      : apiClient.get<TestimonialDto[]>("/api/testimonials"),

  getReviews: (): Promise<ReviewDto[]> =>
    USE_MOCK ? mock(mockReviews) : apiClient.get<ReviewDto[]>("/api/reviews"),

  getReferenceCompanies: (): Promise<ReferenceCompanyDto[]> =>
    USE_MOCK
      ? mock(mockReferenceCompanies)
      : apiClient.get<ReferenceCompanyDto[]>("/api/reference-companies"),

  getVideoTestimonials: (): Promise<VideoTestimonialDto[]> =>
    USE_MOCK
      ? mock(mockVideoTestimonials)
      : apiClient.get<VideoTestimonialDto[]>("/api/video-testimonials"),

  getCaseStudies: (): Promise<CaseStudyDto[]> =>
    USE_MOCK
      ? mock(mockCaseStudies)
      : apiClient.get<CaseStudyDto[]>("/api/case-studies"),

  /**
   * Iletisim formu — her zaman backend POST /api/contact.
   * Mock modda (USE_MOCK=true) gecikmeli basari simule edilir.
   */
  submitContact: (payload: ContactRequestDto): Promise<ContactResponseDto> =>
    USE_MOCK
      ? mock({
          success: true,
          message: "Mesajınız alındı (mock mod — backend bağlı değil).",
        })
      : apiClient.post<ContactResponseDto>("/api/contact", payload),

  getSiteSettings: (): Promise<SiteSettingsDto | null> =>
    USE_MOCK ? mock(null) : apiClient.get<SiteSettingsDto>("/api/site-settings"),

  getConversion: (): Promise<ConversionSettingDto | null> =>
    USE_MOCK ? mock(null) : apiClient.get<ConversionSettingDto>("/api/conversion-settings"),

  getAbout: (): Promise<AboutSettingDto | null> =>
    USE_MOCK ? mock(null) : apiClient.get<AboutSettingDto>("/api/about-settings"),

  getAnalytics: (): Promise<AnalyticsSettingDto | null> =>
    USE_MOCK ? mock(null) : apiClient.get<AnalyticsSettingDto>("/api/analytics-settings"),

  getContent: (): Promise<SiteContent> =>
    USE_MOCK ? mock<SiteContent>({}) : apiClient.get<SiteContent>("/api/content"),
};
