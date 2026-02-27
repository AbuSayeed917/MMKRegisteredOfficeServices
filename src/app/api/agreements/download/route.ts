import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";
import { getSignedDownloadUrl } from "@/lib/s3";

// GET — Get a presigned download URL for a signed agreement PDF
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const agreementId = searchParams.get("id");

    if (!agreementId) {
      return NextResponse.json(
        { error: "Agreement ID is required" },
        { status: 400 }
      );
    }

    const agreement = await db.agreement.findUnique({
      where: { id: agreementId },
      select: { userId: true, pdfUrl: true, status: true },
    });

    if (!agreement) {
      return NextResponse.json(
        { error: "Agreement not found" },
        { status: 404 }
      );
    }

    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(user.role);
    if (agreement.userId !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (agreement.status !== "SIGNED" || !agreement.pdfUrl) {
      return NextResponse.json(
        { error: "PDF not available for this agreement" },
        { status: 400 }
      );
    }

    const url = await getSignedDownloadUrl(agreement.pdfUrl);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Failed to generate download URL:", error);
    return NextResponse.json(
      { error: "Failed to generate download link" },
      { status: 500 }
    );
  }
}
