"use client";

import Link from "next/link";
import {
  Briefcase,
  FileBarChart,
  Mail,
  MailOpen,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useDashboardSummary } from "@/lib/admin/hooks";
import { PageHeader } from "@/components/admin/parts";
import type { LeadChartPoint } from "@/lib/admin/types";

const DashboardLeadChart = dynamic(
  () => import("@/components/admin/DashboardLeadChart").then((m) => m.DashboardLeadChart),
  {
    ssr: false,
    loading: () => <div className="skeleton h-full w-full rounded-xl" />,
  },
);

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardSummary();

  const cards = [
    { label: "Toplam Lead", value: data?.totalLeads, icon: Users, color: "from-blue-500/20 text-blue-400" },
    { label: "Okunmamış Lead", value: data?.unreadLeads, icon: Mail, color: "from-orange-500/20 text-orange-400" },
    { label: "Okunmuş Lead", value: data?.readLeads, icon: MailOpen, color: "from-emerald-500/20 text-emerald-400" },
    { label: "Toplam Başarı Hikayesi", value: data?.totalCaseStudies, icon: FileBarChart, color: "from-sky-500/20 text-sky-400" },
    { label: "Aktif Hizmet", value: data?.activeServices, icon: Briefcase, color: "from-indigo-500/20 text-indigo-400" },
  ];

  return (
    <>
      <PageHeader title="Genel Bakış" description="Son 30 günlük performans ve içerik özeti." />

      {isError && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-red-300">
          Veriler yüklenemedi. Backend çalışıyor mu kontrol edin.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-card p-5">
            <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-display text-3xl font-bold">{isLoading ? "—" : (c.value ?? 0)}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-card p-5">
        <h2 className="mb-4 font-display text-lg font-semibold">Son 30 Gün — Lead Trafiği</h2>
        <div className="h-64">
          {isLoading ? (
            <div className="skeleton h-full w-full rounded-xl" />
          ) : (
            <DashboardLeadChart data={(data?.leadChart ?? []) as LeadChartPoint[]} />
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Son İletişim Talepleri</h2>
          <Link href="/admin/contact-requests" className="text-sm text-primary hover:underline">Tümü</Link>
        </div>
        <ul className="divide-y divide-white/5">
          {(data?.latestContactRequests ?? []).map((c) => (
            <li key={c.id} className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium">{c.fullName}</p>
                <p className="text-xs text-muted-foreground">{c.company} · {c.serviceType}</p>
              </div>
              <span className="text-xs text-muted-foreground">{fmtDateTime(c.createdDate)}</span>
            </li>
          ))}
          {!isLoading && (data?.latestContactRequests.length ?? 0) === 0 && (
            <li className="py-6 text-center text-sm text-muted-foreground">Henüz talep yok.</li>
          )}
        </ul>
      </div>
    </>
  );
}
