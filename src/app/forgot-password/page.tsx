"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <section className="flex flex-1 items-center justify-center py-24 md:py-32 min-h-[80vh]">
        <div className="container max-w-md">
          <Card className="border-[var(--mmk-border-light)] rounded-2xl shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] flex items-center justify-center text-[#0c2d42] font-bold text-2xl shadow-md">
                M
              </div>
              <CardTitle className="text-xl">
                {sent ? "Check Your Email" : "Forgot Password"}
              </CardTitle>
              <p className="text-sm text-[var(--mmk-text-secondary)]">
                {sent
                  ? "We've sent a password reset link to your email"
                  : "Enter your email to receive a password reset link"}
              </p>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center space-y-4">
                  <CheckCircle2 className="size-12 text-emerald-500 mx-auto" />
                  <p className="text-sm text-[var(--mmk-text-secondary)]">
                    If an account exists with <strong>{email}</strong>, you will
                    receive an email with instructions to reset your password.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0ea5e9] hover:text-[#38bdf8] transition-colors"
                  >
                    <ArrowLeft className="size-3.5" />
                    Back to Sign In
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>

                  <p className="text-center text-sm text-[var(--mmk-text-secondary)]">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 font-medium text-[#0ea5e9] hover:text-[#38bdf8] transition-colors"
                    >
                      <ArrowLeft className="size-3.5" />
                      Back to Sign In
                    </Link>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
