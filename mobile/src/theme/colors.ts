/**
 * MMK Brand Theme — Navy + Cyan palette
 * Matching web app identity: deep navy (#0c2d42) + cyan accent (#0ea5e9)
 * with warm blue-gray backgrounds and navy-toned depth.
 */
export const Colors = {
  // ── Core Brand ──────────────────────────────────────────
  primary: "#0c2d42",        // Deep navy (web primary)
  primaryMid: "#164058",
  primaryLight: "#1e5570",

  // Accent — Cyan (web brand accent)
  accent: "#0ea5e9",         // Cyan
  accentLight: "#38bdf8",    // Light cyan (gradient end)
  accentDark: "#0284c7",

  // ── Backgrounds (warm blue-gray) ──────────────────────
  bgPrimary: "#f0f7fb",     // Warm blue-gray
  bgLight: "#f0f7fb",
  bgDark: "#091b28",        // Dark navy
  bgSecondary: "#FFFFFF",
  bgTertiary: "#e6f0f7",
  bgSection: "#dbeaf2",

  // ── Glass Surfaces ──────────────────────────────────────
  glass: "rgba(240, 247, 251, 0.78)",
  glassLight: "rgba(240, 247, 251, 0.56)",
  glassDark: "rgba(12, 45, 66, 0.32)",
  glassUltraThin: "rgba(240, 247, 251, 0.44)",
  glassBorder: "rgba(219, 234, 242, 0.35)",
  glassBorderDark: "rgba(12, 45, 66, 0.08)",

  // ── Text ──────────────────────────────────────────────
  textPrimary: "#0c2d42",    // Navy
  textSecondary: "#3d6478",  // Muted gray-blue
  textTertiary: "#3d647899",
  textLight: "#7a9eb5",      // Placeholder / secondary
  textOnDark: "#FFFFFF",
  textOnGlass: "#0c2d42",

  // ── Borders ───────────────────────────────────────────
  separator: "rgba(12, 45, 66, 0.10)",
  separatorOpaque: "#c0d8e8",
  border: "#c0d8e8",
  borderLight: "#dbeaf2",
  borderDark: "#1a3a4f",

  // ── System Colors ─────────────────────────────────────
  success: "#10b981",        // Emerald
  successLight: "#34d399",
  warning: "#f59e0b",        // Amber
  warningLight: "#fbbf24",
  error: "#ef4444",          // Red
  errorDark: "#dc2626",
  info: "#0ea5e9",           // Cyan

  // Extended palette
  pink: "#FF2D55",
  purple: "#AF52DE",
  indigo: "#5856D6",
  teal: "#38bdf8",
  mint: "#00C7BE",
  cyan: "#0ea5e9",

  // ── Surfaces ──────────────────────────────────────────
  white: "#FFFFFF",
  card: "#FFFFFF",
  cardDark: "#0c2d42",

  // ── Fills ─────────────────────────────────────────────
  fill: "rgba(12, 45, 66, 0.06)",
  fillSecondary: "rgba(12, 45, 66, 0.10)",
  fillTertiary: "rgba(12, 45, 66, 0.04)",

  // Misc
  overlay: "rgba(12, 45, 66, 0.5)",
  transparent: "transparent",
} as const;

export type ColorKey = keyof typeof Colors;

/** Map subscription/payment status → brand color */
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
