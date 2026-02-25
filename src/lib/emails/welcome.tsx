import { Button, Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface WelcomeEmailProps {
  companyName: string;
}

export function WelcomeEmail({ companyName }: WelcomeEmailProps) {
  return (
    <BaseLayout preview={`Welcome to MMK Registered Office Service — ${companyName}`}>
      <Heading style={heading}>Welcome to MMK</Heading>
      <Text style={text}>
        Thank you for registering <strong>{companyName}</strong> with our
        Registered Office Service.
      </Text>
      <Text style={text}>
        Your application has been received and is now pending admin review. We
        typically process applications within 1–2 business days.
      </Text>

      <Section style={box}>
        <Text style={boxTitle}>What happens next?</Text>
        <Text style={boxText}>1. Our team reviews your application</Text>
        <Text style={boxText}>2. You receive an approval notification</Text>
        <Text style={boxText}>3. Complete your £75 annual payment</Text>
        <Text style={boxText}>4. Your registered office address is activated</Text>
      </Section>

      <Section style={buttonContainer}>
        <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL || "https://mmkregisteredofficeservices-production.up.railway.app"}/dashboard`}>
          Go to Dashboard
        </Button>
      </Section>

      <Text style={muted}>
        If you did not create this account, please disregard this email.
      </Text>
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

const muted = {
  color: "#7a9eb5",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "16px 0 0",
};
