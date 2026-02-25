import { NextRequest, NextResponse } from "next/server";
import { searchCompanies } from "@/lib/companies-house";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 20) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 20" },
        { status: 400 }
      );
    }

    const results = await searchCompanies(query.trim(), limit);

    return NextResponse.json({
      total_results: results.total_results,
      items: results.items.map((item) => ({
        company_name: item.title,
        company_number: item.company_number,
        company_type: item.company_type,
        company_status: item.company_status,
        date_of_creation: item.date_of_creation,
        address_snippet: item.address_snippet,
        address: item.address,
      })),
    });
  } catch (error) {
    console.error("Companies House search error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to search companies";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
