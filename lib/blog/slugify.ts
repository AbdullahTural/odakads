/**
 * Istemci tarafi slug uretimi (admin editor canli onizleme).
 * Sunucu (BlogWrite.Slugify) nihai otoritedir; bu yalnizca UX icindir.
 */
const TR_MAP: Record<string, string> = {
  İ: "i",
  I: "i",
  ı: "i",
  Ç: "c",
  ç: "c",
  Ğ: "g",
  ğ: "g",
  Ö: "o",
  ö: "o",
  Ş: "s",
  ş: "s",
  Ü: "u",
  ü: "u",
};

export function slugify(input: string): string {
  if (!input) return "";
  const mapped = input
    .trim()
    .split("")
    .map((ch) => TR_MAP[ch] ?? ch)
    .join("")
    .toLowerCase();

  return mapped
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** İçerikten tahmini okuma suresi (dakika). */
export function estimateReadingMinutes(content: string): number {
  if (!content?.trim()) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
