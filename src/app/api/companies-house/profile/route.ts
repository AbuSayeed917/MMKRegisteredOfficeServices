import { NextRequest, NextResponse } from "next/server";
import {
  getCompanyProfile,
  getCompanyOfficers,
  formatAddress,
} from "@/lib/companies-house";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyNumber = searchParams.get("number");

    if (!companyNumber || companyNumber.trim().length === 0) {
      return NextResponse.json(
        { error: "Company number is required" },
        { status: 400 }
      );
    }

    // Company numbers are typically 8 characters, padded with leading zeros
    const paddedNumber = companyNumber.trim().padStart(8, "0");

    // Fetch profile and officers in parallel
    const [profile, officersResponse] = await Promise.all([
      getCompanyProfile(paddedNumber),
      getCompanyOfficers(paddedNumber).catch(() => null), // Don't fail if officers unavailable
    ]);

    // Extract active directors/officers (not resigned)
    const officers = officersResponse?.items
      ?.filter((o) => !o.resigned_on)
      ?.map((o) => ({
        name: o.name,
        role: o.officer_role,
        appointed_on: o.appointed_on,
        date_of_birth: o.date_of_birth,
        address: o.address ? formatAddress(o.address) : undefined,
        nationality: o.nationality,
        country_of_residence: o.country_of_residence,
        occupation: o.occupation,
      })) || [];

    return NextResponse.json({
      company_name: profile.company_name,
      company_number: profile.company_number,
      type: profile.type,
      company_status: profile.company_status,
      company_status_detail: profile.company_status_detail,
      date_of_creation: profile.date_of_creation,
      date_of_cessation: profile.date_of_cessation,
      jurisdiction: profile.jurisdiction,
      sic_codes: profile.sic_codes || [],
      registered_office_address: profile.registered_office_address,
      accounts: profile.accounts,
      confirmation_statement: profile.confirmation_statement,
      can_file: profile.can_file,
      registered_office_is_in_dispute: profile.registered_office_is_in_dispute,
      undeliverable_registered_office_address:
        profile.undeliverable_registered_office_address,
      officers,
    });
  } catch (error) {
    console.error("Companies House profile error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to get company profile";
    const status =
      error instanceof Error && error.message === "Company not found"
        ? 404
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
