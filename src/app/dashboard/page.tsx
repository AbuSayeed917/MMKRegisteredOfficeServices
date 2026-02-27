"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  CreditCard,
  FileText,
  Bell,
  ChevronRight,
  MapPin,
  Hash,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Shield,
  User,
  LifeBuoy,
} from "lucide-react";

interface DashboardData {
  user: { email: string; createdAt: string; lastLogin: string };
  business: {
    companyName: string;
    crn: string;
    companyType: string;
    registeredAddress: string;
    tradingAddress?: string;
  } | null;
  subscription: {
    status: string;
    startDate?: string;
    endDate?: string;
    nextPaymentDate?: string;
    paymentMethod?: string;
  } | null;
  agreements: {
    id: string;
    status: string;
    signedAt?: string;
    templateVersion: number;
  }[];
  notifications: {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }[];
  payments: {
    id: string;
    amount: number;
    status: string;
    paidAt?: string;
  }[];
}

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  ACTIVE: { label: "Active", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  PENDING_APPROVAL: { label: "Pending Approval", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
  DRAFT: { label: "Draft", color: "text-gray-700 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-800" },
  EXPIRED: { label: "Expired", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
  SUSPENDED: { label: "Suspended", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
  REJECTED: { label: "Rejected", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
  RENEWAL_PENDING: { label: "Renewal Pending", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-destructive/30 rounded-2xl">
        <CardContent className="py-12 text-center">
          <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
          <p className="text-destructive font-medium">
            {error || "Something went wrong"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const unreadCount = data.notifications.filter((n) => !n.isRead).length;
  const subStatus = statusConfig[data.subscription?.status || "DRAFT"] || statusConfig.DRAFT;
  const latestAgreement = data.agreements[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {data.business?.companyName || data.user.email}
        </p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Subscription Status */}
        <Link href="/dashboard/subscription">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-shadow cursor-pointer group overflow-hidden !py-0 !gap-0">
            <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center shrink-0">
                  <CreditCard className="size-4 text-[#0ea5e9]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Subscription</p>
                  <Badge className={`${subStatus.bg} ${subStatus.color} text-[10px] mt-0.5`}>
                    {subStatus.label}
                  </Badge>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-[#0ea5e9] transition-colors shrink-0" />
              </div>
              {data.subscription?.endDate && (
                <p className="text-[11px] text-muted-foreground mt-2 ml-12 flex items-center gap-1">
                  <Calendar className="size-3" />
                  Expires{" "}
                  {new Date(data.subscription.endDate).toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "short", year: "numeric" }
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>

        {/* Agreement Status */}
        <Link href="/dashboard/agreement">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-shadow cursor-pointer group overflow-hidden !py-0 !gap-0">
            <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center shrink-0">
                  <FileText className="size-4 text-[#0ea5e9]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Agreement</p>
                  {latestAgreement ? (
                    <Badge
                      className={`text-[10px] mt-0.5 ${
                        latestAgreement.status === "SIGNED"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {latestAgreement.status === "SIGNED" ? "Signed" : "Pending"}
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-[10px] mt-0.5">
                      No Agreement
                    </Badge>
                  )}
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-[#0ea5e9] transition-colors shrink-0" />
              </div>
              {latestAgreement?.signedAt && (
                <p className="text-[11px] text-muted-foreground mt-2 ml-12 flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  Signed{" "}
                  {new Date(latestAgreement.signedAt).toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "short", year: "numeric" }
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>

        {/* Notifications */}
        <Link href="/dashboard/notifications">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-shadow cursor-pointer group overflow-hidden !py-0 !gap-0">
            <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center shrink-0">
                  <Bell className="size-4 text-[#0ea5e9]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Notifications</p>
                  <p className="font-semibold text-sm">
                    {unreadCount > 0 ? (
                      <span>
                        {unreadCount} unread{" "}
                        <span className="text-muted-foreground font-normal text-xs">
                          of {data.notifications.length}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground font-normal text-sm">All caught up</span>
                    )}
                  </p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-[#0ea5e9] transition-colors shrink-0" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Support */}
        <Link href="/dashboard/support">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-shadow cursor-pointer group overflow-hidden !py-0 !gap-0">
            <div className="h-1 bg-gradient-to-r from-purple-400 to-purple-500" />
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                  <LifeBuoy className="size-4 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Support</p>
                  <p className="font-semibold text-sm text-muted-foreground">Get help</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-purple-500 transition-colors shrink-0" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Company Info */}
      {data.business && (
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#0c2d42] to-[#0ea5e9]" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-base">
              <Building2 className="size-4.5 text-[#0ea5e9]" />
              Company Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Company Name
                </p>
                <p className="font-medium">{data.business.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                  <Hash className="size-3" /> CRN
                </p>
                <p className="font-mono">{data.business.crn}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Type</p>
                <Badge variant="secondary" className="text-xs">
                  {data.business.companyType}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                  <MapPin className="size-3" /> Registered Address
                </p>
                <p>{data.business.registeredAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Notifications */}
      {data.notifications.length > 0 && (
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-base">
              <Bell className="size-4.5 text-[#0ea5e9]" />
              Recent Notifications
            </CardTitle>
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View all <ChevronRight className="size-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.notifications.slice(0, 3).map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-3 rounded-xl text-sm ${
                  n.isRead
                    ? "bg-muted/30"
                    : "bg-[#0ea5e9]/5 border border-[#0ea5e9]/10"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    n.isRead ? "bg-muted-foreground/30" : "bg-[#0ea5e9]"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs">{n.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="size-2.5" />
                    {new Date(n.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/dashboard/profile">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-shadow cursor-pointer group p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center">
              <User className="size-4 text-[#0ea5e9]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Manage Profile</p>
              <p className="text-xs text-muted-foreground">
                Update your details
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-[#0ea5e9]" />
          </Card>
        </Link>
        <Link href="/">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-shadow cursor-pointer group p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center">
              <Shield className="size-4 text-[#0ea5e9]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Need Help?</p>
              <p className="text-xs text-muted-foreground">
                Contact our support team
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-[#0ea5e9]" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
