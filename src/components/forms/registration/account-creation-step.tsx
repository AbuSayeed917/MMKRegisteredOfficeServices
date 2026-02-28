"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

interface AccountFormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

interface AccountCreationStepProps {
  data: AccountFormData;
  directorEmail: string;
  onUpdate: (data: AccountFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

interface PasswordStrength {
  score: number; // 0-5
  label: string;
  color: string;
  checks: {
    minLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

function PasswordCheck({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {met ? (
        <CheckCircle2 className="size-3.5 text-emerald-500" />
      ) : (
        <XCircle className="size-3.5 text-muted-foreground/40" />
      )}
      <span
        className={
          met
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-muted-foreground"
        }
      >
        {label}
      </span>
    </div>
  );
}

function evaluatePassword(password: string): PasswordStrength {
  const checks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const labels: Record<number, { label: string; color: string }> = {
    0: { label: "Very Weak", color: "bg-red-500" },
    1: { label: "Weak", color: "bg-red-400" },
    2: { label: "Fair", color: "bg-amber-500" },
    3: { label: "Good", color: "bg-amber-400" },
    4: { label: "Strong", color: "bg-emerald-400" },
    5: { label: "Excellent", color: "bg-emerald-500" },
  };

  return {
    score,
    label: labels[score].label,
    color: labels[score].color,
    checks,
  };
}

export function AccountCreationStep({
  data,
  directorEmail,
  onUpdate,
  onNext,
  onBack,
}: AccountCreationStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-fill email from director details
  const email = data.email || directorEmail;

  const passwordStrength = useMemo(
    () => evaluatePassword(data.password),
    [data.password]
  );

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

    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      checkTimeoutRef.current = setTimeout(() => {
        checkEmailAvailability(email);
      }, 600);
    }

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [email, checkEmailAvailability]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (emailAvailable === false) {
      newErrors.email = "An account with this email already exists";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (passwordStrength.score < 3) {
      newErrors.password =
        "Password is too weak. Please use a stronger password.";
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!data.acceptTerms) {
      newErrors.acceptTerms = "You must accept the Terms of Service";
    }

    if (!data.acceptPrivacy) {
      newErrors.acceptPrivacy = "You must accept the Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Make sure email is stored
    if (!data.email && directorEmail) {
      onUpdate({ ...data, email: directorEmail });
    }

    // If email hasn't been checked yet, check it now before proceeding
    if (emailAvailable === null && email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailChecking(true);
      try {
        const res = await fetch("/api/register/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.toLowerCase().trim() }),
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
        // If check fails, let the backend handle it
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

  const updateField = (
    field: keyof AccountFormData,
    value: string | boolean
  ) => {
    onUpdate({ ...data, email: email, [field]: value });
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
              <KeyRound className="size-5 text-[#0ea5e9]" />
            </div>
            Create Your Account
          </CardTitle>
          <p className="text-sm text-[var(--mmk-text-secondary)]">
            Set up your login credentials to access your dashboard and manage
            your registered office service.
          </p>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="accountEmail"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Mail className="size-3.5 text-[#0ea5e9]" />
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="accountEmail"
                type="email"
                placeholder="you@company.com"
                value={email}
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
            {!errors.email && !emailChecking && emailAvailable === null && email && (
              <p className="text-xs text-muted-foreground">
                This will be your login email. A verification code will be sent
                after registration.
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Lock className="size-3.5 text-[#0ea5e9]" />
              Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={data.password}
                onChange={(e) => updateField("password", e.target.value)}
                className={`rounded-xl border-[var(--mmk-border)] pr-10 ${
                  errors.password ? "border-destructive" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}

            {/* Password strength indicator */}
            {data.password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.score >= 4
                        ? "text-emerald-600"
                        : passwordStrength.score >= 3
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  <PasswordCheck
                    met={passwordStrength.checks.minLength}
                    label="8+ characters"
                  />
                  <PasswordCheck
                    met={passwordStrength.checks.hasUpper}
                    label="Uppercase letter"
                  />
                  <PasswordCheck
                    met={passwordStrength.checks.hasLower}
                    label="Lowercase letter"
                  />
                  <PasswordCheck
                    met={passwordStrength.checks.hasNumber}
                    label="Number"
                  />
                  <PasswordCheck
                    met={passwordStrength.checks.hasSpecial}
                    label="Special character"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Lock className="size-3.5 text-[#0ea5e9]" />
              Confirm Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={data.confirmPassword}
                onChange={(e) =>
                  updateField("confirmPassword", e.target.value)
                }
                className={`rounded-xl border-[var(--mmk-border)] pr-10 ${
                  errors.confirmPassword ? "border-destructive" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword}
              </p>
            )}
            {data.confirmPassword &&
              data.password === data.confirmPassword &&
              !errors.confirmPassword && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  Passwords match
                </p>
              )}
          </div>

          {/* Terms & Privacy */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="acceptTerms"
                checked={data.acceptTerms}
                onCheckedChange={(checked) =>
                  updateField("acceptTerms", checked === true)
                }
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor="acceptTerms"
                  className="text-sm cursor-pointer"
                >
                  I agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    className="text-[#0ea5e9] hover:text-[#38bdf8] underline"
                  >
                    Terms of Service
                  </a>{" "}
                  <span className="text-destructive">*</span>
                </Label>
                {errors.acceptTerms && (
                  <p className="text-xs text-destructive mt-0.5">
                    {errors.acceptTerms}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="acceptPrivacy"
                checked={data.acceptPrivacy}
                onCheckedChange={(checked) =>
                  updateField("acceptPrivacy", checked === true)
                }
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor="acceptPrivacy"
                  className="text-sm cursor-pointer"
                >
                  I agree to the{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="text-[#0ea5e9] hover:text-[#38bdf8] underline"
                  >
                    Privacy Policy
                  </a>{" "}
                  <span className="text-destructive">*</span>
                </Label>
                {errors.acceptPrivacy && (
                  <p className="text-xs text-destructive mt-0.5">
                    {errors.acceptPrivacy}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 rounded-xl p-3 text-sm flex items-start gap-2">
            <Shield className="size-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[var(--mmk-text-secondary)]">
              Your password is securely hashed and never stored in plain text.
              We use industry-standard encryption to protect your account.
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
              className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold px-6 sm:px-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 gap-2"
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
