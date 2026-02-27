import { Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface ContactConfirmationEmailProps {
  firstName: string;
  subject: string;
}

export function ContactConfirmationEmail({
  firstName,
  subject,
}: ContactConfirmationEmailProps) {
  return (
    <BaseLayout preview={`We received your message — ${subject}`}>
      <Section style={badge}>
        <Text style={badgeText}>Message Received</Text>
      </Section>

      <Heading style={heading}>Thank You, {firstName}!</Heading>
      <Text style={text}>
        We have received your message regarding <strong>{subject}</strong> and
        our team will get back to you as soon as possible, typically within
        1 business day.
      </Text>

      <Section style={box}>
        <Text style={boxText}>
          If your enquiry is urgent, you can reach us directly at{" "}
          <strong>info@mmkaccountants.co.uk</strong> or call during our office
          hours: Monday – Friday, 9:00 AM – 5:30 PM.
        </Text>
      </Section>

      <Text style={text}>
        Thank you for your interest in MMK Registered Office Service.
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

const boxText = {
  color: "#3d6478",
  fontSize: "13px",
  lineHeight: "22px",
  margin: "0",
};
