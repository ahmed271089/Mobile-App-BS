import React, { useRef } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useColors, gradients, radius, typography, spacing } from "../theme";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  loading,
  disabled,
  style,
}: ButtonProps) {
  const colors = useColors();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        base: {
          height: 50,
          borderRadius: radius.lg,
          alignItems: "center",
          justifyContent: "center",
        },
        primaryLabel: {
          ...typography.bodyBold,
          color: colors.onPrimary,
          fontSize: 15,
        },
        secondary: {
          backgroundColor: colors.surfaceContainer,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
        },
        secondaryLabel: {
          ...typography.bodyBold,
          color: colors.onSurface,
        },
        ghost: {
          paddingVertical: spacing.sm,
          alignItems: "center",
        },
        ghostLabel: {
          ...typography.bodyBold,
          color: colors.primary,
        },
      }),
    [colors],
  );

  if (variant === "primary") {
    return (
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled || loading}
          style={{ opacity: disabled ? 0.5 : 1 }}
        >
          <LinearGradient colors={gradients.primary} style={styles.base}>
            {loading ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={styles.primaryLabel}>{label}</Text>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }

  if (variant === "secondary") {
    return (
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled || loading}
          style={[
            styles.base,
            styles.secondary,
            { opacity: disabled ? 0.5 : 1 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.onSurface} />
          ) : (
            <Text style={styles.secondaryLabel}>{label}</Text>
          )}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.ghost,
        { opacity: pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <Text style={styles.ghostLabel}>{label}</Text>
    </Pressable>
  );
}
