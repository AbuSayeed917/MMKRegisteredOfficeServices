import { Button, Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface ApplicationApprovedEmailProps {
  companyName: string;
}

export function ApplicationApprovedEmail({
  companyName,
}: ApplicationApprovedEmailProps) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://mmkregisteredofficeservices-production.up.railway.app";

  return (
    <BaseLayout preview={`Your application for ${companyName} has been approved`}>
      <Section style={badge}>
        <Text style={badgeText}>Approved</Text>
      </Section>

      <Heading style={heading}>Application Approved</Heading>
      <Text style={text}>
        Great news! Your registered office service application for{" "}
        <strong>{companyName}</strong> has been approved.
      </Text>
      <Text style={text}>
        To activate your service, please complete your annual payment of{" "}
        <strong>£75.00</strong> via your dashboard.
      </Text>

      <Section style={box}>
        <Text style={boxTitle}>Next step</Text>
        <Text style={boxText}>
          Log in to your dashboard and click &quot;Pay Now&quot; on the
          Subscription page to complete your payment via Stripe.
        </Text>
      </Section>

      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/dashboard/subscription`}>
          Complete Payment — £75
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

const boxTitle = {
  color: "#0c2d42",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 8px",
};

const boxText = {
  color: "#3d6478",
  fontSize: "13px",
  lineHeight: "22px",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#16a34a",
  borderRadius: "9999px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};
