import { apiUrl } from "@/lib/api/client";
import { authStore } from "./auth-store";
import type { AuthResponse } from "./types";

/**
 * Admin API istemcisi.
 * - Her istege Bearer access token ekler.
 * - 401 alirsa refresh token ile bir kez yeniler ve istegi tekrarlar.
 * - ApiResponse sarmalayicisini acar; hata varsa Error firlatir.
 */

export class AdminApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "AdminApiError";
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

async function parse<T>(res: Response): Promise<ApiEnvelope<T>> {
  const text = await res.text();
  return text ? (JSON.parse(text) as ApiEnvelope<T>) : { success: res.ok };
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = authStore.getRefresh();
  if (!refreshToken) return false;

  const res = await fetch(apiUrl("/api/admin/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return false;

  const body = await parse<AuthResponse>(res);
  if (!body.success || !body.data) return false;

  authStore.setTokens(body.data.accessToken, body.data.refreshToken);
  return true;
}

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const access = authStore.getAccess();
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...init.headers,
    },
  });

  if (res.status === 401 && retry) {
    const ok = await tryRefresh();
    if (ok) return request<T>(path, init, false);
    authStore.clear();
    throw new AdminApiError("Oturum süresi doldu. Lütfen tekrar giriş yapın.", 401);
  }

  const body = await parse<T>(res);

  if (!res.ok || !body.success) {
    const fieldError = body.errors
      ? Object.values(body.errors).flat()[0]
      : undefined;
    throw new AdminApiError(
      fieldError || body.message || `İstek başarısız (${res.status})`,
      res.status,
    );
  }

  return body.data as T;
}

export const adminApi = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, file: File, fieldName = "file") =>
    uploadRequest<T>(path, file, fieldName),
};

async function uploadRequest<T>(path: string, file: File, fieldName: string, retry = true): Promise<T> {
  const access = authStore.getAccess();
  const body = new FormData();
  body.append(fieldName, file);

  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: {
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
    body,
  });

  if (res.status === 401 && retry) {
    const ok = await tryRefresh();
    if (ok) return uploadRequest<T>(path, file, fieldName, false);
    authStore.clear();
    throw new AdminApiError("Oturum süresi doldu. Lütfen tekrar giriş yapın.", 401);
  }

  const parsed = await parse<T>(res);
  if (!res.ok || !parsed.success) {
    throw new AdminApiError(parsed.message || `Yükleme başarısız (${res.status})`, res.status);
  }
  return parsed.data as T;
}

/** Sorgu parametrelerini query string'e cevirir. */
export function toQuery(params: Record<string, unknown> | object): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
