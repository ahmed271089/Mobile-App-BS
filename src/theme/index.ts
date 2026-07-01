/**
 * Theme System - Export All
 * Complete design system based on DESIGN.md
 */

// Colors
export * from "./colors";
export { lightColors as colors } from "./colors"; // Default export for backward compatibility

// Typography
export * from "./typography";

// Spacing
export * from "./spacing";

// Radius
export * from "./radius";

// Theme Context
export { ThemeProvider, useTheme, useColors } from "./ThemeProvider";

// Re-export old ThemeContext for compatibility
export {
  ThemeContext,
  ThemeProvider as OldThemeProvider,
  useTheme as useOldTheme,
} from "./ThemeContext";
