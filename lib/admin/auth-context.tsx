"use client";

import * as React from "react";
import { apiUrl } from "@/lib/api/client";
import { authStore } from "./auth-store";
import type { AdminUser, AuthResponse } from "./types";

interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isReady: boolean; // localStorage hydrate edildi mi
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AdminUser | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    setUser(authStore.getUser());
    setIsReady(true);
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const res = await fetch(apiUrl("/api/admin/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = (await res.json()) as {
      success: boolean;
      message?: string;
      data?: AuthResponse;
    };
    if (!res.ok || !body.success || !body.data) {
      throw new Error(body.message || "Giriş başarısız.");
    }
    authStore.set(body.data.accessToken, body.data.refreshToken, body.data.user);
    setUser(body.data.user);
  }, []);

  const logout = React.useCallback(async () => {
    const refreshToken = authStore.getRefresh();
    try {
      if (refreshToken) {
        await fetch(apiUrl("/api/admin/auth/logout"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // sessizce gec
    }
    authStore.clear();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isReady,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AdminAuthProvider");
  return ctx;
}
