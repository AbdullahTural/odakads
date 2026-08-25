"use client";

import * as React from "react";
import { PageHero } from "./PageHero";
import { useSiteContent } from "@/lib/api/hooks";
import { pickContent } from "@/lib/content/fields";

type Props = {
  /** İçerik anahtarı öneki: "about" | "services" | "success" | "blog" → page.{key}.* */
  contentKey: string;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  image?: React.ComponentProps<typeof PageHero>["image"];
  aside?: React.ReactNode;
};

/**
 * PageHero'yu admin "Site İçeriği" ile besler.
 * Admin ilgili alanı doldurmadıysa mevcut varsayılan (fallback) render edilir → CLS/boş ekran olmaz.
 * Başlık override edilirse düz metin; edilmezse tasarımdaki JSX (gradient vurgu) korunur.
 */
export function PageHeroDynamic({ contentKey, eyebrow, title, description, image, aside }: Props) {
  const { data } = useSiteContent();
  const base = `page.${contentKey}`;
  const titleOverride = pickContent(data, `${base}.title`);

  return (
    <PageHero
      eyebrow={pickContent(data, `${base}.eyebrow`, eyebrow)}
      title={titleOverride || title}
      description={pickContent(data, `${base}.description`, description)}
      image={image}
      aside={aside}
    />
  );
}
