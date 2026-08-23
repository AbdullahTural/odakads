"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAnalyticsSettings, useUpdateAnalyticsSettings } from "@/lib/admin/hooks";
import type { AnalyticsSettingInput } from "@/lib/admin/types";
import { Field, PageHeader } from "@/components/admin/parts";
import { Toggle } from "@/components/admin/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const empty: AnalyticsSettingInput = {
  googleAnalyticsMeasurementId: "",
  googleTagManagerId: "",
  googleSearchConsoleVerificationCode: "",
  microsoftClarityProjectId: "",
  metaPixelId: "",
  linkedinInsightTagPartnerId: "",
  isActive: false,
};

const DESC = {
  ga4: "Sitedeki ziyaretçi, trafik ve dönüşüm verilerini Google Analytics üzerinden takip etmenizi sağlar. Örnek format: G-XXXXXXXXXX.",
  gtm: "Kod eklemeden Analytics, reklam ve dönüşüm etiketlerini yönetmenizi sağlar. Örnek format: GTM-XXXXXXX.",
  gsc: "Google'ın site sahipliğini doğrulaması için kullanılır. Search Console'daki HTML tag doğrulama kodunun content değerini girin.",
  clarity: "Kullanıcıların sitedeki hareketlerini, ısı haritalarını ve oturum kayıtlarını analiz etmenizi sağlar.",
  pixel: "Facebook ve Instagram reklam dönüşümlerini takip etmek için kullanılır.",
  linkedin: "LinkedIn reklam performansını ve dönüşümleri takip etmek için kullanılır.",
  active: "Takip kodlarının frontend tarafında aktif olup olmayacağını belirler.",
};

export default function AnalyticsSettingsPage() {
  const { data, isLoading, isError } = useAnalyticsSettings();
  const updateM = useUpdateAnalyticsSettings();
  const [form, setForm] = React.useState<AnalyticsSettingInput>(empty);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data) {
      setForm({
        googleAnalyticsMeasurementId: data.googleAnalyticsMeasurementId ?? "",
        googleTagManagerId: data.googleTagManagerId ?? "",
        googleSearchConsoleVerificationCode: data.googleSearchConsoleVerificationCode ?? "",
        microsoftClarityProjectId: data.microsoftClarityProjectId ?? "",
        metaPixelId: data.metaPixelId ?? "",
        linkedinInsightTagPartnerId: data.linkedinInsightTagPartnerId ?? "",
        isActive: data.isActive,
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
      <PageHeader title="Analytics / Takip Kodları" description="Sadece ID değerlerini girin; sistem güvenli script'i otomatik üretir." />

      {isLoading && <p className="text-sm text-muted-foreground">Yükleniyor...</p>}
      {isError && <p className="text-sm text-red-400">Ayarlar yüklenemedi.</p>}

      {!isLoading && !isError && (
        <div className="max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-card p-6">
          <Field label="Google Analytics 4 Measurement ID" hint={DESC.ga4}>
            <Input placeholder="G-XXXXXXXXXX" value={form.googleAnalyticsMeasurementId ?? ""} onChange={(e) => setForm({ ...form, googleAnalyticsMeasurementId: e.target.value })} />
          </Field>
          <Field label="Google Tag Manager ID" hint={DESC.gtm}>
            <Input placeholder="GTM-XXXXXXX" value={form.googleTagManagerId ?? ""} onChange={(e) => setForm({ ...form, googleTagManagerId: e.target.value })} />
          </Field>
          <Field label="Google Search Console Verification Code" hint={DESC.gsc}>
            <Input value={form.googleSearchConsoleVerificationCode ?? ""} onChange={(e) => setForm({ ...form, googleSearchConsoleVerificationCode: e.target.value })} />
          </Field>
          <Field label="Microsoft Clarity Project ID" hint={DESC.clarity}>
            <Input value={form.microsoftClarityProjectId ?? ""} onChange={(e) => setForm({ ...form, microsoftClarityProjectId: e.target.value })} />
          </Field>
          <Field label="Meta Pixel ID" hint={DESC.pixel}>
            <Input value={form.metaPixelId ?? ""} onChange={(e) => setForm({ ...form, metaPixelId: e.target.value })} />
          </Field>
          <Field label="LinkedIn Insight Tag Partner ID" hint={DESC.linkedin}>
            <Input value={form.linkedinInsightTagPartnerId ?? ""} onChange={(e) => setForm({ ...form, linkedinInsightTagPartnerId: e.target.value })} />
          </Field>
          <div>
            <Toggle checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} label="Takip kodları aktif" />
            <p className="mt-1 text-xs text-muted-foreground">{DESC.active}</p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex items-center gap-4 pt-2">
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
