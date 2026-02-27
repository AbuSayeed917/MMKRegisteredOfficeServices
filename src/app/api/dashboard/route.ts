import { NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";

/**
 * GET /api/dashboard
 * Returns all data for the client dashboard in a single request.
 */
export async function GET() {
  try {
    const authUser = await getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authUser.id;

    const [user, subscription, agreements, notifications, payments] =
      await Promise.all([
        db.user.findUnique({
          where: { id: userId },
          include: {
            businessProfile: {
              include: { directors: true },
            },
          },
        }),
        db.subscription.findUnique({
          where: { userId },
        }),
        db.agreement.findMany({
          where: { userId },
          include: { template: { select: { version: true } } },
          orderBy: { createdAt: "desc" },
        }),
        db.notification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
        db.payment.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
      business: user.businessProfile
        ? {
            id: user.businessProfile.id,
            companyName: user.businessProfile.companyName,
            crn: user.businessProfile.crn,
            companyType: user.businessProfile.companyType,
            incorporationDate: user.businessProfile.incorporationDate,
            sicCode: user.businessProfile.sicCode,
            registeredAddress: user.businessProfile.registeredAddress,
            tradingAddress: user.businessProfile.tradingAddress,
            phone: user.businessProfile.phone,
            directors: user.businessProfile.directors.map((d) => ({
              id: d.id,
              fullName: d.fullName,
              position: d.position,
            })),
          }
        : null,
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            nextPaymentDate: subscription.nextPaymentDate,
            paymentMethod: subscription.paymentMethod,
          }
        : null,
      agreements: agreements.map((a) => ({
        id: a.id,
        status: a.status,
        signatureType: a.signatureType,
        signedAt: a.signedAt,
        pdfUrl: a.pdfUrl,
        templateVersion: a.template.version,
      })),
      notifications,
      payments: payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        paymentMethod: p.paymentMethod,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
