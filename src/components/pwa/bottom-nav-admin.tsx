"use client";

import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
} from "lucide-react";
import { BottomNav, type BottomNavItem } from "./bottom-nav";

const adminTabs: BottomNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminBottomNav() {
  return <BottomNav items={adminTabs} basePath="/admin" />;
}
