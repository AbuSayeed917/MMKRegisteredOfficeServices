/**
 * iOS 26 Liquid Glass — Color System
 * Inspired by Apple's 2025 design language: muted tones, vibrant accents,
 * translucent surfaces, and adaptive depth.
 */
export const Colors = {
  // ── Core Brand ──────────────────────────────────────────
  primary: "#0a1628",        // Deep ink (near-black navy)
  primaryMid: "#1a2d4a",
  primaryLight: "#2a4a6b",

  // Accent — Saturated Blue (Apple-style system blue)
  accent: "#007AFF",         // iOS system blue
  accentLight: "#5AC8FA",    // iOS system teal
  accentDark: "#0051D5",

  // ── Backgrounds (light, airy, Apple-style) ──────────────
  bgPrimary: "#F2F2F7",     // iOS system grouped background
  bgLight: "#F2F2F7",
  bgDark: "#000000",
  bgSecondary: "#FFFFFF",    // Secondary grouped background
  bgTertiary: "#F2F2F7",
  bgSection: "#E5E5EA",     // iOS system gray 5

  // ── Glass Surfaces ──────────────────────────────────────
  glass: "rgba(255, 255, 255, 0.72)",          // Light glass
  glassLight: "rgba(255, 255, 255, 0.56)",     // Lighter glass
  glassDark: "rgba(0, 0, 0, 0.32)",            // Dark glass
  glassUltraThin: "rgba(255, 255, 255, 0.40)", // Ultra thin glass
  glassBorder: "rgba(255, 255, 255, 0.18)",    // Glass edge highlight
  glassBorderDark: "rgba(0, 0, 0, 0.08)",

  // ── Text (SF Pro hierarchy) ─────────────────────────────
  textPrimary: "#000000",    // Label
  textSecondary: "#3C3C43",  // Secondary label (60% opacity)
  textTertiary: "#3C3C4399", // Tertiary label (30% opacity)
  textLight: "#8E8E93",      // Placeholder text
  textOnDark: "#FFFFFF",
  textOnGlass: "#1C1C1E",

  // ── Borders ─────────────────────────────────────────────
  separator: "rgba(60, 60, 67, 0.12)",  // iOS separator
  separatorOpaque: "#C6C6C8",
  border: "#D1D1D6",
  borderLight: "#E5E5EA",
  borderDark: "#38383A",

  // ── System Colors (iOS 26 vibrant palette) ──────────────
  success: "#34C759",        // iOS system green
  successLight: "#30D158",
  warning: "#FF9500",        // iOS system orange
  warningLight: "#FFCC00",   // iOS system yellow
  error: "#FF3B30",          // iOS system red
  errorDark: "#D70015",
  info: "#007AFF",           // iOS system blue

  // Extended palette
  pink: "#FF2D55",
  purple: "#AF52DE",
  indigo: "#5856D6",
  teal: "#5AC8FA",
  mint: "#00C7BE",
  cyan: "#32ADE6",

  // ── Surfaces ────────────────────────────────────────────
  white: "#FFFFFF",
  card: "#FFFFFF",
  cardDark: "#1C1C1E",       // iOS dark elevated surface

  // ── Fills (iOS system fills) ────────────────────────────
  fill: "rgba(120, 120, 128, 0.12)",     // Quaternary system fill
  fillSecondary: "rgba(120, 120, 128, 0.16)",
  fillTertiary: "rgba(120, 120, 128, 0.08)",

  // Misc
  overlay: "rgba(0, 0, 0, 0.4)",
  transparent: "transparent",
} as const;

export type ColorKey = keyof typeof Colors;

/** Map subscription/payment status → iOS system color */
export function statusColor(status: string): string {
  switch (status) {
    case "ACTIVE":
    case "SUCCEEDED":
      return Colors.success;
    case "PENDING_APPROVAL":
    case "RENEWAL_PENDING":
    case "PENDING":
      return Colors.warning;
    case "SUSPENDED":
    case "EXPIRED":
    case "REJECTED":
    case "FAILED":
      return Colors.error;
    case "REFUNDED":
      return Colors.info;
    default:
      return Colors.textLight;
  }
}
