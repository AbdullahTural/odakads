"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LeadChartPoint } from "@/lib/admin/types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
}

export function DashboardLeadChart({ data }: { data: LeadChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
        <Tooltip
          contentStyle={{ background: "#0b1222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }}
          labelFormatter={(l) => fmtDate(String(l))}
          formatter={(v) => [`${v} lead`, ""]}
        />
        <Area type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={2.5} fill="url(#leadFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
