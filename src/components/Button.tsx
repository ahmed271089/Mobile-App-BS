import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, typography, spacing } from '../theme';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) {
  if (variant === 'primary') {
    return (
      <Pressable onPress={onPress} disabled={disabled || loading} style={[{ opacity: disabled ? 0.5 : 1 }, style]}>
        <LinearGradient colors={gradients.primary} style={styles.base}>
          {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryLabel}>{label}</Text>}
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.base, styles.secondary, { opacity: disabled ? 0.5 : 1 }, style]}
      >
        {loading ? <ActivityIndicator color={colors.textPrimary} /> : <Text style={styles.secondaryLabel}>{label}</Text>}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={[styles.ghost, style]}>
      <Text style={styles.ghostLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 15,
  },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  secondaryLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  ghost: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  ghostLabel: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
