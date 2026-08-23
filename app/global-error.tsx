"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Root layout hatalarinda devreye girer. Kendi html/body sarmalayıcısı gerekir.
 * Static export'ta client-side error boundary olarak calisir.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-[#040e1a] text-[#f8fafc] antialiased">
        <section className="grid min-h-screen place-items-center px-4">
          <div className="max-w-md text-center">
            <p
              className="mx-auto grid h-16 w-16 place-items-center rounded-2xl"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#f87171" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </p>
            <h1 className="mt-6 font-display text-2xl font-bold sm:text-3xl">
              Kritik bir hata oluştu
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#94a3b8]">
              Uygulama beklenmedik bir durumla karşılaştı. Lütfen sayfayı
              yenileyin veya bir süre sonra tekrar deneyin.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-6 text-sm font-semibold text-white"
              >
                Tekrar Dene
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-[#f8fafc] transition-colors hover:bg-white/10"
              >
                Ana Sayfaya Dön
              </a>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
