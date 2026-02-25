"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Brief delay to allow webhook to process
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="size-10 text-[#0ea5e9] animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            Confirming your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
        <CardContent className="py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="size-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
            Your payment of £75.00 has been received. Your registered office
            service subscription is now active.
          </p>
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-6">
            Subscription Active
          </Badge>

          <div className="bg-muted/30 rounded-xl p-4 text-left text-sm space-y-2 mt-6">
            <p className="font-medium">What happens next?</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>&bull; Your registered office address is now active</li>
              <li>&bull; Mail will be forwarded within 2 working days</li>
              <li>&bull; You can view your subscription details in the dashboard</li>
              <li>&bull; A confirmation email has been sent to your inbox</li>
            </ul>
          </div>

          <Link href="/dashboard" className="block mt-6">
            <Button className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold px-8 gap-2">
              Go to Dashboard
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="size-10 text-[#0ea5e9] animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
