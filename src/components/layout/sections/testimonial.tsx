"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface ReviewProps {
  name: string;
  role: string;
  comment: string;
  rating: number;
  initials: string;
  avatar: string;
}

const reviewList: ReviewProps[] = [
  {
    name: "James Thompson",
    role: "Director, Thompson Consulting Ltd",
    comment:
      "Switching to MMK for our registered office was seamless. The online portal makes everything easy to manage, and the team is always responsive when we receive official mail.",
    rating: 5,
    initials: "JT",
    avatar: "/images/avatar-1.jpg",
  },
  {
    name: "Sarah Patel",
    role: "Founder, Patel Digital Solutions",
    comment:
      "As a new business owner, having a professional registered address gave my company instant credibility. The £75/year price is unbeatable for the service you get.",
    rating: 5,
    initials: "SP",
    avatar: "/images/avatar-2.jpg",
  },
  {
    name: "David Chen",
    role: "Managing Director, Chen Properties LLP",
    comment:
      "We manage several companies and MMK handles the registered office for all of them. Their notification system ensures we never miss important correspondence.",
    rating: 5,
    initials: "DC",
    avatar: "/images/avatar-3.jpg",
  },
  {
    name: "Emma Williams",
    role: "Director, Williams & Co Architects",
    comment:
      "The digital agreement signing was so convenient — no printing or posting. Payment setup took minutes and the annual Direct Debit means I never have to think about renewals.",
    rating: 5,
    initials: "EW",
    avatar: "/images/avatar-4.jpg",
  },
  {
    name: "Michael O\u2019Brien",
    role: "CEO, O\u2019Brien Tech Solutions",
    comment:
      "Professional service at an affordable price. The dashboard gives me everything I need — agreement copies, payment history, and instant notifications.",
    rating: 5,
    initials: "MO",
    avatar: "/images/avatar-5.jpg",
  },
  {
    name: "Priya Sharma",
    role: "Director, Sharma Accounting Services",
    comment:
      "As an accountant myself, I appreciate the attention to compliance. MMK keeps everything above board and the digital platform saves significant admin time.",
    rating: 5,
    initials: "PS",
    avatar: "/images/avatar-6.jpg",
  },
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Decorative quote marks */}
      <div className="absolute top-12 left-8 text-[#0ea5e9]/5">
        <Quote className="size-40" />
      </div>
      <div className="absolute bottom-12 right-8 text-[#0ea5e9]/5 rotate-180">
        <Quote className="size-40" />
      </div>

      <div className="container relative z-10">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="section-label mb-4 block">05 — Testimonials</span>
            <h2 className="section-heading text-3xl md:text-4xl mb-4">
              Hear What Our{" "}
              <span className="font-display italic text-[#0ea5e9]">Clients</span>{" "}
              Say
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-[var(--mmk-text-secondary)]">
              Join 75+ businesses who trust MMK Accountants with their registered office needs.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Carousel
            opts={{ align: "start" }}
            className="relative w-full max-w-5xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {reviewList.map((review) => (
                <CarouselItem
                  key={review.name}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="h-full bg-card border-[var(--mmk-border-light)] rounded-2xl card-hover group">
                    <CardContent className="pt-6 pb-0">
                      {/* Stars */}
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="size-4 fill-[#0ea5e9] text-[#0ea5e9]" />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-sm leading-relaxed text-foreground/90 font-display italic">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </CardContent>

                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 border-2 border-[#0ea5e9]/20 group-hover:border-[#0ea5e9]/40 transition-colors">
                          <AvatarImage src={review.avatar} alt={review.name} />
                          <AvatarFallback className="bg-[#0ea5e9]/10 text-[#0ea5e9] text-xs font-semibold">
                            {review.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-sm">{review.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {review.role}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-[var(--mmk-border)] hover:bg-[#0ea5e9]/10 hover:border-[#0ea5e9] transition-all" />
            <CarouselNext className="border-[var(--mmk-border)] hover:bg-[#0ea5e9]/10 hover:border-[#0ea5e9] transition-all" />
          </Carousel>
        </ScrollReveal>
      </div>
    </section>
  );
};
