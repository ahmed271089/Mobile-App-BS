import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../theme';
import { PostCard } from '../../components/PostCard';
import { solvedLibraryStats, recentSolutions } from '../../data/mockData';

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, accent ? { color: accent } : null]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function LibraryScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.title}>Solved Library</Text>
      <Text style={styles.subtitle}>Every solved problem, searchable, forever.</Text>

      <View style={styles.statsGrid}>
        <StatCard label="Problems Solved" value={solvedLibraryStats.totalSolved.toLocaleString()} accent={colors.primary} />
        <StatCard label="Verified Experts" value={solvedLibraryStats.expertsVerified.toLocaleString()} />
        <StatCard label="Success Rate" value={solvedLibraryStats.successRate} accent={colors.success} />
        <StatCard label="Active Problems" value={String(solvedLibraryStats.activeProblems)} accent={colors.warning} />
      </View>

      <Text style={styles.sectionTitle}>Recently Solved</Text>
      {recentSolutions.map((post) => (
        <PostCard key={post.id} post={post} onPress={() => navigation.navigate('PostDetail', { id: post.id })} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flexBasis: '47%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  statValue: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});
