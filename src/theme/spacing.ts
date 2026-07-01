/**
 * Spacing System
 * Based on 8px base unit from DESIGN.md
 */

export const spacing = {
  // Base unit
  base: 8,

  // Semantic spacing
  xs: 4,      // 0.5 * base
  sm: 12,     // 1.5 * base
  md: 24,     // 3 * base
  lg: 40,     // 5 * base
  xl: 64,     // 8 * base
  xxl: 96,    // 12 * base

  // Legacy names (for backward compatibility)
  none: 0,
  xxs: 2,

  // Layout spacing
  containerMax: 1280,
  gutter: 24,

  // Mobile-specific
  screenPadding: 20,  // Safety margins for mobile
  sectionGap: 40,     // Gap between major sections
};

/**
 * Padding helpers
 */
export const padding = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
};

/**
 * Margin helpers
 */
export const margin = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
};

/**
 * Gap helpers (for flexbox/grid)
 */
export const gap = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
};
