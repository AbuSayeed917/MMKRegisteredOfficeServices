import { Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface ContactFormEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactFormEmail({
  firstName,
  lastName,
  email,
  subject,
  message,
}: ContactFormEmailProps) {
  return (
    <BaseLayout preview={`Contact form: ${subject} from ${firstName} ${lastName}`}>
      <Section style={badge}>
        <Text style={badgeText}>Contact Form</Text>
      </Section>

      <Heading style={heading}>New Contact Message</Heading>
      <Text style={text}>
        You have received a new message from the website contact form.
      </Text>

      <Section style={box}>
        <table style={table}>
          <tbody>
            <tr>
              <td style={labelCell}>Name</td>
              <td style={valueCell}>{firstName} {lastName}</td>
            </tr>
            <tr>
              <td style={labelCell}>Email</td>
              <td style={valueCell}>{email}</td>
            </tr>
            <tr>
              <td style={labelCell}>Subject</td>
              <td style={valueCell}>{subject}</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section style={messageBox}>
        <Text style={messageLabel}>Message</Text>
        <Text style={messageText}>{message}</Text>
      </Section>

      <Text style={replyNote}>
        Reply directly to this email to respond to {firstName} at {email}.
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
  width: "80px",
  verticalAlign: "top" as const,
};

const valueCell = {
  color: "#0c2d42",
  fontSize: "13px",
  fontWeight: "600" as const,
  padding: "6px 0",
};

const messageBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "20px 0",
};

const messageLabel = {
  color: "#7a9eb5",
  fontSize: "12px",
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px",
};

const messageText = {
  color: "#0c2d42",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const replyNote = {
  color: "#7a9eb5",
  fontSize: "12px",
  fontStyle: "italic" as const,
  margin: "16px 0 0",
};
