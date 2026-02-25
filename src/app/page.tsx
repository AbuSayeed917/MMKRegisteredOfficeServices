import { BenefitsSection } from "@/components/layout/sections/benefits";
import { CTASection } from "@/components/layout/sections/cta";
import { ContactSection } from "@/components/layout/sections/contact";
import { FAQSection } from "@/components/layout/sections/faq";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { HowItWorksSection } from "@/components/layout/sections/how-it-works";
import { PricingSection } from "@/components/layout/sections/pricing";
import { ServicesSection } from "@/components/layout/sections/services";
import { TestimonialSection } from "@/components/layout/sections/testimonial";
import { Navbar } from "@/components/layout/navbar";

export const metadata = {
  title: "MMK Accountants - Registered Office Service",
  description:
    "Professional registered office address service for your business. Use our Luton office as your Companies House registered address for just £75/year.",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialSection />
      <CTASection />
      <PricingSection />
      <ContactSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
