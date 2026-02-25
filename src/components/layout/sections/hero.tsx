"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Building2, Shield, Users, Clock, ArrowRight } from "lucide-react";
import { AnimatedCounter, FloatingParticles } from "@/components/ui/animated-svg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Background video/image */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay"
          poster="/images/hero-bg.jpg"
        >
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Floating particles SVG overlay */}
      <FloatingParticles className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

      {/* Mesh gradient blobs */}
      <div className="mesh-blob w-[600px] h-[600px] bg-[#0ea5e9] -top-48 -right-48" />
      <div className="mesh-blob w-[500px] h-[500px] bg-[#38bdf8] bottom-0 left-0" style={{ animationDelay: "-5s" }} />
      <div className="mesh-blob w-[350px] h-[350px] bg-[#0284c7] top-1/2 left-1/3" style={{ animationDelay: "-3s" }} />

      {/* Content */}
      <div className="container relative z-10 py-32 md:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div>
            {/* Badge */}
            <Badge className="mb-6 bg-white/10 text-[#38bdf8] border-[#38bdf8]/30 backdrop-blur-sm px-4 py-1.5 text-sm font-medium hover:bg-white/15 animate-fade-in-down">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38bdf8]" />
              </span>
              Trusted by 75+ Businesses
            </Badge>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white mb-6">
              Your Professional{" "}
              <span className="font-display italic bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] bg-clip-text text-transparent">
                Registered Office
              </span>{" "}
              Address
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-[#7a9eb5] max-w-xl mb-10 leading-relaxed">
              Use our professional Luton office as your Companies House registered
              address. Simple, compliant, and affordable at just £75 per year.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-16">
              <Link
                href="/register"
                className="btn-accent inline-flex items-center text-sm md:text-base group"
              >
                Get Started — £75/year
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#services"
                className="btn-outline inline-flex items-center text-sm md:text-base text-white border-[#c0d8e8]/30 hover:border-[#0ea5e9] hover:bg-[#0ea5e9]/10"
              >
                Our Services
              </Link>
            </div>

            {/* Stats with animated counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, value: 75, suffix: "+", label: "Active Clients" },
                { icon: Building2, value: 75, prefix: "£", label: "Per Year" },
                { icon: Shield, value: 100, suffix: "%", label: "Compliant" },
                { icon: Clock, value: 2, suffix: " Days", label: "Mail Notification" },
              ].map(({ icon: Icon, value, suffix, prefix, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10 hover:bg-white/10 hover:border-[#0ea5e9]/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/20 flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-[#38bdf8]" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">
                      <AnimatedCounter
                        target={value}
                        suffix={suffix || ""}
                        prefix={prefix || ""}
                        duration={2000}
                      />
                    </div>
                    <div className="text-xs text-[#7a9eb5]">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating illustration */}
          <div className="hidden lg:flex justify-center items-center relative">
            {/* Glow rings behind illustration */}
            <div className="absolute w-80 h-80 rounded-full border border-[#0ea5e9]/20 animate-pulse-slow" />
            <div className="absolute w-96 h-96 rounded-full border border-[#0ea5e9]/10" />

            {/* Dashboard illustration with float animation */}
            <div className="relative animate-float">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/illustration-dashboard.svg"
                alt="Dashboard Preview"
                width={500}
                height={375}
                className="w-full max-w-[480px] drop-shadow-2xl"
              />
            </div>

            {/* Floating mini cards */}
            <div className="absolute top-10 -left-4 animate-float-delayed bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Shield className="size-4 text-green-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Verified</div>
                  <div className="text-[10px] text-[#7a9eb5]">Companies House</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-16 -right-4 animate-float bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-lg" style={{ animationDelay: "-1.5s" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0ea5e9]/20 flex items-center justify-center">
                  <Building2 className="size-4 text-[#38bdf8]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">£75/year</div>
                  <div className="text-[10px] text-[#7a9eb5]">All inclusive</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
