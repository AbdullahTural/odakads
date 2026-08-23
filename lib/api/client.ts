/**
 * Tipli HTTP istemcisi.
 *
 * Production (tek host): NEXT_PUBLIC_API_BASE_URL bos, NEXT_PUBLIC_USE_MOCK=false
 *   → istekler ayni origin'den relatif yola gider (/api/...).
 *
 * Lokal backend: NEXT_PUBLIC_API_BASE_URL=http://localhost:5085, USE_MOCK=false
 * Lokal mock: NEXT_PUBLIC_USE_MOCK=true (API base gerekmez)
 */

import type { ApiResponse } from "./types";

function normalizeBase(raw: string | undefined): string {
  const base = (raw ?? "").trim();
  if (!base) return "";
  return base.replace(/\/+$/, "");
}

/** Bos = ayni origin (relatif /api/...); dolu = harici API (or. lokal backend). */
export const API_BASE_URL = normalizeBase(process.env.NEXT_PUBLIC_API_BASE_URL);

/** true ise endpoints.ts mock veri kullanir. Production build'de false olmali. */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/** Tam istek URL'si — path her zaman / ile baslamali. */
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalized}` : normalized;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const DEFAULT_TIMEOUT = 12_000;

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const res = await fetch(apiUrl(path), {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });

    const text = await res.text();
    const body = text ? (JSON.parse(text) as unknown) : null;

    if (!res.ok) {
      const message =
        body && typeof body === "object" && "message" in body
          ? String((body as { message: unknown }).message)
          : `İstek başarısız oldu (${res.status})`;
      throw new ApiError(message, res.status, body);
    }

    if (body && typeof body === "object" && "data" in body) {
      return (body as ApiResponse<T>).data;
    }
    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("İstek zaman aşımına uğradı", 408);
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Ağ hatası",
      0,
      error,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),
};
