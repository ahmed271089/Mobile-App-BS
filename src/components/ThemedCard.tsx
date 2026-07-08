import React, { ReactNode } from "react";
import { View, Text, StyleSheet, ViewStyle, Platform } from "react-native";
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

  const shadowStyle = Platform.select({
    ios: elevated
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 3,
        },
    android: { elevation: elevated ? 3 : 1 },
  });

  return (
    <View
      style={[
        baseStyles.card,
        {
          backgroundColor: elevated
            ? colors.surfaceContainerHigh
            : colors.surfaceContainer,
          borderColor: colors.outlineVariant,
        },
        shadowStyle,
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

const baseStyles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
  },
});
