import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";

// GET — Ticket detail with messages
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(user.role);

    const ticket = await db.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, businessProfile: { select: { companyName: true } } },
        },
        assignedTo: { select: { id: true, email: true } },
        messages: {
          where: isAdmin ? {} : { isInternal: false },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            message: true,
            isInternal: true,
            attachmentUrl: true,
            createdAt: true,
            sender: { select: { id: true, email: true, role: true } },
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Only ticket owner or admin can view
    if (ticket.userId !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Failed to get ticket:", error);
    return NextResponse.json(
      { error: "Failed to load ticket" },
      { status: 500 }
    );
  }
}
