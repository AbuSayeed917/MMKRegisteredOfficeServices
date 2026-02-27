import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

/**
 * POST /api/admin/import
 * Bulk import clients from CSV data.
 * Expects JSON body with array of client records.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await getUser();
    if (
      !authUser ||
      !["ADMIN", "SUPER_ADMIN"].includes(authUser.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { clients } = body;

    if (!Array.isArray(clients) || clients.length === 0) {
      return NextResponse.json(
        { error: "No client data provided" },
        { status: 400 }
      );
    }

    if (clients.length > 200) {
      return NextResponse.json(
        { error: "Maximum 200 clients per import" },
        { status: 400 }
      );
    }

    const results: {
      success: number;
      failed: number;
      errors: { row: number; email: string; error: string }[];
    } = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const rowNum = i + 1;

      try {
        // Validate required fields
        if (!client.email || !client.companyName || !client.crn) {
          results.failed++;
          results.errors.push({
            row: rowNum,
            email: client.email || "missing",
            error: "Missing required fields: email, companyName, crn",
          });
          continue;
        }

        // Check for existing user
        const existingUser = await db.user.findUnique({
          where: { email: client.email },
        });

        if (existingUser) {
          results.failed++;
          results.errors.push({
            row: rowNum,
            email: client.email,
            error: "Email already exists",
          });
          continue;
        }

        // Check for existing CRN
        const existingBusiness = await db.businessProfile.findUnique({
          where: { crn: client.crn },
        });

        if (existingBusiness) {
          results.failed++;
          results.errors.push({
            row: rowNum,
            email: client.email,
            error: `CRN ${client.crn} already registered`,
          });
          continue;
        }

        // Generate temporary password
        const tempPassword = generateTempPassword();
        const passwordHash = await bcrypt.hash(tempPassword, 12);

        // Map company type
        const companyType = mapCompanyType(client.companyType);

        // Create user + business profile + subscription in transaction
        await db.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              email: client.email,
              passwordHash,
              role: "CLIENT",
              isActive: true,
            },
          });

          const businessProfile = await tx.businessProfile.create({
            data: {
              userId: user.id,
              companyName: client.companyName,
              crn: client.crn,
              companyType,
              incorporationDate: client.incorporationDate
                ? new Date(client.incorporationDate)
                : null,
              sicCode: client.sicCode || null,
              registeredAddress:
                client.registeredAddress || "Pending — to be updated",
              tradingAddress: client.tradingAddress || null,
              phone: client.phone || null,
            },
          });

          // Create director if provided
          if (client.directorName) {
            await tx.director.create({
              data: {
                businessProfileId: businessProfile.id,
                fullName: client.directorName,
                position: client.directorPosition || "Director",
                dateOfBirth: client.directorDob
                  ? new Date(client.directorDob)
                  : new Date("1970-01-01"),
                residentialAddress:
                  client.directorAddress || "Pending — to be updated",
              },
            });
          }

          // Create subscription (ACTIVE with 90-day grace period)
          const now = new Date();
          const graceEnd = new Date(now);
          graceEnd.setDate(graceEnd.getDate() + 90);

          await tx.subscription.create({
            data: {
              userId: user.id,
              status: "ACTIVE",
              startDate: now,
              endDate: graceEnd,
              nextPaymentDate: graceEnd,
              paymentMethod: client.paymentMethod === "BACS"
                ? "BACS_DIRECT_DEBIT"
                : "CARD",
            },
          });

          // Create welcome notification
          await tx.notification.create({
            data: {
              userId: user.id,
              type: "REGISTRATION_COMPLETE",
              title: "Welcome to MMK Registered Office Service",
              message: `Your account has been migrated. Your temporary password is: ${tempPassword}. Please log in and change it. You have a 90-day grace period before payment is required.`,
            },
          });
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: rowNum,
          email: client.email || "unknown",
          error:
            error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import complete: ${results.success} succeeded, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Import failed" },
      { status: 500 }
    );
  }
}

function generateTempPassword(): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password + "!1";
}

function mapCompanyType(
  type?: string
): "LTD" | "LLP" | "PLC" | "SOLE_TRADER" | "PARTNERSHIP" {
  if (!type) return "LTD";
  const upper = type.toUpperCase().trim();
  if (upper.includes("LLP")) return "LLP";
  if (upper.includes("PLC")) return "PLC";
  if (upper.includes("SOLE") || upper.includes("TRADER"))
    return "SOLE_TRADER";
  if (upper.includes("PARTNER")) return "PARTNERSHIP";
  return "LTD";
}
