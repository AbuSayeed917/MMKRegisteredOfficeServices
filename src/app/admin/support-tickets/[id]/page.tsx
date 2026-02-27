"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  LifeBuoy,
  Send,
  Clock,
  User,
  Building2,
  CalendarDays,
  Loader2,
  AlertTriangle,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

interface TicketMessage {
  id: string;
  message: string;
  isInternal: boolean;
  attachmentUrl: string | null;
  createdAt: string;
  sender: {
    id: string;
    email: string;
    role: string;
  };
}

interface TicketDetail {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    businessProfile: { companyName: string } | null;
  };
  assignedTo: { id: string; email: string } | null;
  messages: TicketMessage[];
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

const roleColors: Record<string, string> = {
  CLIENT: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  SUPER_ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function AdminSupportTicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!ticketId) return;
    let cancelled = false;
    fetch(`/api/support-tickets/${ticketId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load ticket");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setTicket(data);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load ticket details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [ticketId, refreshKey]);

  const handleAction = async (
    action: string,
    extra?: { priority?: string; assignedToId?: string }
  ) => {
    setActionLoading(action);
    try {
      const res = await fetch(
        `/api/admin/support-tickets/${ticketId}/action`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ...extra }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Action failed");
      }
      toast.success(
        action === "in_progress"
          ? "Ticket marked as in progress"
          : action === "resolve"
            ? "Ticket resolved"
            : action === "close"
              ? "Ticket closed"
              : action === "reopen"
                ? "Ticket reopened"
                : action === "set_priority"
                  ? "Priority updated"
                  : "Action completed"
      );
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to perform action"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/support-tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: replyMessage.trim(),
          isInternal,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send reply");
      }
      toast.success(
        isInternal ? "Internal note added" : "Reply sent successfully"
      );
      setReplyMessage("");
      setIsInternal(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send reply"
      );
    } finally {
      setSending(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/support-tickets"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0ea5e9] transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Tickets
        </Link>
        <Card className="border-[var(--mmk-border-light)] rounded-2xl">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="size-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Ticket not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canMarkInProgress =
    ticket.status === "OPEN" || ticket.status === "REOPENED";
  const canResolve =
    ticket.status === "OPEN" || ticket.status === "IN_PROGRESS";
  const canClose =
    ticket.status !== "CLOSED";
  const canReopen =
    ticket.status === "RESOLVED" || ticket.status === "CLOSED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/support-tickets"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0ea5e9] transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Tickets
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white truncate">
              {ticket.subject}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ticket #{ticket.id.slice(0, 8)}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge
              className={`text-xs ${statusColors[ticket.status] || statusColors.OPEN}`}
            >
              {statusLabels[ticket.status] || ticket.status}
            </Badge>
            <Badge
              className={`text-xs ${priorityColors[ticket.priority] || priorityColors.LOW}`}
            >
              {priorityLabels[ticket.priority] || ticket.priority}
            </Badge>
          </div>
        </div>
      </div>

      {/* Client info card */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0">
                <User className="size-4 text-[#0ea5e9]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {ticket.user.email}
                </p>
                <p className="text-[11px] text-muted-foreground">Client</p>
              </div>
            </div>
            {ticket.user.businessProfile?.companyName && (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="size-4 text-[#0ea5e9]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {ticket.user.businessProfile.companyName}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Company</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="size-4 text-[#0ea5e9]" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {formatDate(ticket.createdAt)}
                </p>
                <p className="text-[11px] text-muted-foreground">Created</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action bar */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <p className="text-sm font-medium text-[#0c2d42] dark:text-white flex-shrink-0">
              Actions
            </p>
            <div className="flex flex-wrap gap-2 flex-1">
              {canMarkInProgress && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl gap-1.5 text-amber-700 border-amber-200 hover:bg-amber-50"
                  onClick={() => handleAction("in_progress")}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === "in_progress" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Play className="size-3.5" />
                  )}
                  Mark In Progress
                </Button>
              )}
              {canResolve && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl gap-1.5 text-sky-700 border-sky-200 hover:bg-sky-50"
                  onClick={() => handleAction("resolve")}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === "resolve" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-3.5" />
                  )}
                  Resolve
                </Button>
              )}
              {canClose && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl gap-1.5 text-gray-700 border-gray-200 hover:bg-gray-50"
                  onClick={() => handleAction("close")}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === "close" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <XCircle className="size-3.5" />
                  )}
                  Close
                </Button>
              )}
              {canReopen && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  onClick={() => handleAction("reopen")}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === "reopen" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="size-3.5" />
                  )}
                  Reopen
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground">Priority:</span>
              <Select
                value={ticket.priority}
                onValueChange={(val) =>
                  handleAction("set_priority", { priority: val })
                }
                disabled={actionLoading !== null}
              >
                <SelectTrigger className="w-[120px] h-8 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message thread */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <LifeBuoy className="size-4 text-[#0ea5e9]" />
            Messages
            <Badge variant="secondary" className="text-[10px] ml-2">
              {ticket.messages.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ticket.messages.length === 0 ? (
            <div className="text-center py-8">
              <LifeBuoy className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No messages yet
              </p>
            </div>
          ) : (
            ticket.messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl p-4 ${
                  msg.isInternal
                    ? "bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                    : "bg-muted/30 border border-[var(--mmk-border-light)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{msg.sender.email}</p>
                    <Badge
                      className={`text-[10px] ${
                        roleColors[msg.sender.role] || roleColors.CLIENT
                      }`}
                    >
                      {msg.sender.role === "SUPER_ADMIN"
                        ? "ADMIN"
                        : msg.sender.role}
                    </Badge>
                    {msg.isInternal && (
                      <Badge className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Internal Note
                      </Badge>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="size-3" />
                    {formatDateTime(msg.createdAt)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Reply form */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0c2d42] dark:text-white">
            Reply
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Type your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            rows={4}
            className="rounded-xl resize-none"
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="internal-note"
                checked={isInternal}
                onCheckedChange={(checked) =>
                  setIsInternal(checked === true)
                }
              />
              <label
                htmlFor="internal-note"
                className="text-sm text-muted-foreground cursor-pointer select-none"
              >
                Internal note (only visible to admins)
              </label>
            </div>
            <Button
              onClick={handleReply}
              disabled={sending || !replyMessage.trim()}
              className="rounded-xl gap-2 bg-[#0ea5e9] hover:bg-[#0ea5e9]/90"
            >
              {sending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Send Reply
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
