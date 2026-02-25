"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Clock,
  XCircle,
  RotateCcw,
} from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paidAt: string | null;
  createdAt: string;
  companyName: string | null;
  email: string;
}

interface PaymentsData {
  payments: Payment[];
  summary: Record<string, { count: number; total: number }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  SUCCEEDED: { label: "Succeeded", variant: "default" },
  PENDING: { label: "Pending", variant: "secondary" },
  FAILED: { label: "Failed", variant: "destructive" },
  REFUNDED: { label: "Refunded", variant: "outline" },
};

export default function AdminPaymentsPage() {
  const [data, setData] = useState<PaymentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchPayments = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    params.set("page", String(page));

    fetch(`/api/admin/payments?${params}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    setPage((prev) => (prev !== 1 ? 1 : prev));
  }, [search, statusFilter]);

  const summaryCards = [
    {
      label: "Successful",
      value: data?.summary?.SUCCEEDED?.total || 0,
      count: data?.summary?.SUCCEEDED?.count || 0,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Pending",
      value: data?.summary?.PENDING?.total || 0,
      count: data?.summary?.PENDING?.count || 0,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Failed",
      value: data?.summary?.FAILED?.total || 0,
      count: data?.summary?.FAILED?.count || 0,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Refunded",
      value: data?.summary?.REFUNDED?.total || 0,
      count: data?.summary?.REFUNDED?.count || 0,
      icon: RotateCcw,
      color: "text-[#0ea5e9]",
      bg: "bg-[#0ea5e9]/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
          Payments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all payment transactions
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className="border-[var(--mmk-border-light)] rounded-2xl"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}
                  >
                    <Icon className={`size-4 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      {card.label} ({card.count})
                    </p>
                    <p className="text-lg font-bold">
                      £{card.value.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="size-4 text-[#0ea5e9]" />
            All Payments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by company or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-input bg-background text-sm"
            >
              <option value="">All statuses</option>
              <option value="SUCCEEDED">Succeeded</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : !data || data.payments.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="size-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No payments found</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="hidden md:grid grid-cols-[1fr_1fr_100px_100px_100px_120px] gap-3 px-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                <span>Company</span>
                <span>Email</span>
                <span>Amount</span>
                <span>Method</span>
                <span>Status</span>
                <span>Date</span>
              </div>

              {/* Payment rows */}
              <div className="space-y-1.5">
                {data.payments.map((p) => {
                  const cfg = statusConfig[p.status] || {
                    label: p.status,
                    variant: "secondary" as const,
                  };
                  return (
                    <div
                      key={p.id}
                      className="grid md:grid-cols-[1fr_1fr_100px_100px_100px_120px] gap-2 md:gap-3 items-center p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <p className="text-sm font-medium truncate">
                        {p.companyName || "—"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {p.email}
                      </p>
                      <p className="text-sm font-semibold">
                        £{p.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.paymentMethod?.replace(/_/g, " ") || "—"}
                      </p>
                      <Badge variant={cfg.variant} className="text-[10px] w-fit">
                        {cfg.label}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          p.paidAt || p.createdAt
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Showing {(page - 1) * 20 + 1}–
                    {Math.min(page * 20, data.pagination.total)} of{" "}
                    {data.pagination.total}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="rounded-xl"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.pagination.totalPages}
                      onClick={() => setPage(page + 1)}
                      className="rounded-xl"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
