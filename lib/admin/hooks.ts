"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminApi, toQuery } from "./api";
import type {
  AboutSettingInput,
  AboutSettingItem,
  AnalyticsSettingInput,
  AnalyticsSettingItem,
  CaseStudyInput,
  CaseStudyItem,
  ContactItem,
  ConversionSettingInput,
  ConversionSettingItem,
  DashboardSummary,
  PagedResult,
  QueryParams,
  SeoSettingInput,
  SeoSettingItem,
  ServiceInput,
  ServiceItem,
  SiteSettingsInput,
  SiteSettingsItem,
  TestimonialInput,
  TestimonialItem,
  ReviewInput,
  ReviewItem,
  ReferenceCompanyInput,
  ReferenceCompanyItem,
  VideoInput,
  VideoItem,
} from "./types";

/** Generic CRUD hook fabrikasi (tek kaynak icin liste/olustur/guncelle/sil). */
function createResourceHooks<TItem, TInput>(resource: string, key: string) {
  const base = `/api/admin/${resource}`;

  function useList(params: QueryParams) {
    return useQuery({
      queryKey: [key, "list", params],
      queryFn: () => adminApi.get<PagedResult<TItem>>(`${base}${toQuery(params)}`),
    });
  }

  function useCreate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (input: TInput) => adminApi.post<TItem>(base, input),
      onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
    });
  }

  function useUpdate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: TInput }) =>
        adminApi.put<TItem>(`${base}/${id}`, input),
      onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
    });
  }

  function useRemove() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => adminApi.del<boolean>(`${base}/${id}`),
      onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
    });
  }

  return { useList, useCreate, useUpdate, useRemove };
}

export const servicesHooks = createResourceHooks<ServiceItem, ServiceInput>("services", "admin-services");
export const testimonialsHooks = createResourceHooks<TestimonialItem, TestimonialInput>("testimonials", "admin-testimonials");
export const reviewsHooks = createResourceHooks<ReviewItem, ReviewInput>("reviews", "admin-reviews");
export const referenceCompaniesHooks = createResourceHooks<ReferenceCompanyItem, ReferenceCompanyInput>(
  "reference-companies",
  "admin-reference-companies",
);

export function useUploadReferenceCompanyLogo() {
  return useMutation({
    mutationFn: (file: File) =>
      adminApi.upload<{ url: string }>("/api/admin/reference-companies/upload-logo", file),
  });
}

export const videosHooks = createResourceHooks<VideoItem, VideoInput>("video-testimonials", "admin-videos");
export const caseStudiesHooks = createResourceHooks<CaseStudyItem, CaseStudyInput>("case-studies", "admin-casestudies");

// --- Contact requests ---
export function useContactRequests(params: QueryParams) {
  return useQuery({
    queryKey: ["admin-contacts", "list", params],
    queryFn: () =>
      adminApi.get<PagedResult<ContactItem>>(`/api/admin/contact-requests${toQuery(params)}`),
  });
}

export function useMarkContactRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApi.put<ContactItem>(`/api/admin/contact-requests/${id}/read`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-contacts"] });
      qc.invalidateQueries({ queryKey: ["admin-dashboard-summary"] });
    },
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.del<boolean>(`/api/admin/contact-requests/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-contacts"] });
      qc.invalidateQueries({ queryKey: ["admin-dashboard-summary"] });
    },
  });
}

// --- Site settings ---
export function useSiteSettingsAdmin() {
  return useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: () => adminApi.get<SiteSettingsItem>("/api/admin/site-settings"),
  });
}

export function useUpdateSiteSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SiteSettingsInput) =>
      adminApi.put<SiteSettingsItem>("/api/admin/site-settings", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-site-settings"] }),
  });
}

// --- Phase 3 ---

// SEO
export function useSeoSettings() {
  return useQuery({
    queryKey: ["admin-seo"],
    queryFn: () => adminApi.get<SeoSettingItem[]>("/api/admin/seo-settings"),
  });
}
export function useUpdateSeoSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pageKey, input }: { pageKey: string; input: SeoSettingInput }) =>
      adminApi.put<SeoSettingItem>(`/api/admin/seo-settings/${pageKey}`, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-seo"] }),
  });
}

// Analytics
export function useAnalyticsSettings() {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => adminApi.get<AnalyticsSettingItem | null>("/api/admin/analytics-settings"),
  });
}
export function useUpdateAnalyticsSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AnalyticsSettingInput) =>
      adminApi.put<AnalyticsSettingItem>("/api/admin/analytics-settings", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-analytics"] }),
  });
}

// Conversion
export function useConversionSettings() {
  return useQuery({
    queryKey: ["admin-conversion"],
    queryFn: () => adminApi.get<ConversionSettingItem | null>("/api/admin/conversion-settings"),
  });
}
export function useUpdateConversionSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ConversionSettingInput) =>
      adminApi.put<ConversionSettingItem>("/api/admin/conversion-settings", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-conversion"] }),
  });
}

// About
export function useAboutSettings() {
  return useQuery({
    queryKey: ["admin-about"],
    queryFn: () => adminApi.get<AboutSettingItem | null>("/api/admin/about-settings"),
  });
}
export function useUpdateAboutSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AboutSettingInput) =>
      adminApi.put<AboutSettingItem>("/api/admin/about-settings", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-about"] }),
  });
}

// Dashboard summary
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["admin-dashboard-summary"],
    queryFn: () => adminApi.get<DashboardSummary>("/api/admin/dashboard/summary"),
  });
}
