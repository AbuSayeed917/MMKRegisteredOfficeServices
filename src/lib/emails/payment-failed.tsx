import { Button, Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface PaymentFailedEmailProps {
  companyName: string;
  retryCount: number;
}

export function PaymentFailedEmail({
  companyName,
  retryCount,
}: PaymentFailedEmailProps) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://mmkregisteredofficeservices-production.up.railway.app";

  const urgency =
    retryCount >= 3
      ? "Your account has been suspended due to repeated payment failures."
      : retryCount >= 2
        ? "This is your final reminder. Please update your payment method to avoid suspension."
        : "Please update your payment method or try again.";

  return (
    <BaseLayout preview={`Payment failed for ${companyName} — action required`}>
      <Section style={badge}>
        <Text style={badgeText}>Action Required</Text>
      </Section>

      <Heading style={heading}>Payment Failed</Heading>
      <Text style={text}>
        We were unable to process the payment for the registered office service
        for <strong>{companyName}</strong>.
      </Text>

      <Section style={box}>
        <Text style={boxText}>{urgency}</Text>
        {retryCount < 3 && (
          <Text style={boxSmall}>
            Attempt {retryCount} of 3. Your account will be suspended after 3
            failed attempts.
          </Text>
        )}
      </Section>

      <Section style={buttonContainer}>
        <Button style={button} href={`${appUrl}/dashboard/subscription`}>
          Update Payment Method
        </Button>
      </Section>

      <Text style={muted}>
        If you need assistance, contact us at info@mmkaccountants.co.uk
      </Text>
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

const boxText = {
  color: "#991b1b",
  fontSize: "13px",
  lineHeight: "22px",
  margin: "0",
};

const boxSmall = {
  color: "#7a9eb5",
  fontSize: "12px",
  margin: "8px 0 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#dc2626",
  borderRadius: "9999px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const muted = {
  color: "#7a9eb5",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "16px 0 0",
};
