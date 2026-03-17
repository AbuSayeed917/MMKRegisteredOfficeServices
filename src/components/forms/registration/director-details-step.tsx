"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  UserCircle,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

interface DirectorFormData {
  fullName: string;
  position: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  residentialAddress: string;
}

interface DirectorDetailsStepProps {
  data: DirectorFormData;
  onUpdate: (data: DirectorFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DirectorDetailsStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: DirectorDetailsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced email availability check
  const checkEmailAvailability = useCallback(async (emailToCheck: string) => {
    const normalized = emailToCheck.toLowerCase().trim();
    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setEmailAvailable(null);
      return;
    }

    setEmailChecking(true);
    try {
      const res = await fetch("/api/register/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      });
      const result = await res.json();
      setEmailAvailable(result.available);
      if (!result.available) {
        setErrors((prev) => ({
          ...prev,
          email: "An account with this email already exists",
        }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          if (next.email === "An account with this email already exists") {
            delete next.email;
          }
          return next;
        });
      }
    } catch {
      setEmailAvailable(null);
    } finally {
      setEmailChecking(false);
    }
  }, []);

  // Check email when it changes (debounced)
  useEffect(() => {
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    setEmailAvailable(null);

    if (data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      checkTimeoutRef.current = setTimeout(() => {
        checkEmailAvailability(data.email);
      }, 600);
    }

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [data.email, checkEmailAvailability]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!data.position.trim()) {
      newErrors.position = "Position is required";
    }
    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(data.dateOfBirth);
      const age = Math.floor(
        (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );
      if (age < 16) {
        newErrors.dateOfBirth = "Director must be at least 16 years old";
      }
    }
    if (!data.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (emailAvailable === false) {
      newErrors.email = "An account with this email already exists";
    }
    if (!data.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!data.residentialAddress.trim()) {
      newErrors.residentialAddress = "Residential address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If email hasn't been checked yet, check it now before proceeding
    if (emailAvailable === null && data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setEmailChecking(true);
      try {
        const res = await fetch("/api/register/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email.toLowerCase().trim() }),
        });
        const result = await res.json();
        setEmailAvailable(result.available);
        if (!result.available) {
          setErrors((prev) => ({
            ...prev,
            email: "An account with this email already exists",
          }));
          setEmailChecking(false);
          return;
        }
      } catch {
        // If check fails, let later steps handle it
      } finally {
        setEmailChecking(false);
      }
    }

    if (emailAvailable === false) {
      setErrors((prev) => ({
        ...prev,
        email: "An account with this email already exists",
      }));
      return;
    }

    if (validate()) {
      onNext();
    }
  };

  const updateField = (field: keyof DirectorFormData, value: string) => {
    onUpdate({ ...data, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-[var(--mmk-border-light)] rounded-2xl shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />

        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
              <UserCircle className="size-5 text-[#0ea5e9]" />
            </div>
            Director / Officer Details
          </CardTitle>
          <p className="text-sm text-[var(--mmk-text-secondary)]">
            Enter the details of the primary director or officer responsible for
            this registered office service.
          </p>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="text-sm font-medium flex items-center gap-2"
            >
              <UserCircle className="size-3.5 text-[#0ea5e9]" />
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="John Smith"
              value={data.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className={`rounded-xl border-[var(--mmk-border)] ${
                errors.fullName ? "border-destructive" : ""
              }`}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Position */}
            <div className="space-y-2">
              <Label
                htmlFor="position"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Briefcase className="size-3.5 text-[#0ea5e9]" />
                Position <span className="text-destructive">*</span>
              </Label>
              <Input
                id="position"
                placeholder="Director"
                value={data.position}
                onChange={(e) => updateField("position", e.target.value)}
                className={`rounded-xl border-[var(--mmk-border)] ${
                  errors.position ? "border-destructive" : ""
                }`}
              />
              {errors.position && (
                <p className="text-xs text-destructive">{errors.position}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label
                htmlFor="dateOfBirth"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Calendar className="size-3.5 text-[#0ea5e9]" />
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                className={`rounded-xl border-[var(--mmk-border)] ${
                  errors.dateOfBirth ? "border-destructive" : ""
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-destructive">{errors.dateOfBirth}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="directorEmail"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Mail className="size-3.5 text-[#0ea5e9]" />
                Email Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="directorEmail"
                  type="email"
                  placeholder="john@company.com"
                  value={data.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={`rounded-xl border-[var(--mmk-border)] pr-10 ${
                    errors.email
                      ? "border-destructive"
                      : emailAvailable === true
                      ? "border-emerald-400"
                      : ""
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {emailChecking && (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  )}
                  {!emailChecking && emailAvailable === true && (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  )}
                  {!emailChecking && emailAvailable === false && (
                    <XCircle className="size-4 text-destructive" />
                  )}
                </div>
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
              {!errors.email && emailAvailable === true && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  Email is available
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="directorPhone"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Phone className="size-3.5 text-[#0ea5e9]" />
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="directorPhone"
                type="tel"
                placeholder="+44 7700 900000"
                value={data.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={`rounded-xl border-[var(--mmk-border)] ${
                  errors.phone ? "border-destructive" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Residential Address */}
          <div className="space-y-2">
            <Label
              htmlFor="residentialAddress"
              className="text-sm font-medium flex items-center gap-2"
            >
              <MapPin className="size-3.5 text-[#0ea5e9]" />
              Residential Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="residentialAddress"
              placeholder="Full residential address"
              value={data.residentialAddress}
              onChange={(e) =>
                updateField("residentialAddress", e.target.value)
              }
              className={`rounded-xl border-[var(--mmk-border)] ${
                errors.residentialAddress ? "border-destructive" : ""
              }`}
            />
            {errors.residentialAddress && (
              <p className="text-xs text-destructive">
                {errors.residentialAddress}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              This is kept confidential and used for identity verification only.
            </p>
          </div>

          {/* Info note */}
          <div className="bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 rounded-xl p-3 text-sm flex items-start gap-2">
            <AlertTriangle className="size-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" />
            <p className="text-primary dark:text-white/70 text-xs">
              In the next step, you will upload identification documents
              (passport or driving licence) and proof of address for identity
              verification.
            </p>
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
              disabled={emailChecking || emailAvailable === false}
              className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white font-semibold px-6 sm:px-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 gap-2"
            >
              {emailChecking ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
