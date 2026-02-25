import { Button, Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface AccountReactivatedEmailProps {
  companyName: string;
}

export function AccountReactivatedEmail({
  companyName,
}: AccountReactivatedEmailProps) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://mmkregisteredofficeservices-production.up.railway.app";

  return (
    <BaseLayout preview={`Account reactivated — ${companyName}`}>
      <Section style={badge}>
        <Text style={badgeText}>Reactivated</Text>
      </Section>

      <Heading style={heading}>Service Reactivated</Heading>
      <Text style={text}>
        Your registered office service for <strong>{companyName}</strong> has
        been reactivated.
      </Text>
      <Text style={text}>
        Your registered office address is now active again. You can access your
        full dashboard and service features.
      </Text>

      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/dashboard`}>
          Go to Dashboard
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
