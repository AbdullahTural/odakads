"use client";

import * as React from "react";
import { Check, ExternalLink, Loader2, RotateCcw } from "lucide-react";
import { useContentAdmin, useUpdateContent } from "@/lib/admin/hooks";
import {
  DEFAULT_PRIMARY_HEX,
  DEFAULT_SECONDARY_HEX,
  isValidHex,
  normalizeHex,
} from "@/lib/content/theme";
import { PageHeader, Field } from "@/components/admin/parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AppearanceAdminPage() {
  const { data, isLoading } = useContentAdmin();
  const updateM = useUpdateContent();

  const [primary, setPrimary] = React.useState(DEFAULT_PRIMARY_HEX);
  const [secondary, setSecondary] = React.useState(DEFAULT_SECONDARY_HEX);
  const [dirty, setDirty] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const populated = React.useRef(false);

  React.useEffect(() => {
    if (data && !populated.current) {
      if (data["theme.primary"]) setPrimary(data["theme.primary"]);
      if (data["theme.secondary"]) setSecondary(data["theme.secondary"]);
      populated.current = true;
    }
  }, [data]);

  function touch(setter: (v: string) => void, value: string) {
    setter(value);
    setDirty(true);
    setSaved(false);
  }

  async function save(p: string, s: string) {
    setError(null);
    if (p && !isValidHex(p)) return setError("Birincil renk geçersiz (#RRGGBB formatı).");
    if (s && !isValidHex(s)) return setError("İkincil renk geçersiz (#RRGGBB formatı).");
    try {
      await updateM.mutateAsync({
        "theme.primary": p ? normalizeHex(p) : "",
        "theme.secondary": s ? normalizeHex(s) : "",
      });
      setDirty(false);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi.");
    }
  }

  async function resetDefaults() {
    setPrimary(DEFAULT_PRIMARY_HEX);
    setSecondary(DEFAULT_SECONDARY_HEX);
    await save("", ""); // override'ları temizle → tasarım varsayılanı
  }

  if (isLoading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Görünüm"
        description="Marka renklerini ayarlayın. Kaydedince tüm sitede ve bu panelde uygulanır; boş/varsayılan bırakırsanız tasarımın kendi renkleri kullanılır."
        action={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" /> Siteyi Görüntüle
          </a>
        }
      />

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-white/10 bg-card p-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <ColorField
              label="Birincil renk (butonlar, linkler, vurgular)"
              value={primary}
              onChange={(v) => touch(setPrimary, v)}
            />
            <ColorField
              label="İkincil renk"
              value={secondary}
              onChange={(v) => touch(setSecondary, v)}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button type="button" onClick={() => save(primary, secondary)} disabled={updateM.isPending || !dirty}>
              {updateM.isPending ? "Kaydediliyor..." : "Renkleri Uygula"}
            </Button>
            <Button type="button" variant="outline" onClick={resetDefaults} disabled={updateM.isPending}>
              <RotateCcw className="h-4 w-4" /> Varsayılana Dön
            </Button>
            {saved && !dirty && (
              <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
                <Check className="h-4 w-4" /> Kaydedildi
              </span>
            )}
            {dirty && <span className="text-sm text-amber-400">Kaydedilmemiş değişiklikler</span>}
          </div>
        </section>

        {/* Canlı önizleme */}
        <section className="rounded-2xl border border-white/10 bg-card p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Önizleme</h2>
          <div className="space-y-3">
            <div
              className="flex h-12 items-center justify-center rounded-xl text-sm font-semibold text-white"
              style={{ background: isValidHex(primary) ? normalizeHex(primary) : DEFAULT_PRIMARY_HEX }}
            >
              Birincil buton
            </div>
            <div
              className="flex h-12 items-center justify-center rounded-xl text-sm font-semibold text-white"
              style={{ background: isValidHex(secondary) ? normalizeHex(secondary) : DEFAULT_SECONDARY_HEX }}
            >
              İkincil buton
            </div>
            <p className="text-xs text-muted-foreground">
              Not: Kaydettikten sonra değişiklik tüm sitede birkaç saniye içinde yansır.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const safe = isValidHex(value) ? normalizeHex(value) : DEFAULT_PRIMARY_HEX;
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={safe}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} renk seçici`}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-white/10 bg-transparent p-0"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#4f46e5"
          maxLength={7}
        />
      </div>
    </Field>
  );
}
