/**
 * Border Radius System
 * Based on DESIGN.md rounded specification
 * Soft shapes (0.25rem - 0.75rem) for professional yet approachable feel
 */

export const radius = {
  none: 0,
  sm: 2,      // 0.125rem = 2px
  DEFAULT: 4, // 0.25rem = 4px (Primary buttons/inputs)
  md: 6,      // 0.375rem = 6px
  lg: 8,      // 0.5rem = 8px (Content cards)
  xl: 12,     // 0.75rem = 12px
  full: 9999, // Fully rounded (pills)
};

/**
 * Component-specific radius
 */
export const componentRadius = {
  button: radius.DEFAULT,      // 4px - Precise, tooled look
  card: radius.lg,            // 8px - Softens content areas
  input: radius.DEFAULT,      // 4px - Matches buttons
  pill: radius.full,          // Full rounded for status indicators
  modal: radius.lg,           // 8px - Softer for overlays
  badge: radius.full,         // Full rounded for badges
  avatar: radius.full,        // Full rounded for avatars
  image: radius.md,           // 6px - Slightly softer for media
};

/**
 * Legacy compatibility
 */
export const borderRadius = {
  ...radius,
  small: radius.sm,
  medium: radius.md,
  large: radius.lg,
  round: radius.full,
};
