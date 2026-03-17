export interface BusinessData {
  companyName: string;
  companyNumber: string;
  companyType: string;
  incorporationDate: string;
  registeredAddress: string;
  tradingAddress: string;
  phone: string;
}

export interface DirectorData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  dateOfBirth: string;
  residentialAddress: string;
}

export interface AccountData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function formatCompanyType(type: string): string {
  const map: Record<string, string> = {
    ltd: "Private Limited",
    "private-limited-guarant-nsc": "Private Limited by Guarantee",
    "private-limited-guarant-nsc-limited-exemption":
      "Private Limited by Guarantee (Exempt)",
    plc: "Public Limited Company",
    llp: "Limited Liability Partnership",
  };
  return map[type] || type.replace(/-/g, " ");
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidDateOfBirth(dob: string): boolean {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(dob);
}
