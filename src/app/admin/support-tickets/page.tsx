"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LifeBuoy,
  Search,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  UserCheck,
} from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    businessProfile: { companyName: string } | null;
  };
  assignedTo: { email: string } | null;
  _count: { messages: number };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusColors: Record<string, string> = {
  OPEN: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  IN_PROGRESS: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  RESOLVED: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  CLOSED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  MEDIUM: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  HIGH: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  URGENT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const priorityLabels: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export default function AdminSupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const fetchId = ++fetchCountRef.current;

    const params = new URLSearchParams();
    params.set("page", String(page));
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (priorityFilter) params.set("priority", priorityFilter);
    if (categoryFilter) params.set("category", categoryFilter);

    fetch(`/api/admin/support-tickets?${params}`)
      .then((res) => res.json())
      .then((d) => {
        if (!cancelled && fetchId === fetchCountRef.current) {
          setTickets(d.tickets || []);
          setPagination(d.pagination || null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [page, search, statusFilter, priorityFilter, categoryFilter]);

  const handleSearch = () => {
    setPage(1);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
          Support Tickets
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and respond to client support requests
        </p>
      </div>

      {/* Search and filters */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by subject, email, or company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 rounded-xl"
              />
            </div>
            <Select
              value={statusFilter || "ALL"}
              onValueChange={(val) => {
                setStatusFilter(val === "ALL" ? "" : val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px] rounded-xl">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter || "ALL"}
              onValueChange={(val) => {
                setPriorityFilter(val === "ALL" ? "" : val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px] rounded-xl">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter || "ALL"}
              onValueChange={(val) => {
                setCategoryFilter(val === "ALL" ? "" : val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px] rounded-xl">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="BILLING">Billing</SelectItem>
                <SelectItem value="MAIL_FORWARDING">Mail Forwarding</SelectItem>
                <SelectItem value="ACCOUNT">Account</SelectItem>
                <SelectItem value="TECHNICAL">Technical</SelectItem>
                <SelectItem value="COMPANIES_HOUSE">Companies House</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
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

      {/* Ticket list */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <LifeBuoy className="size-4 text-[#0ea5e9]" />
            Tickets
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
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : tickets.length > 0 ? (
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/admin/support-tickets/${ticket.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0">
                    <LifeBuoy className="size-4 text-[#0ea5e9]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {ticket.subject}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {ticket.user.businessProfile?.companyName
                        ? `${ticket.user.businessProfile.companyName} · `
                        : ""}
                      {ticket.user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge
                        className={`text-[10px] ${statusColors[ticket.status] || statusColors.OPEN}`}
                      >
                        {statusLabels[ticket.status] || ticket.status}
                      </Badge>
                      <Badge
                        className={`text-[10px] ${priorityColors[ticket.priority] || priorityColors.LOW}`}
                      >
                        {priorityLabels[ticket.priority] || ticket.priority}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px]"
                      >
                        {ticket.category.replace(/_/g, " ")}
                      </Badge>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <MessageSquare className="size-3" />
                        {ticket._count.messages}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Updated {formatDate(ticket.updatedAt)}
                      </span>
                      {ticket.assignedTo && (
                        <span className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400">
                          <UserCheck className="size-3" />
                          {ticket.assignedTo.email.split("@")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-[#0ea5e9] flex-shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <LifeBuoy className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No tickets found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search or filter criteria
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
