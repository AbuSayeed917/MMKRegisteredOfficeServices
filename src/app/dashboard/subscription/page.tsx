"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Banknote,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface SubscriptionData {
  subscription: {
    status: string;
    startDate?: string;
    endDate?: string;
    nextPaymentDate?: string;
    paymentMethod?: string;
  } | null;
  payments: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    paidAt?: string;
    createdAt: string;
  }[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  ACTIVE: { label: "Active", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", icon: CheckCircle2 },
  PENDING_APPROVAL: { label: "Pending Approval", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", icon: Clock },
  EXPIRED: { label: "Expired", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: XCircle },
  SUSPENDED: { label: "Suspended", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: AlertTriangle },
  RENEWAL_PENDING: { label: "Renewal Pending", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", icon: RefreshCw },
  DRAFT: { label: "Draft", color: "text-gray-700 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-800", icon: Clock },
  REJECTED: { label: "Rejected", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: XCircle },
};

const paymentStatusIcon: Record<string, { icon: React.ElementType; color: string }> = {
  SUCCEEDED: { icon: CheckCircle2, color: "text-emerald-500" },
  PENDING: { icon: Clock, color: "text-amber-500" },
  FAILED: { icon: XCircle, color: "text-red-500" },
  REFUNDED: { icon: RefreshCw, color: "text-blue-500" },
};

export default function SubscriptionPage() {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) => setData({ subscription: d.subscription, payments: d.payments }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-60 rounded-2xl" />
      </div>
    );
  }

  const sub = data?.subscription;
  const status = statusConfig[sub?.status || "DRAFT"] || statusConfig.DRAFT;
  const StatusIcon = status.icon;

  const canPay =
    sub?.status === "PENDING_APPROVAL" ||
    sub?.status === "RENEWAL_PENDING" ||
    sub?.status === "EXPIRED" ||
    sub?.status === "SUSPENDED";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
          Subscription
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your registered office service subscription
        </p>
      </div>

      {/* Subscription Status Card */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-base">
            <CreditCard className="size-5 text-[#0ea5e9]" />
            Service Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-xl ${status.bg} flex items-center justify-center`}>
              <StatusIcon className={`size-6 ${status.color}`} />
            </div>
            <div>
              <Badge className={`${status.bg} ${status.color} text-sm px-3 py-1`}>
                {status.label}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                Registered Office Service — £75/year
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {sub?.startDate && (
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <Calendar className="size-3" /> Start Date
                </p>
                <p className="font-medium text-sm">
                  {new Date(sub.startDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
            {sub?.endDate && (
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <Calendar className="size-3" /> Renewal Date
                </p>
                <p className="font-medium text-sm">
                  {new Date(sub.endDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
            {sub?.paymentMethod && (
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <Banknote className="size-3" /> Payment Method
                </p>
                <p className="font-medium text-sm">
                  {sub.paymentMethod === "CARD"
                    ? "Credit/Debit Card"
                    : "BACS Direct Debit"}
                </p>
              </div>
            )}
          </div>

          {sub?.status === "PENDING_APPROVAL" && (
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 flex items-start gap-3">
              <Clock className="size-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                  Awaiting Admin Approval
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
                  Your registration is being reviewed. You will be notified
                  once approved and guided through the payment process.
                </p>
              </div>
            </div>
          )}

          {/* Pay Now / Renew button */}
          {canPay && (
            <div className="mt-6">
              <Button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold px-8 gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Redirecting to payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="size-4" />
                    {sub?.status === "RENEWAL_PENDING" || sub?.status === "EXPIRED"
                      ? "Renew Subscription — £75"
                      : "Pay Now — £75"}
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0c2d42] to-[#0ea5e9]" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-base">
            <Banknote className="size-5 text-[#0ea5e9]" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data?.payments && data.payments.length > 0 ? (
            <div className="space-y-3">
              {data.payments.map((p) => {
                const pStatus = paymentStatusIcon[p.status] || paymentStatusIcon.PENDING;
                const PIcon = pStatus.icon;
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 bg-muted/30 rounded-xl p-3"
                  >
                    <PIcon className={`size-4 ${pStatus.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        £{(p.amount / 100).toFixed(2)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {p.paymentMethod === "CARD" ? "Card" : "Direct Debit"}{" "}
                        &bull;{" "}
                        {new Date(p.paidAt || p.createdAt).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[10px] capitalize"
                    >
                      {p.status.toLowerCase()}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Banknote className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No payments yet
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Payments will appear here once your subscription is active
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
