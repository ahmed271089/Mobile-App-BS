import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';
import { Button } from '../../components/Button';

/** ─── Step Indicator ─────────────────────────────────────────── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={stepStyles.wrapper}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            stepStyles.dot,
            i < current ? stepStyles.dotDone : i === current - 1 ? stepStyles.dotActive : stepStyles.dotInactive,
          ]}
        />
      ))}
      <Text style={stepStyles.label}>
        Step {current} of {total}
      </Text>
    </View>
  );
}

const stepStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: colors.cardBorder,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 4,
    flexShrink: 0,
  },
});

/** ─── Screen ─────────────────────────────────────────────────── */
export default function ChooseTypeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = React.useState<'PROBLEM' | 'SOLUTION' | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>New Post</Text>
        <View style={{ width: 36 }} />
      </View>

      <StepIndicator current={1} total={3} />

      <Text style={styles.title}>What would you like to share?</Text>
      <Text style={styles.subtitle}>Choose the type of post you want to create.</Text>

      <Pressable
        style={[styles.option, selected === 'PROBLEM' && styles.optionSelected]}
        onPress={() => setSelected('PROBLEM')}
      >
        <View style={[styles.optionIcon, { backgroundColor: colors.dangerMuted }]}>
          <Ionicons name="warning-outline" size={22} color={colors.danger} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.optionTitle}>I have a Problem</Text>
          <Text style={styles.optionDesc}>
            Describe a fault or issue you need help with. Our AI agent will give an initial diagnosis.
          </Text>
        </View>
        {selected === 'PROBLEM' && (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </Pressable>

      <Pressable
        style={[styles.option, selected === 'SOLUTION' && styles.optionSelected]}
        onPress={() => setSelected('SOLUTION')}
      >
        <View style={[styles.optionIcon, { backgroundColor: colors.successMuted }]}>
          <Ionicons name="bulb-outline" size={22} color={colors.success} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.optionTitle}>I have a Solution</Text>
          <Text style={styles.optionDesc}>
            Share your fix for a problem you've already solved. Help build the community library.
          </Text>
        </View>
        {selected === 'SOLUTION' && (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </Pressable>

      <View style={{ flex: 1 }} />

      <Button
        label="Next: Define the Details"
        disabled={!selected}
        onPress={() => navigation.navigate('ProblemDefinition', { type: selected })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  optionDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
