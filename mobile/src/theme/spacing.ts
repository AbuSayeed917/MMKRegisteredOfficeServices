/**
 * iOS 26 Liquid Glass — Design Tokens
 * 8-point grid, SF Pro typography, concentric corners, glass shadows
 */

/** Compact spacing grid */
export const Spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 28,
  "4xl": 36,
  "5xl": 44,
  "6xl": 56,
} as const;

/** Compact border radius scale */
export const Radius = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 14,
  xl: 18,
  "2xl": 24,
  "3xl": 30,
  full: 9999,
} as const;

/** SF Pro typography scale — compact for mobile */
export const Typography = {
  largeTitle: { fontSize: 26, fontWeight: "700" as const, letterSpacing: 0.3, lineHeight: 32 },
  title1: { fontSize: 22, fontWeight: "700" as const, letterSpacing: 0.3, lineHeight: 28 },
  title2: { fontSize: 18, fontWeight: "700" as const, letterSpacing: 0.3, lineHeight: 23 },
  title3: { fontSize: 16, fontWeight: "600" as const, letterSpacing: 0.3, lineHeight: 21 },
  headline: { fontSize: 14, fontWeight: "600" as const, letterSpacing: -0.3, lineHeight: 19 },
  body: { fontSize: 14, fontWeight: "400" as const, letterSpacing: -0.3, lineHeight: 19 },
  callout: { fontSize: 13, fontWeight: "400" as const, letterSpacing: -0.2, lineHeight: 18 },
  subheadline: { fontSize: 12, fontWeight: "400" as const, letterSpacing: -0.2, lineHeight: 17 },
  footnote: { fontSize: 11, fontWeight: "400" as const, letterSpacing: -0.05, lineHeight: 15 },
  caption1: { fontSize: 10, fontWeight: "400" as const, lineHeight: 14 },
  caption2: { fontSize: 9, fontWeight: "400" as const, letterSpacing: 0.05, lineHeight: 12 },
  // Extended aliases
  captionBold: { fontSize: 11, fontWeight: "600" as const, letterSpacing: -0.05, lineHeight: 15 },
  tabular: { fontSize: 22, fontWeight: "700" as const, letterSpacing: 0.3 },
} as const;

/** Shadow presets — navy-toned depth matching brand */
export const Shadows = {
  sm: { shadowColor: "#0c2d42", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  md: { shadowColor: "#0c2d42", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  lg: { shadowColor: "#0c2d42", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 4 },
  glass: { shadowColor: "#0c2d42", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  glow: { shadowColor: "#0ea5e9", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 4 },
} as const;

/** iOS 26 spring animation configs */
export const Springs = {
  quick: { damping: 20, stiffness: 300, mass: 0.8 },
  default: { damping: 15, stiffness: 200, mass: 1 },
  gentle: { damping: 20, stiffness: 150, mass: 1.2 },
  bouncy: { damping: 12, stiffness: 250, mass: 0.8 },
} as const;
