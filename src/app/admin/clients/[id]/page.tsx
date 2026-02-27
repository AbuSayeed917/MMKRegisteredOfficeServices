"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Building2,
  Hash,
  Calendar,
  MapPin,
  Shield,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Briefcase,
  Users,
  FileText,
  Download,
  Pen,
  Type,
} from "lucide-react";
import { toast } from "sonner";

interface ClientDetail {
  user: {
    id: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
  };
  business: {
    companyName: string;
    crn: string;
    companyType: string;
    incorporationDate?: string;
    sicCode?: string;
    registeredAddress: string;
    tradingAddress?: string;
    phone?: string;
    directors: {
      id: string;
      fullName: string;
      position: string;
      dateOfBirth: string;
      residentialAddress: string;
    }[];
  } | null;
  subscription: {
    id: string;
    status: string;
    startDate?: string;
    endDate?: string;
    paymentMethod?: string;
    retryCount: number;
  } | null;
  agreements: {
    id: string;
    status: string;
    signatureType: string;
    signedAt?: string;
    pdfUrl?: string;
    templateVersion: number;
  }[];
  payments: {
    id: string;
    amount: number;
    status: string;
    paymentMethod: string;
    paidAt?: string;
    createdAt: string;
  }[];
  adminActions: {
    id: string;
    actionType: string;
    reason?: string;
    notes?: string;
    adminEmail: string;
    createdAt: string;
  }[];
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING_APPROVAL: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  EXPIRED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  WITHDRAWN: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export default function ClientDetailPage() {
  const params = useParams();
  const [data, setData] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const clientId = params.id as string;

  const fetchData = () => {
    fetch(`/api/admin/clients/${clientId}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, [clientId]);

  const performAction = async (action: string) => {
    const reason =
      action === "REJECT" || action === "SUSPEND"
        ? prompt(`Reason for ${action.toLowerCase()}:`)
        : null;

    if ((action === "REJECT" || action === "SUSPEND") && !reason) return;

    setActionLoading(action);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (agreementId: string) => {
    setDownloading(agreementId);
    try {
      const res = await fetch(`/api/agreements/download?id=${agreementId}`);
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to download PDF");
      }
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "agreement.pdf";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const { url } = await res.json();
        window.open(url, "_blank");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to download PDF"
      );
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-60 rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="py-12 text-center">
          <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
          <p className="text-destructive font-medium">Client not found</p>
          <Link href="/admin/clients">
            <Button variant="outline" className="mt-4 rounded-full gap-2">
              <ArrowLeft className="size-4" /> Back to clients
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const sub = data.subscription;
  const availableActions: { action: string; label: string; variant: "default" | "destructive" | "outline" }[] = [];

  if (sub?.status === "PENDING_APPROVAL") {
    availableActions.push(
      { action: "APPROVE", label: "Approve", variant: "default" },
      { action: "REJECT", label: "Reject", variant: "destructive" }
    );
  }
  if (sub?.status === "ACTIVE") {
    availableActions.push(
      { action: "SUSPEND", label: "Suspend", variant: "destructive" }
    );
  }
  if (sub?.status === "SUSPENDED") {
    availableActions.push(
      { action: "REACTIVATE", label: "Reactivate", variant: "default" }
    );
  }
  if (sub && !["WITHDRAWN", "REJECTED"].includes(sub.status)) {
    availableActions.push(
      { action: "CANCEL", label: "Cancel Service", variant: "outline" }
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/clients">
          <Button variant="ghost" size="icon" className="rounded-xl mt-1">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
            {data.business?.companyName || data.user.email}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.user.email} · Registered{" "}
            {new Date(data.user.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        {sub && (
          <Badge
            className={`text-xs ${statusColors[sub.status] || statusColors.DRAFT}`}
          >
            {sub.status.replace(/_/g, " ")}
          </Badge>
        )}
      </div>

      {/* Action buttons */}
      {availableActions.length > 0 && (
        <Card className="border-[var(--mmk-border-light)] rounded-2xl">
          <CardContent className="p-4 flex flex-wrap gap-2">
            {availableActions.map((a) => (
              <Button
                key={a.action}
                variant={a.variant}
                size="sm"
                className="rounded-full gap-1.5"
                onClick={() => performAction(a.action)}
                disabled={actionLoading !== null}
              >
                {actionLoading === a.action && (
                  <Loader2 className="size-3 animate-spin" />
                )}
                {a.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Business Details */}
        {data.business && (
          <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#0c2d42] to-[#0ea5e9]" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="size-4 text-[#0ea5e9]" />
                Business Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Company Name</p>
                  <p className="font-medium">{data.business.companyName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Hash className="size-2.5" /> CRN
                  </p>
                  <p className="font-mono">{data.business.crn}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <Badge variant="secondary" className="text-[10px]">
                    {data.business.companyType}
                  </Badge>
                </div>
                {data.business.incorporationDate && (
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-2.5" /> Incorporated
                    </p>
                    <p>
                      {new Date(
                        data.business.incorporationDate
                      ).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-2.5" /> Registered Address
                </p>
                <p>{data.business.registeredAddress}</p>
              </div>
              {data.business.tradingAddress && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Trading Address
                  </p>
                  <p>{data.business.tradingAddress}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Subscription & Account */}
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="size-4 text-[#0ea5e9]" />
              Subscription & Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Account Status</p>
                <Badge
                  className={
                    data.user.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {data.user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              {sub && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Subscription
                    </p>
                    <Badge
                      className={`text-[10px] ${statusColors[sub.status] || ""}`}
                    >
                      {sub.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  {sub.startDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Start Date
                      </p>
                      <p>
                        {new Date(sub.startDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  )}
                  {sub.endDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">End Date</p>
                      <p>
                        {new Date(sub.endDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  )}
                  {sub.paymentMethod && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Payment Method
                      </p>
                      <p>
                        {sub.paymentMethod === "CARD"
                          ? "Card"
                          : "BACS Direct Debit"}
                      </p>
                    </div>
                  )}
                </>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Last Login</p>
                <p>
                  {data.user.lastLogin
                    ? new Date(data.user.lastLogin).toLocaleDateString("en-GB")
                    : "Never"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Directors */}
        {data.business?.directors && data.business.directors.length > 0 && (
          <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4 text-[#0ea5e9]" />
                Directors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.business.directors.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 bg-muted/30 rounded-xl p-3"
                >
                  <Briefcase className="size-4 text-[#0ea5e9] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{d.fullName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {d.position} · DOB:{" "}
                      {new Date(d.dateOfBirth).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Agreements */}
        {data.agreements.length > 0 && (
          <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4 text-[#0ea5e9]" />
                Agreements ({data.agreements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.agreements.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 bg-muted/20 rounded-xl p-3"
                  >
                    {a.signatureType === "typed" ? (
                      <Type className="size-4 text-[#0ea5e9] shrink-0" />
                    ) : (
                      <Pen className="size-4 text-[#0ea5e9] shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        v{a.templateVersion} — {a.signatureType === "typed" ? "Typed" : "Hand-drawn"} signature
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {a.signedAt
                          ? `Signed ${new Date(a.signedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                          : "Pending signature"}
                      </p>
                    </div>
                    <Badge
                      className={`text-[10px] ${
                        a.status === "SIGNED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {a.status}
                    </Badge>
                    {a.status === "SIGNED" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                        onClick={() => handleDownload(a.id)}
                        disabled={downloading === a.id}
                      >
                        {downloading === a.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Download className="size-3" />
                        )}
                        PDF
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment History */}
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4 text-emerald-500" />
              Payments ({data.payments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.payments.length > 0 ? (
              <div className="space-y-2">
                {data.payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 bg-muted/20 rounded-xl p-3"
                  >
                    {p.status === "SUCCEEDED" ? (
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    ) : p.status === "FAILED" ? (
                      <XCircle className="size-4 text-red-500" />
                    ) : (
                      <Clock className="size-4 text-amber-500" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        £{p.amount.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(
                          p.paidAt || p.createdAt
                        ).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {p.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No payments
              </p>
            )}
          </CardContent>
        </Card>

        {/* Audit Log */}
        {data.adminActions.length > 0 && (
          <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden lg:col-span-2">
            <div className="h-1 bg-gradient-to-r from-[#0c2d42] to-[#0ea5e9]" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="size-4 text-[#0ea5e9]" />
                Admin Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.adminActions.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 bg-muted/20 rounded-xl p-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#0ea5e9] mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">
                          {a.actionType.replace(/_/g, " ")}
                        </span>
                        {a.reason && (
                          <span className="text-muted-foreground">
                            {" "}
                            — {a.reason}
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        by {a.adminEmail} ·{" "}
                        {new Date(a.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
