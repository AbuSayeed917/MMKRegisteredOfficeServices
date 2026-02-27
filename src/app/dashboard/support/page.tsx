"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  _count: { messages: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusStyles: Record<string, string> = {
  OPEN: "bg-emerald-100 text-emerald-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-sky-100 text-sky-700",
  CLOSED: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const categoryLabels: Record<string, string> = {
  GENERAL: "General",
  BILLING: "Billing",
  MAIL_FORWARDING: "Mail Forwarding",
  ACCOUNT: "Account",
  TECHNICAL: "Technical",
  COMPANIES_HOUSE: "Companies House",
  OTHER: "Other",
};

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/support-tickets?page=${page}&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setTickets(data.tickets || []);
          setPagination(data.pagination || null);
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-72" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
            Support Tickets
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Need help? Submit a ticket and our team will assist you.
          </p>
        </div>
        <Link href="/dashboard/support/create">
          <Button className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold px-5 gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <Plus className="size-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      {tickets.length > 0 ? (
        <>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/dashboard/support/${ticket.id}`}
                className="block"
              >
                <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 hover:border-[#0ea5e9]/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0c2d42] dark:text-white truncate">
                          {ticket.subject}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge
                            className={`text-[10px] px-2 py-0.5 ${
                              statusStyles[ticket.status] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {statusLabels[ticket.status] || ticket.status}
                          </Badge>
                          <Badge className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5">
                            {categoryLabels[ticket.category] || ticket.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare className="size-3" />
                          <span className="text-xs">
                            {ticket._count.messages}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                          <Clock className="size-2.5" />
                          {new Date(ticket.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} ticket
                {pagination.total !== 1 ? "s" : ""})
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="size-3.5" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="gap-1 text-xs"
                >
                  Next
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <CardContent className="py-16 text-center">
            <LifeBuoy className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No Tickets Yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              When you submit a support ticket, it will appear here
            </p>
            <Link href="/dashboard/support/create">
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-1.5 text-xs"
              >
                <Plus className="size-3.5" />
                Create Your First Ticket
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
