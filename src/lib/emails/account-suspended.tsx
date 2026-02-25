import { Button, Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface AccountSuspendedEmailProps {
  companyName: string;
  reason?: string;
}

export function AccountSuspendedEmail({
  companyName,
  reason,
}: AccountSuspendedEmailProps) {
  return (
    <BaseLayout preview={`Account suspended — ${companyName}`}>
      <Section style={badge}>
        <Text style={badgeText}>Account Suspended</Text>
      </Section>

      <Heading style={heading}>Service Suspended</Heading>
      <Text style={text}>
        Your registered office service for <strong>{companyName}</strong> has
        been suspended.
      </Text>

      {reason && (
        <Section style={box}>
          <Text style={boxTitle}>Reason</Text>
          <Text style={boxText}>{reason}</Text>
        </Section>
      )}

      <Text style={text}>
        While your account is suspended, your registered office address will not
        be active with Companies House. To reactivate your service, please
        contact our team.
      </Text>

      <Section style={buttonContainer}>
        <Button style={button} href="mailto:info@mmkaccountants.co.uk">
          Contact Us
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
  backgroundColor: "#fef2f2",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "20px 0",
  borderLeft: "4px solid #ef4444",
};

const boxTitle = {
  color: "#991b1b",
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
