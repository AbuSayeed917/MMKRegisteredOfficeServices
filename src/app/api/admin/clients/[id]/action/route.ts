import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";
import {
  sendApprovedEmail,
  sendRejectedEmail,
  sendAccountSuspendedEmail,
  sendAccountReactivatedEmail,
} from "@/lib/email";

/**
 * POST /api/admin/clients/[id]/action
 * Perform lifecycle actions: approve, reject, suspend, reactivate, cancel.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getUser();
    if (
      !authUser ||
      !["ADMIN", "SUPER_ADMIN"].includes(authUser.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, reason, notes } = body;

    const validActions = [
      "APPROVE",
      "REJECT",
      "SUSPEND",
      "REACTIVATE",
      "WITHDRAW",
      "CANCEL",
    ];

    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    // Get client + subscription
    const user = await db.user.findUnique({
      where: { id },
      include: { subscription: true, businessProfile: true },
    });

    if (!user || user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Determine new subscription status
    const statusMap: Record<string, string> = {
      APPROVE: "ACTIVE",
      REJECT: "REJECTED",
      SUSPEND: "SUSPENDED",
      REACTIVATE: "ACTIVE",
      WITHDRAW: "WITHDRAWN",
      CANCEL: "WITHDRAWN",
    };

    const newStatus = statusMap[action];
    const now = new Date();

    await db.$transaction(async (tx) => {
      // Update subscription status
      if (user.subscription) {
        const updateData: Record<string, unknown> = { status: newStatus };

        if (action === "APPROVE") {
          updateData.startDate = now;
          updateData.endDate = new Date(
            now.getFullYear() + 1,
            now.getMonth(),
            now.getDate()
          );
          updateData.nextPaymentDate = updateData.endDate;
        }

        if (action === "REACTIVATE") {
          updateData.retryCount = 0;
        }

        await tx.subscription.update({
          where: { id: user.subscription.id },
          data: updateData,
        });
      }

      // Update user active status
      if (action === "SUSPEND" || action === "REJECT" || action === "CANCEL") {
        await tx.user.update({
          where: { id },
          data: { isActive: false },
        });
      } else if (action === "APPROVE" || action === "REACTIVATE") {
        await tx.user.update({
          where: { id },
          data: { isActive: true },
        });
      }

      // Log admin action
      await tx.adminAction.create({
        data: {
          adminUserId: authUser.id,
          targetUserId: id,
          actionType: action,
          reason: reason || null,
          notes: notes || null,
        },
      });

      // Notify the client
      const notificationMessages: Record<string, { title: string; message: string }> = {
        APPROVE: {
          title: "Application Approved",
          message: `Your registered office service application has been approved. You can now proceed with payment in your dashboard.`,
        },
        REJECT: {
          title: "Application Rejected",
          message: `Your application has been rejected. ${reason ? `Reason: ${reason}` : "Please contact us for more details."}`,
        },
        SUSPEND: {
          title: "Account Suspended",
          message: `Your account has been suspended. ${reason ? `Reason: ${reason}` : "Please contact us for assistance."}`,
        },
        REACTIVATE: {
          title: "Account Reactivated",
          message: "Your account has been reactivated. Your registered office service is now active again.",
        },
        WITHDRAW: {
          title: "Service Withdrawn",
          message: "Your registered office service has been withdrawn. Please contact us if you have any questions.",
        },
        CANCEL: {
          title: "Service Cancelled",
          message: "Your registered office service has been cancelled.",
        },
      };

      const notification = notificationMessages[action];
      if (notification) {
        await tx.notification.create({
          data: {
            userId: id,
            type: `ADMIN_${action}`,
            title: notification.title,
            message: notification.message,
          },
        });
      }
    });

    // ─── Send email notifications (non-blocking) ─────────────
    const companyName =
      user.businessProfile?.companyName || user.email;

    if (action === "APPROVE") {
      sendApprovedEmail(user.email, companyName).catch((e) =>
        console.warn("Approved email failed:", e)
      );
    } else if (action === "REJECT") {
      sendRejectedEmail(user.email, companyName, reason).catch((e) =>
        console.warn("Rejected email failed:", e)
      );
    } else if (action === "SUSPEND") {
      sendAccountSuspendedEmail(user.email, companyName, reason).catch((e) =>
        console.warn("Suspended email failed:", e)
      );
    } else if (action === "REACTIVATE") {
      sendAccountReactivatedEmail(user.email, companyName).catch((e) =>
        console.warn("Reactivated email failed:", e)
      );
    }

    return NextResponse.json({
      success: true,
      message: `Client ${action.toLowerCase()}d successfully`,
      newStatus,
    });
  } catch (error) {
    console.error("Admin action error:", error);
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 }
    );
  }
}
