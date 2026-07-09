import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors, radius, spacing, typography } from "../../theme";
import { PostCard } from "../../components/PostCard";
import { getFavorites } from "../../api/posts";
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
        borderWidth: StyleSheet.hairlineWidth,
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
  const [savedPosts, setSavedPosts] = useState<MockPost[]>([]);
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
      divider: {
        height: 1,
        backgroundColor: colors.outlineVariant,
        marginBottom: spacing.lg,
      },
      empty: { ...typography.body, color: colors.onSurfaceVariant },
    }),
    [colors],
  );

  const loadData = useCallback(async () => {
    try {
      const posts = await getFavorites();
      setSavedPosts(posts.map(adaptApiPost));
    } catch (err) {
      console.warn("Failed to load library", err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (savedPosts.length === 0) setLoading(true);
      loadData().finally(() => setLoading(false));
    }, [loadData, savedPosts.length])
  );

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
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <FlatList
        data={savedPosts}
        keyExtractor={(item) => item.id}
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
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Saved Posts</Text>
            <Text style={styles.subtitle}>
              Every saved post, searchable, forever.
            </Text>

            <View style={styles.statsGrid}>
              <StatCard
                label="Total Saved"
                value={savedPosts.length.toLocaleString()}
                accent={colors.primary}
                colors={colors}
              />
              <StatCard
                label="Problems"
                value={String(savedPosts.filter((p) => p.type === "PROBLEM").length)}
                colors={colors}
              />
              <StatCard
                label="Solutions"
                value={String(
                  savedPosts.filter((p) => p.type === "SOLUTION").length,
                )}
                accent={colors.success}
                colors={colors}
              />
              <StatCard
                label="Trending"
                value={String(savedPosts.filter((p) => p.isTrending).length)}
                accent={colors.warning}
                colors={colors}
              />
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Recently Saved</Text>
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ alignItems: "center", paddingVertical: spacing.xxl }}>
              <Ionicons name="bookmarks-outline" size={64} color={colors.outlineVariant} />
              <Text style={[styles.empty, { marginTop: spacing.md, textAlign: "center" }]}>
                No saved posts yet.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item: post }) => (
          <PostCard
            post={post}
            onToggleSave={(isSaved) => {
              if (!isSaved) {
                setSavedPosts((prev) => prev.filter((p) => p.id !== post.id));
              }
            }}
            onPress={() =>
              navigation.navigate("Home", {
                screen: "PostDetail",
                params: { id: post.id },
              })
            }
          />
        )}
      />
    </View>
  );
}
