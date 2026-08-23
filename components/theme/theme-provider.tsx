"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * next-themes + static export uyumlu:
 * - attribute="class" → html.dark
 * - defaultTheme="light", enableSystem=false
 * - localStorage key: theme
 * - FOUC: layout'taki inline script class'ı erken set eder
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
