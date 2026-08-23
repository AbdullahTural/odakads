"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overlay =
    open && mounted
      ? createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Backdrop — header'ın backdrop-blur stacking context'inden bağımsız */}
                <motion.button
                  type="button"
                  aria-label="Menüyü kapat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 top-[72px] z-[60] bg-background/70 backdrop-blur-sm md:hidden"
                />
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-x-0 top-[72px] bottom-0 z-[70] overflow-y-auto border-t border-border bg-background md:hidden"
                >
                  <nav className="container flex flex-col gap-2 py-8">
                    {navItems.map((item, i) => {
                      const active =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              "block rounded-xl px-4 py-3.5 text-lg font-medium transition-colors",
                              active
                                ? "bg-primary/10 text-primary"
                                : "text-foreground/90 hover:bg-surface",
                            )}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                    <div className="mt-2">
                      <ThemeToggle showLabel />
                    </div>
                    <Button asChild size="lg" className="mt-2">
                      <Link href="/iletisim">Ücretsiz Analiz Al</Link>
                    </Button>
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-[80] grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface text-foreground"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {overlay}
    </div>
  );
}
