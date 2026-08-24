/** Blog tarih/etiket bicimlendirme yardimcilari (tr-TR). */

export function formatBlogDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** ISO tarihi <time> datetime niteligi icin (YYYY-MM-DD). */
export function isoDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function readingLabel(minutes: number): string {
  return `${Math.max(1, minutes || 1)} dk okuma`;
}
