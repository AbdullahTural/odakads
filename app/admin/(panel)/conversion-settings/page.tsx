"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useConversionSettings, useUpdateConversionSettings } from "@/lib/admin/hooks";
import type { ConversionSettingInput } from "@/lib/admin/types";
import { Field, PageHeader } from "@/components/admin/parts";
import { Toggle } from "@/components/admin/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const empty: ConversionSettingInput = {
  whatsappPhoneNumber: "",
  whatsappDefaultMessage: "",
  isWhatsappEnabled: false,
  isClickToCallEnabled: false,
  calendlyUrl: "",
  isCalendlyEnabled: false,
  primaryCtaText: "",
  primaryCtaUrl: "",
  secondaryCtaText: "",
  secondaryCtaUrl: "",
};

const DESC = {
  phone: "Sağ alttaki WhatsApp butonunda kullanılacak telefon numarasıdır. Ülke koduyla girin. Örnek: 905xxxxxxxxx.",
  msg: "Kullanıcı WhatsApp butonuna bastığında otomatik doldurulacak mesajdır.",
  waActive: "Sağ alttaki WhatsApp butonunun sitede görünüp görünmeyeceğini belirler.",
  callActive:
    "Sağ altta WhatsApp'ın hemen üstünde telefon butonunu gösterir. Numara Site Ayarları → Telefon alanından alınır.",
  calendly: "Ücretsiz görüşme veya randevu planlama bağlantısıdır. Örnek: https://calendly.com/kullanici/30dk.",
  calActive: "CTA butonlarının Calendly bağlantısı açıp açmayacağını belirler.",
  primaryText: "Ana butonlarda görünen metindir. Örnek: Ücretsiz Danışmanlık Al.",
  primaryUrl: "Ana butonun yönlendireceği adrestir. Calendly aktifse Calendly URL öncelikli olabilir.",
  secondaryText: "İkincil butonlarda görünen metindir.",
  secondaryUrl: "İkincil butonun yönlendireceği adrestir.",
};

export default function ConversionSettingsPage() {
  const { data, isLoading, isError } = useConversionSettings();
  const updateM = useUpdateConversionSettings();
  const [form, setForm] = React.useState<ConversionSettingInput>(empty);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data) {
      setForm({
        whatsappPhoneNumber: data.whatsappPhoneNumber ?? "",
        whatsappDefaultMessage: data.whatsappDefaultMessage ?? "",
        isWhatsappEnabled: data.isWhatsappEnabled,
        isClickToCallEnabled: data.isClickToCallEnabled,
        calendlyUrl: data.calendlyUrl ?? "",
        isCalendlyEnabled: data.isCalendlyEnabled,
        primaryCtaText: data.primaryCtaText,
        primaryCtaUrl: data.primaryCtaUrl,
        secondaryCtaText: data.secondaryCtaText,
        secondaryCtaUrl: data.secondaryCtaUrl,
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
      <PageHeader title="Dönüşüm Ayarları" description="WhatsApp, telefon, Calendly ve CTA buton davranışları." />

      {isLoading && <p className="text-sm text-muted-foreground">Yükleniyor...</p>}
      {isError && <p className="text-sm text-red-400">Ayarlar yüklenemedi.</p>}

      {!isLoading && !isError && (
        <div className="max-w-2xl space-y-6 rounded-2xl border border-white/10 bg-card p-6">
          <section className="space-y-4">
            <h3 className="font-display text-lg font-semibold">WhatsApp</h3>
            <Field label="WhatsApp Telefon Numarası" hint={DESC.phone}>
              <Input placeholder="905xxxxxxxxx" value={form.whatsappPhoneNumber ?? ""} onChange={(e) => setForm({ ...form, whatsappPhoneNumber: e.target.value })} />
            </Field>
            <Field label="Varsayılan Mesaj" hint={DESC.msg}>
              <Textarea value={form.whatsappDefaultMessage ?? ""} onChange={(e) => setForm({ ...form, whatsappDefaultMessage: e.target.value })} />
            </Field>
            <div>
              <Toggle checked={form.isWhatsappEnabled} onChange={(v) => setForm({ ...form, isWhatsappEnabled: v })} label="WhatsApp butonu aktif" />
              <p className="mt-1 text-xs text-muted-foreground">{DESC.waActive}</p>
            </div>
          </section>

          <section className="space-y-4 border-t border-white/10 pt-5">
            <h3 className="font-display text-lg font-semibold">Telefon (Ara)</h3>
            <div>
              <Toggle
                checked={form.isClickToCallEnabled}
                onChange={(v) => setForm({ ...form, isClickToCallEnabled: v })}
                label="Telefon butonu aktif"
              />
              <p className="mt-1 text-xs text-muted-foreground">{DESC.callActive}</p>
            </div>
          </section>

          <section className="space-y-4 border-t border-white/10 pt-5">
            <h3 className="font-display text-lg font-semibold">Calendly</h3>
            <Field label="Calendly URL" hint={DESC.calendly}>
              <Input placeholder="https://calendly.com/..." value={form.calendlyUrl ?? ""} onChange={(e) => setForm({ ...form, calendlyUrl: e.target.value })} />
            </Field>
            <div>
              <Toggle checked={form.isCalendlyEnabled} onChange={(v) => setForm({ ...form, isCalendlyEnabled: v })} label="Calendly aktif" />
              <p className="mt-1 text-xs text-muted-foreground">{DESC.calActive}</p>
            </div>
          </section>

          <section className="space-y-4 border-t border-white/10 pt-5">
            <h3 className="font-display text-lg font-semibold">CTA Butonları</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Primary CTA Text" hint={DESC.primaryText}>
                <Input value={form.primaryCtaText} onChange={(e) => setForm({ ...form, primaryCtaText: e.target.value })} />
              </Field>
              <Field label="Primary CTA URL" hint={DESC.primaryUrl}>
                <Input value={form.primaryCtaUrl} onChange={(e) => setForm({ ...form, primaryCtaUrl: e.target.value })} />
              </Field>
              <Field label="Secondary CTA Text" hint={DESC.secondaryText}>
                <Input value={form.secondaryCtaText} onChange={(e) => setForm({ ...form, secondaryCtaText: e.target.value })} />
              </Field>
              <Field label="Secondary CTA URL" hint={DESC.secondaryUrl}>
                <Input value={form.secondaryCtaUrl} onChange={(e) => setForm({ ...form, secondaryCtaUrl: e.target.value })} />
              </Field>
            </div>
          </section>

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
