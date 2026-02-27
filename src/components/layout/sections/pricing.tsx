"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-section-alt">
      <div className="container">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="section-label mb-4 block">Pricing</span>
            <h2 className="section-heading text-3xl md:text-4xl mb-4">
              Simple, Transparent{" "}
              <span className="font-display italic text-[#0ea5e9]">Pricing</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-[var(--mmk-text-secondary)]">
              One plan. Everything included. No hidden fees.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Card Payment */}
          <ScrollReveal delay={0} direction="up">
            <Card className="bg-card border-[var(--mmk-border-light)] rounded-2xl card-hover h-full">
              <CardHeader>
                <CardTitle className="text-lg">Card Payment</CardTitle>
                <CardDescription>
                  Pay immediately with your debit or credit card via Stripe.
                </CardDescription>
                <div className="pt-2">
                  <span className="text-4xl font-bold">£75</span>
                  <span className="text-sm text-[var(--mmk-text-secondary)]"> /year</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Instant payment confirmation",
                    "Visa, Mastercard & Amex accepted",
                    "3D Secure authentication",
                    "Email receipt & invoice",
                    "Manual renewal each year",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Check className="size-4 text-[#0ea5e9] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full rounded-full border-[var(--mmk-border)] hover:border-[#0ea5e9] hover:bg-[#0ea5e9]/5 transition-all">
                  <Link href="/register">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          </ScrollReveal>

          {/* Recommended - Direct Debit */}
          <ScrollReveal delay={150} direction="up">
            <Card className="relative border-[#0ea5e9] shadow-lg rounded-2xl lg:scale-105 card-hover h-full group">
              {/* Recommended badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] text-xs font-semibold px-4 py-1.5 rounded-full shadow-md inline-flex items-center gap-1.5">
                  <Sparkles className="size-3" />
                  Recommended
                </span>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "0 0 40px rgba(14, 165, 233, 0.15)" }} />

              <CardHeader>
                <CardTitle className="text-lg">Direct Debit (BACS)</CardTitle>
                <CardDescription>
                  Set up annual Direct Debit for hassle-free automatic renewals.
                </CardDescription>
                <div className="pt-2">
                  <span className="text-4xl font-bold">£75</span>
                  <span className="text-sm text-[var(--mmk-text-secondary)]"> /year</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Automatic annual renewal",
                    "Direct Debit Guarantee protection",
                    "Cancel anytime from dashboard",
                    "Email receipt & invoice",
                    "Never miss a renewal date",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Check className="size-4 text-[#0ea5e9] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <Link href="/register">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          </ScrollReveal>

          {/* What's Included */}
          <ScrollReveal delay={300} direction="up">
            <Card className="bg-card border-[var(--mmk-border-light)] rounded-2xl card-hover h-full">
              <CardHeader>
                <CardTitle className="text-lg">What&apos;s Included</CardTitle>
                <CardDescription>
                  Every plan includes the full registered office service.
                </CardDescription>
                <div className="pt-2">
                  <span className="text-4xl font-bold">All-in-One</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Official Companies House address",
                    "HMRC correspondence handling",
                    "Mail notification within 2 days",
                    "Digital agreement & signature",
                    "Online client dashboard",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Check className="size-4 text-[#0ea5e9] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full rounded-full border-[var(--mmk-border)] hover:border-[#0ea5e9] hover:bg-[#0ea5e9]/5 transition-all">
                  <Link href="/pricing">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
