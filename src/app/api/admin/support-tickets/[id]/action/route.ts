import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

const validActions = [
  "assign",
  "set_priority",
  "in_progress",
  "resolve",
  "close",
  "reopen",
];

// PATCH — Perform admin actions on a ticket
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, priority, assignedToId } = body;

    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Action must be one of: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    const ticket = await db.supportTicket.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        subject: true,
        status: true,
        user: { select: { email: true } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    let notifyClient = false;
    let notificationTitle = "";
    let notificationMessage = "";

    switch (action) {
      case "assign":
        if (!assignedToId) {
          return NextResponse.json(
            { error: "assignedToId is required" },
            { status: 400 }
          );
        }
        updateData.assignedToId = assignedToId;
        break;

      case "set_priority": {
        const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
        if (!validPriorities.includes(priority)) {
          return NextResponse.json(
            { error: `Priority must be one of: ${validPriorities.join(", ")}` },
            { status: 400 }
          );
        }
        updateData.priority = priority;
        break;
      }

      case "in_progress":
        updateData.status = "IN_PROGRESS";
        updateData.assignedToId = updateData.assignedToId ?? user.id;
        notifyClient = true;
        notificationTitle = "Ticket In Progress";
        notificationMessage = `Your ticket "${ticket.subject}" is being worked on.`;
        break;

      case "resolve":
        updateData.status = "RESOLVED";
        updateData.closedAt = new Date();
        notifyClient = true;
        notificationTitle = "Ticket Resolved";
        notificationMessage = `Your ticket "${ticket.subject}" has been resolved.`;
        break;

      case "close":
        updateData.status = "CLOSED";
        updateData.closedAt = new Date();
        notifyClient = true;
        notificationTitle = "Ticket Closed";
        notificationMessage = `Your ticket "${ticket.subject}" has been closed.`;
        break;

      case "reopen":
        updateData.status = "OPEN";
        updateData.closedAt = null;
        notifyClient = true;
        notificationTitle = "Ticket Reopened";
        notificationMessage = `Your ticket "${ticket.subject}" has been reopened.`;
        break;
    }

    await db.$transaction(async (tx) => {
      await tx.supportTicket.update({ where: { id }, data: updateData });

      if (notifyClient) {
        await tx.notification.create({
          data: {
            userId: ticket.userId,
            type: "TICKET_STATUS_CHANGE",
            title: notificationTitle,
            message: notificationMessage,
          },
        });
      }
    });

    // Non-blocking email for resolve/close
    if (action === "resolve" || action === "close") {
      sendEmail({
        to: ticket.user.email,
        subject: `Ticket ${action === "resolve" ? "Resolved" : "Closed"}: ${ticket.subject}`,
        html: `
          <h2>Your support ticket has been ${action === "resolve" ? "resolved" : "closed"}</h2>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p>If you still need help, you can reply to reopen your ticket.</p>
        `,
      }).catch((e) => console.warn("Ticket action email failed:", e));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to perform ticket action:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}
