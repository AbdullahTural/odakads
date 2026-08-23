"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/admin/api";
import { Field, PageHeader } from "@/components/admin/parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      await adminApi.post<boolean>("/api/admin/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Parola güncellenemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Şifre Değiştir"
        description="Yönetim paneli giriş parolanızı güncelleyin."
      />

      <form
        onSubmit={onSubmit}
        className="max-w-md space-y-4 rounded-2xl border border-white/10 bg-card p-6"
      >
        <Field label="Mevcut Parola">
          <Input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </Field>

        <Field
          label="Yeni Parola"
          hint="En az 8 karakter; büyük harf, küçük harf, rakam ve özel karakter içermelidir."
        >
          <Input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
        </Field>

        <Field label="Yeni Parola (Tekrar)">
          <Input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </Field>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Parolayı Güncelle
          </Button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Parola güncellendi
            </span>
          )}
        </div>
      </form>
    </>
  );
}
