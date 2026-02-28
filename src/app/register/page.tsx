"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";
import { BusinessDetailsStep } from "@/components/forms/registration/business-details-step";
import { DirectorDetailsStep } from "@/components/forms/registration/director-details-step";
import { DocumentUploadStep } from "@/components/forms/registration/document-upload-step";
import { AccountCreationStep } from "@/components/forms/registration/account-creation-step";
import { AgreementStep } from "@/components/forms/registration/agreement-step";
import { ReviewStep } from "@/components/forms/registration/review-step";
import {
  Building2,
  UserCircle,
  ShieldCheck,
  KeyRound,
  FileText,
  Eye,
  Check,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { BusinessDetailsFormData, CompanyOfficer } from "@/types/companies-house";
import type { DocumentUploadData } from "@/components/forms/registration/document-upload-step";

interface DirectorFormData {
  fullName: string;
  position: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  residentialAddress: string;
}

interface AccountFormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

interface AgreementFormData {
  agreed: boolean;
  signatureType: "typed" | "drawn" | "";
  signatureData: string;
  signerName: string;
}

export interface RegistrationData {
  business: BusinessDetailsFormData;
  director: DirectorFormData;
  documents: DocumentUploadData;
  account: AccountFormData;
  agreement: AgreementFormData;
}

const steps = [
  { label: "Business Details", icon: Building2 },
  { label: "Director Details", icon: UserCircle },
  { label: "Upload Documents", icon: ShieldCheck },
  { label: "Create Account", icon: KeyRound },
  { label: "Agreement", icon: FileText },
  { label: "Review & Pay", icon: Eye },
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RegistrationData>({
    business: {
      companyName: "",
      companyNumber: "",
      companyType: "",
      companyStatus: "",
      incorporationDate: "",
      sicCodes: [],
      registeredAddress: "",
      tradingAddress: "",
      phone: "",
    },
    director: {
      fullName: "",
      position: "Director",
      dateOfBirth: "",
      email: "",
      phone: "",
      residentialAddress: "",
    },
    documents: {
      idDocument: null,
      addressProof: null,
    },
    account: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      acceptPrivacy: false,
    },
    agreement: {
      agreed: false,
      signatureType: "",
      signatureData: "",
      signerName: "",
    },
  });

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const updateBusinessData = (data: BusinessDetailsFormData, officers?: CompanyOfficer[]) => {
    setFormData((prev) => {
      const updated = { ...prev, business: data };

      // Auto-fill director details from the first active director/officer
      if (officers && officers.length > 0) {
        const director = officers.find(
          (o) => o.role === "director" || o.role === "llp-member"
        ) || officers[0];

        // Companies House returns names as "SURNAME, Forenames"
        const nameParts = director.name.split(", ");
        const formattedName =
          nameParts.length === 2
            ? `${nameParts[1]} ${nameParts[0].charAt(0)}${nameParts[0].slice(1).toLowerCase()}`
            : director.name;

        const roleMap: Record<string, string> = {
          director: "Director",
          secretary: "Company Secretary",
          "llp-member": "LLP Member",
          "llp-designated-member": "LLP Designated Member",
          "corporate-director": "Corporate Director",
          "corporate-secretary": "Corporate Secretary",
          "corporate-nominee-director": "Corporate Nominee Director",
          "corporate-nominee-secretary": "Corporate Nominee Secretary",
          "judicial-factor": "Judicial Factor",
          "nominee-director": "Nominee Director",
          "nominee-secretary": "Nominee Secretary",
        };

        updated.director = {
          ...prev.director,
          fullName: formattedName,
          position: roleMap[director.role] || director.role.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          residentialAddress: director.address || prev.director.residentialAddress,
          dateOfBirth: director.date_of_birth
            ? `${director.date_of_birth.year}-${String(director.date_of_birth.month).padStart(2, "0")}-01`
            : prev.director.dateOfBirth,
        };
      }

      return updated;
    });
  };

  const updateDirectorData = (data: DirectorFormData) => {
    setFormData((prev) => ({ ...prev, director: data }));
  };

  const updateDocumentData = (data: DocumentUploadData) => {
    setFormData((prev) => ({ ...prev, documents: data }));
  };

  const updateAccountData = (data: AccountFormData) => {
    setFormData((prev) => ({ ...prev, account: data }));
  };

  const updateAgreementData = (data: AgreementFormData) => {
    setFormData((prev) => ({ ...prev, agreement: data }));
  };

  return (
    <>
      <Navbar />
      <section className="py-16 md:py-24 min-h-[80vh] px-4 sm:px-6">
        <div className="w-full max-w-4xl mx-auto">
          <ScrollReveal>
            {/* Header */}
            <div className="text-center mb-10">
              <span className="section-label mb-3 block">
                Registration
              </span>
              <h1 className="section-heading text-2xl md:text-3xl mb-3">
                Register Your{" "}
                <span className="font-display italic text-[#0ea5e9]">
                  Company
                </span>
              </h1>
              <p className="text-[var(--mmk-text-secondary)] max-w-lg mx-auto">
                Set up your registered office service in minutes. Search
                Companies House to auto-fill your business details.
              </p>
            </div>
          </ScrollReveal>

          {/* Step Progress - Mobile: compact bar */}
          <div className="mb-10">
            {/* Mobile: compact step indicator */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = steps[currentStep].icon;
                    return (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] flex items-center justify-center text-[#0c2d42] shadow-md">
                        <Icon className="size-4" />
                      </div>
                    );
                  })()}
                  <div>
                    <p className="text-sm font-semibold">{steps[currentStep].label}</p>
                    <p className="text-xs text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      index < currentStep
                        ? "bg-emerald-500"
                        : index === currentStep
                        ? "bg-[#0ea5e9]"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop: full step indicators */}
            <div className="hidden sm:flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isCompleted
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            : isCurrent
                            ? "bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] shadow-lg shadow-[#0ea5e9]/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="size-5" />
                        ) : (
                          <Icon className="size-5" />
                        )}
                        <span
                          className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            isCompleted
                              ? "bg-emerald-600 text-white"
                              : isCurrent
                              ? "bg-[#0c2d42] text-[#38bdf8]"
                              : "bg-muted-foreground/20 text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <span
                        className={`mt-2 text-[11px] font-medium text-center leading-tight ${
                          isCurrent
                            ? "text-[#0ea5e9]"
                            : isCompleted
                            ? "text-emerald-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div className="w-10 md:w-14 h-[2px] mx-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            index < currentStep
                              ? "bg-emerald-500"
                              : "bg-muted"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 0 && (
              <BusinessDetailsStep
                data={formData.business}
                onUpdate={updateBusinessData}
                onNext={goNext}
              />
            )}
            {currentStep === 1 && (
              <DirectorDetailsStep
                data={formData.director}
                onUpdate={updateDirectorData}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStep === 2 && (
              <DocumentUploadStep
                data={formData.documents}
                directorName={formData.director.fullName}
                onUpdate={updateDocumentData}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStep === 3 && (
              <AccountCreationStep
                data={formData.account}
                directorEmail={formData.director.email}
                onUpdate={updateAccountData}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStep === 4 && (
              <AgreementStep
                data={formData.agreement}
                companyName={formData.business.companyName}
                companyNumber={formData.business.companyNumber}
                directorName={formData.director.fullName}
                onUpdate={updateAgreementData}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStep === 5 && (
              <ReviewStep
                data={formData}
                onBack={goBack}
              />
            )}
          </div>

          {/* Already have an account */}
          <div className="text-center mt-8">
            <p className="text-sm text-[var(--mmk-text-secondary)]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#0ea5e9] hover:text-[#38bdf8] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
