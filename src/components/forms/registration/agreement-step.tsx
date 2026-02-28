"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignaturePad } from "@/components/forms/signature-pad";
import {
  FileText,
  ArrowRight,
  ArrowLeft,
  ScrollText,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface AgreementFormData {
  agreed: boolean;
  signatureType: "typed" | "drawn" | "";
  signatureData: string;
  signerName: string;
}

interface AgreementStepProps {
  data: AgreementFormData;
  companyName: string;
  companyNumber: string;
  directorName: string;
  onUpdate: (data: AgreementFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AgreementStep({
  data,
  companyName,
  companyNumber,
  directorName,
  onUpdate,
  onBack,
  onNext,
}: AgreementStepProps) {
  const [agreementHtml, setAgreementHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch the active agreement template
  useEffect(() => {
    async function fetchTemplate() {
      try {
        const res = await fetch("/api/agreements/template");
        if (!res.ok) throw new Error("Failed to load agreement");
        const json = await res.json();

        // Replace placeholders with actual company details
        let html = json.contentHtml as string;
        html = html.replace(/\{\{companyName\}\}/g, companyName || "[Company Name]");
        html = html.replace(/\{\{crn\}\}/g, companyNumber || "[CRN]");
        html = html.replace(/\{\{directorName\}\}/g, directorName || "[Director Name]");
        html = html.replace(
          /\{\{date\}\}/g,
          new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        );

        setAgreementHtml(html);
      } catch {
        setError("Could not load the agreement template. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchTemplate();
  }, [companyName, companyNumber, directorName]);

  // Track scroll to bottom
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const threshold = 40; // px from bottom
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    if (atBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  }, [hasScrolledToBottom]);

  // Stable signature change handler
  const handleSignatureChange = useCallback(
    (sig: { type: "typed" | "drawn"; data: string; name?: string } | null) => {
      if (sig) {
        onUpdate({
          ...data,
          signatureType: sig.type,
          signatureData: sig.data,
          signerName: sig.name || directorName,
        });
      } else {
        onUpdate({
          ...data,
          signatureType: "",
          signatureData: "",
          signerName: "",
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [directorName]
  );

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!hasScrolledToBottom) {
      newErrors.scroll =
        "Please read the full agreement by scrolling to the bottom";
    }
    if (!data.signatureType || !data.signatureData) {
      newErrors.signature = "Please provide your signature to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onUpdate({ ...data, agreed: true });
      onNext();
    }
  };

  if (loading) {
    return (
      <Card className="border-[var(--mmk-border-light)] rounded-2xl shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
        <CardContent className="py-20 text-center">
          <Loader2 className="size-8 text-[#0ea5e9] animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            Loading agreement...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-[var(--mmk-border-light)] rounded-2xl shadow-lg overflow-hidden">
        <div className="h-1 bg-destructive/60" />
        <CardContent className="py-16 text-center">
          <AlertTriangle className="size-10 text-destructive mx-auto mb-4" />
          <p className="text-sm text-destructive mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={onBack}
            className="rounded-full px-6 gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-[var(--mmk-border-light)] rounded-2xl shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />

        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
              <FileText className="size-5 text-[#0ea5e9]" />
            </div>
            Service Agreement
          </CardTitle>
          <p className="text-sm text-[var(--mmk-text-secondary)]">
            Please read the registered office service agreement below and sign
            to confirm your acceptance.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Agreement info badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="gap-1.5 text-xs font-normal rounded-full px-3"
            >
              <ScrollText className="size-3" />
              Registered Office Service Agreement
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1.5 text-xs font-normal rounded-full px-3"
            >
              <Shield className="size-3" />
              Legally binding
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1.5 text-xs font-normal rounded-full px-3"
            >
              <Clock className="size-3" />
              12-month term
            </Badge>
          </div>

          {/* Agreement content — scrollable */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="bg-white dark:bg-gray-950 border border-[var(--mmk-border)] rounded-xl p-6 max-h-[400px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none
                prose-headings:text-[#0c2d42] dark:prose-headings:text-white
                prose-h1:text-xl prose-h1:font-bold prose-h1:mb-4
                prose-h2:text-base prose-h2:font-semibold prose-h2:mt-6 prose-h2:mb-2
                prose-p:text-sm prose-p:leading-relaxed
                prose-li:text-sm prose-li:leading-relaxed
                prose-strong:text-[#0c2d42] dark:prose-strong:text-white
              "
              dangerouslySetInnerHTML={{ __html: agreementHtml }}
            />

            {/* Scroll indicator overlay */}
            {!hasScrolledToBottom && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-950 to-transparent rounded-b-xl pointer-events-none flex items-end justify-center pb-2">
                <p className="text-[10px] text-muted-foreground animate-bounce pointer-events-auto">
                  ↓ Scroll down to read the full agreement
                </p>
              </div>
            )}
          </div>

          {/* Scroll confirmation */}
          {hasScrolledToBottom ? (
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              You have read the full agreement
            </div>
          ) : (
            errors.scroll && (
              <div className="flex items-center gap-2 text-xs text-destructive">
                <AlertTriangle className="size-3.5" />
                {errors.scroll}
              </div>
            )
          )}

          {/* Signature section */}
          <div className="border-t border-[var(--mmk-border)] pt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center">
                <FileText className="size-4 text-[#0ea5e9]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Sign the Agreement</h3>
                <p className="text-xs text-muted-foreground">
                  Type your name or draw your signature below
                </p>
              </div>
            </div>

            <SignaturePad
              onSignatureChange={handleSignatureChange}
              signerName={directorName}
            />

            {errors.signature && (
              <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                <AlertTriangle className="size-3" />
                {errors.signature}
              </p>
            )}
          </div>

          {/* Legal disclaimer */}
          <div className="bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 rounded-xl p-4 text-xs text-[var(--mmk-text-secondary)] space-y-1">
            <p className="font-medium text-[#0ea5e9]">
              By signing, you confirm that:
            </p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>
                You are authorised to enter into this agreement on behalf of{" "}
                <strong>{companyName}</strong>
              </li>
              <li>
                You have read and understood all terms of the agreement
              </li>
              <li>
                Your electronic signature is legally binding under the
                Electronic Communications Act 2000
              </li>
              <li>
                Your signature timestamp and IP address will be recorded
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="rounded-full px-6 gap-2 border-[var(--mmk-border)]"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold px-6 sm:px-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 gap-2"
            >
              Sign & Continue
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
