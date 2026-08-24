"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  Briefcase,
  FileBarChart,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Rocket,
  Search,
  Settings,
  Video,
  Menu,
  X,
  KeyRound,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/admin/auth-context";

const links = [
  { href: "/admin/dashboard", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/admin/services", label: "Hizmetler", icon: Briefcase },
  { href: "/admin/testimonials", label: "Referanslar", icon: MessageSquareQuote },
  { href: "/admin/reviews", label: "Armut Yorumları", icon: Star },
  { href: "/admin/reference-companies", label: "Referans Firmalar", icon: Building2 },
  { href: "/admin/video-testimonials", label: "Video Referanslar", icon: Video },
  { href: "/admin/case-studies", label: "Vaka Çalışmaları", icon: FileBarChart },
  { href: "/admin/blogs", label: "Bloglar", icon: Newspaper },
  { href: "/admin/contact-requests", label: "İletişim Talepleri", icon: Mail },
  { href: "/admin/seo-settings", label: "SEO Yönetimi", icon: Search },
  { href: "/admin/analytics-settings", label: "Analytics / Takip", icon: BarChart3 },
  { href: "/admin/conversion-settings", label: "Dönüşüm Ayarları", icon: Rocket },
  { href: "/admin/about-settings", label: "Hakkımızda Ayarları", icon: Info },
  { href: "/admin/site-settings", label: "Site Ayarları", icon: Settings },
  { href: "/admin/change-password", label: "Şifre Değiştir", icon: KeyRound },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <span className="font-display font-bold">Odak Yönetim</span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5"
          aria-label="Menü"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-background transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="font-display text-lg font-bold">Odak Ads Reklam</p>
            <p className="text-xs text-muted-foreground">Yönetim Paneli</p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {links.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch={false}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  <l.icon className="h-4 w-4 shrink-0" />
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <p className="mb-1 truncate text-sm font-medium">{user?.fullName}</p>
            <p className="mb-3 truncate text-xs text-muted-foreground">{user?.email}</p>
            <button
              onClick={() => logout()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
