import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/password/forgot
 * Sends a password reset link to the user's email.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`forgot:${ip}`, { maxRequests: 5, windowMs: 15 * 60 * 1000 });
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Always return success to avoid email enumeration
    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      // Invalidate any existing tokens
      await db.passwordReset.updateMany({
        where: { userId: user.id, used: false },
        data: { used: true },
      });

      // Create new token (valid for 1 hour)
      const token = randomBytes(32).toString("hex");
      await db.passwordReset.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetUrl = `${appUrl}/reset-password?token=${token}`;

      await sendEmail({
        to: email,
        subject: "Reset Your Password — MMK Registered Office",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #0ea5e9, #38bdf8); display: inline-flex; align-items: center; justify-content: center; color: #0c2d42; font-weight: bold; font-size: 20px;">M</div>
            </div>
            <h2 style="color: #0c2d42; font-size: 20px; margin: 0 0 12px; text-align: center;">Reset Your Password</h2>
            <p style="color: #3d6478; font-size: 14px; line-height: 22px;">We received a request to reset your password. Click the button below to set a new password. This link expires in 1 hour.</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${resetUrl}" style="background-color: #0ea5e9; border-radius: 9999px; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #7a9eb5; font-size: 12px; line-height: 18px;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      message: "If an account exists with that email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
