import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/admin/clients/[id]
 * Returns full detail for a single client.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      include: {
        businessProfile: {
          include: { directors: true },
        },
        subscription: true,
        agreements: {
          include: { template: { select: { version: true } } },
          orderBy: { createdAt: "desc" },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        notifications: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!user || user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Get admin actions for this client
    const adminActions = await db.adminAction.findMany({
      where: { targetUserId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        adminUser: { select: { email: true } },
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
      business: user.businessProfile
        ? {
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
              dateOfBirth: d.dateOfBirth,
              residentialAddress: d.residentialAddress,
            })),
          }
        : null,
      subscription: user.subscription
        ? {
            id: user.subscription.id,
            status: user.subscription.status,
            startDate: user.subscription.startDate,
            endDate: user.subscription.endDate,
            nextPaymentDate: user.subscription.nextPaymentDate,
            paymentMethod: user.subscription.paymentMethod,
            stripeCustomerId: user.subscription.stripeCustomerId,
            retryCount: user.subscription.retryCount,
          }
        : null,
      agreements: user.agreements.map((a) => ({
        id: a.id,
        status: a.status,
        signatureType: a.signatureType,
        signedAt: a.signedAt,
        pdfUrl: a.pdfUrl,
        templateVersion: a.template.version,
      })),
      payments: user.payments.map((p) => ({
        id: p.id,
        amount: p.amount / 100,
        currency: p.currency,
        status: p.status,
        paymentMethod: p.paymentMethod,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
      })),
      adminActions: adminActions.map((a) => ({
        id: a.id,
        actionType: a.actionType,
        reason: a.reason,
        notes: a.notes,
        adminEmail: a.adminUser.email,
        createdAt: a.createdAt,
      })),
    });
  } catch (error) {
    console.error("Admin client detail error:", error);
    return NextResponse.json(
      { error: "Failed to load client details" },
      { status: 500 }
    );
  }
}
