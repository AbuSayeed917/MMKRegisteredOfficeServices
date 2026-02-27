"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Send, Loader2, LifeBuoy } from "lucide-react";
import { toast } from "sonner";

const categories = [
  { value: "GENERAL", label: "General" },
  { value: "BILLING", label: "Billing" },
  { value: "MAIL_FORWARDING", label: "Mail Forwarding" },
  { value: "ACCOUNT", label: "Account" },
  { value: "TECHNICAL", label: "Technical" },
  { value: "COMPANIES_HOUSE", label: "Companies House" },
  { value: "OTHER", label: "Other" },
];

export default function CreateTicketPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    subject.trim().length > 0 && message.trim().length >= 10 && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    if (message.trim().length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/support-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          category,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create ticket");
      }

      const data = await res.json();
      toast.success("Ticket created successfully");
      router.push(`/dashboard/support/${data.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create ticket"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/support"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#0ea5e9] transition-colors mb-4"
        >
          <ArrowLeft className="size-3.5" />
          Back to Support
        </Link>
        <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
          New Support Ticket
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Describe your issue and we&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-base">
            <LifeBuoy className="size-5 text-[#0ea5e9]" />
            Ticket Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="text-sm font-medium text-[#0c2d42] dark:text-white"
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <Input
                id="subject"
                placeholder="Brief summary of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={submitting}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-[#0c2d42] dark:text-white"
              >
                Category
              </label>
              <Select
                value={category}
                onValueChange={setCategory}
                disabled={submitting}
              >
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-[#0c2d42] dark:text-white"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="message"
                placeholder="Please provide as much detail as possible about your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                disabled={submitting}
                className="rounded-lg min-h-[140px]"
              />
              <p className="text-[11px] text-muted-foreground">
                Minimum 10 characters.{" "}
                {message.trim().length > 0 && message.trim().length < 10 && (
                  <span className="text-amber-600">
                    {10 - message.trim().length} more character
                    {10 - message.trim().length !== 1 ? "s" : ""} needed.
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={!canSubmit}
                className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold px-6 gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Submit Ticket
                  </>
                )}
              </Button>
              <Link href="/dashboard/support">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={submitting}
                  className="text-sm text-muted-foreground"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
