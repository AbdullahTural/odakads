"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAboutSettings, useUpdateAboutSettings } from "@/lib/admin/hooks";
import type { AboutSettingInput } from "@/lib/admin/types";
import { Field, PageHeader } from "@/components/admin/parts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const empty: AboutSettingInput = {
  companyStory: "",
  missionText: "",
  visionText: "",
};

export default function AboutSettingsPage() {
  const { data, isLoading, isError } = useAboutSettings();
  const updateM = useUpdateAboutSettings();
  const [form, setForm] = React.useState<AboutSettingInput>(empty);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data) {
      setForm({
        companyStory: data.companyStory,
        missionText: data.missionText,
        visionText: data.visionText,
      });
    }
  }, [data]);

  const onSave = async () => {
    setError(null);
    setSaved(false);
    try {
      await updateM.mutateAsync(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi.");
    }
  };

  return (
    <>
      <PageHeader title="Hakkımızda Ayarları" description="Hakkımızda sayfasındaki metinler (görsel alan yoktur)." />

      {isLoading && <p className="text-sm text-muted-foreground">Yükleniyor...</p>}
      {isError && <p className="text-sm text-red-400">Ayarlar yüklenemedi.</p>}

      {!isLoading && !isError && (
        <div className="max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-card p-6">
          <Field label="Şirket Hikayesi">
            <Textarea className="min-h-[140px]" value={form.companyStory} onChange={(e) => setForm({ ...form, companyStory: e.target.value })} />
          </Field>
          <Field label="Misyon">
            <Textarea value={form.missionText} onChange={(e) => setForm({ ...form, missionText: e.target.value })} />
          </Field>
          <Field label="Vizyon">
            <Textarea value={form.visionText} onChange={(e) => setForm({ ...form, visionText: e.target.value })} />
          </Field>

          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex items-center gap-4">
            <Button type="button" onClick={onSave} disabled={updateM.isPending}>
              {updateM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Kaydet
            </Button>
            {saved && <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Kaydedildi</span>}
          </div>
        </div>
      )}
    </>
  );
}
