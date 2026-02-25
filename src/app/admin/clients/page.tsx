"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Search,
  ChevronRight,
  ChevronLeft,
  Building2,
} from "lucide-react";

interface Client {
  id: string;
  email: string;
  isActive: boolean;
  companyName?: string;
  crn?: string;
  companyType?: string;
  subscriptionStatus: string;
  subscriptionEnd?: string;
  paymentMethod?: string;
  agreementStatus: string;
  createdAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING_APPROVAL: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  EXPIRED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  NONE: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  RENEWAL_PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  WITHDRAWN: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchClients = (p: number, s: string, f: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(p));
    if (s) params.set("search", s);
    if (f) params.set("status", f);

    fetch(`/api/admin/clients?${params}`)
      .then((res) => res.json())
      .then((d) => {
        setClients(d.clients || []);
        setPagination(d.pagination || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchClients(page, search, statusFilter); }, [page, statusFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchClients(1, search, statusFilter);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
          Client Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all registered clients
        </p>
      </div>

      {/* Search and filters */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by company name, CRN, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 rounded-xl"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-xl border border-[var(--mmk-border)] bg-background px-3 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="EXPIRED">Expired</option>
              <option value="REJECTED">Rejected</option>
              <option value="DRAFT">Draft</option>
            </select>
            <Button
              onClick={handleSearch}
              className="rounded-xl gap-2"
              variant="outline"
            >
              <Search className="size-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Client list */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4 text-[#0ea5e9]" />
            Clients
            {pagination && (
              <Badge variant="secondary" className="text-[10px] ml-2">
                {pagination.total} total
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : clients.length > 0 ? (
            <div className="space-y-2">
              {clients.map((client) => (
                <Link
                  key={client.id}
                  href={`/admin/clients/${client.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="size-4 text-[#0ea5e9]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {client.companyName || client.email}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {client.crn && `CRN: ${client.crn} · `}
                      {client.email}
                    </p>
                  </div>
                  <Badge
                    className={`text-[10px] flex-shrink-0 ${statusColors[client.subscriptionStatus] || statusColors.NONE}`}
                  >
                    {client.subscriptionStatus.replace(/_/g, " ")}
                  </Badge>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-[#0ea5e9] flex-shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No clients found
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--mmk-border-light)]">
              <p className="text-xs text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg gap-1"
                >
                  <ChevronLeft className="size-3" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page >= pagination.totalPages}
                  className="rounded-lg gap-1"
                >
                  Next
                  <ChevronRight className="size-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
