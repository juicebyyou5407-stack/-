import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, saveToken, getToken, clearToken } from "../api/client";
import type { AuthUser, Organization } from "../api/types";

type AuthResponse = { token: string; user: AuthUser; organization: Organization };

type AuthContextValue = {
  isLoading: boolean;
  user: AuthUser | null;
  organization: Organization | null;
  login: (email: string, password: string) => Promise<void>;
  registerOrganization: (input: {
    organizationName: string;
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      // We don't persist the profile locally; a stored token alone can't
      // restore `user`/`organization`, so we simply require a fresh login
      // if the app was killed. Simpler and avoids stale-role bugs.
      if (!token) {
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    })();
  }, []);

  const applyAuth = async (data: AuthResponse) => {
    await saveToken(data.token);
    setUser(data.user);
    setOrganization(data.organization);
  };

  const login = async (email: string, password: string) => {
    const data = await api.post<AuthResponse>("/auth/login", { email, password });
    await applyAuth(data);
  };

  const registerOrganization: AuthContextValue["registerOrganization"] = async (input) => {
    const data = await api.post<AuthResponse>("/auth/register", input);
    await applyAuth(data);
  };

  const logout = async () => {
    await clearToken();
    setUser(null);
    setOrganization(null);
  };

  const value = useMemo(
    () => ({ isLoading, user, organization, login, registerOrganization, logout }),
    [isLoading, user, organization]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
