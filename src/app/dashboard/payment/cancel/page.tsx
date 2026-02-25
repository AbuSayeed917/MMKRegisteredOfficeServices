"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="max-w-lg mx-auto">
      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
        <CardContent className="py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
            <XCircle className="size-10 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white mb-2">
            Payment Cancelled
          </h1>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Your payment was not completed. No charges have been made. You can
            try again at any time from your dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="rounded-full px-6 gap-2 border-[var(--mmk-border)]"
              >
                <ArrowLeft className="size-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/subscription">
              <Button className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold px-6 gap-2">
                <CreditCard className="size-4" />
                Try Again
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
