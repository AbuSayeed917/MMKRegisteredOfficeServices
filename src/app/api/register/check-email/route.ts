import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/register/check-email
 * Checks if an email is already registered. Used during registration step 4.
 */
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`check-email:${ip}`, {
      maxRequests: 20,
      windowMs: 60 * 1000,
    });
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    return NextResponse.json({ available: !existingUser });
  } catch {
    return NextResponse.json(
      { error: "Check failed" },
      { status: 500 }
    );
  }
}
