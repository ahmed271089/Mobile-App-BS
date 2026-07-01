import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors, radius, spacing, typography } from "../../theme";
import { PostCard } from "../../components/PostCard";
import { getFeed } from "../../api/posts";
import { adaptApiPost } from "../../utils/adaptApiPost";
import { MockPost } from "../../data/mockData";

function StatCard({
  label,
  value,
  accent,
  colors,
}: {
  label: string;
  value: string;
  accent?: string;
  colors: any;
}) {
  const styles = React.useMemo(
    () => ({
      statCard: {
        flexBasis: "47%" as const,
        backgroundColor: colors.surfaceContainer,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
        borderRadius: radius.lg,
        padding: spacing.lg,
      },
      statValue: { ...typography.h1, color: colors.onSurface, marginBottom: 4 },
      statLabel: { ...typography.caption, color: colors.onSurfaceVariant },
    }),
    [colors],
  );

  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, accent ? { color: accent } : null]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function LibraryScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [solvedPosts, setSolvedPosts] = useState<MockPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const styles = React.useMemo(
    () => ({
      center: {
        flex: 1,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      },
      container: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
      title: { ...typography.h1, color: colors.onSurface },
      subtitle: {
        ...typography.body,
        color: colors.onSurfaceVariant,
        marginBottom: spacing.xl,
      },
      statsGrid: {
        flexDirection: "row" as const,
        flexWrap: "wrap" as const,
        gap: spacing.md,
        marginBottom: spacing.xl,
      },
      sectionTitle: {
        ...typography.h3,
        color: colors.onSurface,
        marginBottom: spacing.md,
      },
      empty: { ...typography.body, color: colors.onSurfaceVariant },
    }),
    [colors],
  );

  const loadData = useCallback(async () => {
    try {
      const posts = await getFeed({ status: "SOLVED" });
      setSolvedPosts(posts.map(adaptApiPost));
    } catch (err) {
      console.warn("Failed to load library", err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { paddingTop: insets.top, backgroundColor: colors.surface },
        ]}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface }}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + spacing.lg },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await loadData();
            setRefreshing(false);
          }}
          tintColor={colors.primary}
        />
      }
    >
      <Text style={styles.title}>Solved Library</Text>
      <Text style={styles.subtitle}>
        Every solved problem, searchable, forever.
      </Text>

      <View style={styles.statsGrid}>
        <StatCard
          label="Problems Solved"
          value={solvedPosts.length.toLocaleString()}
          accent={colors.primary}
          colors={colors}
        />
        <StatCard
          label="In Library"
          value={String(solvedPosts.filter((p) => p.type === "PROBLEM").length)}
          colors={colors}
        />
        <StatCard
          label="Solutions"
          value={String(
            solvedPosts.filter((p) => p.type === "SOLUTION").length,
          )}
          accent={colors.success}
          colors={colors}
        />
        <StatCard
          label="Trending"
          value={String(solvedPosts.filter((p) => p.isTrending).length)}
          accent={colors.warning}
          colors={colors}
        />
      </View>

      <Text style={styles.sectionTitle}>Recently Solved</Text>
      {solvedPosts.length === 0 ? (
        <Text style={styles.empty}>No solved problems yet.</Text>
      ) : (
        solvedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPress={() =>
              navigation.navigate("Home", {
                screen: "PostDetail",
                params: { id: post.id },
              })
            }
          />
        ))
      )}
    </ScrollView>
  );
}
