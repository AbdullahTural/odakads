"use client";

import { useSiteContent } from "@/lib/api/hooks";
import { pickContent } from "@/lib/content/fields";
import { hexToHslTriplet } from "@/lib/content/theme";

/**
 * Admin "Görünüm" panelinde ayarlanan marka renklerini runtime'da uygular.
 * theme.primary / theme.secondary boşsa hiçbir şey yapmaz → globals.css varsayılanları geçerli (regresyon yok).
 * Renkler CSS değişkeni olarak üretilir; kaynak yalnızca doğrulanmış hex → HSL üçlüsüdür.
 */
export function ThemeVars() {
  const { data } = useSiteContent();
  const primary = hexToHslTriplet(pickContent(data, "theme.primary"));
  const secondary = hexToHslTriplet(pickContent(data, "theme.secondary"));

  if (!primary && !secondary) return null;

  const decls: string[] = [];
  if (primary) decls.push(`--primary:${primary}`, `--accent:${primary}`, `--ring:${primary}`);
  if (secondary) decls.push(`--secondary:${secondary}`);
  const block = decls.join(";");
  const css = `:root{${block}}.dark{${block}}.force-dark{${block}}`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
