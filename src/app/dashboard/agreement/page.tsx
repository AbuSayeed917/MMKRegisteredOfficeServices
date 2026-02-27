"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  Shield,
  Pen,
  Type,
  Globe,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface AgreementData {
  id: string;
  status: string;
  signatureType: string;
  signedAt?: string;
  pdfUrl?: string;
  templateVersion: number;
}

export default function AgreementPage() {
  const [agreements, setAgreements] = useState<AgreementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (agreementId: string) => {
    setDownloading(agreementId);
    try {
      const res = await fetch(`/api/agreements/download?id=${agreementId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get download link");
      }
      const { url } = await res.json();
      window.open(url, "_blank");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to download PDF"
      );
    } finally {
      setDownloading(null);
    }
  };

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) => setAgreements(d.agreements || []))
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
          Service Agreement
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View your signed registered office service agreement
        </p>
      </div>

      {agreements.length > 0 ? (
        agreements.map((agreement) => (
          <Card
            key={agreement.id}
            className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden"
          >
            <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-3 text-base">
                  <FileText className="size-5 text-[#0ea5e9]" />
                  Registered Office Service Agreement
                </span>
                <Badge
                  className={
                    agreement.status === "SIGNED"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }
                >
                  {agreement.status === "SIGNED" ? "Signed" : agreement.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Agreement details grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Shield className="size-3" /> Status
                  </p>
                  <div className="flex items-center gap-1.5">
                    {agreement.status === "SIGNED" ? (
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    ) : (
                      <Clock className="size-4 text-amber-500" />
                    )}
                    <p className="font-medium text-sm">
                      {agreement.status === "SIGNED"
                        ? "Electronically Signed"
                        : "Pending Signature"}
                    </p>
                  </div>
                </div>

                {agreement.signedAt && (
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <Calendar className="size-3" /> Date Signed
                    </p>
                    <p className="font-medium text-sm">
                      {new Date(agreement.signedAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}

                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    {agreement.signatureType === "typed" ? (
                      <Type className="size-3" />
                    ) : (
                      <Pen className="size-3" />
                    )}{" "}
                    Signature Type
                  </p>
                  <p className="font-medium text-sm">
                    {agreement.signatureType === "typed"
                      ? "Typed Name"
                      : "Hand-drawn"}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Globe className="size-3" /> Version
                  </p>
                  <p className="font-medium text-sm">
                    v{agreement.templateVersion}
                  </p>
                </div>
              </div>

              {/* Agreement info */}
              <div className="bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 rounded-xl p-4">
                <p className="text-sm font-medium text-[#0ea5e9] mb-1">
                  Agreement Summary
                </p>
                <ul className="text-xs text-[var(--mmk-text-secondary)] space-y-1">
                  <li>
                    &bull; Registered office address service at MMK Accountants,
                    Luton
                  </li>
                  <li>&bull; Annual fee of £75.00, payable in advance</li>
                  <li>
                    &bull; 12-month term with automatic renewal
                  </li>
                  <li>
                    &bull; Mail receipt and notification within 2 working days
                  </li>
                  <li>
                    &bull; 30-day notice required for termination
                  </li>
                </ul>
              </div>

              {/* Download + Legal note */}
              {agreement.status === "SIGNED" && agreement.pdfUrl && (
                <Button
                  variant="outline"
                  className="rounded-xl gap-2 w-full sm:w-auto"
                  onClick={() => handleDownload(agreement.id)}
                  disabled={downloading === agreement.id}
                >
                  {downloading === agreement.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  Download Signed Agreement (PDF)
                </Button>
              )}

              <p className="text-[10px] text-muted-foreground">
                This agreement was signed electronically under the Electronic
                Communications Act 2000. Your signature, timestamp, and IP
                address have been recorded.
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <CardContent className="py-16 text-center">
            <FileText className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No agreement found
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              An agreement will appear here once you complete registration
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
