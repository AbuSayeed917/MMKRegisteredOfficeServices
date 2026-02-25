/**
 * Companies House API Client
 * https://developer.company-information.service.gov.uk/
 *
 * Uses HTTP Basic Auth with API key as username and empty password.
 * Base URL: https://api.company-information.service.gov.uk
 * Rate limit: 600 requests per 5-minute window
 */

const BASE_URL = "https://api.company-information.service.gov.uk";

function getAuthHeader(): string {
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY;
  if (!apiKey) {
    throw new Error("COMPANIES_HOUSE_API_KEY is not configured");
  }
  // Basic Auth: API key as username, empty password
  return `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
}

// ─── Types ──────────────────────────────────────────────────

export interface CompanySearchResult {
  title: string;
  company_number: string;
  company_type: string;
  company_status: string;
  date_of_creation: string | null;
  date_of_cessation: string | null;
  address_snippet: string;
  address: CompanyAddress;
  description: string;
  links: {
    self: string;
  };
}

export interface CompanyAddress {
  premises?: string;
  address_line_1?: string;
  address_line_2?: string;
  locality?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  care_of?: string;
  po_box?: string;
}

export interface CompanySearchResponse {
  kind: string;
  total_results: number;
  items_per_page: number;
  start_index: number;
  items: CompanySearchResult[];
}

export interface CompanyProfile {
  company_name: string;
  company_number: string;
  type: string;
  company_status: string;
  company_status_detail?: string;
  date_of_creation: string;
  date_of_cessation?: string;
  jurisdiction?: string;
  sic_codes?: string[];
  registered_office_address: CompanyAddress;
  accounts?: {
    accounting_reference_date?: {
      day: number;
      month: number;
    };
    last_accounts?: {
      period_start_on: string;
      period_end_on: string;
      type: string;
    };
    next_accounts?: {
      due_on: string;
      period_start_on: string;
      period_end_on: string;
      overdue: boolean;
    };
  };
  confirmation_statement?: {
    last_made_up_to?: string;
    next_due?: string;
    overdue?: boolean;
  };
  previous_company_names?: Array<{
    name: string;
    effective_from: string;
    ceased_on: string;
  }>;
  has_charges?: boolean;
  has_insolvency_history?: boolean;
  registered_office_is_in_dispute?: boolean;
  undeliverable_registered_office_address?: boolean;
  can_file?: boolean;
  links: {
    self: string;
    filing_history?: string;
    officers?: string;
    charges?: string;
    persons_with_significant_control?: string;
  };
}

// ─── API Functions ──────────────────────────────────────────

/**
 * Search for companies by name or number
 */
export async function searchCompanies(
  query: string,
  itemsPerPage: number = 10,
  startIndex: number = 0
): Promise<CompanySearchResponse> {
  const params = new URLSearchParams({
    q: query,
    items_per_page: itemsPerPage.toString(),
    start_index: startIndex.toString(),
  });

  const response = await fetch(`${BASE_URL}/search/companies?${params}`, {
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid Companies House API key");
    }
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw new Error(`Companies House API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get full company profile by company number
 */
export async function getCompanyProfile(
  companyNumber: string
): Promise<CompanyProfile> {
  const response = await fetch(`${BASE_URL}/company/${companyNumber}`, {
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid Companies House API key");
    }
    if (response.status === 404) {
      throw new Error("Company not found");
    }
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw new Error(`Companies House API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ─── Officers Types ─────────────────────────────────────────

export interface CompanyOfficer {
  name: string;
  officer_role: string;
  date_of_birth?: {
    month: number;
    year: number;
  };
  appointed_on?: string;
  resigned_on?: string;
  address?: CompanyAddress;
  nationality?: string;
  country_of_residence?: string;
  occupation?: string;
  links?: {
    self: string;
    officer: {
      appointments: string;
    };
  };
}

export interface CompanyOfficersResponse {
  kind: string;
  total_results: number;
  items_per_page: number;
  start_index: number;
  items: CompanyOfficer[];
  active_count?: number;
  resigned_count?: number;
}

/**
 * Get company officers (directors, secretaries, etc.)
 */
export async function getCompanyOfficers(
  companyNumber: string
): Promise<CompanyOfficersResponse> {
  const response = await fetch(
    `${BASE_URL}/company/${companyNumber}/officers`,
    {
      headers: {
        Authorization: getAuthHeader(),
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid Companies House API key");
    }
    if (response.status === 404) {
      throw new Error("Officers not found");
    }
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a few minutes.");
    }
    throw new Error(
      `Companies House API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Format a Companies House address into a single line string
 */
export function formatAddress(address: CompanyAddress): string {
  const parts = [
    address.premises,
    address.address_line_1,
    address.address_line_2,
    address.locality,
    address.region,
    address.postal_code,
    address.country,
  ].filter(Boolean);
  return parts.join(", ");
}

/**
 * Map Companies House company type to our CompanyType enum
 */
export function mapCompanyType(chType: string): string {
  const typeMap: Record<string, string> = {
    ltd: "LTD",
    "private-limited-guarant-nsc": "LTD",
    "private-limited-guarant-nsc-limited-exemption": "LTD",
    "private-limited-shares-section-30-exemption": "LTD",
    "private-unlimited": "LTD",
    "private-unlimited-nsc": "LTD",
    plc: "PLC",
    "old-public-company": "PLC",
    llp: "LLP",
    "limited-partnership": "PARTNERSHIP",
    "scottish-partnership": "PARTNERSHIP",
  };

  return typeMap[chType] || "LTD";
}

/**
 * Humanize company type for display
 */
export function humanizeCompanyType(chType: string): string {
  const typeMap: Record<string, string> = {
    ltd: "Private Limited Company",
    "private-limited-guarant-nsc": "Private Limited by Guarantee",
    "private-limited-guarant-nsc-limited-exemption": "Private Limited by Guarantee (Exempt)",
    plc: "Public Limited Company",
    "old-public-company": "Old Public Company",
    llp: "Limited Liability Partnership",
    "limited-partnership": "Limited Partnership",
    "scottish-partnership": "Scottish Partnership",
    "private-unlimited": "Private Unlimited Company",
    "private-unlimited-nsc": "Private Unlimited (NSC)",
    "registered-overseas-entity": "Registered Overseas Entity",
    "royal-charter": "Royal Charter Company",
    "registered-society-non-jurisdictional": "Registered Society",
  };

  return typeMap[chType] || chType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Humanize company status for display
 */
export function humanizeCompanyStatus(status: string): string {
  const statusMap: Record<string, string> = {
    active: "Active",
    dissolved: "Dissolved",
    liquidation: "In Liquidation",
    receivership: "In Receivership",
    administration: "In Administration",
    "voluntary-arrangement": "Voluntary Arrangement",
    "converted-closed": "Converted/Closed",
    "insolvency-proceedings": "Insolvency Proceedings",
    registered: "Registered",
    removed: "Removed",
    closed: "Closed",
    open: "Open",
  };

  return statusMap[status] || status.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
