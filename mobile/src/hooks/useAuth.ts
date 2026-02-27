import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isClient = user?.role === "CLIENT";

  return { user, isAuthenticated, isLoading, isAdmin, isClient };
}
