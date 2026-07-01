export type ThemeColors = {
  bg: string;
  bgElevated: string;
  card: string;
  cardBorder: string;
  primary: string;
  primaryMuted: string;
  secondary: string;
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
  chipTech: string;
  chipAuto: string;
  chipHome: string;
  chipGarden: string;
  white: string;
  black: string;
  overlay: string;
};

export const darkColors: ThemeColors = {
  bg: '#0B0E16',
  bgElevated: '#12151F',
  card: '#161A26',
  cardBorder: '#22273A',
  primary: '#6C5CE7',
  primaryMuted: '#2A2550',
  secondary: '#3B82F6',
  textPrimary: '#F4F5F8',
  textSecondary: '#9AA1B5',
  textMuted: '#5C6178',
  success: '#22C55E',
  successMuted: '#10301F',
  warning: '#F59E0B',
  warningMuted: '#3A2A0E',
  danger: '#EF4444',
  dangerMuted: '#3A1414',
  info: '#3B82F6',
  infoMuted: '#142235',
  chipTech: '#3B82F6',
  chipAuto: '#F59E0B',
  chipHome: '#22C55E',
  chipGarden: '#84CC16',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(11,14,22,0.85)',
};

export const lightColors: ThemeColors = {
  bg: '#F4F5F8',
  bgElevated: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#E2E5EE',
  primary: '#6C5CE7',
  primaryMuted: '#EDE9FE',
  secondary: '#3B82F6',
  textPrimary: '#0B0E16',
  textSecondary: '#4B5563',
  textMuted: '#9AA1B5',
  success: '#16A34A',
  successMuted: '#DCFCE7',
  warning: '#D97706',
  warningMuted: '#FEF3C7',
  danger: '#DC2626',
  dangerMuted: '#FEE2E2',
  info: '#2563EB',
  infoMuted: '#DBEAFE',
  chipTech: '#3B82F6',
  chipAuto: '#F59E0B',
  chipHome: '#22C55E',
  chipGarden: '#84CC16',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(11,14,22,0.45)',
};

/** Default dark palette used across existing screens. */
export const colors = darkColors;

export const gradients = {
  primary: ['#7C5CFC', '#5B3FE0'] as const,
  card: ['#1B1F2E', '#12151F'] as const,
};
