import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, radius, spacing, typography } from "../../theme";
import { Button } from "../../components/Button";

/** ─── Step Indicator ─────────────────────────────────────────── */
function StepIndicator({
  current,
  total,
  colors,
}: {
  current: number;
  total: number;
  colors: any;
}) {
  const stepStyles = React.useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginBottom: spacing.lg,
        },
        dot: {
          height: 4,
          borderRadius: 2,
        },
        dotActive: {
          flex: 1,
          backgroundColor: colors.primary,
        },
        dotDone: {
          flex: 1,
          backgroundColor: colors.primary,
          opacity: 0.55,
        },
        dotInactive: {
          flex: 1,
          backgroundColor: colors.outlineVariant,
        },
        label: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          marginLeft: 4,
          flexShrink: 0,
        },
      }),
    [colors],
  );

  return (
    <View style={stepStyles.wrapper}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            stepStyles.dot,
            i + 1 < current
              ? stepStyles.dotDone
              : i + 1 === current
                ? stepStyles.dotActive
                : stepStyles.dotInactive,
          ]}
        />
      ))}
      <Text style={stepStyles.label}>
        Step {current} of {total}
      </Text>
    </View>
  );
}

/** ─── Screen ─────────────────────────────────────────────────── */
export default function ChooseTypeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [selected, setSelected] = React.useState<"PROBLEM" | "SOLUTION" | null>(
    null,
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.surface,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xl,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: spacing.xl,
        },
        closeBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        headerTitle: {
          ...typography.h3,
          color: colors.onSurface,
        },
        title: {
          ...typography.h1,
          color: colors.onSurface,
          marginBottom: spacing.xs,
        },
        subtitle: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          marginBottom: spacing.xl,
        },
        option: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surfaceContainer,
          borderWidth: 1.5,
          borderColor: colors.outlineVariant,
          borderRadius: radius.lg,
          padding: spacing.lg,
          marginBottom: spacing.md,
          gap: spacing.md,
        },
        optionSelected: {
          borderColor: colors.primary,
          backgroundColor: colors.primaryContainer,
        },
        optionIcon: {
          width: 44,
          height: 44,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
        },
        optionTitle: {
          ...typography.h3,
          color: colors.onSurface,
          marginBottom: 4,
        },
        optionDesc: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          lineHeight: 16,
        },
      }),
    [colors],
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface }}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.lg, flexGrow: 1, paddingBottom: spacing.xl + insets.bottom }]}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>New Post</Text>
        <View style={{ width: 36 }} />
      </View>

      <StepIndicator current={1} total={3} colors={colors} />

      <Text style={styles.title}>What would you like to share?</Text>
      <Text style={styles.subtitle}>
        Choose the type of post you want to create.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.option,
          selected === "PROBLEM" && styles.optionSelected,
          pressed && { opacity: 0.85 },
        ]}
        onPress={() => setSelected("PROBLEM")}
      >
        <View
          style={[
            styles.optionIcon,
            { backgroundColor: colors.errorContainer },
          ]}
        >
          <Ionicons name="warning-outline" size={22} color={colors.error} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.optionTitle}>I have a Problem</Text>
          <Text style={styles.optionDesc}>
            Describe a fault or issue you need help with. Our AI agent will give
            an initial diagnosis.
          </Text>
        </View>
        {selected === "PROBLEM" && (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.option,
          selected === "SOLUTION" && styles.optionSelected,
          pressed && { opacity: 0.85 },
        ]}
        onPress={() => setSelected("SOLUTION")}
      >
        <View
          style={[
            styles.optionIcon,
            { backgroundColor: colors.secondaryContainer },
          ]}
        >
          <Ionicons name="bulb-outline" size={22} color={colors.secondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.optionTitle}>I have a Solution</Text>
          <Text style={styles.optionDesc}>
            Share your fix for a problem you've already solved. Help build the
            community library.
          </Text>
        </View>
        {selected === "SOLUTION" && (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </Pressable>

      <View style={{ flex: 1 }} />

      <Button
        label="Next: Define the Details"
        disabled={!selected}
        onPress={() =>
          navigation.navigate("ProblemDefinition", { type: selected })
        }
      />
    </ScrollView>
  );
}
