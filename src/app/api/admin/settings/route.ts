import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/admin/settings
 * Returns all system settings.
 */
export async function GET() {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const settings = await db.systemSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }

    return NextResponse.json({
      annualFeePence: map.annual_fee_pence ?? String(process.env.ANNUAL_FEE_PENCE ?? "7500"),
    });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/settings
 * Updates system settings.
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { annualFeePence } = body;

    if (annualFeePence !== undefined) {
      const pence = parseInt(annualFeePence, 10);
      if (isNaN(pence) || pence < 0) {
        return NextResponse.json({ error: "Invalid fee amount" }, { status: 400 });
      }

      await db.systemSetting.upsert({
        where: { key: "annual_fee_pence" },
        update: { value: String(pence) },
        create: { key: "annual_fee_pence", value: String(pence) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
