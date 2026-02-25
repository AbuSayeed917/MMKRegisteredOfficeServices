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

export type CompanyType = "LTD" | "LLP" | "PLC" | "SOLE_TRADER" | "PARTNERSHIP";

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
