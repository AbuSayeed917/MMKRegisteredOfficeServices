import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";

/**
 * GET /api/admin/clients
 * Returns paginated list of all clients with search/filter.
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
    const where: Record<string, unknown> = { role: "CLIENT" as const };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        {
          businessProfile: {
            companyName: { contains: search, mode: "insensitive" },
          },
        },
        {
          businessProfile: {
            crn: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    if (status) {
      where.subscription = { status };
    }

    const [clients, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          isActive: true,
          createdAt: true,
          businessProfile: {
            select: {
              companyName: true,
              crn: true,
              companyType: true,
            },
          },
          subscription: {
            select: {
              status: true,
              startDate: true,
              endDate: true,
              paymentMethod: true,
            },
          },
          agreements: {
            select: { status: true },
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      clients: clients.map((c) => ({
        id: c.id,
        email: c.email,
        isActive: c.isActive,
        companyName: c.businessProfile?.companyName || null,
        crn: c.businessProfile?.crn || null,
        companyType: c.businessProfile?.companyType || null,
        subscriptionStatus: c.subscription?.status || "NONE",
        subscriptionEnd: c.subscription?.endDate || null,
        paymentMethod: c.subscription?.paymentMethod || null,
        agreementStatus: c.agreements[0]?.status || "NONE",
        createdAt: c.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin clients error:", error);
    return NextResponse.json(
      { error: "Failed to load clients" },
      { status: 500 }
    );
  }
}
