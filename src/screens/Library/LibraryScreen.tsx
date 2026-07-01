import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../theme';
import { PostCard } from '../../components/PostCard';
import { getFeed } from '../../api/posts';
import { adaptApiPost } from '../../utils/adaptApiPost';
import { MockPost } from '../../data/mockData';

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
  const [solvedPosts, setSolvedPosts] = useState<MockPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const posts = await getFeed({ status: 'SOLVED' });
      setSolvedPosts(posts.map(adaptApiPost));
    } catch (err) {
      console.warn('Failed to load library', err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.lg }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await loadData(); setRefreshing(false); }} tintColor={colors.primary} />}
    >
      <Text style={styles.title}>Solved Library</Text>
      <Text style={styles.subtitle}>Every solved problem, searchable, forever.</Text>

      <View style={styles.statsGrid}>
        <StatCard label="Problems Solved" value={solvedPosts.length.toLocaleString()} accent={colors.primary} />
        <StatCard label="In Library" value={String(solvedPosts.filter((p) => p.type === 'PROBLEM').length)} />
        <StatCard label="Solutions" value={String(solvedPosts.filter((p) => p.type === 'SOLUTION').length)} accent={colors.success} />
        <StatCard label="Trending" value={String(solvedPosts.filter((p) => p.isTrending).length)} accent={colors.warning} />
      </View>

      <Text style={styles.sectionTitle}>Recently Solved</Text>
      {solvedPosts.length === 0 ? (
        <Text style={styles.empty}>No solved problems yet.</Text>
      ) : (
        solvedPosts.map((post) => (
          <PostCard key={post.id} post={post} onPress={() => navigation.navigate('Home', { screen: 'PostDetail', params: { id: post.id } })} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  statCard: { flexBasis: '47%', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.lg, padding: spacing.lg },
  statValue: { ...typography.h1, color: colors.textPrimary, marginBottom: 4 },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  empty: { ...typography.body, color: colors.textMuted },
});
