"use client";

import * as React from "react";
import { Pencil, Info } from "lucide-react";
import { useSeoSettings, useUpdateSeoSetting } from "@/lib/admin/hooks";
import type { SeoSettingInput, SeoSettingItem } from "@/lib/admin/types";
import {
  Field,
  PageHeader,
  StatusPill,
  TableCard,
  TableState,
  tdClass,
  thClass,
} from "@/components/admin/parts";
import { Modal } from "@/components/admin/Modal";
import { Toggle } from "@/components/admin/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const DESC = {
  title:
    "Google arama sonuçlarında ve tarayıcı sekmesinde görünen sayfa başlığıdır. Önerilen uzunluk: 50-60 karakter.",
  description:
    "Google arama sonuçlarında başlığın altında görünen açıklamadır. Önerilen uzunluk: 140-160 karakter.",
  keywords:
    "Sayfanın hedeflediği anahtar kelimelerdir. SEO için yardımcıdır ancak tek başına sıralama garantisi vermez.",
  canonicalUrl:
    "Bu sayfanın resmi URL adresidir. Kopya içerik sorunlarını önlemeye yardımcı olur.",
  isActive:
    "Bu SEO ayarının aktif olup olmadığını belirler. Pasifse build fallback metadata kullanılır.",
};

function Counter({ value, min, max }: { value: string; min: number; max: number }) {
  const len = value.length;
  const ok = len >= min && len <= max;
  return (
    <span className={ok ? "text-emerald-400" : "text-amber-400"}>
      {len} karakter {ok ? "✓" : `(önerilen ${min}-${max})`}
    </span>
  );
}

export default function SeoSettingsPage() {
  const { data, isLoading, isError } = useSeoSettings();
  const updateM = useUpdateSeoSetting();

  const [editing, setEditing] = React.useState<SeoSettingItem | null>(null);
  const [form, setForm] = React.useState<SeoSettingInput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [savedNotice, setSavedNotice] = React.useState<string | null>(null);

  const openEdit = (item: SeoSettingItem) => {
    setEditing(item);
    setForm({
      pageName: item.pageName,
      title: item.title,
      description: item.description,
      keywords: item.keywords,
      canonicalUrl: item.canonicalUrl,
      isActive: item.isActive,
    });
    setError(null);
  };

  const onSave = async () => {
    if (!editing || !form) return;
    setError(null);
    try {
      await updateM.mutateAsync({ pageKey: editing.pageKey, input: form });
      setEditing(null);
      setSavedNotice(
        "SEO kaydedildi. Canlı sitede görünmesi için sunucuda npm run build:deploy çalıştırın.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi.");
    }
  };

  return (
    <>
      <PageHeader title="SEO Yönetimi" description="Her sayfa için arama motoru meta verilerini düzenleyin." />

      <div className="mb-6 flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
        <p>
          Site statik export ile sunulur. Buradaki SEO değişiklikleri HTML meta etiketlerine{" "}
          <strong className="font-medium text-amber-50">yalnızca rebuild sonrası</strong> yansır.
          Build sırasında API&apos;den çekilir (<code className="text-xs">npm run build:deploy</code>).
        </p>
      </div>

      {savedNotice && (
        <div className="mb-6 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {savedNotice}
        </div>
      )}

      <TableCard>
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <th className={thClass}>Sayfa</th>
              <th className={thClass}>Başlık</th>
              <th className={thClass}>Durum</th>
              <th className={`${thClass} text-right`}>İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data?.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-white/[0.02]">
                <td className={`${tdClass} font-medium`}>{item.pageName}<div className="text-xs text-muted-foreground">/{item.pageKey}</div></td>
                <td className={`${tdClass} max-w-xs truncate text-muted-foreground`}>{item.title}</td>
                <td className={tdClass}><StatusPill active={item.isActive} /></td>
                <td className={`${tdClass} text-right`}>
                  <button onClick={() => openEdit(item)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-primary ml-auto" aria-label="Düzenle">
                    <Pencil className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <TableState loading={isLoading} error={isError} empty={!isLoading && !isError && (data?.length ?? 0) === 0} />
      </TableCard>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={`SEO — ${editing?.pageName ?? ""}`} size="lg">
        {form && (
          <div className="space-y-4">
            <Field label="Sayfa Adı">
              <Input value={form.pageName} onChange={(e) => setForm({ ...form, pageName: e.target.value })} />
            </Field>
            <Field label="Title" hint={DESC.title}>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <div className="text-xs"><Counter value={form.title} min={50} max={60} /></div>
            </Field>
            <Field label="Meta Description" hint={DESC.description}>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="text-xs"><Counter value={form.description} min={140} max={160} /></div>
            </Field>
            <Field label="Keywords" hint={DESC.keywords}>
              <Input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
            </Field>
            <Field label="Canonical URL" hint={DESC.canonicalUrl}>
              <Input value={form.canonicalUrl} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} />
            </Field>
            <div>
              <Toggle checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} label="Aktif" />
              <p className="mt-1 text-xs text-muted-foreground">{DESC.isActive}</p>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => setEditing(null)}>İptal</Button>
              <Button type="button" onClick={onSave} disabled={updateM.isPending}>
                {updateM.isPending ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
