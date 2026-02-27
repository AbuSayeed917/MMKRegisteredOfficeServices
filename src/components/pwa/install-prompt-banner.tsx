"use client";

import { useState, useSyncExternalStore } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePwaInstall } from "@/hooks/use-pwa-install";

const DISMISS_KEY = "mmk-pwa-install-dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function subscribeDismiss(callback: () => void) {
  // Re-check when storage changes (e.g. from another tab)
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getDismissSnapshot() {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  return Date.now() - parseInt(raw, 10) < DISMISS_DURATION_MS;
}

function getServerDismissSnapshot() {
  return true; // Default to dismissed on server
}

export function InstallPromptBanner() {
  const { canInstall, isInstalled, promptInstall } = usePwaInstall();
  const [manualDismiss, setManualDismiss] = useState(false);
  const storageDismissed = useSyncExternalStore(
    subscribeDismiss,
    getDismissSnapshot,
    getServerDismissSnapshot
  );

  const dismissed = manualDismiss || storageDismissed;

  if (!canInstall || isInstalled || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setManualDismiss(true);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-sm">
      <div className="bg-[#0c2d42] text-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] flex items-center justify-center shrink-0">
          <Download className="size-5 text-[#0c2d42]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Install MMK Office</p>
          <p className="text-xs text-white/60">
            Quick access from your home screen
          </p>
        </div>
        <Button
          size="sm"
          onClick={promptInstall}
          className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold rounded-full px-4 hover:shadow-lg shrink-0"
        >
          Install
        </Button>
        <button
          onClick={handleDismiss}
          className="text-white/40 hover:text-white/80 transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
