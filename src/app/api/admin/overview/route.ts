import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/admin/overview
 * Returns admin dashboard metrics.
 */
export async function GET() {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [
      totalClients,
      activeClients,
      pendingApprovals,
      suspendedClients,
      totalRevenue,
      recentPayments,
      recentRegistrations,
      expiringSubscriptions,
    ] = await Promise.all([
      db.user.count({ where: { role: "CLIENT" } }),
      db.subscription.count({ where: { status: "ACTIVE" } }),
      db.subscription.count({ where: { status: "PENDING_APPROVAL" } }),
      db.subscription.count({ where: { status: "SUSPENDED" } }),
      db.payment.aggregate({
        where: { status: "SUCCEEDED" },
        _sum: { amount: true },
      }),
      db.payment.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: {
            select: {
              email: true,
              businessProfile: { select: { companyName: true } },
            },
          },
        },
      }),
      db.user.findMany({
        where: { role: "CLIENT" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          email: true,
          createdAt: true,
          businessProfile: { select: { companyName: true } },
          subscription: { select: { status: true } },
        },
      }),
      db.subscription.count({
        where: {
          status: "ACTIVE",
          endDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            gte: new Date(),
          },
        },
      }),
    ]);

    return NextResponse.json({
      metrics: {
        totalClients,
        activeClients,
        pendingApprovals,
        suspendedClients,
        expiringSubscriptions,
        totalRevenue: (totalRevenue._sum.amount || 0) / 100,
      },
      recentPayments: recentPayments.map((p) => ({
        id: p.id,
        amount: p.amount / 100,
        status: p.status,
        companyName: p.user.businessProfile?.companyName || p.user.email,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
      })),
      recentRegistrations: recentRegistrations.map((u) => ({
        id: u.id,
        email: u.email,
        companyName: u.businessProfile?.companyName || null,
        subscriptionStatus: u.subscription?.status || "NONE",
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    return NextResponse.json(
      { error: "Failed to load overview data" },
      { status: 500 }
    );
  }
}
