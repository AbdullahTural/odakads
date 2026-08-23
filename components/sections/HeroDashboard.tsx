"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, MousePointerClick, TrendingUp } from "lucide-react";

const roasData = [
  { name: "Oca", value: 1.6 },
  { name: "Şub", value: 1.9 },
  { name: "Mar", value: 2.1 },
  { name: "Nis", value: 2.3 },
  { name: "May", value: 2.5 },
  { name: "Haz", value: 2.8 },
];

const convData = [
  { name: "P", value: 18 },
  { name: "S", value: 24 },
  { name: "Ç", value: 21 },
  { name: "P", value: 32 },
  { name: "C", value: 28 },
  { name: "C", value: 36 },
  { name: "P", value: 31 },
];

export function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
      style={{ perspective: 1200 }}
      className="force-dark relative"
    >
      {/* arka glow — panel her temada koyu kalır */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 scale-95 rounded-[2rem] bg-gradient-to-br from-primary/30 to-secondary/30 blur-[80px]"
      />

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="glass-strong relative rounded-[1.75rem] border border-white/10 p-5 text-foreground shadow-glass"
      >
        {/* ust bar */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-xs font-medium text-muted-foreground">
              Kampanya Paneli
            </span>
            <span className="text-[10px] text-muted-foreground/70">
              Temsili gösterim
            </span>
          </div>
        </div>

        {/* metrik kartlari */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="ROAS"
            value="2.8x"
            delta="+42%"
            accent="blue"
          />
          <MetricCard
            icon={<MousePointerClick className="h-4 w-4" />}
            label="Dönüşüm"
            value="214"
            delta="+27%"
            accent="purple"
          />
        </div>

        {/* ROAS alan grafigi */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              ROAS Gelişimi
            </p>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <ArrowUpRight className="h-3 w-3" /> Son 6 ay
            </span>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roasData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="roasFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis
                  domain={[1.4, 3.0]}
                  hide
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <Tooltip content={<ChartTooltip suffix="x" />} cursor={false} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#60a5fa"
                  strokeWidth={2.5}
                  fill="url(#roasFill)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#60a5fa" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* dönüşüm bar grafigi */}
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Haftalık Dönüşümler
          </p>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={convData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <YAxis domain={[0, 40]} hide />
                <Tooltip content={<ChartTooltip />} cursor={false} />
                <Bar dataKey="value" fill="url(#barFill)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* yuzen kucuk rozet */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="glass absolute -right-4 -top-4 hidden rounded-2xl px-4 py-3 shadow-glow-purple sm:block"
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Tıklama Maliyeti
        </p>
        <p className="font-display text-lg font-bold text-emerald-400">-18%</p>
      </motion.div>
    </motion.div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  delta,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  accent: "blue" | "purple";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between">
        <span
          className={
            accent === "blue"
              ? "grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary"
              : "grid h-8 w-8 place-items-center rounded-lg bg-secondary/15 text-secondary"
          }
        >
          {icon}
        </span>
        <span className="text-xs font-semibold text-emerald-400">{delta}</span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  suffix = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-popover px-3 py-1.5 text-xs shadow-glass">
      <span className="font-semibold text-foreground">
        {payload[0].value}
        {suffix}
      </span>
    </div>
  );
}
