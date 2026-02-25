import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendRenewalReminderEmail } from "@/lib/email";

/**
 * POST /api/cron/renewal-reminders
 * Sends renewal reminder emails for subscriptions expiring in 60, 30, or 7 days.
 * Should be called by a cron job (e.g., Railway cron, Vercel cron, or external service).
 * Protected by CRON_SECRET header.
 */
export async function POST(request: NextRequest) {
  try {
    const cronSecret = request.headers.get("x-cron-secret");
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const reminderDays = [60, 30, 7];
    let totalSent = 0;

    for (const days of reminderDays) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + days);

      // Find subscriptions expiring on this target date (within the same day)
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const expiringSubscriptions = await db.subscription.findMany({
        where: {
          status: "ACTIVE",
          endDate: { gte: startOfDay, lte: endOfDay },
        },
        include: {
          user: { include: { businessProfile: true } },
        },
      });

      for (const sub of expiringSubscriptions) {
        if (!sub.user.businessProfile) continue;

        const expiryDate = sub.endDate!.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        try {
          await sendRenewalReminderEmail(
            sub.user.email,
            sub.user.businessProfile.companyName,
            days,
            expiryDate
          );

          // Create in-app notification
          await db.notification.create({
            data: {
              userId: sub.userId,
              type: "RENEWAL_REMINDER",
              title: "Subscription Renewal Reminder",
              message: `Your registered office service for ${sub.user.businessProfile.companyName} expires on ${expiryDate}. Please renew to maintain your service.`,
            },
          });

          totalSent++;
        } catch (e) {
          console.warn(`Failed to send reminder to ${sub.user.email}:`, e);
        }
      }
    }

    // Expire overdue subscriptions
    const expiredCount = await db.subscription.updateMany({
      where: {
        status: "ACTIVE",
        endDate: { lt: now },
      },
      data: { status: "EXPIRED" },
    });

    return NextResponse.json({
      remindersSent: totalSent,
      subscriptionsExpired: expiredCount.count,
    });
  } catch (error) {
    console.error("Renewal reminders cron error:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}
