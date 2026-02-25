"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Building2,
  Mail,
  Calendar,
  MapPin,
  Hash,
  Clock,
  Users,
  Briefcase,
  Lock,
  Save,
  CheckCircle2,
  Loader2,
  Pencil,
  Phone,
} from "lucide-react";

interface Director {
  id: string;
  fullName: string;
  position: string;
}

interface ProfileData {
  user: {
    email: string;
    createdAt: string;
    lastLogin: string;
    emailVerified: string | null;
  };
  business: {
    companyName: string;
    crn: string;
    companyType: string;
    registeredAddress: string;
    tradingAddress?: string;
    phone?: string;
    incorporationDate?: string;
    sicCode?: string;
    directors: Director[];
  } | null;
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [editing, setEditing] = useState(false);
  const [tradingAddress, setTradingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Email verification
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setData({ user: d.user, business: d.business });
        setTradingAddress(d.business?.tradingAddress || "");
        setPhone(d.business?.phone || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileError("");
    setProfileSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tradingAddress, phone }),
      });
      if (res.ok) {
        setProfileSuccess(true);
        setEditing(false);
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        const d = await res.json();
        setProfileError(d.error || "Failed to update");
      }
    } catch {
      setProfileError("Something went wrong");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/password/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const d = await res.json();
      if (res.ok) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(d.error || "Failed to change password");
      }
    } catch {
      setPasswordError("Something went wrong");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSendVerification = async () => {
    setSendingVerification(true);
    try {
      const res = await fetch("/api/email/send-verification", { method: "POST" });
      if (res.ok) setVerificationSent(true);
    } catch {
      // silently fail
    } finally {
      setSendingVerification(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verifyCode || !data?.user.email) return;
    setVerifying(true);
    setVerifyError("");
    try {
      const res = await fetch("/api/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.user.email, code: verifyCode }),
      });
      if (res.ok) {
        setData((prev) =>
          prev ? { ...prev, user: { ...prev.user, emailVerified: new Date().toISOString() } } : prev
        );
        setVerificationSent(false);
      } else {
        const d = await res.json();
        setVerifyError(d.error || "Invalid code");
      }
    } catch {
      setVerifyError("Something went wrong");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-60 rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="border-[var(--mmk-border-light)] rounded-2xl">
        <CardContent className="py-16 text-center">
          <User className="size-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            Unable to load profile
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
          My Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your account and business details
        </p>
      </div>

      {/* Account Information */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-3 text-base">
            <User className="size-4.5 text-[#0ea5e9]" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <Mail className="size-3" /> Email Address
              </p>
              <p className="font-medium text-sm">{data.user.email}</p>
              {data.user.emailVerified ? (
                <Badge className="mt-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px]">
                  Verified
                </Badge>
              ) : (
                <div className="mt-1.5">
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px]">
                    Not Verified
                  </Badge>
                  {!verificationSent ? (
                    <Button
                      variant="link"
                      size="sm"
                      className="text-[11px] text-[#0ea5e9] p-0 h-auto ml-2"
                      onClick={handleSendVerification}
                      disabled={sendingVerification}
                    >
                      {sendingVerification ? "Sending..." : "Verify now"}
                    </Button>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        className="rounded-lg h-8 text-xs max-w-[120px]"
                      />
                      <Button
                        size="sm"
                        className="h-8 text-xs rounded-lg"
                        onClick={handleVerifyEmail}
                        disabled={verifying}
                      >
                        {verifying ? "..." : "Verify"}
                      </Button>
                      {verifyError && (
                        <p className="text-[10px] text-destructive self-center">{verifyError}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <Calendar className="size-3" /> Member Since
              </p>
              <p className="font-medium text-sm">
                {new Date(data.user.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <Clock className="size-3" /> Last Login
              </p>
              <p className="font-medium text-sm">
                {data.user.lastLogin
                  ? new Date(data.user.lastLogin).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-3">
              <Lock className="size-4.5 text-amber-500" />
              Password
            </span>
            {!showPasswordForm && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {passwordSuccess && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 mb-3">
              <CheckCircle2 className="size-4" />
              Password changed successfully
            </div>
          )}
          {showPasswordForm ? (
            <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
              {passwordError && (
                <div className="rounded-xl bg-destructive/10 p-2.5 text-xs text-destructive">
                  {passwordError}
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs">Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="rounded-xl h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Min 8 characters"
                  className="rounded-xl h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="rounded-xl h-9 text-sm"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl text-xs"
                  disabled={changingPassword}
                >
                  {changingPassword ? (
                    <Loader2 className="size-3 animate-spin mr-1" />
                  ) : (
                    <Save className="size-3 mr-1" />
                  )}
                  {changingPassword ? "Changing..." : "Update Password"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordError("");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-xs text-muted-foreground">
              Last changed: Unknown
            </p>
          )}
        </CardContent>
      </Card>

      {/* Business Details */}
      {data.business && (
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#0c2d42] to-[#0ea5e9]" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-3">
                <Building2 className="size-4.5 text-[#0ea5e9]" />
                Business Details
              </span>
              {!editing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="size-3 mr-1" />
                  Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 mb-3">
                <CheckCircle2 className="size-4" />
                Profile updated successfully
              </div>
            )}
            {profileError && (
              <div className="rounded-xl bg-destructive/10 p-2.5 text-xs text-destructive mb-3">
                {profileError}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Company Name
                </p>
                <p className="font-medium text-sm">
                  {data.business.companyName}
                </p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <Hash className="size-3" /> Company Registration Number
                </p>
                <p className="font-mono text-sm">{data.business.crn}</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Company Type
                </p>
                <Badge variant="secondary" className="text-xs">
                  {data.business.companyType}
                </Badge>
              </div>
              {data.business.incorporationDate && (
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Calendar className="size-3" /> Incorporation Date
                  </p>
                  <p className="font-medium text-sm">
                    {new Date(
                      data.business.incorporationDate
                    ).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
              {data.business.sicCode && (
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    SIC Code
                  </p>
                  <p className="font-mono text-sm">{data.business.sicCode}</p>
                </div>
              )}
              <div className="bg-muted/30 rounded-xl p-4 sm:col-span-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <MapPin className="size-3" /> Registered Address
                </p>
                <p className="text-sm">{data.business.registeredAddress}</p>
              </div>

              {/* Editable: Trading Address */}
              <div className="bg-muted/30 rounded-xl p-4 sm:col-span-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <MapPin className="size-3" /> Trading Address
                </p>
                {editing ? (
                  <Input
                    value={tradingAddress}
                    onChange={(e) => setTradingAddress(e.target.value)}
                    placeholder="Enter trading address"
                    className="rounded-lg h-8 text-sm mt-1"
                  />
                ) : (
                  <p className="text-sm">
                    {tradingAddress || "Not specified"}
                  </p>
                )}
              </div>

              {/* Editable: Phone */}
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <Phone className="size-3" /> Phone
                </p>
                {editing ? (
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="rounded-lg h-8 text-sm mt-1"
                  />
                ) : (
                  <p className="text-sm">{phone || "Not specified"}</p>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  className="rounded-xl text-xs"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <Loader2 className="size-3 animate-spin mr-1" />
                  ) : (
                    <Save className="size-3 mr-1" />
                  )}
                  {savingProfile ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs"
                  onClick={() => {
                    setEditing(false);
                    setProfileError("");
                    setTradingAddress(data.business?.tradingAddress || "");
                    setPhone(data.business?.phone || "");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Directors */}
      {data.business?.directors && data.business.directors.length > 0 && (
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-base">
              <Users className="size-4.5 text-[#0ea5e9]" />
              Directors &amp; Officers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.business!.directors.map((director) => (
              <div
                key={director.id}
                className="flex items-center gap-3 bg-muted/30 rounded-xl p-4"
              >
                <div className="w-9 h-9 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="size-4 text-[#0ea5e9]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{director.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {director.position}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Legal Note */}
      <p className="text-[10px] text-muted-foreground">
        You can update your trading address and phone number directly. To change
        your company name, CRN, or registered address, please contact MMK
        Accountants as these require admin approval.
      </p>
    </div>
  );
}
