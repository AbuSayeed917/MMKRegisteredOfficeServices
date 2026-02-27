// ─── Enums ────────────────────────────────────────────
export type UserRole = "CLIENT" | "ADMIN" | "SUPER_ADMIN";

export type SubscriptionStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "RENEWAL_PENDING"
  | "EXPIRED"
  | "SUSPENDED"
  | "WITHDRAWN"
  | "REJECTED"
  | "ABANDONED";

export type AgreementStatus = "SIGNED" | "PENDING" | "VOIDED";
export type PaymentStatus = "SUCCEEDED" | "PENDING" | "FAILED" | "REFUNDED";
export type PaymentMethodType = "CARD" | "BACS_DIRECT_DEBIT";
export type AdminActionType =
  | "APPROVE"
  | "REJECT"
  | "SUSPEND"
  | "REACTIVATE"
  | "WITHDRAW"
  | "CANCEL"
  | "REFUND"
  | "NOTE";

export type NotificationType =
  | "REGISTRATION_COMPLETE"
  | "APPLICATION_APPROVED"
  | "APPLICATION_REJECTED"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_FAILED"
  | "RENEWAL_REMINDER"
  | "ACCOUNT_SUSPENDED"
  | "ACCOUNT_REACTIVATED"
  | "WITHDRAWAL_INITIATED"
  | "WITHDRAWAL_COMPLETE"
  | "GENERAL";

// ─── Models ───────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: string | null;
  createdAt: string;
  lastLogin: string | null;
}

export interface Director {
  id: string;
  fullName: string;
  position: string;
  dateOfBirth?: string | null;
}

export interface BusinessProfile {
  id: string;
  companyName: string;
  crn: string;
  companyType: string;
  incorporationDate?: string | null;
  sicCode?: string | null;
  registeredAddress?: string | null;
  tradingAddress?: string | null;
  phone?: string | null;
  directors: Director[];
}

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  startDate: string | null;
  endDate: string | null;
  nextPaymentDate: string | null;
  paymentMethod: PaymentMethodType | null;
}

export interface Payment {
  id: string;
  amount: number; // pence
  currency: string;
  status: PaymentStatus;
  paymentMethod: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface Agreement {
  id: string;
  status: AgreementStatus;
  signatureType: string | null;
  signedAt: string | null;
  pdfUrl: string | null;
  templateVersion?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ─── API Responses ────────────────────────────────────
export interface DashboardResponse {
  user: User;
  business: BusinessProfile | null;
  subscription: Subscription | null;
  agreements: Agreement[];
  notifications: Notification[];
  payments: Payment[];
}

export interface AdminOverviewResponse {
  metrics: {
    totalClients: number;
    activeClients: number;
    pendingApprovals: number;
    suspendedClients: number;
    expiringSubscriptions: number;
    totalRevenue: number; // pence
  };
  recentPayments: AdminPaymentItem[];
  recentRegistrations: AdminClientItem[];
}

export interface AdminClientItem {
  id: string;
  email: string;
  companyName: string | null;
  crn: string | null;
  subscriptionStatus: SubscriptionStatus | null;
  agreementStatus: AgreementStatus | null;
  createdAt: string;
}

export interface AdminClientDetail {
  user: User & { isActive: boolean };
  business: BusinessProfile | null;
  subscription: Subscription | null;
  agreements: Agreement[];
  payments: Payment[];
  adminActions: AdminAction[];
}

export interface AdminAction {
  id: string;
  actionType: AdminActionType;
  reason: string | null;
  notes: string | null;
  adminEmail?: string;
  createdAt: string;
}

export interface AdminPaymentItem {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string | null;
  paidAt: string | null;
  createdAt: string;
  companyName: string | null;
  email: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminPaymentsResponse {
  payments: AdminPaymentItem[];
  summary: Record<PaymentStatus, { count: number; total: number }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
