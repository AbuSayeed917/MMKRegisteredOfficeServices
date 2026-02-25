import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BaseLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function BaseLayout({ preview, children }: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>
              <span style={logoIcon}>M</span> MMK Accountants
            </Text>
            <Text style={tagline}>Registered Office Service</Text>
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              MMK Accountants — Professional Registered Office Service
            </Text>
            <Text style={footerText}>Luton, United Kingdom</Text>
            <Text style={footerSmall}>
              This email was sent by MMK Accountants. If you have questions,
              contact us at info@mmkaccountants.co.uk
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f0f7fb",
  fontFamily:
    "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const header = {
  backgroundColor: "#0c2d42",
  borderRadius: "16px 16px 0 0",
  padding: "32px 40px 24px",
  textAlign: "center" as const,
};

const logoText = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "700" as const,
  margin: "0",
};

const logoIcon = {
  display: "inline-block",
  width: "32px",
  height: "32px",
  backgroundColor: "#0ea5e9",
  color: "#0c2d42",
  borderRadius: "8px",
  textAlign: "center" as const,
  lineHeight: "32px",
  fontWeight: "800" as const,
  fontSize: "18px",
  marginRight: "8px",
  verticalAlign: "middle",
};

const tagline = {
  color: "#7a9eb5",
  fontSize: "13px",
  margin: "4px 0 0",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "32px 40px",
};

const hr = {
  borderColor: "#c0d8e8",
  margin: "0",
};

const footer = {
  backgroundColor: "#ffffff",
  borderRadius: "0 0 16px 16px",
  padding: "20px 40px 24px",
};

const footerText = {
  color: "#7a9eb5",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0",
  textAlign: "center" as const,
};

const footerSmall = {
  color: "#a0b8c8",
  fontSize: "11px",
  lineHeight: "16px",
  margin: "12px 0 0",
  textAlign: "center" as const,
};
