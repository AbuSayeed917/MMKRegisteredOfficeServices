import { Button, Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface RenewalReminderEmailProps {
  companyName: string;
  daysLeft: number;
  expiryDate: string;
}

export function RenewalReminderEmail({
  companyName,
  daysLeft,
  expiryDate,
}: RenewalReminderEmailProps) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://mmkregisteredofficeservices-production.up.railway.app";

  const urgencyText =
    daysLeft <= 7
      ? "Your subscription expires very soon. Please renew immediately to avoid service interruption."
      : daysLeft <= 30
        ? "Your subscription is expiring soon. Please renew to maintain your registered office address."
        : "This is an early reminder that your subscription will be up for renewal.";

  return (
    <BaseLayout preview={`Renewal reminder — ${companyName} expires in ${daysLeft} days`}>
      <Section style={badge}>
        <Text style={daysLeft <= 7 ? badgeUrgent : badgeNormal}>
          {daysLeft} days remaining
        </Text>
      </Section>

      <Heading style={heading}>Subscription Renewal</Heading>
      <Text style={text}>
        Your registered office service subscription for{" "}
        <strong>{companyName}</strong> is due for renewal.
      </Text>

      <Section style={box}>
        <table style={table}>
          <tbody>
            <tr>
              <td style={labelCell}>Expiry Date</td>
              <td style={valueCell}>{expiryDate}</td>
            </tr>
            <tr>
              <td style={labelCell}>Renewal Fee</td>
              <td style={valueCell}>£75.00</td>
            </tr>
            <tr>
              <td style={labelCell}>Days Remaining</td>
              <td style={valueCell}>{daysLeft} days</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Text style={text}>{urgencyText}</Text>

      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/dashboard/subscription`}>
          Renew Now — £75
        </Button>
      </Section>
    </BaseLayout>
  );
}

const badge = {
  textAlign: "center" as const,
  margin: "0 0 16px",
};

const badgeNormal = {
  display: "inline-block",
  backgroundColor: "#fef3c7",
  color: "#d97706",
  fontSize: "12px",
  fontWeight: "600" as const,
  borderRadius: "9999px",
  padding: "4px 16px",
  margin: "0",
};

const badgeUrgent = {
  display: "inline-block",
  backgroundColor: "#fef2f2",
  color: "#dc2626",
  fontSize: "12px",
  fontWeight: "600" as const,
  borderRadius: "9999px",
  padding: "4px 16px",
  margin: "0",
};

const heading = {
  color: "#0c2d42",
  fontSize: "24px",
  fontWeight: "700" as const,
  margin: "0 0 16px",
};

const text = {
  color: "#3d6478",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 12px",
};

const box = {
  backgroundColor: "#f0f7fb",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "20px 0",
};

const table = {
  width: "100%" as const,
  borderCollapse: "collapse" as const,
};

const labelCell = {
  color: "#7a9eb5",
  fontSize: "13px",
  padding: "6px 0",
  width: "140px",
};

const valueCell = {
  color: "#0c2d42",
  fontSize: "13px",
  fontWeight: "600" as const,
  padding: "6px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#0ea5e9",
  borderRadius: "9999px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};
