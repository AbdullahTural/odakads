"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const chartData = [
  { day: "1", spend: 1820 },
  { day: "5", spend: 1950 },
  { day: "10", spend: 2100 },
  { day: "15", spend: 2280 },
  { day: "20", spend: 2350 },
  { day: "25", spend: 2450 },
  { day: "30", spend: 2380 },
];

const metrics = [
  {
    label: "Dönüşüm",
    value: "214",
    delta: "+27%",
    positive: true,
    icon: TrendingUp,
  },
  {
    label: "Maliyet/Dönüşüm",
    value: "₺42,15",
    delta: "-12,7%",
    positive: true,
    icon: TrendingDown,
  },
  {
    label: "ROAS",
    value: "2,8x",
    delta: "+42%",
    positive: true,
    icon: TrendingUp,
  },
] as const;

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { day: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="rounded-lg border border-white/10 bg-popover px-2.5 py-1 text-xs shadow-glass">
      <span className="font-semibold text-foreground">
        ₺{val.toLocaleString("tr-TR")}
      </span>
    </div>
  );
}

/** Referanslar hero — temsili performans ozeti paneli */
export function PerformanceOverviewPanel() {
  return (
    <div className="force-dark relative w-full max-w-lg lg:max-w-none">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[1.75rem] bg-gradient-to-br from-secondary/25 to-primary/20 blur-[70px]"
      />
      <div className="glass-strong relative rounded-[1.75rem] border border-white/10 p-5 text-foreground shadow-glass">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Performans Özeti
            </h2>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant="outline" className="text-[11px] font-normal">
              Son 30 gün
            </Badge>
            <span className="text-[10px] text-muted-foreground/70">
              Temsili gösterim
            </span>
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
            >
              <div className="flex items-center justify-between gap-1">
                <m.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span
                  className={cn(
                    "text-[10px] font-semibold",
                    m.positive ? "text-emerald-400" : "text-red-400",
                  )}
                >
                  {m.delta}
                </span>
              </div>
              <p className="mt-2 font-display text-sm font-bold leading-tight">
                {m.label}: {m.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Günlük harcama trendi
          </p>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  tickFormatter={(v) => `${v}. gün`}
                />
                <YAxis hide domain={["dataMin - 200", "dataMax + 200"]} />
                <Tooltip content={<ChartTooltip />} cursor={false} />
                <Line
                  type="monotone"
                  dataKey="spend"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#a78bfa", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
