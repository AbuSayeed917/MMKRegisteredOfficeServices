import { Button, Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface AdminNewRegistrationEmailProps {
  companyName: string;
  email: string;
  crn: string;
  clientId: string;
}

export function AdminNewRegistrationEmail({
  companyName,
  email,
  crn,
  clientId,
}: AdminNewRegistrationEmailProps) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://mmkregisteredofficeservices-production.up.railway.app";

  return (
    <BaseLayout preview={`New registration: ${companyName} (${crn})`}>
      <Section style={badge}>
        <Text style={badgeText}>New Registration</Text>
      </Section>

      <Heading style={heading}>New Client Application</Heading>
      <Text style={text}>
        A new client has registered for the Registered Office Service and is
        awaiting your review.
      </Text>

      <Section style={box}>
        <table style={table}>
          <tbody>
            <tr>
              <td style={labelCell}>Company</td>
              <td style={valueCell}>{companyName}</td>
            </tr>
            <tr>
              <td style={labelCell}>CRN</td>
              <td style={valueCell}>{crn}</td>
            </tr>
            <tr>
              <td style={labelCell}>Email</td>
              <td style={valueCell}>{email}</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section style={buttonContainer}>
        <Button
          style={button}
          href={`${appUrl}/admin/clients/${clientId}`}
        >
          Review Application
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
  backgroundColor: "#dbeafe",
  color: "#2563eb",
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
  width: "100px",
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
