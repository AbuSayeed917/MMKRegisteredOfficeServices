import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

// POST — Add a reply to a ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { message, isInternal } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(user.role);

    const ticket = await db.supportTicket.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        subject: true,
        status: true,
        user: { select: { email: true } },
        assignedTo: { select: { id: true, email: true } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Only ticket owner or admin can reply
    if (ticket.userId !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only admins can create internal notes
    const internal = isAdmin && isInternal === true;

    await db.$transaction(async (tx) => {
      await tx.ticketMessage.create({
        data: {
          ticketId: id,
          senderId: user.id,
          message: message.trim(),
          isInternal: internal,
        },
      });

      // Reopen if client replies to a resolved ticket
      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (!isAdmin && ticket.status === "RESOLVED") {
        updateData.status = "OPEN";
        updateData.closedAt = null;
      }

      await tx.supportTicket.update({ where: { id }, data: updateData });

      // Send notification (skip for internal notes)
      if (!internal) {
        if (isAdmin) {
          // Admin replied → notify client
          await tx.notification.create({
            data: {
              userId: ticket.userId,
              type: "TICKET_REPLY",
              title: "Support Reply",
              message: `New reply on "${ticket.subject}"`,
            },
          });
        } else {
          // Client replied → notify assigned admin or all admins
          const adminIds = ticket.assignedTo
            ? [ticket.assignedTo.id]
            : (
                await tx.user.findMany({
                  where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
                  select: { id: true },
                })
              ).map((a) => a.id);

          if (adminIds.length > 0) {
            await tx.notification.createMany({
              data: adminIds.map((adminId) => ({
                userId: adminId,
                type: "TICKET_CLIENT_REPLY",
                title: "Client Reply",
                message: `${user.email} replied on "${ticket.subject}"`,
              })),
            });
          }
        }
      }
    });

    // Non-blocking email
    if (!internal) {
      const emailTo = isAdmin ? ticket.user.email : (ticket.assignedTo?.email ?? process.env.ADMIN_EMAIL ?? "admin@mmkaccountants.co.uk");
      sendEmail({
        to: emailTo,
        subject: `Re: ${ticket.subject}`,
        html: `
          <h2>New reply on your support ticket</h2>
          <p><strong>From:</strong> ${user.email}</p>
          <hr />
          <p>${message.trim().replace(/\n/g, "<br />")}</p>
        `,
      }).catch((e) => console.warn("Reply email failed:", e));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reply to ticket:", error);
    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 }
    );
  }
}
