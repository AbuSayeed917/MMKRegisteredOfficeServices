import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? "admin@mmkaccountants.co.uk";

// GET — List authenticated user's support tickets
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      db.supportTicket.findMany({
        where: { userId: user.id },
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
          _count: { select: { messages: true } },
        },
      }),
      db.supportTicket.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to list support tickets:", error);
    return NextResponse.json(
      { error: "Failed to load tickets" },
      { status: 500 }
    );
  }
}

// POST — Create a new support ticket
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, category, message } = body;

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    const validCategories = [
      "GENERAL",
      "BILLING",
      "MAIL_FORWARDING",
      "ACCOUNT",
      "TECHNICAL",
      "COMPANIES_HOUSE",
      "OTHER",
    ];
    const ticketCategory = validCategories.includes(category)
      ? category
      : "GENERAL";

    const ticket = await db.$transaction(async (tx) => {
      const newTicket = await tx.supportTicket.create({
        data: {
          userId: user.id,
          subject: subject.trim(),
          category: ticketCategory,
        },
      });

      await tx.ticketMessage.create({
        data: {
          ticketId: newTicket.id,
          senderId: user.id,
          message: message.trim(),
        },
      });

      // Notify all admins
      const admins = await tx.user.findMany({
        where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
        select: { id: true },
      });

      if (admins.length > 0) {
        await tx.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            type: "NEW_SUPPORT_TICKET",
            title: "New Support Ticket",
            message: `${user.email} submitted: "${subject.trim()}"`,
          })),
        });
      }

      return newTicket;
    });

    // Non-blocking email to admin
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Support Ticket: ${subject.trim()}`,
      html: `
        <h2>New Support Ticket</h2>
        <p><strong>From:</strong> ${user.email}</p>
        <p><strong>Subject:</strong> ${subject.trim()}</p>
        <p><strong>Category:</strong> ${ticketCategory.replace(/_/g, " ")}</p>
        <hr />
        <p>${message.trim().replace(/\n/g, "<br />")}</p>
      `,
    }).catch((e) => console.warn("Ticket email failed:", e));

    return NextResponse.json({ id: ticket.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create support ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
