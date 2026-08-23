import { siteConfig } from "@/lib/site";
import type { SiteSettingsDto } from "@/lib/api/types";

function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

/** API site ayarlari + lib/site.ts fallback birlestirmesi */
export function resolveSiteSettings(api: SiteSettingsDto | null | undefined) {
  return {
    phone: api?.phone?.trim() || siteConfig.contact.phone,
    phoneHref: api?.phone?.trim()
      ? telHref(api.phone)
      : siteConfig.contact.phoneHref,
    email: api?.email?.trim() || siteConfig.contact.email,
    emailHref: api?.email?.trim()
      ? `mailto:${api.email}`
      : siteConfig.contact.emailHref,
    address: api?.address?.trim() || siteConfig.contact.address,
    workingHours: siteConfig.contact.workingHours,
    mapEmbed: api?.googleMapEmbed?.trim() || siteConfig.contact.mapEmbed,
    linkedin: api?.linkedinUrl?.trim() || siteConfig.social.linkedin,
    instagram: api?.instagramUrl?.trim() || siteConfig.social.instagram,
    facebook: api?.facebookUrl?.trim() || "",
    youtube: siteConfig.social.youtube,
  };
}
