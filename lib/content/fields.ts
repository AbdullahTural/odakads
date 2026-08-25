import type { SiteContent } from "@/lib/api/types";

/** İçerik haritasından bir anahtarı okur; boşsa fallback (mevcut varsayılan metin) döner. */
export function pickContent(map: SiteContent | undefined, key: string, fallback = ""): string {
  const v = map?.[key];
  return v && v.trim() ? v : fallback;
}

export type ContentField = {
  key: string;
  label: string;
  hint?: string;
  multiline?: boolean;
};

export type ContentGroup = {
  title: string;
  description?: string;
  fields: ContentField[];
};

/**
 * Admin "Site İçeriği" formunun ve bileşenlerin ortak anahtar kaynağı.
 * Yeni düzenlenebilir metin eklemek için: buraya bir alan ekleyin + ilgili bileşende
 * pickContent(data, "anahtar", "varsayılan") ile okuyun. (Migration gerekmez.)
 */
export const CONTENT_GROUPS: ContentGroup[] = [
  {
    title: "Ana Sayfa — Hero",
    description: "Ana sayfanın en üst (ilk ekran) bölümü.",
    fields: [
      { key: "hero.badge", label: "Üst rozet" },
      { key: "hero.title", label: "Başlık", multiline: true },
      { key: "hero.subtitle", label: "Alt metin", multiline: true },
      { key: "hero.primaryText", label: "1. Buton yazısı" },
      { key: "hero.primaryUrl", label: "1. Buton bağlantısı", hint: "Örn. /iletisim" },
      { key: "hero.secondaryText", label: "2. Buton yazısı" },
      { key: "hero.secondaryUrl", label: "2. Buton bağlantısı", hint: "Örn. /basarilarimiz" },
      { key: "hero.badge1", label: "Güven rozeti 1" },
      { key: "hero.badge2", label: "Güven rozeti 2" },
      { key: "hero.badge3", label: "Güven rozeti 3" },
      { key: "hero.badge4", label: "Güven rozeti 4" },
    ],
  },
  {
    title: "Alt CTA Bölümü",
    description: "Sayfaların altındaki çağrı bölümü. (Buton yazısı/bağlantısı Dönüşüm Ayarları'ndan yönetilir.)",
    fields: [
      { key: "cta.title", label: "Başlık", multiline: true },
      { key: "cta.subtitle", label: "Alt metin", multiline: true },
    ],
  },
  {
    title: "Footer",
    fields: [{ key: "footer.description", label: "Açıklama metni", multiline: true }],
  },
  {
    title: "Sayfa Başlıkları (Hero)",
    description: "Alt sayfaların üst başlık bölümleri. Boş bırakılan alanlar mevcut varsayılan metni kullanır.",
    fields: [
      { key: "page.about.eyebrow", label: "Hakkımızda — üst etiket" },
      { key: "page.about.title", label: "Hakkımızda — başlık", multiline: true },
      { key: "page.about.description", label: "Hakkımızda — açıklama", multiline: true },
      { key: "page.services.eyebrow", label: "Hizmetler — üst etiket" },
      { key: "page.services.title", label: "Hizmetler — başlık", multiline: true },
      { key: "page.services.description", label: "Hizmetler — açıklama", multiline: true },
      { key: "page.success.eyebrow", label: "Referanslarımız — üst etiket" },
      { key: "page.success.title", label: "Referanslarımız — başlık", multiline: true },
      { key: "page.success.description", label: "Referanslarımız — açıklama", multiline: true },
      { key: "page.blog.eyebrow", label: "Blog — üst etiket" },
      { key: "page.blog.title", label: "Blog — başlık", multiline: true },
      { key: "page.blog.description", label: "Blog — açıklama", multiline: true },
    ],
  },
];

export const CONTENT_KEYS: string[] = CONTENT_GROUPS.flatMap((g) => g.fields.map((f) => f.key));
