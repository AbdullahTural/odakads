"use client";

import Link from "next/link";
import { Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { navItems, siteConfig } from "@/lib/site";
import { useResolvedSiteSettings, useSiteContent } from "@/lib/api/hooks";
import { pickContent } from "@/lib/content/fields";
import { Logo } from "@/components/layout/Logo";

const services = [
  "Google Ads Yönetimi",
  "Arama Ağı Reklamları",
  "Performance Max",
  "YouTube Reklamları",
  "Yeniden Pazarlama",
];

export function Footer() {
  const year = new Date().getFullYear();
  const { data: contact } = useResolvedSiteSettings();
  const { data: c } = useSiteContent();

  return (
    <footer className="relative mt-24 border-t border-border bg-background/80">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {pickContent(
                c,
                "footer.description",
                "Performans odaklı Google Ads yönetimiyle markanızın büyümesini hızlandırıyoruz. Veriye dayalı, şeffaf kampanya yönetimi.",
              )}
            </p>
            <div className="flex items-center gap-3">
              <SocialLink href={contact.linkedin} label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </SocialLink>
              <SocialLink href={contact.instagram} label="Instagram">
                <Instagram className="h-4 w-4" />
              </SocialLink>
              <SocialLink href={contact.youtube} label="YouTube">
                <Youtube className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground/90">
              Kurumsal
            </h3>
            <ul className="space-y-3 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground/90">
              Hizmetler
            </h3>
            <ul className="space-y-3 text-sm">
              {services.map((s) => (
                <li key={s}>
                  <Link
                    href="/hizmetler"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground/90">
              İletişim
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{contact.address}</span>
              </li>
              <li>
                <a
                  href={contact.phoneHref}
                  className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={contact.emailHref}
                  className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {siteConfig.name}. Tüm hakları saklıdır.
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 animate-glow-pulse rounded-full bg-emerald-400" />
            Performans Odaklı Google Ads Ajansı
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:shadow-glow-blue"
    >
      {children}
    </a>
  );
}
