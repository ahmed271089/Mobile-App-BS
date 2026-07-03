import React from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { useColors, radius, spacing, typography } from "../theme";

interface InputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
}

export function Input({ label, icon, style, multiline, ...rest }: InputProps) {
  const colors = useColors();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        label: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          marginBottom: spacing.xs,
        },
        wrapper: {
          flexDirection: "row",
          alignItems: multiline ? "flex-start" : "center",
          backgroundColor: colors.surfaceContainer,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: multiline ? spacing.md : 0,
          minHeight: multiline ? 80 : 50,
        },
        input: {
          flex: 1,
          color: colors.onSurface,
          ...typography.body,
          paddingTop: multiline ? spacing.xs : 0,
        },
      }),
    [colors, multiline],
  );

  return (
    <View style={{ marginBottom: spacing.lg }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.wrapper}>
        {icon ? <View style={{ marginRight: spacing.sm }}>{icon}</View> : null}
        <TextInput
          placeholderTextColor={colors.onSurfaceVariant}
          style={[styles.input, style]}
          multiline={multiline}
          {...rest}
        />
      </View>
    </View>
  );
}
