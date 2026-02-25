"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building2, Clock, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const formSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().min(2).max(255),
  message: z.string(),
});

export const ContactSection = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "Registered Office Service",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { firstName, lastName, email, subject, message } = values;
    const mailToLink = `mailto:info@mmkaccountants.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hello, I am ${firstName} ${lastName}. My email is ${email}.\n\n${message}`)}`;
    window.open(mailToLink, "_self");
  }

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="container">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="section-label mb-4 block">07 — Contact</span>
            <h2 className="section-heading text-3xl md:text-4xl mb-4">
              Get In{" "}
              <span className="font-display italic text-[#0ea5e9]">Touch</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-[var(--mmk-text-secondary)]">
              Have questions about our registered office service? We&apos;re here to
              help. Reach out to our team and we&apos;ll get back to you promptly.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left: Contact info + images */}
          <ScrollReveal direction="left">
            <div>
              {/* Office image grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="relative rounded-2xl overflow-hidden group">
                  <Image
                    src="/images/team.jpg"
                    alt="MMK Team"
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c2d42]/50 to-transparent" />
                  <div className="absolute bottom-2 left-3 text-white text-xs font-medium">Our Team</div>
                </div>
                <div className="relative rounded-2xl overflow-hidden group">
                  <Image
                    src="/images/modern-office.jpg"
                    alt="Modern Office"
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c2d42]/50 to-transparent" />
                  <div className="absolute bottom-2 left-3 text-white text-xs font-medium">Our Office</div>
                </div>
              </div>

              {/* London skyline image */}
              <div className="relative rounded-2xl overflow-hidden mb-8 group">
                <Image
                  src="/images/london-skyline.jpg"
                  alt="London Business District"
                  width={600}
                  height={200}
                  className="w-full h-36 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2d42]/60 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <div className="text-sm font-semibold">Serving Businesses Across the UK</div>
                  <div className="text-xs text-white/70">Based in Luton, United Kingdom</div>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { icon: Building2, label: "Our Office", value: "MMK Accountants, Luton, United Kingdom" },
                  { icon: Phone, label: "Call Us", value: "Contact us for details" },
                  { icon: Mail, label: "Email Us", value: "info@mmkaccountants.co.uk" },
                  { icon: Clock, label: "Office Hours", value: "Monday – Friday, 9:00 AM – 5:30 PM" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0ea5e9]/20 group-hover:shadow-[0_0_15px_rgba(14,165,233,0.15)] transition-all duration-500">
                      <Icon className="size-5 text-[#0ea5e9]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{label}</div>
                      <div className="text-sm text-[var(--mmk-text-secondary)]">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Form */}
          <ScrollReveal direction="right" delay={200}>
            <Card className="bg-card border-[var(--mmk-border-light)] rounded-2xl shadow-md">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-6">Send us a message</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" className="rounded-xl border-[var(--mmk-border)] focus:border-[#0ea5e9] focus:ring-[#0ea5e9]/20 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Smith" className="rounded-xl border-[var(--mmk-border)] focus:border-[#0ea5e9] focus:ring-[#0ea5e9]/20 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@company.co.uk" className="rounded-xl border-[var(--mmk-border)] focus:border-[#0ea5e9] focus:ring-[#0ea5e9]/20 transition-all" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Subject</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-[var(--mmk-border)]">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Registered Office Service">Registered Office Service</SelectItem>
                              <SelectItem value="Pricing Enquiry">Pricing Enquiry</SelectItem>
                              <SelectItem value="Account Support">Account Support</SelectItem>
                              <SelectItem value="General Enquiry">General Enquiry</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Message</FormLabel>
                          <FormControl>
                            <Textarea rows={4} placeholder="Your message..." className="resize-none rounded-xl border-[var(--mmk-border)] focus:border-[#0ea5e9] focus:ring-[#0ea5e9]/20 transition-all" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold py-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Send Message
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
