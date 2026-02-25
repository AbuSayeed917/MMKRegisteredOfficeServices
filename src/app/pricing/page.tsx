import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";
import { PricingSection } from "@/components/layout/sections/pricing";
import { FAQSection } from "@/components/layout/sections/faq";
import { CTASection } from "@/components/layout/sections/cta";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Check, CreditCard, Building } from "lucide-react";

export const metadata = {
  title: "Pricing - MMK Accountants Registered Office Service",
  description:
    "Simple, transparent pricing for your registered office address. £75 per year, everything included.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <PricingSection />

      {/* Payment Methods Detail */}
      <section className="py-16">
        <div className="container">
          <h2 className="section-heading text-2xl text-center mb-8">
            Payment <span className="font-display italic text-[#0ea5e9]">Methods</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <Card className="bg-card border-[var(--mmk-border-light)] rounded-2xl card-hover">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
                    <CreditCard className="size-5 text-[#0ea5e9]" />
                  </div>
                  <h3 className="font-semibold">Card Payment</h3>
                </div>
                <p className="mb-4 text-sm text-[var(--mmk-text-secondary)] leading-relaxed">
                  Pay immediately with your debit or credit card. We accept Visa,
                  Mastercard, and American Express.
                </p>
                <ul className="space-y-2">
                  {["Instant payment confirmation", "3D Secure authentication", "Secure processing via Stripe"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="size-3.5 text-[#0ea5e9] shrink-0" />
                      <span className="text-[var(--mmk-text-secondary)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-[var(--mmk-border-light)] rounded-2xl card-hover">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
                    <Building className="size-5 text-[#0ea5e9]" />
                  </div>
                  <h3 className="font-semibold">Direct Debit (BACS)</h3>
                </div>
                <p className="mb-4 text-sm text-[var(--mmk-text-secondary)] leading-relaxed">
                  Set up an annual Direct Debit for hassle-free automatic renewals.
                  Payment is collected via BACS.
                </p>
                <ul className="space-y-2">
                  {["Automatic annual collection", "Direct Debit Guarantee protection", "Cancel anytime from your dashboard"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="size-3.5 text-[#0ea5e9] shrink-0" />
                      <span className="text-[var(--mmk-text-secondary)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 text-center bg-section-alt">
        <div className="container">
          <h2 className="section-heading text-2xl mb-3">
            Coming <span className="font-display italic text-[#0ea5e9]">Soon</span>
          </h2>
          <p className="mb-8 text-[var(--mmk-text-secondary)]">
            Additional services to enhance your experience.
          </p>
          <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
            {["Mail scanning & forwarding", "Companies House API filing", "Multi-location support"].map((item) => (
              <Card key={item} className="border-dashed border-[var(--mmk-border)] bg-card/50 rounded-2xl">
                <CardContent className="p-4 text-center text-sm text-[var(--mmk-text-secondary)]">
                  {item}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/register"
              className="btn-accent inline-flex items-center text-base"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      <FAQSection />
      <CTASection />
      <FooterSection />
    </>
  );
}
