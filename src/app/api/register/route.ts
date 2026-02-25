import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { mapCompanyType } from "@/lib/companies-house";
import { generateAgreementPdf } from "@/lib/pdf-generator";
import { uploadFile } from "@/lib/s3";
import { sendWelcomeEmail, sendAdminNewRegistrationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { business, director, account, agreement } = body;

    // ─── Validate required fields ─────────────────────────────
    if (!business?.companyName || !business?.companyNumber) {
      return NextResponse.json(
        { error: "Company name and number are required" },
        { status: 400 }
      );
    }

    if (!director?.fullName || !director?.email || !director?.phone) {
      return NextResponse.json(
        { error: "Director details are required" },
        { status: 400 }
      );
    }

    if (!account?.email || !account?.password) {
      return NextResponse.json(
        { error: "Account email and password are required" },
        { status: 400 }
      );
    }

    // Password strength check
    if (account.password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Validate agreement
    if (!agreement?.signatureType || !agreement?.signatureData) {
      return NextResponse.json(
        { error: "Agreement must be signed before registration" },
        { status: 400 }
      );
    }

    // ─── Check for existing user ──────────────────────────────
    const existingUser = await db.user.findUnique({
      where: { email: account.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Check for existing CRN
    const existingBusiness = await db.businessProfile.findUnique({
      where: { crn: business.companyNumber },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: "This company number is already registered with our service" },
        { status: 409 }
      );
    }

    // ─── Map company type to our enum ─────────────────────────
    const companyType = mapCompanyType(business.companyType || "ltd");

    // ─── Hash password ────────────────────────────────────────
    const passwordHash = await bcrypt.hash(account.password, 12);

    // ─── Capture IP address ────────────────────────────────────
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "unknown";

    // ─── Get active agreement template ────────────────────────
    const template = await db.agreementTemplate.findFirst({
      where: { isActive: true },
      orderBy: { version: "desc" },
    });

    // ─── Create user, business profile, director, agreement, and subscription
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: account.email,
          passwordHash,
          role: "CLIENT",
          isActive: true,
        },
      });

      // Create business profile
      const businessProfile = await tx.businessProfile.create({
        data: {
          userId: user.id,
          companyName: business.companyName,
          crn: business.companyNumber,
          companyType: companyType as "LTD" | "LLP" | "PLC" | "SOLE_TRADER" | "PARTNERSHIP",
          incorporationDate: business.incorporationDate
            ? new Date(business.incorporationDate)
            : null,
          sicCode: business.sicCodes?.join(", ") || null,
          registeredAddress: business.registeredAddress || "",
          tradingAddress: business.tradingAddress || null,
          phone: business.phone || null,
        },
      });

      // Create director
      await tx.director.create({
        data: {
          businessProfileId: businessProfile.id,
          fullName: director.fullName,
          position: director.position || "Director",
          dateOfBirth: new Date(director.dateOfBirth),
          residentialAddress: director.residentialAddress || "",
        },
      });

      // Create signed agreement (if template exists)
      let agreementRecord = null;
      if (template) {
        const signedAt = new Date();

        agreementRecord = await tx.agreement.create({
          data: {
            userId: user.id,
            templateId: template.id,
            signatureType: agreement.signatureType,
            signatureData: agreement.signatureData,
            ipAddress,
            status: "SIGNED",
            signedAt,
          },
        });

        // Generate and upload PDF (non-blocking for the transaction)
        // We'll do this outside the transaction to avoid long locks
      }

      // Create subscription (PENDING_APPROVAL status)
      await tx.subscription.create({
        data: {
          userId: user.id,
          status: "PENDING_APPROVAL",
        },
      });

      // Create notification for admin
      const admins = await tx.user.findMany({
        where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
      });

      for (const admin of admins) {
        await tx.notification.create({
          data: {
            userId: admin.id,
            type: "REGISTRATION_COMPLETE",
            title: "New Registration",
            message: `${business.companyName} (CRN: ${business.companyNumber}) has submitted a registration with a signed agreement. Director: ${director.fullName}. Review and approve at your earliest convenience.`,
          },
        });
      }

      // Create notification for the new user
      await tx.notification.create({
        data: {
          userId: user.id,
          type: "REGISTRATION_COMPLETE",
          title: "Registration Submitted",
          message: `Thank you for registering ${business.companyName}. Your signed agreement has been recorded. Your application is pending admin approval. You will receive an email once it has been reviewed.`,
        },
      });

      return {
        userId: user.id,
        businessProfileId: businessProfile.id,
        agreementId: agreementRecord?.id || null,
      };
    });

    // ─── Post-transaction: Generate PDF and upload to S3 ──────
    // This happens outside the transaction so it doesn't block
    if (result.agreementId && template) {
      try {
        const signedAt = new Date();
        const pdfBuffer = await generateAgreementPdf({
          contentHtml: template.contentHtml,
          companyName: business.companyName,
          companyNumber: business.companyNumber,
          signerName: agreement.signerName || director.fullName,
          signatureType: agreement.signatureType,
          signatureData: agreement.signatureData,
          signedAt,
          ipAddress,
        });

        // Upload to S3
        const s3Key = `agreements/${result.userId}/${signedAt.getTime()}-agreement.pdf`;

        try {
          await uploadFile(s3Key, pdfBuffer, "application/pdf");

          // Update the agreement record with the PDF URL
          await db.agreement.update({
            where: { id: result.agreementId },
            data: { pdfUrl: s3Key },
          });
        } catch (s3Error) {
          console.warn("S3 upload failed (agreement still saved):", s3Error);
        }
      } catch (pdfError) {
        console.warn("PDF generation failed (registration still complete):", pdfError);
      }
    }

    // ─── Send emails (non-blocking) ────────────────────────────
    sendWelcomeEmail(account.email, business.companyName).catch((e) =>
      console.warn("Welcome email failed:", e)
    );
    sendAdminNewRegistrationEmail(
      business.companyName,
      account.email,
      business.companyNumber,
      result.userId
    ).catch((e) => console.warn("Admin notification email failed:", e));

    return NextResponse.json(
      {
        success: true,
        message: "Registration submitted successfully",
        userId: result.userId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
