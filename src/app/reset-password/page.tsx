"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-destructive">
          Invalid reset link. Please request a new password reset.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0ea5e9] hover:text-[#38bdf8] transition-colors"
        >
          Request New Reset Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="size-12 text-emerald-500 mx-auto" />
        <p className="text-sm font-medium">Password reset successfully!</p>
        <p className="text-sm text-[var(--mmk-text-secondary)]">
          You can now sign in with your new password.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold py-2.5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          New Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Min 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="rounded-xl border-[var(--mmk-border)]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          className="rounded-xl border-[var(--mmk-border)]"
        />
      </div>

      <Button
        type="submit"
        className="w-full rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Resetting...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>

      <p className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0ea5e9] hover:text-[#38bdf8] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Sign In
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <section className="flex flex-1 items-center justify-center px-4 sm:px-6 py-16 md:py-32 min-h-[80vh]">
        <div className="w-full max-w-md">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] flex items-center justify-center text-[#0c2d42] font-bold text-2xl shadow-md">
                M
              </div>
              <CardTitle className="text-xl">Reset Password</CardTitle>
              <p className="text-sm text-[var(--mmk-text-secondary)]">
                Enter your new password below
              </p>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading...</div>}>
                <ResetPasswordForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
