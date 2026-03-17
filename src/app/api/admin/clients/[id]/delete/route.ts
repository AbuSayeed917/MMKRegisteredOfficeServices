import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";

/**
 * DELETE /api/admin/clients/[id]/delete
 * Permanently delete a client and all associated data.
 * Requires SUPER_ADMIN role and confirmation phrase.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getUser();
    if (!authUser || authUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Only super admins can delete clients" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { confirmationPhrase } = body;

    // Get the client to verify they exist and get the company name
    const user = await db.user.findUnique({
      where: { id },
      include: { businessProfile: true },
    });

    if (!user || user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Build expected confirmation phrase
    const clientName =
      user.businessProfile?.companyName || user.email;
    const expectedPhrase = `Delete/${clientName}`;

    if (confirmationPhrase !== expectedPhrase) {
      return NextResponse.json(
        { error: "Confirmation phrase does not match" },
        { status: 400 }
      );
    }

    // Log the deletion BEFORE deleting (so we have a record)
    // We use a separate admin action log since the target user will be deleted
    const deletionRecord = {
      adminEmail: authUser.email,
      targetEmail: user.email,
      targetCompany: clientName,
      deletedAt: new Date().toISOString(),
    };

    await db.$transaction(async (tx) => {
      // Delete admin actions where this user is the target
      await tx.adminAction.deleteMany({
        where: { targetUserId: id },
      });

      // Delete admin actions where this user performed actions (shouldn't happen for CLIENT but safety)
      await tx.adminAction.deleteMany({
        where: { adminUserId: id },
      });

      // Delete ticket messages sent by this user
      await tx.ticketMessage.deleteMany({
        where: { senderId: id },
      });

      // Unassign any tickets assigned to this user
      await tx.supportTicket.updateMany({
        where: { assignedToId: id },
        data: { assignedToId: null },
      });

      // Now delete the user — cascades handle:
      // businessProfile → directors, subscription → payments,
      // agreements, notifications, otpCodes, passwordResets, supportTickets
      await tx.user.delete({
        where: { id },
      });
    });

    console.log("Client permanently deleted:", deletionRecord);

    return NextResponse.json({
      success: true,
      message: `Client "${clientName}" has been permanently deleted`,
    });
  } catch (error) {
    console.error("Delete client error:", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
