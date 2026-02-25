import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * PATCH /api/profile
 * Updates the authenticated user's business profile details.
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tradingAddress, phone } = body;

    const profile = await db.businessProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 }
      );
    }

    // Only allow updating non-critical fields (trading address, phone)
    // Company name, CRN, registered address changes require admin approval
    const updateData: Record<string, string | null> = {};

    if (tradingAddress !== undefined) {
      updateData.tradingAddress = tradingAddress || null;
    }
    if (phone !== undefined) {
      updateData.phone = phone || null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    await db.businessProfile.update({
      where: { id: profile.id },
      data: updateData,
    });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
