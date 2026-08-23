"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <section className="grid min-h-[70vh] place-items-center px-4">
      <div className="text-center">
        <p className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-8 w-8" aria-hidden />
        </p>
        <h1 className="mt-6 font-display text-2xl font-bold sm:text-3xl">
          Bir şeyler ters gitti
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Sayfa yüklenirken beklenmeyen bir hata oluştu. Tekrar deneyebilir veya
          ana sayfaya dönebilirsiniz.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => reset()}>
            <RotateCcw className="h-4 w-4" />
            Tekrar Dene
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Ana Sayfaya Dön
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
