import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { mapCompanyType } from "@/lib/companies-house";
import { generateAgreementPdf } from "@/lib/pdf-generator";
import { uploadFile } from "@/lib/s3";
import { sendWelcomeEmail, sendAdminNewRegistrationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`register:${ip}`, { maxRequests: 5, windowMs: 15 * 60 * 1000 });
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const { business, director, documents, account, agreement } = body;

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

    // Validate documents
    if (!documents?.idDocument?.data || !documents?.addressProof?.data) {
      return NextResponse.json(
        { error: "Both Photo ID and Proof of Address documents are required" },
        { status: 400 }
      );
    }

    // Validate document sizes (max ~2.7MB base64 ≈ 2MB file)
    const MAX_DOC_BASE64_SIZE = 3 * 1024 * 1024; // 3MB base64 string
    if (documents.idDocument.data.length > MAX_DOC_BASE64_SIZE) {
      return NextResponse.json(
        { error: "Photo ID file is too large. Maximum 2MB allowed." },
        { status: 400 }
      );
    }
    if (documents.addressProof.data.length > MAX_DOC_BASE64_SIZE) {
      return NextResponse.json(
        { error: "Proof of Address file is too large. Maximum 2MB allowed." },
        { status: 400 }
      );
    }

    // ─── Normalize email ──────────────────────────────────────
    const normalizedEmail = account.email.toLowerCase().trim();

    // ─── Check for existing user ──────────────────────────────
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
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
          email: normalizedEmail,
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

      // Create director with KYC documents
      try {
        await tx.director.create({
          data: {
            businessProfileId: businessProfile.id,
            fullName: director.fullName,
            position: director.position || "Director",
            dateOfBirth: new Date(director.dateOfBirth),
            residentialAddress: director.residentialAddress || "",
            idDocumentData: documents.idDocument.data,
            idDocumentName: documents.idDocument.name,
            idDocumentType: documents.idDocument.type,
            addressProofData: documents.addressProof.data,
            addressProofName: documents.addressProof.name,
            addressProofType: documents.addressProof.type,
          },
        });
      } catch (directorError) {
        const err = directorError as { code?: string; message?: string };
        console.error("Director create failed:", {
          code: err.code,
          message: err.message?.slice(-300),
          docDataLengths: {
            id: documents.idDocument.data?.length,
            proof: documents.addressProof.data?.length,
          },
        });
        throw directorError;
      }

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
      }

      // Create subscription (DRAFT — will become PENDING_APPROVAL after payment)
      const subscription = await tx.subscription.create({
        data: {
          userId: user.id,
          status: "DRAFT",
        },
      });

      // Create notification for the new user
      await tx.notification.create({
        data: {
          userId: user.id,
          type: "REGISTRATION_COMPLETE",
          title: "Registration Submitted",
          message: `Thank you for registering ${business.companyName}. Please complete payment to finalise your application.`,
        },
      });

      return {
        userId: user.id,
        businessProfileId: businessProfile.id,
        agreementId: agreementRecord?.id || null,
        subscriptionId: subscription.id,
        companyName: business.companyName,
        crn: business.companyNumber,
      };
    });

    // ─── Post-transaction: Generate PDF and upload to S3 ──────
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

        const s3Key = `agreements/${result.userId}/${signedAt.getTime()}-agreement.pdf`;

        try {
          await uploadFile(s3Key, pdfBuffer, "application/pdf");
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

    // ─── Create Stripe Checkout Session ──────────────────────
    let checkoutUrl: string | null = null;
    try {
      const customer = await stripe.customers.create({
        email: normalizedEmail,
        metadata: {
          userId: result.userId,
          companyName: result.companyName,
          crn: result.crn,
        },
      });

      await db.subscription.update({
        where: { id: result.subscriptionId },
        data: { stripeCustomerId: customer.id },
      });

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: "Registered Office Service",
                description:
                  "Annual registered office address service at MMK Accountants, Luton",
              },
              unit_amount: 7500,
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: result.userId,
          subscriptionId: result.subscriptionId,
        },
        success_url: `${baseUrl}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/dashboard/payment/cancel`,
      });

      checkoutUrl = checkoutSession.url;
    } catch (stripeError) {
      console.warn("Stripe checkout creation failed:", stripeError);
    }

    // ─── Send emails (non-blocking) ────────────────────────────
    sendWelcomeEmail(normalizedEmail, business.companyName).catch((e) =>
      console.warn("Welcome email failed:", e)
    );
    sendAdminNewRegistrationEmail(
      business.companyName,
      normalizedEmail,
      business.companyNumber,
      result.userId
    ).catch((e) => console.warn("Admin notification email failed:", e));

    return NextResponse.json(
      {
        success: true,
        message: "Registration submitted successfully",
        userId: result.userId,
        checkoutUrl,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as { code?: string; meta?: { target?: string[] }; message?: string };
    // Log the full error server-side for debugging
    console.error("Registration error — code:", err.code, "meta:", JSON.stringify(err.meta));
    console.error("Registration error — message tail:", err.message?.slice(-500));

    let errorMessage = "Registration failed. Please try again.";

    if (err.code === "P2002") {
      const field = err.meta?.target?.[0] || "field";
      errorMessage = `A record with this ${field} already exists.`;
    } else if (err.code) {
      errorMessage = `Database error (${err.code}). Please try again or contact support.`;
    }
    // Never return raw Prisma error messages to the client (they can be huge)

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
