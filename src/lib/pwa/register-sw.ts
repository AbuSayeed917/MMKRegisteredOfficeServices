import { SW_PATH, SW_SCOPE } from "./constants";

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  // Skip SW in development to avoid stale cache issues
  if (process.env.NODE_ENV === "development") {
    // Unregister any existing SW in dev
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      await reg.unregister();
    }
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(SW_PATH, {
      scope: SW_SCOPE,
    });

    // Check for updates every 60 minutes
    setInterval(
      () => {
        registration.update();
      },
      60 * 60 * 1000
    );

    return registration;
  } catch (error) {
    console.error("SW registration failed:", error);
    return null;
  }
}
