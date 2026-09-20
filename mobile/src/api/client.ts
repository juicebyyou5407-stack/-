import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Set EXPO_PUBLIC_API_URL in mobile/.env when running against a real device
// (e.g. your computer's LAN IP: http://192.168.1.10:4000). Falls back to the
// Android emulator's host-loopback address for local development.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:4000";

const TOKEN_KEY = "kyosai_crm_token";

// expo-secure-store has no web implementation (there's no OS keychain to
// back it), so on web we fall back to localStorage. This is the native app;
// the fallback only matters for browser-based development/testing.
export async function saveToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => undefined);
  if (!res.ok) {
    const message = body?.error?.formErrors?.[0] ?? body?.error ?? `リクエストに失敗しました (${res.status})`;
    throw new ApiError(res.status, typeof message === "string" ? message : "リクエストに失敗しました");
  }
  return body as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PUT", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
