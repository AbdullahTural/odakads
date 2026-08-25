"use client";

import * as React from "react";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { useContentAdmin, useUpdateContent } from "@/lib/admin/hooks";
import { CONTENT_GROUPS, CONTENT_KEYS } from "@/lib/content/fields";
import { PageHeader, Field } from "@/components/admin/parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContentAdminPage() {
  const { data, isLoading, isError } = useContentAdmin();
  const updateM = useUpdateContent();

  const [form, setForm] = React.useState<Record<string, string>>({});
  const [dirty, setDirty] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const populated = React.useRef(false);

  React.useEffect(() => {
    if (data && !populated.current) {
      const init: Record<string, string> = {};
      for (const k of CONTENT_KEYS) init[k] = data[k] ?? "";
      setForm(init);
      populated.current = true;
    }
  }, [data]);

  React.useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
    setSaved(false);
  }

  async function onSave() {
    setError(null);
    try {
      await updateM.mutateAsync(form);
      setDirty(false);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi.");
    }
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
        title="Site İçeriği"
        description="Ana sayfa hero, alt CTA, footer ve sayfa başlıklarını düzenleyin. Boş bırakılan alanlar mevcut varsayılan metni kullanır. Değişiklikler sitede anında yansır (rebuild gerekmez)."
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

      {isError && (
        <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          İçerik yüklenemedi (backend bağlı değil olabilir). Yine de düzenleyip kaydetmeyi deneyebilirsiniz.
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-6 pb-24">
        {CONTENT_GROUPS.map((group) => (
          <section key={group.title} className="rounded-2xl border border-white/10 bg-card p-5">
            <div className="mb-4">
              <h2 className="font-display text-base font-semibold">{group.title}</h2>
              {group.description && (
                <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.fields.map((f) => (
                <div key={f.key} className={f.multiline ? "sm:col-span-2" : undefined}>
                  <Field label={f.label} hint={f.hint}>
                    {f.multiline ? (
                      <Textarea
                        value={form[f.key] ?? ""}
                        onChange={(e) => update(f.key, e.target.value)}
                        className="min-h-[80px]"
                        maxLength={4000}
                        placeholder="Varsayılan metni kullan (boş bırakılabilir)"
                      />
                    ) : (
                      <Input
                        value={form[f.key] ?? ""}
                        onChange={(e) => update(f.key, e.target.value)}
                        maxLength={4000}
                        placeholder="Varsayılan metni kullan"
                      />
                    )}
                  </Field>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Alt sabit kaydet çubuğu */}
      <div className="sticky bottom-0 -mx-4 border-t border-white/10 bg-background/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3">
          {saved && !dirty && (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
              <Check className="h-4 w-4" /> Kaydedildi
            </span>
          )}
          {dirty && <span className="text-sm text-amber-400">Kaydedilmemiş değişiklikler</span>}
          <Button type="button" onClick={onSave} disabled={updateM.isPending || !dirty}>
            {updateM.isPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>
    </>
  );
}
