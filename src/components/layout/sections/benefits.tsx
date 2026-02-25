"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Shield, Mail, Clock } from "lucide-react";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const benefitList = [
  {
    icon: Building2,
    title: "Professional Address",
    description:
      "Use our established Luton office as your official Companies House registered address, projecting professionalism to clients and partners.",
  },
  {
    icon: Shield,
    title: "Full Compliance",
    description:
      "We ensure your registered office address meets all Companies House and HMRC requirements, keeping your business fully compliant.",
  },
  {
    icon: Mail,
    title: "Mail Notifications",
    description:
      "Receive prompt notifications within 2 business days of any official correspondence from HMRC, Companies House, or statutory bodies.",
  },
  {
    icon: Clock,
    title: "Quick Digital Setup",
    description:
      "Complete your registration online in minutes with digital agreement signing, secure payment, and fast admin approval.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-24 sm:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image + info */}
          <div>
            <ScrollReveal direction="left">
              <span className="section-label mb-4 block">01 — Why Choose Us</span>
              <h2 className="section-heading text-3xl md:text-4xl mb-6">
                Why Choose{" "}
                <span className="font-display italic text-[#0ea5e9]">
                  MMK Accountants?
                </span>
              </h2>
              <p className="text-lg text-[var(--mmk-text-secondary)] leading-relaxed mb-8">
                With over 75 businesses trusting us with their registered office
                needs, we provide a reliable, professional, and fully digital
                service that saves you time and keeps you compliant.
              </p>
            </ScrollReveal>

            {/* Office image with overlay */}
            <ScrollReveal delay={200} direction="up">
              <div className="relative rounded-2xl overflow-hidden group">
                <Image
                  src="/images/about-office.jpg"
                  alt="MMK Accountants Office"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2d42]/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm font-semibold">MMK Accountants</div>
                  <div className="text-xs text-white/70">Luton, United Kingdom</div>
                </div>
                {/* Accent border on hover */}
                <div className="absolute inset-0 border-2 border-[#0ea5e9]/0 group-hover:border-[#0ea5e9]/40 rounded-2xl transition-colors duration-500" />
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Benefit cards */}
          <div className="grid sm:grid-cols-2 gap-5">
            {benefitList.map(({ icon: Icon, title, description }, index) => (
              <ScrollReveal key={title} delay={index * 150} direction="right">
                <Card
                  className="relative overflow-hidden card-hover bg-card border-[var(--mmk-border)] rounded-2xl group h-full"
                >
                  {/* Accent top line */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
                  <CardHeader className="pb-2 pt-6">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center group-hover:bg-[#0ea5e9]/20 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all duration-500">
                        <Icon className="size-5 text-[#0ea5e9]" />
                      </div>
                      <span className="text-4xl font-bold text-[var(--mmk-border)]">
                        0{index + 1}
                      </span>
                    </div>
                    <CardTitle className="text-base mt-3">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-[var(--mmk-text-secondary)] leading-relaxed">
                    {description}
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
