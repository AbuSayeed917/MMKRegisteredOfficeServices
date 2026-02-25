"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  };
  business: {
    companyName: string;
    crn: string;
    companyType: string;
    registeredAddress: string;
    tradingAddress?: string;
    incorporationDate?: string;
    sicCode?: string;
    directors: Director[];
  } | null;
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) =>
        setData({
          user: d.user,
          business: d.business,
        })
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

      {/* Business Details */}
      {data.business && (
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#0c2d42] to-[#0ea5e9]" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-base">
              <Building2 className="size-4.5 text-[#0ea5e9]" />
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent>
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
              {data.business.tradingAddress && (
                <div className="bg-muted/30 rounded-xl p-4 sm:col-span-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <MapPin className="size-3" /> Trading Address
                  </p>
                  <p className="text-sm">{data.business.tradingAddress}</p>
                </div>
              )}
            </div>
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
        To update your business details, please contact MMK Accountants. Changes
        to registered office address or company details require admin approval
        and may take up to 2 working days to process.
      </p>
    </div>
  );
}
