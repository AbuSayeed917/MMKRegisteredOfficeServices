import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/register/check-company
 * Checks if a company (by CRN) is already registered. Used during registration step 1.
 */
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`check-company:${ip}`, {
      maxRequests: 20,
      windowMs: 60 * 1000,
    });
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const { crn } = await request.json();

    if (!crn || typeof crn !== "string") {
      return NextResponse.json(
        { error: "Company number is required" },
        { status: 400 }
      );
    }

    const normalizedCrn = crn.trim().toUpperCase();

    const existingBusiness = await db.businessProfile.findUnique({
      where: { crn: normalizedCrn },
      select: { id: true },
    });

    return NextResponse.json({ available: !existingBusiness });
  } catch {
    return NextResponse.json(
      { error: "Check failed" },
      { status: 500 }
    );
  }
}
