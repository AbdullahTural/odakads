"use client";

import * as React from "react";
import { Check, Link2, Linkedin, MessageCircle } from "lucide-react";

/** Sosyal paylasim + bağlantı kopyalama. url mutlak (build-time) verilir. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = React.useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);

  const links = [
    {
      label: "WhatsApp'ta paylaş",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      icon: <MessageCircle className="h-4 w-4" aria-hidden />,
    },
    {
      label: "X'te paylaş",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn'de paylaş",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <Linkedin className="h-4 w-4" aria-hidden />,
    },
  ];

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // pano erisimi yoksa sessizce yut
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-muted-foreground">Paylaş:</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:shadow-glow-blue"
        >
          {l.icon}
        </a>
      ))}
      <button
        type="button"
        onClick={onCopy}
        aria-label="Bağlantıyı kopyala"
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-400" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
        {copied ? "Kopyalandı" : "Bağlantı"}
      </button>
    </div>
  );
}
