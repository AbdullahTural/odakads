"use client";

/**
 * TanStack Query hook'lari.
 *
 * Tum section'lar veriyi YALNIZCA bu hook'lar uzerinden tuketir.
 * queryFn'ler endpoints.ts'e baglidir; mock <-> gercek API gecisi
 * section'lari hic degistirmeden yapilir.
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { endpoints } from "./endpoints";
import { resolveSiteSettings } from "@/lib/site-resolved";
import type { ContactRequestDto } from "./types";

export const queryKeys = {
  services: ["services"] as const,
  stats: ["stats"] as const,
  processSteps: ["process-steps"] as const,
  values: ["values"] as const,
  testimonials: ["testimonials"] as const,
  reviews: ["reviews"] as const,
  referenceCompanies: ["reference-companies"] as const,
  videoTestimonials: ["video-testimonials"] as const,
  caseStudies: ["case-studies"] as const,
  siteSettings: ["site-settings"] as const,
  about: ["about-settings"] as const,
  analytics: ["analytics-settings"] as const,
};

const PUBLIC_STALE_TIME = 5 * 60 * 1000;

export function useServices() {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: endpoints.getServices,
    staleTime: PUBLIC_STALE_TIME,
  });
}

export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: endpoints.getStats,
    staleTime: PUBLIC_STALE_TIME,
  });
}

export function useProcessSteps() {
  return useQuery({
    queryKey: queryKeys.processSteps,
    queryFn: endpoints.getProcessSteps,
    staleTime: PUBLIC_STALE_TIME,
  });
}

export function useValues() {
  return useQuery({
    queryKey: queryKeys.values,
    queryFn: endpoints.getValues,
    staleTime: PUBLIC_STALE_TIME,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: endpoints.getTestimonials,
    staleTime: PUBLIC_STALE_TIME,
  });
}

export function useReviews() {
  return useQuery({
    queryKey: queryKeys.reviews,
    queryFn: endpoints.getReviews,
    staleTime: PUBLIC_STALE_TIME,
  });
}

export function useReferenceCompanies() {
  return useQuery({
    queryKey: queryKeys.referenceCompanies,
    queryFn: endpoints.getReferenceCompanies,
    staleTime: PUBLIC_STALE_TIME,
  });
}

export function useVideoTestimonials() {
  return useQuery({
    queryKey: queryKeys.videoTestimonials,
    queryFn: endpoints.getVideoTestimonials,
    staleTime: PUBLIC_STALE_TIME,
  });
}

export function useCaseStudies() {
  return useQuery({
    queryKey: queryKeys.caseStudies,
    queryFn: endpoints.getCaseStudies,
    staleTime: PUBLIC_STALE_TIME,
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: queryKeys.siteSettings,
    queryFn: endpoints.getSiteSettings,
    staleTime: PUBLIC_STALE_TIME,
  });
}

/** API + lib/site.ts fallback birlestirilmis iletisim/sosyal bilgiler */
export function useResolvedSiteSettings() {
  const { data, ...rest } = useSiteSettings();
  return {
    ...rest,
    data: resolveSiteSettings(data),
  };
}

export function useAbout() {
  return useQuery({
    queryKey: queryKeys.about,
    queryFn: endpoints.getAbout,
    staleTime: PUBLIC_STALE_TIME,
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics,
    queryFn: endpoints.getAnalytics,
    staleTime: PUBLIC_STALE_TIME,
  });
}

export function useConversion() {
  return useQuery({
    queryKey: ["conversion-settings"],
    queryFn: endpoints.getConversion,
    staleTime: PUBLIC_STALE_TIME,
  });
}

export function useContactMutation() {
  return useMutation({
    mutationFn: (payload: ContactRequestDto) =>
      endpoints.submitContact(payload),
  });
}
