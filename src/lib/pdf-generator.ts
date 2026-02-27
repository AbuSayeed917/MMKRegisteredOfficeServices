/**
 * Agreement PDF Generator
 *
 * Generates a PDF document for the signed registered office service agreement.
 * Uses @react-pdf/renderer to build the PDF server-side.
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
  Font,
} from "@react-pdf/renderer";

// ─── Types ──────────────────────────────────────────────

interface AgreementPdfInput {
  contentHtml: string;
  companyName: string;
  companyNumber: string;
  signerName: string;
  signatureType: "typed" | "drawn";
  signatureData: string; // typed name or base64 image
  signedAt: Date;
  ipAddress: string;
}

// ─── Register custom font for typed signatures ──────────

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
      fontWeight: 400,
      fontStyle: "italic",
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
      fontWeight: 700,
    },
  ],
});

// ─── PDF Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Inter",
    fontSize: 10,
    lineHeight: 1.6,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2px solid #0ea5e9",
    paddingBottom: 15,
  },
  companyTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0c2d42",
    marginBottom: 2,
  },
  companySubtitle: {
    fontSize: 9,
    color: "#666",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#0c2d42",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0c2d42",
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 8,
    textAlign: "justify",
  },
  listItem: {
    fontSize: 10,
    marginBottom: 4,
    paddingLeft: 15,
  },
  parties: {
    backgroundColor: "#f0f7fb",
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  partyLine: {
    fontSize: 10,
    marginBottom: 2,
  },
  signatureBlock: {
    marginTop: 30,
    borderTop: "1px solid #ccc",
    paddingTop: 20,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  signatureCol: {
    width: "45%",
  },
  signatureLabel: {
    fontSize: 8,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  signatureName: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#0c2d42",
    marginBottom: 2,
  },
  signatureImage: {
    height: 60,
    marginBottom: 4,
    objectFit: "contain",
  },
  signatureLine: {
    borderBottom: "1px solid #0c2d42",
    marginTop: 4,
    marginBottom: 4,
  },
  signatureDetail: {
    fontSize: 8,
    color: "#666",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    borderTop: "1px solid #e0e0e0",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: "#999",
  },
  watermark: {
    fontSize: 7,
    color: "#0ea5e9",
    fontWeight: 700,
  },
});

// ─── Parse HTML into simple blocks for PDF ──────────────

interface ContentBlock {
  type: "h1" | "h2" | "p" | "li" | "strong-p";
  text: string;
}

function parseHtmlToBlocks(html: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  // Strip tags and extract structure
  const lines = html
    .replace(/<ul>/g, "")
    .replace(/<\/ul>/g, "")
    .replace(/<br\s*\/?>/g, "\n")
    .split(/(<\/?[^>]+>)/);

  let currentTag = "";

  for (const part of lines) {
    const trimmed = part.trim();

    if (trimmed.startsWith("<h1")) {
      currentTag = "h1";
    } else if (trimmed.startsWith("<h2")) {
      currentTag = "h2";
    } else if (trimmed.startsWith("<p")) {
      currentTag = "p";
    } else if (trimmed.startsWith("<li")) {
      currentTag = "li";
    } else if (
      trimmed.startsWith("</h1") ||
      trimmed.startsWith("</h2") ||
      trimmed.startsWith("</p") ||
      trimmed.startsWith("</li")
    ) {
      currentTag = "";
    } else if (trimmed && currentTag) {
      // Strip remaining inline tags
      const cleanText = trimmed
        .replace(/<[^>]+>/g, "")
        .replace(/&pound;/g, "£")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .trim();

      if (cleanText) {
        blocks.push({
          type: currentTag as ContentBlock["type"],
          text: cleanText,
        });
      }
    }
  }

  return blocks;
}

// ─── Build PDF Document Element ─────────────────────────

function buildDocumentElement(
  input: AgreementPdfInput,
  blocks: ContentBlock[]
) {
  const signedDate = input.signedAt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const signedTime = input.signedAt.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  return React.createElement(
    Document,
    { title: `Agreement - ${input.companyName}`, author: "MMK Accountants" },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.companyTitle }, "MMK Accountants"),
        React.createElement(
          Text,
          { style: styles.companySubtitle },
          "Registered Office Service • Luton, United Kingdom"
        )
      ),

      // Agreement content
      ...blocks.map((block, i) => {
        switch (block.type) {
          case "h1":
            return React.createElement(
              Text,
              { key: `b-${i}`, style: styles.title },
              block.text
            );
          case "h2":
            return React.createElement(
              Text,
              { key: `b-${i}`, style: styles.sectionTitle },
              block.text
            );
          case "li":
            return React.createElement(
              Text,
              { key: `b-${i}`, style: styles.listItem },
              `•  ${block.text}`
            );
          default:
            return React.createElement(
              Text,
              { key: `b-${i}`, style: styles.paragraph },
              block.text
            );
        }
      }),

      // Signature block
      React.createElement(
        View,
        { style: styles.signatureBlock },
        React.createElement(
          View,
          { style: styles.signatureRow },
          // Client signature
          React.createElement(
            View,
            { style: styles.signatureCol },
            React.createElement(
              Text,
              { style: styles.signatureLabel },
              "Signed by (Client)"
            ),
            input.signatureType === "drawn" && input.signatureData.startsWith("data:")
              ? React.createElement(Image, {
                  style: styles.signatureImage,
                  src: input.signatureData,
                })
              : React.createElement(
                  Text,
                  { style: styles.signatureName },
                  input.signatureData
                ),
            React.createElement(View, { style: styles.signatureLine }),
            React.createElement(
              Text,
              { style: styles.signatureDetail },
              input.signerName
            ),
            React.createElement(
              Text,
              { style: styles.signatureDetail },
              `on behalf of ${input.companyName} (${input.companyNumber})`
            )
          ),
          // Provider signature placeholder
          React.createElement(
            View,
            { style: styles.signatureCol },
            React.createElement(
              Text,
              { style: styles.signatureLabel },
              "Signed by (Provider)"
            ),
            React.createElement(
              Text,
              { style: styles.signatureName },
              "MMK Accountants"
            ),
            React.createElement(View, { style: styles.signatureLine }),
            React.createElement(
              Text,
              { style: styles.signatureDetail },
              "MMK Accountants Ltd"
            ),
            React.createElement(
              Text,
              { style: styles.signatureDetail },
              "Registered Office Service Provider"
            )
          )
        ),
        // Metadata
        React.createElement(
          Text,
          { style: styles.signatureDetail },
          `Date: ${signedDate} at ${signedTime}`
        ),
        React.createElement(
          Text,
          { style: styles.signatureDetail },
          `IP Address: ${input.ipAddress}`
        ),
        React.createElement(
          Text,
          { style: styles.signatureDetail },
          `Signature Method: ${input.signatureType === "typed" ? "Typed Name" : "Hand-drawn"}`
        )
      ),

      // Footer
      React.createElement(
        View,
        { style: styles.footer, fixed: true },
        React.createElement(
          Text,
          { style: styles.footerText },
          `MMK Registered Office Service Agreement — ${input.companyName}`
        ),
        React.createElement(
          Text,
          { style: styles.watermark },
          "Electronically Generated"
        )
      )
    )
  );
}

// ─── Public API ─────────────────────────────────────────

export async function generateAgreementPdf(
  input: AgreementPdfInput
): Promise<Buffer> {
  // Replace placeholders in HTML
  let html = input.contentHtml;
  html = html.replace(/\{\{companyName\}\}/g, input.companyName);
  html = html.replace(/\{\{crn\}\}/g, input.companyNumber);
  html = html.replace(/\{\{directorName\}\}/g, input.signerName);
  html = html.replace(
    /\{\{date\}\}/g,
    input.signedAt.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  );

  const blocks = parseHtmlToBlocks(html);
  const doc = buildDocumentElement(input, blocks);
  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
