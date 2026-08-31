"use client";

import * as React from "react";
import { AlertTriangle, Check, Loader2, Rocket } from "lucide-react";
import { useRebuildState, useTriggerRebuild } from "@/lib/admin/hooks";
import { formatBlogDate } from "@/lib/blog/format";

/**
 * "Siteyi Yayına Al" afişi — admin panelden statik siteyi yeniden yayınlar.
 * Blog/SEO gibi build-time içerikler bu butonla canlıya çıkar (Abdullah'a gerek kalmadan).
 * Sunucuda Rebuild:Enabled açık değilse buton çalışır ama net bir uyarı gösterir.
 */
export function PublishSiteButton() {
  const trigger = useTriggerRebuild();
  const { data } = useRebuildState();
  const [error, setError] = React.useState<string | null>(null);

  const running = data?.status === "running" || trigger.isPending;

  const onClick = async () => {
    setError(null);
    try {
      await trigger.mutateAsync();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yayınlama başlatılamadı.");
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm">
        <p className="font-semibold">Değişiklikleri canlıya çıkarın</p>
        <p className="mt-0.5 text-muted-foreground">
          Yazıları yazıp yayınladıktan sonra bu butona basın; site birkaç dakika içinde güncellenir.
        </p>
      </div>

      <div className="flex flex-col items-start gap-1.5 sm:items-end">
        <button
          type="button"
          onClick={onClick}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow-blue transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
          {running ? "Yayınlanıyor..." : "Siteyi Yayına Al"}
        </button>

        {error ? (
          <span className="inline-flex items-center gap-1 text-xs text-amber-400">
            <AlertTriangle className="h-3 w-3" /> {error}
          </span>
        ) : running ? (
          <span className="text-xs text-muted-foreground">Değişiklikler 1-2 dk içinde canlıya çıkar.</span>
        ) : data?.status === "success" ? (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
            <Check className="h-3 w-3" /> {data.message}
            {data.finishedAt ? ` (${formatBlogDate(data.finishedAt)})` : ""}
          </span>
        ) : data?.status === "failed" ? (
          <span className="inline-flex items-center gap-1 text-xs text-red-400">
            <AlertTriangle className="h-3 w-3" /> {data.message}
          </span>
        ) : null}
      </div>
    </div>
  );
}
