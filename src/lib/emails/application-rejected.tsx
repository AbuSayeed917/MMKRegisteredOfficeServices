import { Button, Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface ApplicationRejectedEmailProps {
  companyName: string;
  reason?: string;
}

export function ApplicationRejectedEmail({
  companyName,
  reason,
}: ApplicationRejectedEmailProps) {
  return (
    <BaseLayout preview={`Update regarding your application for ${companyName}`}>
      <Heading style={heading}>Application Update</Heading>
      <Text style={text}>
        We regret to inform you that your registered office service application
        for <strong>{companyName}</strong> has not been approved at this time.
      </Text>

      {reason && (
        <Section style={box}>
          <Text style={boxTitle}>Reason</Text>
          <Text style={boxText}>{reason}</Text>
        </Section>
      )}

      <Text style={text}>
        If you believe this was made in error, or would like to discuss this
        further, please contact our team.
      </Text>

      <Section style={buttonContainer}>
        <Button style={button} href={`mailto:info@mmkaccountants.co.uk`}>
          Contact Us
        </Button>
      </Section>
    </BaseLayout>
  );
}

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
