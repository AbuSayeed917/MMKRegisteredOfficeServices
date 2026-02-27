"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  ChevronRight,
  Calendar,
  LifeBuoy,
} from "lucide-react";

interface OverviewData {
  metrics: {
    totalClients: number;
    activeClients: number;
    pendingApprovals: number;
    suspendedClients: number;
    expiringSubscriptions: number;
    openTickets: number;
    inProgressTickets: number;
    totalRevenue: number;
  };
  recentPayments: {
    id: string;
    amount: number;
    status: string;
    companyName: string;
    paidAt?: string;
    createdAt: string;
  }[];
  recentRegistrations: {
    id: string;
    email: string;
    companyName?: string;
    subscriptionStatus: string;
    createdAt: string;
  }[];
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="py-12 text-center">
          <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
          <p className="text-destructive font-medium">
            Failed to load admin data
          </p>
        </CardContent>
      </Card>
    );
  }

  const { metrics } = data;

  const metricCards: { label: string; value: string | number; icon: typeof Users; color: string; bg: string; href?: string }[] = [
    {
      label: "Total Clients",
      value: metrics.totalClients,
      icon: Users,
      color: "text-[#0ea5e9]",
      bg: "bg-[#0ea5e9]/10",
    },
    {
      label: "Active Subscriptions",
      value: metrics.activeClients,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Pending Approvals",
      value: metrics.pendingApprovals,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Suspended",
      value: metrics.suspendedClients,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Expiring (30 days)",
      value: metrics.expiringSubscriptions,
      icon: Calendar,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Open Tickets",
      value: metrics.openTickets + metrics.inProgressTickets,
      icon: LifeBuoy,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      href: "/admin/support-tickets",
    },
    {
      label: "Total Revenue",
      value: `£${metrics.totalRevenue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of registered office service management
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          const cardEl = (
            <Card
              key={card.label}
              className={`border-[var(--mmk-border-light)] rounded-2xl${card.href ? " hover:shadow-md transition-shadow cursor-pointer" : ""}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}
                  >
                    <Icon className={`size-5 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {card.label}
                    </p>
                    <p className="text-xl font-bold">{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
          return card.href ? (
            <Link key={card.label} href={card.href}>{cardEl}</Link>
          ) : (
            <div key={card.label}>{cardEl}</div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-[#0ea5e9]" />
              Recent Registrations
            </CardTitle>
            <Link
              href="/admin/clients"
              className="text-xs text-[#0ea5e9] hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.recentRegistrations.length > 0 ? (
              data.recentRegistrations.map((r) => (
                <Link
                  key={r.id}
                  href={`/admin/clients/${r.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {r.companyName || r.email}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] flex-shrink-0"
                  >
                    {r.subscriptionStatus.replace(/_/g, " ")}
                  </Badge>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No registrations yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4 text-emerald-500" />
              Recent Payments
            </CardTitle>
            <Link
              href="/admin/payments"
              className="text-xs text-[#0ea5e9] hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.recentPayments.length > 0 ? (
              data.recentPayments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {p.companyName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(
                        p.paidAt || p.createdAt
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-emerald-500">
                    £{p.amount.toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No payments yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
