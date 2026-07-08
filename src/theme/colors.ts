/**
 * Color System - Based on Material Design 3
 * Supports Light and Dark modes
 */

export interface ColorScheme {
  // Surface Colors
  surface: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  onSurface: string;
  onSurfaceVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;

  // Outline
  outline: string;
  outlineVariant: string;

  // Primary
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  inversePrimary: string;
  primaryFixed: string;
  primaryFixedDim: string;
  onPrimaryFixed: string;
  onPrimaryFixedVariant: string;

  // Secondary
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  secondaryFixed: string;
  secondaryFixedDim: string;
  onSecondaryFixed: string;
  onSecondaryFixedVariant: string;

  // Tertiary
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  tertiaryFixed: string;
  tertiaryFixedDim: string;
  onTertiaryFixed: string;
  onTertiaryFixedVariant: string;

  // Error
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  // Background
  background: string;
  onBackground: string;

  // Surface Variant
  surfaceVariant: string;
  surfaceTint: string;

  // Legacy compatibility (for existing code)
  bg: string;
  bgElevated: string;
  card: string;
  cardBorder: string;
  primaryMuted: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  danger: string;
  dangerMuted: string;
  info: string;
  infoMuted: string;
  white: string;
  black: string;
  overlay: string;
}

/**
 * Light Color Scheme
 * Based on DESIGN.md specification
 */
export const lightColors: ColorScheme = {
  // Surface Colors
  surface: "#f8f9ff",
  surfaceDim: "#ccdbf3",
  surfaceBright: "#f8f9ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eff4ff",
  surfaceContainer: "#e6eeff",
  surfaceContainerHigh: "#dce9ff",
  surfaceContainerHighest: "#d5e3fc",
  onSurface: "#0d1c2e",
  onSurfaceVariant: "#434653",
  inverseSurface: "#233144",
  inverseOnSurface: "#eaf1ff",

  // Outline
  outline: "#737784",
  outlineVariant: "#c3c6d5",

  // Primary (Resolution Blue)
  primary: "#1d59c1",
  onPrimary: "#ffffff",
  primaryContainer: "#0f52ba",
  onPrimaryContainer: "#bcceff",
  inversePrimary: "#b0c6ff",
  primaryFixed: "#d9e2ff",
  primaryFixedDim: "#b0c6ff",
  onPrimaryFixed: "#001945",
  onPrimaryFixedVariant: "#00419c",

  // Secondary (Success Green)
  secondary: "#006c49",
  onSecondary: "#ffffff",
  secondaryContainer: "#6cf8bb",
  onSecondaryContainer: "#00714d",
  secondaryFixed: "#6ffbbe",
  secondaryFixedDim: "#4edea3",
  onSecondaryFixed: "#002113",
  onSecondaryFixedVariant: "#005236",

  // Tertiary (AI/Trending Violet)
  tertiary: "#4e04b8",
  onTertiary: "#ffffff",
  tertiaryContainer: "#6632d0",
  onTertiaryContainer: "#d7c5ff",
  tertiaryFixed: "#e9ddff",
  tertiaryFixedDim: "#d0bcff",
  onTertiaryFixed: "#23005c",
  onTertiaryFixedVariant: "#5516be",

  // Error
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",

  // Background
  background: "#f8f9ff",
  onBackground: "#0d1c2e",

  // Surface Variant
  surfaceVariant: "#d5e3fc",
  surfaceTint: "#1d59c1",

  // Legacy Compatibility
  bg: "#f8f9ff",
  bgElevated: "#ffffff",
  card: "#ffffff",
  cardBorder: "#e6eeff",
  primaryMuted: "#d9e2ff",
  textPrimary: "#0d1c2e",
  textSecondary: "#434653",
  textMuted: "#737784",
  success: "#006c49",
  successMuted: "#6cf8bb",
  warning: "#f59e0b",
  warningMuted: "#fef3c7",
  danger: "#ba1a1a",
  dangerMuted: "#ffdad6",
  info: "#003c90",
  infoMuted: "#d9e2ff",
  white: "#ffffff",
  black: "#0d1c2e",
  overlay: "rgba(13, 28, 46, 0.6)",
};

/**
 * Dark Color Scheme
 * Inverted and adapted from light theme
 */
export const darkColors: ColorScheme = {
  // Surface Colors
  surface: "#0d1c2e",
  surfaceDim: "#0a1523",
  surfaceBright: "#233144",
  surfaceContainerLowest: "#070f1a",
  surfaceContainerLow: "#151d2e",
  surfaceContainer: "#192332",
  surfaceContainerHigh: "#1e293a",
  surfaceContainerHighest: "#243145",
  onSurface: "#eaf1ff",
  onSurfaceVariant: "#c3c6d5",
  inverseSurface: "#eaf1ff",
  inverseOnSurface: "#233144",

  // Outline
  outline: "#8d9199",
  outlineVariant: "#434653",

  // Primary
  primary: "#b0c6ff",
  onPrimary: "#001945",
  primaryContainer: "#0f52ba",
  onPrimaryContainer: "#d9e2ff",
  inversePrimary: "#003c90",
  primaryFixed: "#d9e2ff",
  primaryFixedDim: "#b0c6ff",
  onPrimaryFixed: "#001945",
  onPrimaryFixedVariant: "#00419c",

  // Secondary
  secondary: "#4edea3",
  onSecondary: "#002113",
  secondaryContainer: "#005236",
  onSecondaryContainer: "#6ffbbe",
  secondaryFixed: "#6ffbbe",
  secondaryFixedDim: "#4edea3",
  onSecondaryFixed: "#002113",
  onSecondaryFixedVariant: "#005236",

  // Tertiary
  tertiary: "#d0bcff",
  onTertiary: "#23005c",
  tertiaryContainer: "#5516be",
  onTertiaryContainer: "#e9ddff",
  tertiaryFixed: "#e9ddff",
  tertiaryFixedDim: "#d0bcff",
  onTertiaryFixed: "#23005c",
  onTertiaryFixedVariant: "#5516be",

  // Error
  error: "#ffb4ab",
  onError: "#690005",
  errorContainer: "#93000a",
  onErrorContainer: "#ffdad6",

  // Background
  background: "#0a1523",
  onBackground: "#d5e3fc",

  // Surface Variant
  surfaceVariant: "#434653",
  surfaceTint: "#b0c6ff",

  // Legacy Compatibility
  bg: "#0a1523",
  bgElevated: "#151d2e",
  card: "#192332",
  cardBorder: "#243145",
  primaryMuted: "#0f52ba",
  textPrimary: "#eaf1ff",
  textSecondary: "#c3c6d5",
  textMuted: "#8d9199",
  success: "#4edea3",
  successMuted: "#005236",
  warning: "#f59e0b",
  warningMuted: "#3a2a0e",
  danger: "#ffb4ab",
  dangerMuted: "#93000a",
  info: "#b0c6ff",
  infoMuted: "#0f52ba",
  white: "#ffffff",
  black: "#000000",
  overlay: "rgba(13, 28, 46, 0.85)",
};

// Gradients (same for both themes)
export const gradients = {
  primary: ["#003c90", "#0f52ba"] as const,
  secondary: ["#006c49", "#4edea3"] as const,
  tertiary: ["#4e04b8", "#6632d0"] as const,
  card: ["#192332", "#151d2e"] as const,
};

// Chip/Category Colors
export const categoryColors = {
  tech: "#003c90",
  auto: "#f59e0b",
  home: "#006c49",
  garden: "#84cc16",
};
