"use client";

import { ClipboardList, Signature, CreditCard, CircleCheck } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const steps = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Register Online",
    description:
      "Complete your business details, upload identification documents, and create your account in our simple step-by-step wizard.",
    illustration: "/images/illustration-register.svg",
  },
  {
    step: "02",
    icon: Signature,
    title: "Sign Agreement",
    description:
      "Review and digitally sign the registered office service agreement. Your signed copy is stored securely and available anytime.",
    illustration: "/images/illustration-agreement.svg",
  },
  {
    step: "03",
    icon: CreditCard,
    title: "Pay Securely",
    description:
      "Pay £75 per year by card or set up an annual Direct Debit via Stripe. Instant confirmation and email receipt.",
    illustration: "/images/illustration-payment.svg",
  },
  {
    step: "04",
    icon: CircleCheck,
    title: "Get Approved",
    description:
      "Our team reviews your application and activates your service. You receive a welcome email with your dashboard access.",
    illustration: "/images/illustration-approved.svg",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-section-alt">
      <div className="container">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="section-label mb-4 block">04 — How It Works</span>
            <h2 className="section-heading text-3xl md:text-4xl mb-4">
              Get Started in{" "}
              <span className="font-display italic text-[#0ea5e9]">
                4 Simple Steps
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-[var(--mmk-text-secondary)]">
              From registration to approval, our fully digital process takes just
              minutes to complete.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line — desktop only */}
          <div className="hidden lg:block absolute top-[140px] left-[12.5%] right-[12.5%] h-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-[#0ea5e9]/20 via-[#0ea5e9]/60 to-[#0ea5e9]/20" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ step, icon: Icon, title, description, illustration }, index) => (
              <ScrollReveal key={step} delay={index * 200} direction="up">
                <div className="relative text-center group">
                  {/* SVG Illustration */}
                  <div className="mx-auto mb-4 w-28 h-28 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={illustration}
                      alt={title}
                      className="w-full h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  {/* Step number circle */}
                  <div className="relative mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_40px_rgba(14,165,233,0.3)] transition-shadow duration-500">
                    <Icon className="size-7 text-[#0c2d42]" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#0c2d42] text-[#38bdf8] text-xs font-bold flex items-center justify-center border-2 border-[#0ea5e9]">
                      {step}
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-[var(--mmk-text-secondary)] leading-relaxed max-w-[240px] mx-auto">
                    {description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
