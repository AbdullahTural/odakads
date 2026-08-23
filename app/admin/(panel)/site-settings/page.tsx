"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useSiteSettingsAdmin, useUpdateSiteSettings } from "@/lib/admin/hooks";
import type { SiteSettingsInput } from "@/lib/admin/types";
import { Field, PageHeader } from "@/components/admin/parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const emptyForm: SiteSettingsInput = {
  phone: "",
  email: "",
  address: "",
  googleMapEmbed: "",
  facebookUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
};

export default function SiteSettingsAdminPage() {
  const { data, isLoading, isError } = useSiteSettingsAdmin();
  const updateM = useUpdateSiteSettings();
  const [form, setForm] = React.useState<SiteSettingsInput>(emptyForm);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data) {
      setForm({
        phone: data.phone, email: data.email, address: data.address,
        googleMapEmbed: data.googleMapEmbed, facebookUrl: data.facebookUrl,
        instagramUrl: data.instagramUrl, linkedinUrl: data.linkedinUrl,
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
      <PageHeader title="Site Ayarları" description="İletişim bilgileri ve sosyal medya bağlantıları." />

      {isLoading && <p className="text-sm text-muted-foreground">Yükleniyor...</p>}
      {isError && <p className="text-sm text-red-400">Ayarlar yüklenemedi.</p>}

      {data && (
        <div className="max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Telefon"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="E-posta"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          </div>
          <Field label="Adres"><Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
          <Field
            label="Google Harita Embed URL"
            hint={
              "Google Maps'te konumu açın → Paylaş → \"Haritayı yerleştir\". Verilen HTML'den yalnızca src=\"...\" içindeki bağlantıyı yapıştırın; tüm iframe kodunu değil. URL https://www.google.com/maps/embed? ile başlamalıdır."
            }
          >
            <Input value={form.googleMapEmbed} onChange={(e) => setForm({ ...form, googleMapEmbed: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="LinkedIn"><Input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} /></Field>
            <Field label="Instagram"><Input value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} /></Field>
            <Field label="Facebook"><Input value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} /></Field>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex items-center gap-4 pt-2">
            <Button type="button" onClick={onSave} disabled={updateM.isPending}>
              {updateM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Kaydet
            </Button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Kaydedildi
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
