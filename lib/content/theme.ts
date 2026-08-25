/**
 * Tema (marka rengi) yardımcıları.
 * Renkler admin "Görünüm" panelinden ContentBlock (theme.primary / theme.secondary) olarak saklanır;
 * ThemeVars runtime'da CSS değişkenlerini (--primary/--accent/--ring/--secondary) ezerek uygular.
 */

/** Mevcut tasarıma yakın varsayılan renkler (picker başlangıç değeri). */
export const DEFAULT_PRIMARY_HEX = "#4f46e5"; // indigo
export const DEFAULT_SECONDARY_HEX = "#8b5cf6"; // violet

export function isValidHex(hex: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test((hex || "").trim());
}

export function normalizeHex(hex: string): string {
  const t = (hex || "").trim();
  if (!isValidHex(t)) return "";
  return t.startsWith("#") ? t.toLowerCase() : `#${t.toLowerCase()}`;
}

/** #RRGGBB → "H S% L%" (Tailwind token formatı). Geçersizse null. */
export function hexToHslTriplet(hex: string): string | null {
  const m = /^#?([0-9a-fA-F]{6})$/.exec((hex || "").trim());
  if (!m) return null;

  const int = parseInt(m[1], 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
