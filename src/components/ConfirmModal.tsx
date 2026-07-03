import React, { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
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
          borderWidth: 1,
          borderColor: colors.outlineVariant,
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
          borderWidth: 1,
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
          color: colors.white,
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
              style={[styles.button, styles.cancelButton]}
              disabled={loading}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={[styles.button, styles.confirmButton]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
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
