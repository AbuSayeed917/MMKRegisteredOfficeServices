"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import {
  captureDeferredPrompt,
  getDeferredPrompt,
  clearDeferredPrompt,
  isStandalone,
} from "@/lib/pwa/install-prompt";

function subscribeStandalone(callback: () => void) {
  const mql = window.matchMedia("(display-mode: standalone)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getStandaloneSnapshot() {
  return isStandalone();
}

function getServerSnapshot() {
  return false;
}

export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const isInstalled = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      captureDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
      clearDeferredPrompt();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const prompt = getDeferredPrompt();
    if (!prompt) return false;

    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    clearDeferredPrompt();
    setCanInstall(false);

    return outcome === "accepted";
  }, []);

  return { canInstall, isInstalled, promptInstall };
}
