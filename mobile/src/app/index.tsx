import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function Index() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  if (isAdmin) return <Redirect href="/(admin)" />;

  return <Redirect href="/(dashboard)" />;
}
