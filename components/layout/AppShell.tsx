"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingContactButtons } from "@/components/conversion/FloatingContactButtons";

/**
 * Public sayfalarda Navbar + Footer gosterir; /admin altinda gizler
 * (admin kendi layout'unu kullanir).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">{children}</main>
      <Footer />
      <FloatingContactButtons />
    </>
  );
}
