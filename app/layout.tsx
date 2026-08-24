import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { rootMetadata } from "@/lib/api/server";
import { Providers } from "./providers";
import { AppShell } from "@/components/layout/AppShell";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd } from "@/lib/seo/structured-data";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f5f8" },
    { media: "(prefers-color-scheme: dark)", color: "#040e1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Static export FOUC önleyici — varsayılan light; yalnızca theme=dark iken .dark */
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){document.documentElement.classList.remove('dark')}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen">
        <JsonLd data={organizationLd()} />
        <Providers>
          <AppShell>{children}</AppShell>
          <AnalyticsScripts />
        </Providers>
      </body>
    </html>
  );
}
