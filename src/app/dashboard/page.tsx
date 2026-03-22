"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandPattern, BrandSwoosh } from "@/components/ui/brand-pattern";
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
  Mail,
  FileCheck,
  Banknote,
  ClipboardCheck,
  Loader2,
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
  ACTIVE: { label: "Active", color: "text-emerald-700", bg: "bg-emerald-100" },
  PENDING_APPROVAL: { label: "Pending Approval", color: "text-amber-700", bg: "bg-amber-100" },
  DRAFT: { label: "Draft", color: "text-gray-700", bg: "bg-gray-100" },
  EXPIRED: { label: "Expired", color: "text-red-700", bg: "bg-red-100" },
  SUSPENDED: { label: "Suspended", color: "text-red-700", bg: "bg-red-100" },
  REJECTED: { label: "Rejected", color: "text-red-700", bg: "bg-red-100" },
  RENEWAL_PENDING: { label: "Renewal Pending", color: "text-amber-700", bg: "bg-amber-100" },
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchDashboard = useCallback(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // Re-fetch when window regains focus
  useEffect(() => {
    const onFocus = () => fetchDashboard();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-36 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
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
  const isActive = data.subscription?.status === "ACTIVE";
  const needsPayment =
    data.subscription?.status === "DRAFT" &&
    !data.payments.some((p) => p.status === "PAID" || p.status === "SUCCEEDED");

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      // silently fail
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Journey steps for service tracker
  const journeySteps = [
    {
      icon: ClipboardCheck,
      label: "Registered",
      done: true,
    },
    {
      icon: FileCheck,
      label: "Agreement",
      done: latestAgreement?.status === "SIGNED",
    },
    {
      icon: Banknote,
      label: "Payment",
      done: data.payments.some((p) => p.status === "PAID"),
    },
    {
      icon: CheckCircle2,
      label: "Active",
      done: isActive,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ───── Welcome Banner ───── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#057baa] to-[#033d5c] text-white">
        {/* Pattern overlay */}
        <BrandPattern
          className="absolute inset-0 pointer-events-none"
          opacity={0.08}
          variant="geometric"
        />
        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">
                Client Portal
              </p>
              <h1 className="text-xl sm:text-2xl font-bold">
                Welcome back{data.business ? `, ${data.business.companyName}` : ""}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                {data.user.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${subStatus.bg} ${subStatus.color} text-xs font-semibold px-3 py-1`}>
                {subStatus.label}
              </Badge>
            </div>
          </div>

          {/* Service Journey Tracker */}
          <div className="mt-6 flex items-center gap-0">
            {journeySteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        step.done
                          ? "bg-white text-[#057baa]"
                          : "bg-white/15 text-white/50"
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <span className={`text-[10px] font-medium whitespace-nowrap ${
                      step.done ? "text-white" : "text-white/40"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {i < journeySteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mt-[-18px] rounded-full ${
                      step.done ? "bg-white/40" : "bg-white/10"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Swoosh accent */}
        <BrandSwoosh
          className="absolute bottom-0 left-0 w-full h-6 opacity-30"
          color="#38bdf8"
        />
      </div>

      {/* ───── Payment CTA (DRAFT status, no payment yet) ───── */}
      {needsPayment && (
        <Card className="border-[#0ea5e9]/30 bg-[#0ea5e9]/5 rounded-2xl overflow-hidden">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center shrink-0">
                <CreditCard className="size-5 text-[#0ea5e9]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Complete Your Payment</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your application is ready. Pay the £75 annual fee to submit it for review.
                </p>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white font-semibold px-6 gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shrink-0"
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Redirecting…
                </>
              ) : (
                <>
                  <CreditCard className="size-4" />
                  Pay Now — £75
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ───── Status Cards Grid ───── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Subscription */}
        <Link href="/dashboard/subscription" className="h-full">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-all cursor-pointer group overflow-hidden !py-0 !gap-0 h-full hover:-translate-y-0.5">
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
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
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

        {/* Agreement */}
        <Link href="/dashboard/agreement" className="h-full">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-all cursor-pointer group overflow-hidden !py-0 !gap-0 h-full hover:-translate-y-0.5">
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
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {latestAgreement.status === "SIGNED" ? "Signed" : "Pending"}
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-600 text-[10px] mt-0.5">
                      No Agreement
                    </Badge>
                  )}
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
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
        <Link href="/dashboard/notifications" className="h-full">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-all cursor-pointer group overflow-hidden !py-0 !gap-0 h-full hover:-translate-y-0.5">
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
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Support */}
        <Link href="/dashboard/support" className="h-full">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-all cursor-pointer group overflow-hidden !py-0 !gap-0 h-full hover:-translate-y-0.5">
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

      {/* ───── Company Info + Service Summary ───── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Company Details — takes 2 cols */}
        {data.business && (
          <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden lg:col-span-2">
            <div className="h-1 bg-gradient-to-r from-primary to-[#0ea5e9]" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-base">
                <Building2 className="size-4.5 text-[#0ea5e9]" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-[var(--mmk-bg-section)] rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Company Name
                  </p>
                  <p className="font-semibold">{data.business.companyName}</p>
                </div>
                <div className="bg-[var(--mmk-bg-section)] rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                    <Hash className="size-3" /> CRN
                  </p>
                  <p className="font-mono font-semibold">{data.business.crn}</p>
                </div>
                <div className="bg-[var(--mmk-bg-section)] rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Type</p>
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {data.business.companyType}
                  </Badge>
                </div>
                <div className="bg-[var(--mmk-bg-section)] rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                    <MapPin className="size-3" /> Registered Address
                  </p>
                  <p className="font-medium">{data.business.registeredAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Your Service — takes 1 col */}
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-base">
              <Shield className="size-4.5 text-emerald-500" />
              Your Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <Mail className="size-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-800">Mail Handling</p>
                <p className="text-[11px] text-emerald-600">Notified within 2 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0ea5e9]/5 border border-[#0ea5e9]/10">
              <Building2 className="size-4 text-[#0ea5e9] shrink-0" />
              <div>
                <p className="text-xs font-semibold">Registered Address</p>
                <p className="text-[11px] text-muted-foreground">Companies House compliant</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0ea5e9]/5 border border-[#0ea5e9]/10">
              <FileText className="size-4 text-[#0ea5e9] shrink-0" />
              <div>
                <p className="text-xs font-semibold">Document Scanning</p>
                <p className="text-[11px] text-muted-foreground">Available on request</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ───── Recent Notifications ───── */}
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

      {/* ───── Quick Actions ───── */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Link href="/dashboard/profile">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-all cursor-pointer group p-4 flex items-center gap-3 hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center">
              <User className="size-4 text-[#0ea5e9]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Manage Profile</p>
              <p className="text-xs text-muted-foreground">
                Update your details
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground" />
          </Card>
        </Link>
        <Link href="/dashboard/documents">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-all cursor-pointer group p-4 flex items-center gap-3 hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center">
              <FileText className="size-4 text-[#0ea5e9]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">View Documents</p>
              <p className="text-xs text-muted-foreground">
                Agreements & receipts
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground" />
          </Card>
        </Link>
        <Link href="/dashboard/support">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl hover:shadow-md transition-all cursor-pointer group p-4 flex items-center gap-3 hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <LifeBuoy className="size-4 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Need Help?</p>
              <p className="text-xs text-muted-foreground">
                Contact our support team
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-purple-500" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
