"use client";

import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Bell,
  User,
} from "lucide-react";
import { BottomNav, type BottomNavItem } from "./bottom-nav";

const dashboardTabs: BottomNavItem[] = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/subscription", label: "Plan", icon: CreditCard },
  { href: "/dashboard/agreement", label: "Agreement", icon: FileText },
  { href: "/dashboard/notifications", label: "Alerts", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardBottomNav() {
  return <BottomNav items={dashboardTabs} basePath="/dashboard" />;
}
