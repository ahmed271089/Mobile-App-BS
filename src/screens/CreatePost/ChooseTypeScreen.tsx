import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';
import { Button } from '../../components/Button';

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

      <Text style={styles.title}>What would you like to share today?</Text>
      <Text style={styles.subtitle}>Choose the type of post you want. Select this option first.</Text>

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
      </Pressable>

      <View style={{ flex: 1 }} />

      <Button
        label="Continue to All Steps"
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
