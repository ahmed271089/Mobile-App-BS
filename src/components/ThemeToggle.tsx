import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, radius } from '../theme';

interface ThemeToggleProps {
  size?: number;
  showLabel?: boolean;
}

export function ThemeToggle({ size = 24, showLabel = false }: ThemeToggleProps) {
  const { colors, isDark, toggleTheme, mode } = useTheme();

  const getIcon = () => {
    if (mode === 'auto') return 'phone-portrait-outline';
    return isDark ? 'moon' : 'sunny';
  };

  const getLabel = () => {
    if (mode === 'auto') return 'Auto';
    return isDark ? 'Dark' : 'Light';
  };

  return (
    <Pressable
      onPress={toggleTheme}
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceContainerHigh,
          borderColor: colors.outlineVariant,
        },
      ]}
    >
      <Ionicons name={getIcon()} size={size} color={colors.onSurface} />
      {showLabel && (
        <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>
          {getLabel()}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
