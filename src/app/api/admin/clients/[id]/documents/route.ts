import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/db";

/**
 * GET /api/admin/clients/[id]/documents?directorId=xxx
 * Returns the KYC document data for a specific director (admin only).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getUser();
    if (
      !authUser ||
      !["ADMIN", "SUPER_ADMIN"].includes(authUser.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const directorId = request.nextUrl.searchParams.get("directorId");

    // Verify the client exists
    const user = await db.user.findUnique({
      where: { id },
      include: {
        businessProfile: {
          include: { directors: true },
        },
      },
    });

    if (!user || user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    if (!user.businessProfile) {
      return NextResponse.json(
        { error: "No business profile found" },
        { status: 404 }
      );
    }

    // If directorId specified, return docs for that director
    if (directorId) {
      const director = user.businessProfile.directors.find(
        (d) => d.id === directorId
      );

      if (!director) {
        return NextResponse.json(
          { error: "Director not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        directorId: director.id,
        fullName: director.fullName,
        idDocument: director.idDocumentData
          ? {
              data: director.idDocumentData,
              name: director.idDocumentName,
              type: director.idDocumentType,
            }
          : null,
        addressProof: director.addressProofData
          ? {
              data: director.addressProofData,
              name: director.addressProofName,
              type: director.addressProofType,
            }
          : null,
      });
    }

    // Return summary for all directors
    return NextResponse.json({
      directors: user.businessProfile.directors.map((d) => ({
        id: d.id,
        fullName: d.fullName,
        idDocument: d.idDocumentData
          ? {
              data: d.idDocumentData,
              name: d.idDocumentName,
              type: d.idDocumentType,
            }
          : null,
        addressProof: d.addressProofData
          ? {
              data: d.addressProofData,
              name: d.addressProofName,
              type: d.addressProofType,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Admin documents error:", error);
    return NextResponse.json(
      { error: "Failed to load documents" },
      { status: 500 }
    );
  }
}
