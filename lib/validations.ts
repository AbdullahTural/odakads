import { z } from "zod";

/**
 * Iletisim formu dogrulama semasi.
 * Hem client (React Hook Form resolver) hem server (API route) tarafinda kullanilir.
 */

const phoneRegex = /^(\+?\d[\d\s()-]{8,17}\d)$/;

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Ad Soyad en az 2 karakter olmalıdır." })
    .max(120, { message: "Ad Soyad çok uzun." }),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, { message: "Geçerli bir telefon numarası girin." })
    .max(40, { message: "Telefon numarası çok uzun." }),
  email: z
    .string()
    .trim()
    .email({ message: "Geçerli bir e-posta adresi girin." })
    .max(200, { message: "E-posta adresi çok uzun." }),
  company: z
    .string()
    .trim()
    .min(2, { message: "Firma adı en az 2 karakter olmalıdır." })
    .max(160, { message: "Firma adı çok uzun." }),
  serviceType: z
    .string()
    .trim()
    .min(1, { message: "Lütfen bir hizmet türü seçin." }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Mesajınız en az 10 karakter olmalıdır." })
    .max(4000, { message: "Mesajınız çok uzun." }),
  // Honeypot — bot disinda doldurulmamali
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const serviceTypeOptions = [
  "Google Ads Yönetimi",
  "Arama Ağı Reklamları",
  "Görüntülü Reklamlar",
  "YouTube Reklamları",
  "Performance Max",
  "Yeniden Pazarlama",
  "Dönüşüm Takibi",
  "A/B Testleri",
  "Diğer",
] as const;
