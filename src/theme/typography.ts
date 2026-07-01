/**
 * Typography System
 * Based on DESIGN.md specification
 * Fonts: Hanken Grotesk (Headings), Inter (Body), JetBrains Mono (Labels)
 */

import { TextStyle } from "react-native";

/**
 * Display Styles - For hero sections and major headings
 */
export const displayLg: TextStyle = {
  fontFamily: "System", // Will be replaced with Hanken Grotesk when loaded
  fontSize: 48,
  fontWeight: "700",
  lineHeight: 56,
  letterSpacing: -0.96, // -0.02em * 48
};

/**
 * Headline Styles - For section headers
 */
export const headlineLg: TextStyle = {
  fontFamily: "System",
  fontSize: 32,
  fontWeight: "600",
  lineHeight: 40,
  letterSpacing: -0.32, // -0.01em * 32
};

export const headlineLgMobile: TextStyle = {
  fontFamily: "System",
  fontSize: 24,
  fontWeight: "600",
  lineHeight: 32,
};

export const headlineMd: TextStyle = {
  fontFamily: "System",
  fontSize: 24,
  fontWeight: "600",
  lineHeight: 32,
};

/**
 * Body Styles - For main content
 */
export const bodyLg: TextStyle = {
  fontFamily: "System",
  fontSize: 18,
  fontWeight: "400",
  lineHeight: 28,
};

export const bodyMd: TextStyle = {
  fontFamily: "System",
  fontSize: 16,
  fontWeight: "400",
  lineHeight: 24,
};

export const bodySm: TextStyle = {
  fontFamily: "System",
  fontSize: 14,
  fontWeight: "400",
  lineHeight: 20,
};

/**
 * Label Styles - For UI elements, buttons, badges
 */
export const labelLg: TextStyle = {
  fontFamily: "System", // Will be JetBrains Mono
  fontSize: 14,
  fontWeight: "500",
  lineHeight: 20,
  letterSpacing: 0.28, // 0.02em * 14
};

export const labelMd: TextStyle = {
  fontFamily: "System",
  fontSize: 14,
  fontWeight: "500",
  lineHeight: 20,
  letterSpacing: 0.28,
};

export const labelSm: TextStyle = {
  fontFamily: "System",
  fontSize: 12,
  fontWeight: "500",
  lineHeight: 16,
  letterSpacing: 0.24, // 0.02em * 12
};

/**
 * Legacy Typography (for backward compatibility)
 */
export const typography = {
  // Display
  display: displayLg,
  displayLarge: displayLg,

  // Headlines
  h1: headlineLg,
  h2: headlineMd,
  h3: {
    fontFamily: "System",
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },

  // Body
  body: bodyMd,
  bodyLarge: bodyLg,
  bodyBold: {
    ...bodyMd,
    fontWeight: "600" as const,
  },

  // Labels/Captions
  label: labelMd,
  caption: labelSm,
  captionBold: {
    ...labelSm,
    fontWeight: "600" as const,
  },

  // Buttons
  button: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 20,
    letterSpacing: 0.32,
  },

  buttonSmall: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 18,
  },
};

/**
 * Font Weights
 */
export const fontWeights = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

/**
 * Line Heights (relative to font size)
 */
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

/**
 * Letter Spacing
 */
export const letterSpacing = {
  tighter: -0.02,
  tight: -0.01,
  normal: 0,
  wide: 0.02,
  wider: 0.04,
};
