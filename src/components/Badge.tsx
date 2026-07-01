import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useColors, componentRadius, typography } from "../theme";

type BadgeVariant =
  "primary" | "success" | "warning" | "danger" | "info" | "neutral";

export function Badge({
  label,
  variant = "neutral",
  icon,
}: {
  label: string;
  variant?: BadgeVariant;
  icon?: string;
}) {
  const colors = useColors();

  const VARIANT_STYLES = useMemo(
    () => ({
      primary: { bg: colors.primaryContainer, fg: colors.primary },
      success: { bg: colors.secondaryContainer, fg: colors.success },
      warning: { bg: colors.tertiaryContainer, fg: colors.warning },
      danger: { bg: colors.errorContainer, fg: colors.error },
      info: { bg: `${colors.primaryContainer}CC`, fg: colors.info },
      neutral: { bg: colors.surfaceContainerHigh, fg: colors.onSurfaceVariant },
    }),
    [colors],
  );

  const styles = useMemo(
    () => ({
      badge: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: componentRadius.badge,
        alignSelf: "flex-start" as const,
      },
      label: {
        ...typography.caption,
        textTransform: "uppercase" as const,
      },
    }),
    [],
  );

  const style = VARIANT_STYLES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      {icon ? (
        <Text style={{ fontSize: 11, marginRight: 4 }}>{icon}</Text>
      ) : null}
      <Text style={[styles.label, { color: style.fg }]}>{label}</Text>
    </View>
  );
}
