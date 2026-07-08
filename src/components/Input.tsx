import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  Platform,
} from "react-native";
import { useColors, radius, spacing, typography } from "../theme";

interface InputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
}

export function Input({ label, icon, style, multiline, ...rest }: InputProps) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        label: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          marginBottom: spacing.xs,
        },
        labelFocused: {
          color: colors.primary,
        },
        wrapper: {
          flexDirection: "row",
          alignItems: multiline ? "flex-start" : "center",
          backgroundColor: colors.surfaceContainer,
          borderWidth: 1.5,
          borderColor: colors.outlineVariant,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: multiline ? spacing.md : 0,
          minHeight: multiline ? 80 : 50,
        },
        wrapperFocused: {
          borderColor: colors.primary,
          backgroundColor: colors.surfaceContainerLow,
          ...Platform.select({
            ios: {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.12,
              shadowRadius: 6,
            },
            android: { elevation: 2 },
          }),
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
      {label ? (
        <Text style={[styles.label, isFocused && styles.labelFocused]}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.wrapper, isFocused && styles.wrapperFocused]}>
        {icon ? <View style={{ marginRight: spacing.sm }}>{icon}</View> : null}
        <TextInput
          placeholderTextColor={colors.outline}
          style={[styles.input, style]}
          multiline={multiline}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
      </View>
    </View>
  );
}
