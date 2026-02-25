"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  DollarSign,
  FileText,
  Mail,
  Shield,
  Save,
  Info,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [feeAmount, setFeeAmount] = useState("75.00");
  const [saving, setSaving] = useState(false);

  const handleSaveFee = async () => {
    setSaving(true);
    // TODO: connect to API
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure system settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fee Configuration */}
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="size-4 text-emerald-500" />
              Fee Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Annual Service Fee (£)
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  className="rounded-xl max-w-[160px]"
                  step="0.01"
                  min="0"
                />
                <Button
                  onClick={handleSaveFee}
                  disabled={saving}
                  size="sm"
                  className="rounded-xl"
                >
                  <Save className="size-3.5 mr-1.5" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                This is the annual fee charged for the registered office service.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Agreement Templates */}
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4 text-[#0ea5e9]" />
              Agreement Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-xl bg-muted/30 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Service Agreement Template
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Version 1 — Active
                </p>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                Active
              </Badge>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <Info className="size-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Agreement template management will be available in a future update.
                New versions only apply to new signups and renewals.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-400 to-purple-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="size-4 text-purple-500" />
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {[
                { label: "Registration confirmations", enabled: true },
                { label: "Payment receipts", enabled: true },
                { label: "Renewal reminders (60/30/7 days)", enabled: true },
                { label: "Failed payment alerts", enabled: true },
                { label: "Admin action notifications", enabled: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20"
                >
                  <span className="text-sm">{item.label}</span>
                  <Badge
                    variant={item.enabled ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {item.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <Info className="size-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Email template customisation will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-400 to-red-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="size-4 text-red-500" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {[
                {
                  label: "Account lockout",
                  value: "After 5 failed attempts (15-min cooldown)",
                },
                {
                  label: "Session timeout",
                  value: "30 minutes of inactivity",
                },
                {
                  label: "Password requirements",
                  value: "Min 8 chars, uppercase, lowercase, number",
                },
                {
                  label: "CSRF protection",
                  value: "Enabled (NextAuth)",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-2.5 rounded-xl bg-muted/20"
                >
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden lg:col-span-2">
          <div className="h-1 bg-gradient-to-r from-gray-300 to-gray-400" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="size-4 text-muted-foreground" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Framework", value: "Next.js 16" },
                { label: "Database", value: "PostgreSQL (Prisma)" },
                { label: "Payments", value: "Stripe" },
                { label: "Hosting", value: "Railway" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-xl bg-muted/20 text-center"
                >
                  <p className="text-[11px] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
