"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  CheckCheck,
  Clock,
  Info,
  AlertTriangle,
  CreditCard,
  FileText,
  Shield,
} from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  PAYMENT: <CreditCard className="size-4" />,
  AGREEMENT: <FileText className="size-4" />,
  SUBSCRIPTION: <Shield className="size-4" />,
  SYSTEM: <Info className="size-4" />,
  WARNING: <AlertTriangle className="size-4" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) => setNotifications(d.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await fetch("/api/dashboard/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silently fail
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/dashboard/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [id] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // silently fail
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            className="gap-1.5 text-xs"
          >
            <CheckCheck className="size-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-[var(--mmk-border-light)] rounded-2xl overflow-hidden transition-all ${
                !notification.isRead
                  ? "border-l-4 border-l-[#0ea5e9] bg-[#0ea5e9]/[0.03]"
                  : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      !notification.isRead
                        ? "bg-[#0ea5e9]/10 text-[#0ea5e9]"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {typeIcons[notification.type] || (
                      <Bell className="size-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          !notification.isRead
                            ? "font-semibold text-[#0c2d42] dark:text-white"
                            : "font-medium text-muted-foreground"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <Badge className="bg-[#0ea5e9]/10 text-[#0ea5e9] text-[10px] px-1.5">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="size-2.5" />
                        {new Date(notification.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-[10px] h-6 px-2 text-muted-foreground hover:text-[#0ea5e9]"
                        >
                          Mark read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <CardContent className="py-16 text-center">
            <Bell className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No notifications yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You&apos;ll be notified about important updates here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
