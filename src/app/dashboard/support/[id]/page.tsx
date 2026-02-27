"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Send,
  Loader2,
  Clock,
  LifeBuoy,
  MessageSquare,
  Shield,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
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

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  user: {
    id: string;
    email: string;
    businessProfile: { companyName: string } | null;
  };
  assignedTo: { id: string; email: string } | null;
  messages: Message[];
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

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        if (!cancelled) toast.error("Failed to load ticket");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [ticketId, refreshKey]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket?.messages]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSending(true);

    try {
      const res = await fetch(`/api/support-tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send reply");
      }

      toast.success("Reply sent successfully");
      setReplyMessage("");
      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send reply"
      );
    } finally {
      setSending(false);
    }
  };

  const isAdminMessage = (role: string) =>
    role === "ADMIN" || role === "SUPER_ADMIN";

  const canReply =
    ticket?.status === "OPEN" ||
    ticket?.status === "IN_PROGRESS" ||
    ticket?.status === "RESOLVED";

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 rounded-2xl" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/support"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#0ea5e9] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Support
        </Link>
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <CardContent className="py-16 text-center">
            <LifeBuoy className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              Ticket Not Found
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This ticket may have been removed or you don&apos;t have access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/support"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#0ea5e9] transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Back to Support
      </Link>

      {/* Ticket Header */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-[#0c2d42] dark:text-white">
                {ticket.subject}
              </h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge
                  className={`text-xs px-2.5 py-0.5 ${
                    statusStyles[ticket.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {statusLabels[ticket.status] || ticket.status}
                </Badge>
                <Badge className="bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5">
                  {categoryLabels[ticket.category] || ticket.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <Clock className="size-3" />
                Opened on{" "}
                {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Thread */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-[#0c2d42] dark:text-white flex items-center gap-2">
          <MessageSquare className="size-4 text-[#0ea5e9]" />
          Messages ({ticket.messages.length})
        </h2>

        {ticket.messages.length > 0 ? (
          <div className="space-y-3">
            {ticket.messages.map((msg) => {
              const isAdmin = isAdminMessage(msg.sender.role);
              return (
                <Card
                  key={msg.id}
                  className={`border-[var(--mmk-border-light)] rounded-2xl overflow-hidden ${
                    isAdmin ? "border-l-4 border-l-[#0ea5e9]" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isAdmin
                            ? "bg-[#0ea5e9]/10 text-[#0ea5e9]"
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {isAdmin ? (
                          <Shield className="size-3.5" />
                        ) : (
                          <User className="size-3.5" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-[#0c2d42] dark:text-white">
                          {msg.sender.email}
                        </span>
                        {isAdmin && (
                          <Badge className="bg-[#0ea5e9]/10 text-[#0ea5e9] text-[9px] px-1.5 py-0">
                            Staff
                          </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="size-2.5" />
                          {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed pl-9">
                      {msg.message}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
            <CardContent className="py-10 text-center">
              <MessageSquare className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No messages yet</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reply Form */}
      {canReply ? (
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Send className="size-4 text-[#0ea5e9]" />
              Reply
              {ticket.status === "RESOLVED" && (
                <span className="text-[10px] font-normal text-muted-foreground">
                  (Replying will reopen this ticket)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReply} className="space-y-3">
              <Textarea
                placeholder="Type your reply..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                disabled={sending}
                className="rounded-lg min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!replyMessage.trim() || sending}
                  className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold px-6 gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  {sending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              This ticket is closed. No further replies can be added.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
