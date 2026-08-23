"use client";

import { ChevronRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useResolvedSiteSettings } from "@/lib/api/hooks";

export function ContactInfo() {
  const { data: contact } = useResolvedSiteSettings();

  const items = [
    {
      icon: Phone,
      label: "Telefon",
      value: contact.phone,
      href: contact.phoneHref,
    },
    {
      icon: Mail,
      label: "E-posta",
      value: contact.email,
      href: contact.emailHref,
    },
    {
      icon: MapPin,
      label: "Adres",
      value: contact.address,
    },
    {
      icon: Clock,
      label: "Çalışma Saatleri",
      value: contact.workingHours,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold">İletişim Bilgilerimiz</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Size nasıl yardımcı olabiliriz?
        </p>
        <ul className="mt-6 space-y-3">
          {items.map((item) => {
            const inner = (
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors group-hover:border-primary/30 group-hover:bg-surface">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-foreground/90">
                    {item.value}
                  </p>
                </div>
                {item.href && (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                )}
              </div>
            );
            return (
              <li key={item.label}>
                {item.href ? (
                  <a href={item.href} className="group block">
                    {inner}
                  </a>
                ) : (
                  <div className="group">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <p className="text-sm font-medium text-emerald-300">
          Ücretsiz Hesap Analizi
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Mevcut Google Ads hesabınızı ücretsiz analiz edip büyüme fırsatlarını
          raporluyoruz. Taahhüt gerekmez.
        </p>
      </div>
    </div>
  );
}
