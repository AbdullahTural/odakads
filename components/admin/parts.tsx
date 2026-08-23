"use client";

import * as React from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function AddButton({ onClick, label = "Yeni Ekle" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow-blue transition-transform hover:-translate-y-0.5"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Ara...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

export function TableCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-card">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-white/10 text-muted-foreground",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-400" : "bg-muted-foreground")} />
      {active ? "Aktif" : "Pasif"}
    </span>
  );
}

export function TableState({ loading, error, empty }: { loading: boolean; error: boolean; empty: boolean }) {
  if (loading) return <div className="p-10 text-center text-sm text-muted-foreground">Yükleniyor...</div>;
  if (error) return <div className="p-10 text-center text-sm text-red-400">Veriler yüklenemedi.</div>;
  if (empty) return <div className="p-10 text-center text-sm text-muted-foreground">Kayıt bulunamadı.</div>;
  return null;
}

export const thClass = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground";
export const tdClass = "px-4 py-3 text-sm";

export function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={onEdit}
        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-primary"
        aria-label="Düzenle"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-red-400"
        aria-label="Sil"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
