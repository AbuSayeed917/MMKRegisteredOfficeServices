"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { FloatingParticles } from "@/components/ui/animated-svg";

export const CTASection = () => {
  return (
    <section id="cta" className="py-24 sm:py-32">
      <div className="container">
        <ScrollReveal>
          <div className="relative overflow-hidden cta-gradient rounded-3xl p-12 md:p-20 text-center">
            {/* Mesh blobs */}
            <div className="mesh-blob w-[400px] h-[400px] bg-[#0ea5e9] -top-32 -right-32 opacity-10" />
            <div className="mesh-blob w-[300px] h-[300px] bg-[#38bdf8] -bottom-20 -left-20 opacity-10" style={{ animationDelay: "-4s" }} />

            {/* Floating particles */}
            <FloatingParticles className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />

            {/* Background illustration */}
            <div className="absolute -bottom-16 -right-16 w-64 h-64 opacity-[0.04] pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/illustration-approved.svg"
                alt=""
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative z-10">
              <h2 className="section-heading text-3xl md:text-4xl lg:text-5xl text-white mb-6">
                Ready to Get Your{" "}
                <span className="font-display italic text-[#38bdf8]">
                  Registered Office?
                </span>
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-[#7a9eb5] mb-10">
                Join 75+ businesses who trust MMK Accountants with their
                registered office needs. Register online in minutes and get started
                for just £75 per year.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="btn-accent inline-flex items-center justify-center text-base px-8 py-4 group"
                >
                  Register Now — £75/year
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#contact"
                  className="btn-outline inline-flex items-center justify-center text-base px-8 py-4 text-white border-white/20 hover:border-[#38bdf8] hover:bg-[#38bdf8]/10"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
