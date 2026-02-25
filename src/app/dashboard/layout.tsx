"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Building2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/agreement", label: "Agreement", icon: FileText },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const currentPage =
    navItems.find((item) => isActive(item.href))?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#0c2d42] border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:bg-white/10 -ml-2"
          >
            <Menu className="size-5" />
          </Button>
          <span className="text-white font-semibold text-sm">
            MMK Dashboard
          </span>
        </div>
        <span className="text-white/60 text-xs">{currentPage}</span>
      </div>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0c2d42] text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] flex items-center justify-center">
              <Building2 className="size-4 text-[#0c2d42]" />
            </div>
            <div>
              <span className="font-bold text-sm leading-none">MMK</span>
              <span className="block text-[10px] text-white/50 leading-none mt-0.5">
                Client Portal
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "bg-[#0ea5e9]/15 text-[#38bdf8]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`size-4.5 ${
                    active
                      ? "text-[#0ea5e9]"
                      : "text-white/40 group-hover:text-white/70"
                  }`}
                />
                {item.label}
                {active && (
                  <ChevronRight className="size-3.5 ml-auto text-[#0ea5e9]/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
          >
            <LogOut className="size-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
