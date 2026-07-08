import React, { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useColors, spacing, typography, radius } from "../theme";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmColor?: string;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  confirmColor,
}: ConfirmModalProps) {
  const colors = useColors();
  const resolvedConfirmColor = confirmColor ?? colors.error;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.xl,
        },
        modal: {
          backgroundColor: colors.surfaceContainerHigh,
          borderRadius: radius.xl,
          padding: spacing.xl,
          width: "100%",
          maxWidth: 400,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.18,
              shadowRadius: 24,
            },
            android: { elevation: 12 },
          }),
        },
        title: {
          ...typography.h3,
          color: colors.onSurface,
          marginBottom: spacing.md,
          textAlign: "center",
        },
        message: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          marginBottom: spacing.xl,
          textAlign: "center",
          lineHeight: 22,
        },
        buttons: {
          flexDirection: "row",
          gap: spacing.md,
        },
        button: {
          flex: 1,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          borderRadius: radius.lg,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 48,
        },
        cancelButton: {
          backgroundColor: colors.surfaceContainer,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
        },
        confirmButton: {
          backgroundColor: resolvedConfirmColor,
        },
        cancelText: {
          ...typography.bodyBold,
          color: colors.onSurface,
        },
        confirmText: {
          ...typography.bodyBold,
          color: colors.onPrimary,
        },
      }),
    [colors, resolvedConfirmColor],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && { opacity: 0.7 },
              ]}
              disabled={loading}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
              ]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.onPrimary} />
              ) : (
                <Text style={styles.confirmText}>{confirmText}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
