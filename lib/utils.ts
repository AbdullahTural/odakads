import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Turkce sayi formati (binlik ayirici) */
export function formatNumberTR(value: number): string {
  return new Intl.NumberFormat("tr-TR").format(value);
}

/** TL para birimi formati */
export function formatCurrencyTR(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}
