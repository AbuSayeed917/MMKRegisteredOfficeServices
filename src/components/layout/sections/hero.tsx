"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Building2, Shield, Users, Clock, ArrowRight } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-svg";

export const HeroSection = () => {
  return (
    <section className="relative flex items-center overflow-hidden" style={{ backgroundColor: "#e2f2f5" }}>
      {/* Content */}
      <div className="container relative z-10 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div>
            {/* Badge */}
            <Badge className="mb-6 bg-[#0ea5e9]/10 text-foreground border-[#0ea5e9]/30 px-4 py-1.5 text-sm font-medium hover:bg-[#0ea5e9]/15">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ea5e9] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0ea5e9]" />
              </span>
              Trusted by 75+ Businesses
            </Badge>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-foreground mb-6">
              Your Professional{" "}
              <span className="font-display italic">
                Registered Office
              </span>{" "}
              Address
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
              Use our professional Luton office as your Companies House registered
              address. Simple, compliant, and affordable at just £75 per year.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/register"
                className="inline-flex items-center text-sm md:text-base group font-bold rounded-full px-8 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ backgroundColor: "#0ea5e9" }}
              >
                Get Started — £75/year
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center text-sm md:text-base font-bold text-foreground border-2 border-foreground/20 hover:border-foreground/40 hover:bg-white/50 rounded-full px-8 py-3 transition-all duration-300"
              >
                Our Services
              </Link>
            </div>

            {/* Stats with animated counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { icon: Users, value: 75, suffix: "+", label: "Active Clients" },
                { icon: Building2, value: 75, prefix: "£", label: "Per Year" },
                { icon: Shield, value: 100, suffix: "%", label: "Compliant" },
                { icon: Clock, value: 2, suffix: " Days", label: "Mail Notification" },
              ].map(({ icon: Icon, value, suffix, prefix, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-2 rounded-2xl px-3 py-4 bg-white border border-border hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
                    <Icon className="size-5 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">
                      <AnimatedCounter
                        target={value}
                        suffix={suffix || ""}
                        prefix={prefix || ""}
                        duration={2000}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating illustration */}
          <div className="hidden lg:flex justify-center items-center relative">
            {/* Dashboard illustration with float animation */}
            <div className="relative animate-float">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/illustration-office-service.svg"
                alt="MMK Registered Office Service"
                width={500}
                height={375}
                className="w-full max-w-[480px] drop-shadow-2xl"
              />
            </div>

            {/* Floating mini cards */}
            <div className="absolute top-10 -left-4 animate-float-delayed bg-white rounded-2xl p-3 border border-border shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Shield className="size-4 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Verified</div>
                  <div className="text-[10px] text-muted-foreground">Companies House</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-16 -right-4 animate-float bg-white rounded-2xl p-3 border border-border shadow-lg" style={{ animationDelay: "-1.5s" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center">
                  <Building2 className="size-4 text-[#0ea5e9]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">£75/year</div>
                  <div className="text-[10px] text-muted-foreground">All inclusive</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
