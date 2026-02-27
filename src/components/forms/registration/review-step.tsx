"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  ArrowLeft,
  Building2,
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Hash,
  Shield,
  FileText,
  CheckCircle2,
  Loader2,
  CreditCard,
  AlertTriangle,
  Pen,
  Type,
  ShieldCheck,
} from "lucide-react";
import type { RegistrationData } from "@/app/register/page";

interface ReviewStepProps {
  data: RegistrationData;
  onBack: () => void;
}

function humanizeType(type: string): string {
  const map: Record<string, string> = {
    ltd: "Private Limited Company (Ltd)",
    plc: "Public Limited Company (PLC)",
    llp: "Limited Liability Partnership (LLP)",
    "limited-partnership": "Limited Partnership",
    "private-limited-guarant-nsc": "Private Limited by Guarantee",
    "private-unlimited": "Private Unlimited Company",
  };
  return map[type] || type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function ReviewStep({ data, onBack }: ReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business: {
            companyName: data.business.companyName,
            companyNumber: data.business.companyNumber,
            companyType: data.business.companyType,
            incorporationDate: data.business.incorporationDate,
            sicCodes: data.business.sicCodes,
            registeredAddress: data.business.registeredAddress,
            tradingAddress: data.business.tradingAddress,
            phone: data.business.phone,
          },
          director: {
            fullName: data.director.fullName,
            position: data.director.position,
            dateOfBirth: data.director.dateOfBirth,
            email: data.director.email,
            phone: data.director.phone,
            residentialAddress: data.director.residentialAddress,
          },
          documents: {
            idDocument: data.documents.idDocument,
            addressProof: data.documents.addressProof,
          },
          account: {
            email: data.account.email,
            password: data.account.password,
          },
          agreement: {
            signatureType: data.agreement.signatureType,
            signatureData: data.agreement.signatureData,
            signerName: data.agreement.signerName,
          },
        }),
      });

      if (!response.ok) {
        let errorMsg = "Registration failed. Please try again.";
        try {
          const result = await response.json();
          errorMsg = result.error || errorMsg;
        } catch {
          // Response body may not be valid JSON (e.g., truncated or too large)
          errorMsg = response.status === 409
            ? "An account with this email already exists."
            : response.status === 429
            ? "Too many attempts. Please wait a moment and try again."
            : "Registration failed. Please try again.";
        }
        throw new Error(errorMsg);
      }

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("Unexpected server response. Please try again.");
      }

      // If we get a checkout URL, redirect to Stripe
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state (fallback — normally user is redirected to Stripe)
  if (success) {
    return (
      <Card className="border-[var(--mmk-border-light)] rounded-2xl shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
        <CardContent className="py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="size-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Registration Complete!</h2>
          <p className="text-[var(--mmk-text-secondary)] mb-4 max-w-md mx-auto">
            Your registration has been submitted successfully. You will be
            redirected to complete payment shortly.
          </p>
          <Loader2 className="size-5 animate-spin text-[#0ea5e9] mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[var(--mmk-border-light)] rounded-2xl shadow-lg overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
            <Eye className="size-5 text-[#0ea5e9]" />
          </div>
          Review & Pay
        </CardTitle>
        <p className="text-sm text-[var(--mmk-text-secondary)]">
          Review all your details below. After submitting, you will be redirected
          to our secure payment page.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Business Details */}
        <div className="bg-muted/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="size-4 text-[#0ea5e9]" />
            <h3 className="font-semibold text-sm">Business Details</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">
                Company Name
              </span>
              <p className="font-medium">{data.business.companyName}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Hash className="size-3" /> CRN
              </span>
              <p className="font-mono">{data.business.companyNumber}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Briefcase className="size-3" /> Type
              </span>
              <p>{humanizeType(data.business.companyType)}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Status</span>
              <div>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                  {data.business.companyStatus || "Active"}
                </Badge>
              </div>
            </div>
            {data.business.incorporationDate && (
              <div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" /> Incorporated
                </span>
                <p>
                  {new Date(data.business.incorporationDate).toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                </p>
              </div>
            )}
            {data.business.sicCodes.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground">
                  SIC Codes
                </span>
                <div className="flex gap-1 flex-wrap mt-0.5">
                  {data.business.sicCodes.map((code) => (
                    <Badge key={code} variant="secondary" className="text-xs font-mono">
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {data.business.registeredAddress && (
              <div className="sm:col-span-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3" /> Current Registered Address
                </span>
                <p>{data.business.registeredAddress}</p>
              </div>
            )}
            {data.business.tradingAddress && (
              <div className="sm:col-span-2">
                <span className="text-xs text-muted-foreground">
                  Trading Address
                </span>
                <p>{data.business.tradingAddress}</p>
              </div>
            )}
            {data.business.phone && (
              <div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="size-3" /> Business Phone
                </span>
                <p>{data.business.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Director Details */}
        <div className="bg-muted/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <UserCircle className="size-4 text-[#0ea5e9]" />
            <h3 className="font-semibold text-sm">Director / Officer</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">Full Name</span>
              <p className="font-medium">{data.director.fullName}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Briefcase className="size-3" /> Position
              </span>
              <p>{data.director.position}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3" /> Date of Birth
              </span>
              <p>
                {new Date(data.director.dateOfBirth).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "long", year: "numeric" }
                )}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="size-3" /> Email
              </span>
              <p>{data.director.email}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="size-3" /> Phone
              </span>
              <p>{data.director.phone}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="size-3" /> Residential Address
              </span>
              <p>{data.director.residentialAddress}</p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-muted/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="size-4 text-[#0ea5e9]" />
            <h3 className="font-semibold text-sm">KYC Documents</h3>
          </div>

          <div className="space-y-2 text-sm">
            {data.documents.idDocument && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span className="text-xs text-muted-foreground">
                  Photo ID:{" "}
                  <strong className="text-foreground">
                    {data.documents.idDocument.name}
                  </strong>
                </span>
              </div>
            )}
            {data.documents.addressProof && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span className="text-xs text-muted-foreground">
                  Proof of Address:{" "}
                  <strong className="text-foreground">
                    {data.documents.addressProof.name}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-muted/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="size-4 text-[#0ea5e9]" />
            <h3 className="font-semibold text-sm">Account</h3>
          </div>

          <div className="text-sm">
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 text-muted-foreground" />
              <span>{data.account.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span className="text-xs text-muted-foreground">
                Terms of Service accepted
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span className="text-xs text-muted-foreground">
                Privacy Policy accepted
              </span>
            </div>
          </div>
        </div>

        {/* Agreement Details */}
        <div className="bg-muted/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="size-4 text-[#0ea5e9]" />
            <h3 className="font-semibold text-sm">Service Agreement</h3>
          </div>

          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span className="text-xs text-muted-foreground">
                Agreement reviewed and accepted
              </span>
            </div>
            <div className="flex items-center gap-2">
              {data.agreement.signatureType === "typed" ? (
                <Type className="size-3.5 text-[#0ea5e9]" />
              ) : (
                <Pen className="size-3.5 text-[#0ea5e9]" />
              )}
              <span className="text-xs text-muted-foreground">
                Signed by:{" "}
                <strong className="text-foreground">
                  {data.agreement.signerName}
                </strong>{" "}
                ({data.agreement.signatureType === "typed" ? "Typed" : "Hand-drawn"} signature)
              </span>
            </div>

            {/* Typed signature preview */}
            {data.agreement.signatureType === "typed" && (
              <div className="mt-2 bg-white dark:bg-gray-900 border border-[var(--mmk-border)] rounded-lg p-3 text-center">
                <p
                  className="text-lg italic text-[#0c2d42] dark:text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {data.agreement.signatureData}
                </p>
              </div>
            )}

            {/* Drawn signature preview */}
            {data.agreement.signatureType === "drawn" &&
              data.agreement.signatureData.startsWith("data:") && (
                <div className="mt-2 bg-white dark:bg-gray-900 border border-[var(--mmk-border)] rounded-lg p-3 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.agreement.signatureData}
                    alt="Signature"
                    className="h-16 object-contain"
                  />
                </div>
              )}
          </div>
        </div>

        {/* Payment info */}
        <div className="bg-gradient-to-r from-[#0ea5e9]/10 to-[#38bdf8]/10 border border-[#0ea5e9]/20 rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/15 flex items-center justify-center flex-shrink-0">
            <CreditCard className="size-5 text-[#0ea5e9]" />
          </div>
          <div>
            <p className="font-semibold text-sm">
              Pay £75 — Annual Service Fee
            </p>
            <p className="text-xs text-[var(--mmk-text-secondary)] mt-0.5">
              After submitting, you will be securely redirected to Stripe to
              complete payment. Your application will be reviewed by our admin
              team once payment is confirmed. If your application is not
              approved, you will receive a full automatic refund.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
            <AlertTriangle className="size-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            className="rounded-full px-6 gap-2 border-[var(--mmk-border)]"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold px-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="size-4" />
                Submit & Pay £75
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
