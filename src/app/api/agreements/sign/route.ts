import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateAgreementPdf } from "@/lib/pdf-generator";
import { uploadFile } from "@/lib/s3";

/**
 * POST /api/agreements/sign
 * Signs an agreement for a user during registration.
 * Records signature data, timestamp, IP address, generates PDF, and stores it.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      userId,
      templateId,
      signatureType,
      signatureData,
      signerName,
      companyName,
      companyNumber,
    } = body;

    // Validate required fields
    if (!userId || !templateId || !signatureType || !signatureData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["typed", "drawn"].includes(signatureType)) {
      return NextResponse.json(
        { error: "Invalid signature type" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { businessProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the agreement template
    const template = await db.agreementTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Agreement template not found" },
        { status: 404 }
      );
    }

    // Capture IP address
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "unknown";

    const signedAt = new Date();

    // Generate PDF
    let pdfUrl: string | null = null;

    try {
      const pdfBuffer = await generateAgreementPdf({
        contentHtml: template.contentHtml,
        companyName: companyName || user.businessProfile?.companyName || "",
        companyNumber: companyNumber || user.businessProfile?.crn || "",
        signerName: signerName || "",
        signatureType,
        signatureData,
        signedAt,
        ipAddress,
      });

      // Upload to S3
      const s3Key = `agreements/${userId}/${signedAt.getTime()}-agreement.pdf`;

      try {
        await uploadFile(s3Key, pdfBuffer, "application/pdf");
        pdfUrl = s3Key;
      } catch (s3Error) {
        // S3 upload is non-blocking — agreement is still valid without the PDF stored
        console.warn("S3 upload failed (agreement still saved):", s3Error);
      }
    } catch (pdfError) {
      // PDF generation is non-blocking — we still save the agreement record
      console.warn("PDF generation failed (agreement still saved):", pdfError);
    }

    // Create the agreement record
    const agreement = await db.agreement.create({
      data: {
        userId,
        templateId,
        signatureType,
        signatureData,
        ipAddress,
        pdfUrl,
        status: "SIGNED",
        signedAt,
      },
    });

    return NextResponse.json(
      {
        agreementId: agreement.id,
        signedAt: agreement.signedAt,
        pdfUrl: agreement.pdfUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Agreement signing failed:", error);
    return NextResponse.json(
      { error: "Failed to sign agreement" },
      { status: 500 }
    );
  }
}
