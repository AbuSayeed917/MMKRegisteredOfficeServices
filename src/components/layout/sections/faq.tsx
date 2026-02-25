"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const FAQList = [
  {
    question: "What is a registered office address?",
    answer:
      "A registered office address is a legal requirement for every UK company. It is the official address filed with Companies House where statutory correspondence, such as letters from HMRC and Companies House, is received. It appears on the public register.",
  },
  {
    question: "Can I use your address for my business?",
    answer:
      "Yes. Our Luton office can serve as your company's registered office address filed with Companies House. This is ideal for businesses that operate from home or co-working spaces and want a professional, fixed address.",
  },
  {
    question: "How much does the service cost?",
    answer:
      "The service costs £75 per year (including VAT where applicable). This covers your registered office address, mail receipt and notification, access to your online dashboard, and digital agreement management.",
  },
  {
    question: "How do I sign up?",
    answer:
      "Simply click 'Register Now' and follow our 4-step online process: enter your business details, sign the service agreement digitally, make payment via card or Direct Debit, and await admin approval. The entire process takes just a few minutes.",
  },
  {
    question: "What happens when I receive official mail?",
    answer:
      "When official correspondence arrives at our office addressed to your company, we notify you within 2 business days via email and your dashboard. You can then arrange collection or request forwarding.",
  },
  {
    question: "Can I cancel the service?",
    answer:
      "Yes, you can cancel at any time from your dashboard. We follow a formal withdrawal process that includes updating Companies House records. A minimum 15-day notice period applies to ensure a smooth transition.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept debit and credit cards (Visa, Mastercard, American Express) for immediate payment, or you can set up an annual BACS Direct Debit for automatic renewals. All payments are processed securely through Stripe.",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="relative py-24 sm:py-32 bg-section-alt overflow-hidden">
      {/* Background illustration */}
      <div className="absolute bottom-0 left-0 w-80 h-80 opacity-[0.03] pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/illustration-compliance.svg"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      <div className="container relative z-10">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="section-label mb-4 block">06 — FAQ</span>
            <h2 className="section-heading text-3xl md:text-4xl mb-4">
              Common{" "}
              <span className="font-display italic text-[#0ea5e9]">
                Questions
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-[var(--mmk-text-secondary)]">
              Everything you need to know about our registered office service.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Accordion
            type="single"
            collapsible
            className="max-w-3xl mx-auto space-y-3"
          >
            {FAQList.map(({ question, answer }, index) => (
              <AccordionItem
                key={question}
                value={question}
                className="bg-card border border-[var(--mmk-border-light)] rounded-2xl px-6 data-[state=open]:shadow-md data-[state=open]:border-[#0ea5e9]/30 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AccordionTrigger className="text-left text-sm font-semibold hover:text-[#0ea5e9] transition-colors py-5">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[var(--mmk-text-secondary)] leading-relaxed pb-5">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
};
