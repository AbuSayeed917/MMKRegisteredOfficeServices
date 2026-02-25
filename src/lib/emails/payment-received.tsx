import { Button, Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface PaymentReceivedEmailProps {
  companyName: string;
  amount: string;
  date: string;
  nextPaymentDate: string;
}

export function PaymentReceivedEmail({
  companyName,
  amount,
  date,
  nextPaymentDate,
}: PaymentReceivedEmailProps) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://mmkregisteredofficeservices-production.up.railway.app";

  return (
    <BaseLayout preview={`Payment of ${amount} received for ${companyName}`}>
      <Section style={badge}>
        <Text style={badgeText}>Payment Received</Text>
      </Section>

      <Heading style={heading}>Payment Confirmed</Heading>
      <Text style={text}>
        We have received your payment for the registered office service for{" "}
        <strong>{companyName}</strong>.
      </Text>

      <Section style={box}>
        <table style={table}>
          <tbody>
            <tr>
              <td style={labelCell}>Amount</td>
              <td style={valueCell}>{amount}</td>
            </tr>
            <tr>
              <td style={labelCell}>Date</td>
              <td style={valueCell}>{date}</td>
            </tr>
            <tr>
              <td style={labelCell}>Service</td>
              <td style={valueCell}>Registered Office Address</td>
            </tr>
            <tr>
              <td style={labelCell}>Next Payment</td>
              <td style={valueCell}>{nextPaymentDate}</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Text style={text}>
        Your subscription is now active. You can view your payment history and
        manage your subscription in your dashboard.
      </Text>

      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/dashboard/subscription`}>
          View Subscription
        </Button>
      </Section>
    </BaseLayout>
  );
}

const badge = {
  textAlign: "center" as const,
  margin: "0 0 16px",
};

const badgeText = {
  display: "inline-block",
  backgroundColor: "#dcfce7",
  color: "#16a34a",
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
