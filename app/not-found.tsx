import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-4">
      <div className="text-center">
        <p className="font-display text-7xl font-bold text-gradient sm:text-9xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
          Sayfa bulunamadı
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Ana sayfaya
          dönüp tekrar deneyebilirsiniz.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
        </Button>
      </div>
    </section>
  );
}
