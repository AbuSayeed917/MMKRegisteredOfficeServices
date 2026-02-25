-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('LTD', 'LLP', 'PLC', 'SOLE_TRADER', 'PARTNERSHIP');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'RENEWAL_PENDING', 'EXPIRED', 'SUSPENDED', 'WITHDRAWN', 'REJECTED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('SIGNED', 'PENDING', 'VOIDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCEEDED', 'PENDING', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CARD', 'BACS_DIRECT_DEBIT');

-- CreateEnum
CREATE TYPE "AdminActionType" AS ENUM ('APPROVE', 'REJECT', 'SUSPEND', 'REACTIVATE', 'WITHDRAW', 'CANCEL', 'REFUND', 'NOTE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "email_verified" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_codes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "crn" TEXT NOT NULL,
    "company_type" "CompanyType" NOT NULL,
    "incorporation_date" TIMESTAMP(3),
    "sic_code" TEXT,
    "registered_address" TEXT NOT NULL,
    "trading_address" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directors" (
    "id" TEXT NOT NULL,
    "business_profile_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "residential_address" TEXT NOT NULL,
    "id_document_url" TEXT,
    "address_proof_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "directors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreement_templates" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "content_html" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agreement_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "signature_type" TEXT NOT NULL,
    "signature_data" TEXT,
    "ip_address" TEXT,
    "pdf_url" TEXT,
    "status" "AgreementStatus" NOT NULL DEFAULT 'PENDING',
    "signed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'DRAFT',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "next_payment_date" TIMESTAMP(3),
    "payment_method" "PaymentMethodType",
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_mandate_id" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'gbp',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_method" "PaymentMethodType" NOT NULL,
    "stripe_payment_intent_id" TEXT,
    "invoice_url" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_actions" (
    "id" TEXT NOT NULL,
    "admin_user_id" TEXT NOT NULL,
    "target_user_id" TEXT NOT NULL,
    "action_type" "AdminActionType" NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");

-- CreateIndex
CREATE UNIQUE INDEX "business_profiles_user_id_key" ON "business_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_profiles_crn_key" ON "business_profiles"("crn");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");

-- AddForeignKey
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_profiles" ADD CONSTRAINT "business_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directors" ADD CONSTRAINT "directors_business_profile_id_fkey" FOREIGN KEY ("business_profile_id") REFERENCES "business_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "agreement_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
