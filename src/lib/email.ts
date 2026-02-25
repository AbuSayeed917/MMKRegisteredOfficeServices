import { Resend } from "resend";
import { render } from "@react-email/components";
import { WelcomeEmail } from "./emails/welcome";
import { ApplicationApprovedEmail } from "./emails/application-approved";
import { ApplicationRejectedEmail } from "./emails/application-rejected";
import { PaymentReceivedEmail } from "./emails/payment-received";
import { PaymentFailedEmail } from "./emails/payment-failed";
import { RenewalReminderEmail } from "./emails/renewal-reminder";
import { AccountSuspendedEmail } from "./emails/account-suspended";
import { AccountReactivatedEmail } from "./emails/account-reactivated";
import { AdminNewRegistrationEmail } from "./emails/admin-new-registration";

// Lazy initialization to avoid throwing during build when RESEND_API_KEY is absent
let _resend: Resend | null = null;
function getResendClient(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set in environment variables");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    const client = getResendClient();
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});

const FROM_EMAIL =
  process.env.FROM_EMAIL ?? "MMK Accountants <noreply@mmkaccountants.co.uk>";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? "admin@mmkaccountants.co.uk";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    return await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    return null;
  }
}

// ─── Template-based email senders ──────────────────────────

export async function sendWelcomeEmail(to: string, companyName: string) {
  const html = await render(WelcomeEmail({ companyName }));
  return sendEmail({
    to,
    subject: `Welcome to MMK Registered Office Service — ${companyName}`,
    html,
  });
}

export async function sendApprovedEmail(to: string, companyName: string) {
  const html = await render(ApplicationApprovedEmail({ companyName }));
  return sendEmail({
    to,
    subject: `Application Approved — ${companyName}`,
    html,
  });
}

export async function sendRejectedEmail(
  to: string,
  companyName: string,
  reason?: string
) {
  const html = await render(ApplicationRejectedEmail({ companyName, reason }));
  return sendEmail({
    to,
    subject: `Application Update — ${companyName}`,
    html,
  });
}

export async function sendPaymentReceivedEmail(
  to: string,
  companyName: string,
  amount: string,
  date: string,
  nextPaymentDate: string
) {
  const html = await render(
    PaymentReceivedEmail({ companyName, amount, date, nextPaymentDate })
  );
  return sendEmail({
    to,
    subject: `Payment Confirmed — ${amount} for ${companyName}`,
    html,
  });
}

export async function sendPaymentFailedEmail(
  to: string,
  companyName: string,
  retryCount: number
) {
  const html = await render(PaymentFailedEmail({ companyName, retryCount }));
  return sendEmail({
    to,
    subject: `Payment Failed — Action Required for ${companyName}`,
    html,
  });
}

export async function sendRenewalReminderEmail(
  to: string,
  companyName: string,
  daysLeft: number,
  expiryDate: string
) {
  const html = await render(
    RenewalReminderEmail({ companyName, daysLeft, expiryDate })
  );
  return sendEmail({
    to,
    subject: `Renewal Reminder — ${companyName} expires in ${daysLeft} days`,
    html,
  });
}

export async function sendAccountSuspendedEmail(
  to: string,
  companyName: string,
  reason?: string
) {
  const html = await render(AccountSuspendedEmail({ companyName, reason }));
  return sendEmail({
    to,
    subject: `Account Suspended — ${companyName}`,
    html,
  });
}

export async function sendAccountReactivatedEmail(
  to: string,
  companyName: string
) {
  const html = await render(AccountReactivatedEmail({ companyName }));
  return sendEmail({
    to,
    subject: `Account Reactivated — ${companyName}`,
    html,
  });
}

export async function sendAdminNewRegistrationEmail(
  companyName: string,
  email: string,
  crn: string,
  clientId: string
) {
  const html = await render(
    AdminNewRegistrationEmail({ companyName, email, crn, clientId })
  );
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Registration: ${companyName} (${crn})`,
    html,
  });
}
