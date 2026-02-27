/**
 * iOS 26 Liquid Glass — Design Tokens
 * 8-point grid, SF Pro typography, concentric corners, glass shadows
 */

/** 8-point spacing grid (Apple HIG standard) */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
} as const;

/** Concentric border radius scale — matches iOS 26 hardware curves */
export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  "2xl": 28,
  "3xl": 36,
  full: 9999,
} as const;

/** SF Pro typography scale — iOS 26 hierarchy */
export const Typography = {
  largeTitle: { fontSize: 34, fontWeight: "700" as const, letterSpacing: 0.37, lineHeight: 41 },
  title1: { fontSize: 28, fontWeight: "700" as const, letterSpacing: 0.36, lineHeight: 34 },
  title2: { fontSize: 22, fontWeight: "700" as const, letterSpacing: 0.35, lineHeight: 28 },
  title3: { fontSize: 20, fontWeight: "600" as const, letterSpacing: 0.38, lineHeight: 25 },
  headline: { fontSize: 17, fontWeight: "600" as const, letterSpacing: -0.41, lineHeight: 22 },
  body: { fontSize: 17, fontWeight: "400" as const, letterSpacing: -0.41, lineHeight: 22 },
  callout: { fontSize: 16, fontWeight: "400" as const, letterSpacing: -0.32, lineHeight: 21 },
  subheadline: { fontSize: 15, fontWeight: "400" as const, letterSpacing: -0.24, lineHeight: 20 },
  footnote: { fontSize: 13, fontWeight: "400" as const, letterSpacing: -0.08, lineHeight: 18 },
  caption1: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
  caption2: { fontSize: 11, fontWeight: "400" as const, letterSpacing: 0.07, lineHeight: 13 },
  // Backward compat aliases
  h1: { fontSize: 34, fontWeight: "700" as const, letterSpacing: 0.37, lineHeight: 41 },
  h2: { fontSize: 28, fontWeight: "700" as const, letterSpacing: 0.36, lineHeight: 34 },
  h3: { fontSize: 22, fontWeight: "700" as const, letterSpacing: 0.35, lineHeight: 28 },
  h4: { fontSize: 17, fontWeight: "600" as const, letterSpacing: -0.41, lineHeight: 22 },
  bodyBold: { fontSize: 17, fontWeight: "600" as const, letterSpacing: -0.41, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: "400" as const, letterSpacing: -0.08, lineHeight: 18 },
  captionBold: { fontSize: 13, fontWeight: "600" as const, letterSpacing: -0.08, lineHeight: 18 },
  small: { fontSize: 11, fontWeight: "500" as const, letterSpacing: 0.07, lineHeight: 13 },
  tabular: { fontSize: 28, fontWeight: "700" as const, letterSpacing: 0.36 },
} as const;

/** iOS 26 shadow presets — subtle, layered depth */
export const Shadows = {
  sm: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  md: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  lg: { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.10, shadowRadius: 24, elevation: 4 },
  glass: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  glow: { shadowColor: "#007AFF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 4 },
} as const;

/** iOS 26 spring animation configs */
export const Springs = {
  quick: { damping: 20, stiffness: 300, mass: 0.8 },
  default: { damping: 15, stiffness: 200, mass: 1 },
  gentle: { damping: 20, stiffness: 150, mass: 1.2 },
  bouncy: { damping: 12, stiffness: 250, mass: 0.8 },
} as const;
