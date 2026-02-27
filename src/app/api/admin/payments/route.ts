import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";

/**
 * GET /api/admin/payments
 * Returns paginated list of all payments with search/filter.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (
      !user ||
      !["ADMIN", "SUPER_ADMIN"].includes(user.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.user = {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          {
            businessProfile: {
              companyName: { contains: search, mode: "insensitive" },
            },
          },
        ],
      };
    }

    const [payments, total, summary] = await Promise.all([
      db.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              email: true,
              businessProfile: {
                select: { companyName: true },
              },
            },
          },
        },
      }),
      db.payment.count({ where }),
      // Summary stats
      db.payment.groupBy({
        by: ["status"],
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const summaryMap: Record<string, { count: number; total: number }> = {};
    for (const s of summary) {
      summaryMap[s.status] = {
        count: s._count,
        total: (s._sum.amount || 0) / 100,
      };
    }

    return NextResponse.json({
      payments: payments.map((p) => ({
        id: p.id,
        amount: p.amount / 100,
        currency: p.currency,
        status: p.status,
        paymentMethod: p.paymentMethod,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
        companyName: p.user.businessProfile?.companyName || null,
        email: p.user.email,
      })),
      summary: summaryMap,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin payments error:", error);
    return NextResponse.json(
      { error: "Failed to load payments" },
      { status: 500 }
    );
  }
}
