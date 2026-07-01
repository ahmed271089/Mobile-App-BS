import React, { ReactNode } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useColors, typography, spacing, radius } from "../theme";

interface ThemedCardProps {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

/**
 * Example card component using the new theme system
 * Automatically adapts to light/dark mode
 */
export function ThemedCard({
  title,
  children,
  style,
  elevated = false,
}: ThemedCardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: elevated
            ? colors.surfaceContainerHigh
            : colors.surfaceContainer,
          borderColor: colors.outlineVariant,
        },
        style,
      ]}
    >
      {title && (
        <Text
          style={[
            typography.h3,
            { color: colors.onSurface, marginBottom: spacing.sm },
          ]}
        >
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
  },
});
