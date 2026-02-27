"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  Shield,
  Loader2,
  Upload,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminBottomNav } from "@/components/pwa/bottom-nav-admin";
import { InstallPromptBanner } from "@/components/pwa/install-prompt-banner";
import { OfflineIndicator } from "@/components/pwa/offline-indicator";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/migration", label: "Migration", icon: Upload },
  { href: "/admin/support-tickets", label: "Support", icon: LifeBuoy },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role guard: redirect non-admin users
  const userRole = (session?.user as { role?: string })?.role;
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--mmk-bg)]">
        <Loader2 className="size-8 animate-spin text-[#0ea5e9]" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    router.replace("/dashboard");
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--mmk-bg)]">
        <div className="text-center">
          <Shield className="size-10 text-red-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-destructive">Access Denied</p>
          <p className="text-xs text-muted-foreground mt-1">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  const currentPage =
    navItems.find(
      (item) =>
        item.href === pathname ||
        (item.href !== "/admin" && pathname.startsWith(item.href))
    )?.label || "Admin";

  return (
    <div className="min-h-screen bg-[var(--mmk-bg)] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0c2d42] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link
            href="/admin"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] flex items-center justify-center">
              <Shield className="size-5 text-[#0c2d42]" />
            </div>
            <div>
              <p className="font-bold text-sm">MMK Admin</p>
              <p className="text-[10px] text-white/60">Management Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-[#0ea5e9]/20 text-[#38bdf8] font-medium"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
                {isActive && (
                  <ChevronRight className="size-3.5 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all w-full"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-[var(--mmk-border-light)] bg-[var(--mmk-bg)] flex items-center px-4 gap-4 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <h2 className="font-semibold text-sm text-[#0c2d42] dark:text-white">
            {currentPage}
          </h2>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 overflow-auto">
          {children}
        </main>
      </div>

      <AdminBottomNav />
      <InstallPromptBanner />
      <OfflineIndicator />
    </div>
  );
}
