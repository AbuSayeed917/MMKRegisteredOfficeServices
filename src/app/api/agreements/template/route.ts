import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/agreements/template
 * Returns the currently active agreement template.
 */
export async function GET() {
  try {
    const template = await db.agreementTemplate.findFirst({
      where: { isActive: true },
      orderBy: { version: "desc" },
    });

    if (!template) {
      return NextResponse.json(
        { error: "No active agreement template found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: template.id,
      version: template.version,
      contentHtml: template.contentHtml,
    });
  } catch (error) {
    console.error("Failed to fetch agreement template:", error);
    return NextResponse.json(
      { error: "Failed to load agreement template" },
      { status: 500 }
    );
  }
}
