import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Slot, router } from "expo-router";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { LightTheme } from "@/theme/paper-theme";
import { Colors } from "@/theme/colors";
import { useAuthStore } from "@/stores/auth-store";
import { restoreSession } from "@/lib/auth";
import { registerForPushNotificationsAsync } from "@/lib/notifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.race([
          restoreSession(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
        ]);
      } catch {
        useAuthStore.getState().logout();
      } finally {
        useAuthStore.getState().setLoading(false);
        setReady(true);
      }
    };
    init();
  }, []);

  // ── Register for push notifications once the app is ready ──
  useEffect(() => {
    if (!ready) return;
    registerForPushNotificationsAsync().catch(console.warn);
  }, [ready]);

  // ── Deep link handler ─────────────────────────────────────
  useEffect(() => {
    if (!ready) return;

    const handleDeepLink = (event: { url: string }) => {
      const parsed = Linking.parse(event.url);
      if (parsed.path === "payment/success") {
        router.push("/(dashboard)/subscription");
      } else if (parsed.path === "payment/cancel") {
        router.push("/(dashboard)/subscription");
      } else if (parsed.path?.startsWith("reset-password")) {
        const token = parsed.queryParams?.token;
        if (token) {
          router.push(`/(auth)/reset-password?token=${token}`);
        }
      }
    };

    // Listen for incoming deep links while the app is open
    const sub = Linking.addEventListener("url", handleDeepLink);

    // Handle the URL that launched the app (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      sub.remove();
    };
  }, [ready]);

  if (!ready) {
    return (
      <View style={styles.splash}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBg}>
            <Text style={styles.logoText}>MMK</Text>
          </View>
          <ActivityIndicator size="small" color={Colors.accent} style={styles.spinner} />
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <PaperProvider theme={LightTheme}>
          <QueryClientProvider client={queryClient}>
            <StatusBar style="dark" />
            <Slot />
            <Toast />
          </QueryClientProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bgPrimary,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoBg: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  spinner: {
    marginTop: 24,
  },
});
