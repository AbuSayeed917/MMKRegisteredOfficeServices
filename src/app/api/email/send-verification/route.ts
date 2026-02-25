import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

/**
 * POST /api/email/send-verification
 * Sends a verification code to the authenticated user's email.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // Invalidate existing codes
    await db.otpCode.updateMany({
      where: { email: user.email, used: false },
      data: { used: true },
    });

    // Create new OTP (valid for 15 minutes)
    await db.otpCode.create({
      data: {
        userId: user.id,
        email: user.email,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email — MMK Registered Office",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #0ea5e9, #38bdf8); display: inline-flex; align-items: center; justify-content: center; color: #0c2d42; font-weight: bold; font-size: 20px;">M</div>
          </div>
          <h2 style="color: #0c2d42; font-size: 20px; margin: 0 0 12px; text-align: center;">Verify Your Email</h2>
          <p style="color: #3d6478; font-size: 14px; line-height: 22px; text-align: center;">Use the code below to verify your email address. This code expires in 15 minutes.</p>
          <div style="text-align: center; margin: 24px 0;">
            <div style="background: #f0f7fb; border-radius: 12px; padding: 20px; display: inline-block;">
              <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0c2d42; font-family: monospace;">${code}</span>
            </div>
          </div>
          <p style="color: #7a9eb5; font-size: 12px; line-height: 18px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Verification code sent" });
  } catch (error) {
    console.error("Send verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
