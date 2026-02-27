import { api } from "./api";
import { useAuthStore, type AuthUser } from "@/stores/auth-store";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "mmk-auth-token";
const USER_KEY = "mmk-auth-user";

/** Restore session from secure storage on app start */
export async function restoreSession(): Promise<boolean> {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userStr = await SecureStore.getItemAsync(USER_KEY);

    if (!token || !userStr) {
      useAuthStore.getState().logout();
      return false;
    }

    const user: AuthUser = JSON.parse(userStr);
    useAuthStore.getState().login(user, token);
    return true;
  } catch {
    useAuthStore.getState().logout();
    return false;
  }
}

/** Login with email/password via dedicated mobile endpoint */
export async function loginWithCredentials(email: string, password: string): Promise<AuthUser> {
  const res = await api.post("/api/auth/mobile", { email, password });

  if (res.status !== 200 || !res.data.token) {
    throw new Error(res.data?.error || "Invalid credentials");
  }

  const { token, user } = res.data;

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  // Persist token and user securely
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(authUser));

  useAuthStore.getState().login(authUser, token);
  return authUser;
}

/** Logout */
export async function logout() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
  useAuthStore.getState().logout();
}
