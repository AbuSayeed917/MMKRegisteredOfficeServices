"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Signature, CreditCard, LayoutDashboard, Bell, Lock, RefreshCcw } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const featureList = [
  {
    icon: Signature,
    title: "Digital Agreement Signing",
    description:
      "Sign your service agreement electronically with our secure signature pad. No printing, scanning, or posting required.",
  },
  {
    icon: CreditCard,
    title: "Secure Online Payment",
    description:
      "Pay securely via card or set up annual BACS Direct Debit through Stripe. Automatic renewal reminders at 60, 30, and 7 days.",
  },
  {
    icon: LayoutDashboard,
    title: "Client Dashboard",
    description:
      "Access your account anytime — view your agreement, download invoices, update business details, and track your subscription.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Stay informed with email and in-app notifications for payment receipts, renewal reminders, and mail received at your address.",
  },
  {
    icon: Lock,
    title: "GDPR Compliant & Secure",
    description:
      "Your data is encrypted at rest and in transit. We follow strict GDPR compliance with secure document storage.",
  },
  {
    icon: RefreshCcw,
    title: "Automatic Renewals",
    description:
      "Direct Debit clients enjoy hassle-free automatic annual renewals. Card clients receive timely reminders with easy payment links.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 sm:py-32 bg-section-alt overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/illustration-dashboard.svg"
          alt=""
          className="w-full h-full"
        />
      </div>

      <div className="container relative z-10">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="section-label mb-4 block">02 — Platform Features</span>
            <h2 className="section-heading text-3xl md:text-4xl mb-4">
              Everything You{" "}
              <span className="font-display italic text-[#0ea5e9]">Need</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-[var(--mmk-text-secondary)]">
              Our platform makes managing your registered office address simple,
              secure, and completely digital.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map(({ icon: Icon, title, description }, index) => (
            <ScrollReveal key={title} delay={index * 100} direction="up">
              <Card
                className="relative overflow-hidden card-hover bg-card border-[var(--mmk-border-light)] rounded-2xl group h-full"
              >
                {/* Hover glow background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/0 to-[#38bdf8]/0 group-hover:from-[#0ea5e9]/[0.02] group-hover:to-[#38bdf8]/[0.04] transition-all duration-700" />
                <CardHeader className="pb-2 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center mb-3 group-hover:bg-[#0ea5e9]/20 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all duration-500">
                    <Icon className="size-5 text-[#0ea5e9] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[var(--mmk-text-secondary)] leading-relaxed relative">
                  {description}
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
