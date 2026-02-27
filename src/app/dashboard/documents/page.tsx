"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  ImageIcon,
} from "lucide-react";

interface DirectorDoc {
  id: string;
  fullName: string;
  position: string;
  idDocumentName?: string;
  hasIdDocument: boolean;
  addressProofName?: string;
  hasAddressProof: boolean;
}

export default function DocumentsPage() {
  const [directors, setDirectors] = useState<DirectorDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setDirectors(d.business?.directors || []);
      })
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
          KYC Documents
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your uploaded identification documents
        </p>
      </div>

      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-base">
            <ShieldCheck className="size-5 text-[#0ea5e9]" />
            Uploaded Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {directors.length === 0 ? (
            <div className="text-center py-8">
              <ShieldCheck className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No documents found
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {directors.map((d) => (
                <div key={d.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{d.fullName}</p>
                    <Badge variant="secondary" className="text-[10px]">
                      {d.position}
                    </Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* Photo ID */}
                    <div
                      className={`rounded-xl p-4 ${
                        d.hasIdDocument
                          ? "bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30"
                          : "bg-muted/30 border border-[var(--mmk-border-light)]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {d.hasIdDocument ? (
                          <CheckCircle2 className="size-4 text-emerald-500" />
                        ) : (
                          <XCircle className="size-4 text-muted-foreground" />
                        )}
                        <p className="text-sm font-medium">Photo ID</p>
                      </div>
                      {d.hasIdDocument ? (
                        <div className="flex items-center gap-2">
                          <ImageIcon className="size-3.5 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground truncate">
                            {d.idDocumentName}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Not uploaded
                        </p>
                      )}
                    </div>

                    {/* Address Proof */}
                    <div
                      className={`rounded-xl p-4 ${
                        d.hasAddressProof
                          ? "bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30"
                          : "bg-muted/30 border border-[var(--mmk-border-light)]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {d.hasAddressProof ? (
                          <CheckCircle2 className="size-4 text-emerald-500" />
                        ) : (
                          <XCircle className="size-4 text-muted-foreground" />
                        )}
                        <p className="text-sm font-medium">Proof of Address</p>
                      </div>
                      {d.hasAddressProof ? (
                        <div className="flex items-center gap-2">
                          <FileText className="size-3.5 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground truncate">
                            {d.addressProofName}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Not uploaded
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <div className="bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="size-5 text-[#0ea5e9] mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">Document Security</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your documents are stored securely and are only accessible to our
            admin team for identity verification purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
