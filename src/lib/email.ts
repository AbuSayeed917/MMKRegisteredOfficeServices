import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set in environment variables");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.FROM_EMAIL ?? "MMK Accountants <noreply@mmkaccountants.co.uk>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}
