import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors, spacing, typography, radius } from "../theme";
import { Button } from "./Button";

interface ReportModalProps {
  visible: boolean;
  targetType?: 'POST' | 'COMMENT' | 'USER' | 'MESSAGE';
  onClose: () => void;
  onSubmit: (reason: string, details: string) => Promise<void>;
}

export function ReportModal({ visible, targetType = 'POST', onClose, onSubmit }: ReportModalProps) {
  const colors = useColors();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    setReason("");
    setDetails("");
    setSubmitted(false);
    onClose();
  };

  const reasons = [
    "Spam or misleading",
    "Harassment or hate",
    "Inappropriate content",
    "Other",
  ];

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    try {
      await onSubmit(reason, details);
      setSubmitted(true);
    } catch (e) {
      // In a real app, you might want to show an error message in the modal
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        },
        sheet: {
          backgroundColor: colors.surface,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
          padding: spacing.lg,
          paddingBottom: spacing.xxl,
          maxHeight: "80%",
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing.md,
        },
        title: {
          ...typography.h3,
          color: colors.onSurface,
        },
        closeBtn: {
          padding: spacing.xs,
        },
        reasonBtn: {
          padding: spacing.md,
          backgroundColor: colors.surfaceContainer,
          borderRadius: radius.md,
          marginBottom: spacing.sm,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
        },
        reasonBtnSelected: {
          backgroundColor: colors.primaryContainer,
          borderColor: colors.primary,
        },
        reasonText: {
          ...typography.body,
          color: colors.onSurface,
        },
        reasonTextSelected: {
          ...typography.bodyBold,
          color: colors.primary,
        },
        input: {
          backgroundColor: colors.surfaceContainer,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
          borderRadius: radius.md,
          padding: spacing.md,
          color: colors.onSurface,
          ...typography.body,
          minHeight: 100,
          textAlignVertical: "top",
          marginTop: spacing.md,
          marginBottom: spacing.lg,
        },
      }),
    [colors]
  );

    return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {submitted ? "Report Submitted" : `Report ${targetType === 'USER' ? 'User' : targetType === 'COMMENT' ? 'Comment' : targetType === 'MESSAGE' ? 'Message' : 'Post'}`}
            </Text>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.onSurfaceVariant} />
            </Pressable>
          </View>

          {submitted ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg }}>
                <Ionicons name="checkmark" size={32} color={colors.primary} />
              </View>
              <Text style={{ ...typography.h3, color: colors.onSurface, marginBottom: spacing.xs, textAlign: 'center' }}>Thank You</Text>
              <Text style={{ ...typography.body, color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: spacing.xl }}>
                We've received your report. Our moderation team will review it shortly to ensure our community stays safe.
              </Text>
              <Button label="Done" onPress={handleClose} style={{ width: '100%' }} />
            </View>
          ) : !reason ? (
            <View>
              <Text style={{ ...typography.body, color: colors.onSurfaceVariant, marginBottom: spacing.md }}>
                Why are you reporting this?
              </Text>
              {reasons.map((r) => (
                <Pressable
                  key={r}
                  style={styles.reasonBtn}
                  onPress={() => setReason(r)}
                >
                  <Text style={styles.reasonText}>{r}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md, gap: spacing.sm }}>
                <Pressable onPress={() => setReason("")} style={{ padding: 4 }}>
                  <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
                </Pressable>
                <Text style={{ ...typography.bodyBold, color: colors.primary }}>{reason}</Text>
              </View>
              <Text style={{ ...typography.body, color: colors.onSurfaceVariant }}>
                Please provide more details (optional):
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Additional details..."
                placeholderTextColor={colors.outline}
                multiline
                value={details}
                onChangeText={setDetails}
              />
              <Button
                label="Submit Report"
                loading={submitting}
                onPress={handleSubmit}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
