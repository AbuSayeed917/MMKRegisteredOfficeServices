import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// GET — List all support tickets (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";
    const skip = (page - 1) * limit;

    const where: Prisma.SupportTicketWhereInput = {};

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        {
          user: {
            businessProfile: {
              companyName: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    if (status) where.status = status as Prisma.EnumTicketStatusFilter;
    if (priority) where.priority = priority as Prisma.EnumTicketPriorityFilter;

    const [tickets, total] = await Promise.all([
      db.supportTicket.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          subject: true,
          category: true,
          status: true,
          priority: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              email: true,
              businessProfile: { select: { companyName: true } },
            },
          },
          assignedTo: { select: { email: true } },
          _count: { select: { messages: true } },
        },
      }),
      db.supportTicket.count({ where }),
    ]);

    return NextResponse.json({
      tickets,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Failed to list admin tickets:", error);
    return NextResponse.json(
      { error: "Failed to load tickets" },
      { status: 500 }
    );
  }
}
