/**
 * Types for Companies House API responses (client-side)
 */

export interface CompanySearchItem {
  company_name: string;
  company_number: string;
  company_type: string;
  company_status: string;
  date_of_creation: string | null;
  address_snippet: string;
  address: {
    premises?: string;
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface CompanySearchResponse {
  total_results: number;
  items: CompanySearchItem[];
}

export interface CompanyProfileResponse {
  company_name: string;
  company_number: string;
  type: string;
  company_status: string;
  company_status_detail?: string;
  date_of_creation: string;
  date_of_cessation?: string;
  jurisdiction?: string;
  sic_codes: string[];
  registered_office_address: {
    premises?: string;
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    region?: string;
    postal_code?: string;
    country?: string;
    care_of?: string;
    po_box?: string;
  };
  accounts?: {
    accounting_reference_date?: {
      day: number;
      month: number;
    };
    next_accounts?: {
      due_on: string;
      overdue: boolean;
    };
  };
  confirmation_statement?: {
    next_due?: string;
    overdue?: boolean;
  };
  can_file?: boolean;
  registered_office_is_in_dispute?: boolean;
  undeliverable_registered_office_address?: boolean;
  officers?: CompanyOfficer[];
}

export interface CompanyOfficer {
  name: string;
  role: string;
  appointed_on?: string;
  date_of_birth?: {
    month: number;
    year: number;
  };
  address?: string;
  nationality?: string;
  country_of_residence?: string;
  occupation?: string;
}

/**
 * Registration form data for business details step
 */
export interface BusinessDetailsFormData {
  companyName: string;
  companyNumber: string;
  companyType: string;
  companyStatus: string;
  incorporationDate: string;
  sicCodes: string[];
  registeredAddress: string;
  tradingAddress: string;
  phone: string;
}
