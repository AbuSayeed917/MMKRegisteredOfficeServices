"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building2, Mail, FileText, Wallet, BadgeCheck, HeadphonesIcon } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const serviceList = [
  {
    icon: Building2,
    title: "Registered Office Address",
    description:
      "Use our Luton office as your official Companies House address for all statutory correspondence.",
    illustration: "/images/illustration-register.svg",
  },
  {
    icon: Mail,
    title: "Mail Receipt & Notification",
    description:
      "We receive your HMRC and Companies House mail and notify you within 2 business days.",
    illustration: "/images/illustration-agreement.svg",
  },
  {
    icon: FileText,
    title: "Digital Agreement Management",
    description:
      "Sign, view, and download your service agreement digitally from your secure dashboard.",
    illustration: "/images/illustration-compliance.svg",
  },
  {
    icon: Wallet,
    title: "Payment Management",
    description:
      "Manage your annual subscription, view payment history, and update payment methods online.",
    illustration: "/images/illustration-payment.svg",
  },
  {
    icon: BadgeCheck,
    title: "Companies House Compliance",
    description:
      "Stay fully compliant with all filing requirements. We handle your registered address obligations.",
    illustration: "/images/illustration-approved.svg",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description:
      "Our team is available Monday to Friday to assist with any queries about your registered office service.",
    illustration: "/images/illustration-dashboard.svg",
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-24 sm:py-32">
      <div className="container">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="section-label mb-4 block">03 — Our Services</span>
            <h2 className="section-heading text-3xl md:text-4xl mb-4">
              What We{" "}
              <span className="font-display italic text-[#0ea5e9]">Provide</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-[var(--mmk-text-secondary)]">
              A comprehensive registered office service designed for modern businesses.
              Everything managed digitally, no paperwork required.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {serviceList.map(({ icon: Icon, title, description, illustration }, index) => (
            <ScrollReveal key={title} delay={index * 100} direction="up">
              <Card
                className="relative overflow-hidden card-hover bg-card border-[var(--mmk-border-light)] rounded-2xl group h-full"
              >
                {/* Accent top line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Background illustration (subtle) */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={illustration}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>

                <CardContent className="p-6 relative">
                  <div className="w-14 h-14 rounded-2xl bg-[#0ea5e9]/10 flex items-center justify-center mb-4 group-hover:bg-[#0ea5e9]/20 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all duration-500">
                    <Icon className="size-6 text-[#0ea5e9] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-[var(--mmk-text-secondary)] leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
