"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanySearch } from "@/components/forms/company-search";
import {
  Building2,
  ArrowRight,
  Calendar,
  Hash,
  MapPin,
  Phone,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import type {
  BusinessDetailsFormData,
  CompanyProfileResponse,
  CompanyOfficer,
} from "@/types/companies-house";

interface BusinessDetailsStepProps {
  data: BusinessDetailsFormData;
  onUpdate: (data: BusinessDetailsFormData, officers?: CompanyOfficer[]) => void;
  onNext: () => void;
}

// Helper to format address from API response
function formatAddress(address: CompanyProfileResponse["registered_office_address"]): string {
  const parts = [
    address.premises,
    address.address_line_1,
    address.address_line_2,
    address.locality,
    address.region,
    address.postal_code,
    address.country,
  ].filter(Boolean);
  return parts.join(", ");
}

// Humanize company type
function humanizeType(type: string): string {
  const map: Record<string, string> = {
    ltd: "Private Limited Company (Ltd)",
    plc: "Public Limited Company (PLC)",
    llp: "Limited Liability Partnership (LLP)",
    "limited-partnership": "Limited Partnership",
    "private-limited-guarant-nsc": "Private Limited by Guarantee",
    "private-unlimited": "Private Unlimited Company",
    "scottish-partnership": "Scottish Partnership",
    "old-public-company": "Old Public Company",
  };
  return map[type] || type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function BusinessDetailsStep({
  data,
  onUpdate,
  onNext,
}: BusinessDetailsStepProps) {
  const [selectedCompany, setSelectedCompany] = useState<{
    name: string;
    number: string;
  } | null>(
    data.companyNumber
      ? { name: data.companyName, number: data.companyNumber }
      : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCompanySelect = (profile: CompanyProfileResponse) => {
    const addressStr = formatAddress(profile.registered_office_address);

    setSelectedCompany({
      name: profile.company_name,
      number: profile.company_number,
    });

    onUpdate(
      {
        ...data,
        companyName: profile.company_name,
        companyNumber: profile.company_number,
        companyType: profile.type,
        companyStatus: profile.company_status,
        incorporationDate: profile.date_of_creation || "",
        sicCodes: profile.sic_codes || [],
        registeredAddress: addressStr,
      },
      profile.officers
    );

    setErrors({});
  };

  const handleClear = () => {
    setSelectedCompany(null);
    onUpdate({
      companyName: "",
      companyNumber: "",
      companyType: "",
      companyStatus: "",
      incorporationDate: "",
      sicCodes: [],
      registeredAddress: "",
      tradingAddress: data.tradingAddress,
      phone: data.phone,
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!data.companyNumber.trim()) {
      newErrors.companyNumber = "Company number (CRN) is required";
    }
    if (!data.companyType.trim()) {
      newErrors.companyType = "Company type is required";
    }
    if (data.companyStatus && data.companyStatus !== "active") {
      newErrors.companyStatus =
        "Only active companies can register for this service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const isCompanySelected = !!selectedCompany;

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-[var(--mmk-border-light)] rounded-2xl shadow-lg overflow-hidden">
        {/* Accent top */}
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />

        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
              <Building2 className="size-5 text-[#0ea5e9]" />
            </div>
            Business Details
          </CardTitle>
          <p className="text-sm text-[var(--mmk-text-secondary)]">
            Search Companies House to find and auto-fill your company
            information.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Companies House Search */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Hash className="size-3.5 text-[#0ea5e9]" />
              Find Your Company
            </Label>
            <CompanySearch
              onCompanySelect={handleCompanySelect}
              onClear={handleClear}
              selectedCompany={selectedCompany}
            />
            <p className="text-xs text-muted-foreground">
              Search by company name or CRN number. Details will be filled
              automatically from Companies House.
            </p>
          </div>

          {/* Company info card (shown after selection) */}
          {isCompanySelected && (
            <div className="bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Info className="size-4 text-[#0ea5e9]" />
                <span className="text-sm font-semibold text-[#0ea5e9]">
                  Company Details from Companies House
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Company Name
                  </Label>
                  <p className="font-semibold">{data.companyName}</p>
                </div>

                {/* CRN */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Company Number (CRN)
                  </Label>
                  <p className="font-mono text-sm">{data.companyNumber}</p>
                </div>

                {/* Company Type */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Company Type
                  </Label>
                  <p className="text-sm">{humanizeType(data.companyType)}</p>
                </div>

                {/* Status */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Status
                  </Label>
                  <div className="flex items-center gap-2">
                    {data.companyStatus === "active" ? (
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 gap-1">
                        <CheckCircle2 className="size-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                        <AlertTriangle className="size-3" />
                        {data.companyStatus?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    )}
                  </div>
                  {errors.companyStatus && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.companyStatus}
                    </p>
                  )}
                </div>

                {/* Incorporation Date */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="size-3" />
                    Incorporation Date
                  </Label>
                  <p className="text-sm">
                    {data.incorporationDate
                      ? new Date(data.incorporationDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </p>
                </div>

                {/* SIC Codes */}
                {data.sicCodes.length > 0 && (
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Briefcase className="size-3" />
                      SIC Code(s)
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {data.sicCodes.map((code) => (
                        <Badge
                          key={code}
                          variant="secondary"
                          className="text-xs font-mono"
                        >
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registered Address */}
                {data.registeredAddress && (
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="size-3" />
                      Current Registered Address
                    </Label>
                    <p className="text-sm">{data.registeredAddress}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This will be changed to our MMK office address once your
                      application is approved.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Manual fields that aren't auto-filled */}
          <div className="space-y-4 pt-2">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Trading Address */}
              <div className="sm:col-span-2 space-y-2">
                <Label
                  htmlFor="tradingAddress"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <MapPin className="size-3.5 text-[#0ea5e9]" />
                  Trading Address
                  <span className="text-xs text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="tradingAddress"
                  placeholder="Your day-to-day business address (if different)"
                  value={data.tradingAddress}
                  onChange={(e) =>
                    onUpdate({ ...data, tradingAddress: e.target.value })
                  }
                  className="rounded-xl border-[var(--mmk-border)]"
                />
              </div>

              {/* Phone */}
              <div className="sm:col-span-2 space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Phone className="size-3.5 text-[#0ea5e9]" />
                  Business Phone Number
                  <span className="text-xs text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+44 1234 567890"
                  value={data.phone}
                  onChange={(e) =>
                    onUpdate({ ...data, phone: e.target.value })
                  }
                  className="rounded-xl border-[var(--mmk-border)]"
                />
              </div>
            </div>
          </div>

          {/* Validation errors summary */}
          {Object.keys(errors).length > 0 && !errors.companyStatus && (
            <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
              <AlertTriangle className="size-4 mt-0.5 flex-shrink-0" />
              <div>
                Please search for and select your company from Companies House
                before continuing.
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold px-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 gap-2"
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
