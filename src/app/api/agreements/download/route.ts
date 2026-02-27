import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";
import { getSignedDownloadUrl } from "@/lib/s3";
import { generateAgreementPdf } from "@/lib/pdf-generator";

// GET — Download a signed agreement PDF
// Primary: generate on-the-fly from DB data
// Fallback: presigned S3 URL if pdfUrl exists
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
      include: {
        user: {
          include: { businessProfile: true },
        },
        template: true,
      },
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

    if (agreement.status !== "SIGNED") {
      return NextResponse.json(
        { error: "Agreement has not been signed" },
        { status: 400 }
      );
    }

    // Fallback: if pdfUrl exists, try S3 presigned URL
    if (agreement.pdfUrl) {
      try {
        const url = await getSignedDownloadUrl(agreement.pdfUrl);
        return NextResponse.json({ url });
      } catch {
        // S3 failed — fall through to on-the-fly generation
      }
    }

    // Primary: generate PDF on-the-fly from stored agreement data
    if (!agreement.template) {
      return NextResponse.json(
        { error: "Agreement template not found" },
        { status: 400 }
      );
    }

    const companyName =
      agreement.user.businessProfile?.companyName || "";
    const companyNumber =
      agreement.user.businessProfile?.crn || "";

    const pdfBuffer = await generateAgreementPdf({
      contentHtml: agreement.template.contentHtml,
      companyName,
      companyNumber,
      signerName: agreement.signatureData?.includes("data:")
        ? companyName
        : agreement.signatureData || "",
      signatureType: agreement.signatureType as "typed" | "drawn",
      signatureData: agreement.signatureData || "",
      signedAt: agreement.signedAt || new Date(),
      ipAddress: agreement.ipAddress || "unknown",
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="agreement-${companyName.replace(/[^a-zA-Z0-9]/g, "-")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Failed to generate/download PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
