import { NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";

// GET — List admin users (for assignment dropdowns)
export async function GET() {
  try {
    const user = await getUser();
    if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const admins = await db.user.findMany({
      where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
      select: { id: true, email: true },
      orderBy: { email: "asc" },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Failed to list admin users:", error);
    return NextResponse.json(
      { error: "Failed to load admin users" },
      { status: 500 }
    );
  }
}
