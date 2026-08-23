"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GlowCardProps = {
  children: React.ReactNode;
  className?: string;
  /** glow rengi */
  glow?: "blue" | "purple";
};

/**
 * Imlec takipli radial glow + glassmorphism kart.
 * Hover'da kenar parlamasi (glow-border) ve hafif yukselme.
 */
export function GlowCard({ children, className, glow = "blue" }: GlowCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: 50, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const glowColor =
    glow === "blue" ? "59, 130, 246" : "139, 92, 246";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "glow-border group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-glass",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${pos.x}% ${pos.y}%, rgba(${glowColor}, 0.14), transparent 45%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
