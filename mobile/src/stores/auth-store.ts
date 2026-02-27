import { create } from "zustand";

export interface AuthUser {
  id: string;
  email: string;
  role: "CLIENT" | "ADMIN" | "SUPER_ADMIN";
}

interface AuthState {
  user: AuthUser | null;
  sessionCookie: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, cookie: string) => void;
  logout: () => void;
  setSessionCookie: (cookie: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  sessionCookie: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, cookie) =>
    set({
      user,
      sessionCookie: cookie,
      isAuthenticated: true,
      isLoading: false,
    }),

  logout: () =>
    set({
      user: null,
      sessionCookie: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setSessionCookie: (cookie) => set({ sessionCookie: cookie }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
