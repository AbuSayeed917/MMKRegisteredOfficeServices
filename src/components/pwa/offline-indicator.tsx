"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-amber-950 text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2">
      <WifiOff className="size-3.5" />
      You are offline. Some features may be unavailable.
    </div>
  );
}
