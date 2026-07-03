import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, spacing, typography } from "../../theme";
import { PostCard } from "../../components/PostCard";
import { getFeed, getCategories } from "../../api/posts";
import { getUnreadCount } from "../../api/notifications";
import { adaptApiPost } from "../../utils/adaptApiPost";
import { MockPost } from "../../data/mockData";

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [trendingPosts, setTrendingPosts] = useState<MockPost[]>([]);
  const [recentSolutions, setRecentSolutions] = useState<MockPost[]>([]);
  const [categories, setCategories] = useState<
    { id: string; name: string; icon: string | null }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        center: { flex: 1, alignItems: "center", justifyContent: "center" },
        container: {
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xxl,
        },
        headerRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing.lg,
        },
        greeting: { ...typography.h2, color: colors.onSurface },
        subGreeting: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          marginTop: 4,
        },
        notifBadge: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        badge: {
          position: "absolute",
          top: -2,
          right: -2,
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: colors.error,
          alignItems: "center",
          justifyContent: "center",
        },
        badgeText: { fontSize: 10, fontWeight: "700", color: colors.onError },
        searchBar: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          backgroundColor: colors.surfaceContainer,
          borderRadius: 12,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          marginBottom: spacing.lg,
        },
        searchText: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          flex: 1,
        },
        categoryScroll: { marginBottom: spacing.lg },
        categoryBtn: {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: 20,
          backgroundColor: colors.surfaceContainer,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          marginRight: spacing.xs,
        },
        categoryBtnActive: {
          backgroundColor: colors.primaryContainer,
          borderColor: colors.primary,
        },
        categoryText: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          fontWeight: "500",
        },
        categoryTextActive: { color: colors.primary, fontWeight: "600" },
        sectionHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing.md,
        },
        sectionTitle: { ...typography.h3, color: colors.onSurface },
        seeAll: {
          ...typography.caption,
          color: colors.primary,
          fontWeight: "600",
        },
        section: { marginBottom: spacing.xl },
        iconBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        searchPlaceholder: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          flex: 1,
        },
        categoryRow: { marginBottom: spacing.lg },
        categoryChip: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: 20,
          backgroundColor: colors.surfaceContainer,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          marginRight: spacing.xs,
        },
        categoryChipActive: {
          backgroundColor: colors.primaryContainer,
          borderColor: colors.primary,
        },
        categoryLabel: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          fontWeight: "500",
        },
        empty: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          textAlign: "center",
          marginVertical: spacing.xl,
        },
      }),
    [colors],
  );

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(typeof count === "number" ? count : 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [trending, solutions, cats] = await Promise.all([
        getFeed({
          type: "PROBLEM",
          trending: true,
          categoryId: selectedCategory ?? undefined,
        }),
        getFeed({
          type: "SOLUTION",
          categoryId: selectedCategory ?? undefined,
        }),
        getCategories(),
      ]);
      setTrendingPosts(trending.map(adaptApiPost));
      setRecentSolutions(solutions.map(adaptApiPost));
      setCategories(cats);
    } catch (err) {
      console.warn("Failed to load home feed", err);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
    }, [loadUnreadCount]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadData(), loadUnreadCount()]);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + spacing.lg },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Best Solving</Text>
            <Text style={styles.subGreeting}>What needs fixing today?</Text>
          </View>
          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.onSurface}
            />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        <Pressable
          style={styles.searchBar}
          onPress={() => navigation.navigate("Search")}
        >
          <Ionicons name="search" size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.searchPlaceholder}>
            Search problems, solutions, experts…
          </Text>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryRow}
        >
          <Pressable
            style={[
              styles.categoryChip,
              !selectedCategory && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.categoryLabel}>All</Text>
          </Pressable>
          {categories.map((c) => (
            <Pressable
              key={c.id}
              style={[
                styles.categoryChip,
                selectedCategory === c.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(c.id)}
            >
              <Text style={{ fontSize: 14 }}>{c.icon}</Text>
              <Text style={styles.categoryLabel}>{c.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Trending Problems</Text>
        </View>
        {trendingPosts.length === 0 ? (
          <Text style={styles.empty}>No trending problems yet.</Text>
        ) : (
          trendingPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() => navigation.navigate("PostDetail", { id: post.id })}
            />
          ))
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Solutions</Text>
        </View>
        {recentSolutions.length === 0 ? (
          <Text style={styles.empty}>No solutions posted yet.</Text>
        ) : (
          recentSolutions.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() => navigation.navigate("PostDetail", { id: post.id })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Styles now created dynamically inside component using useMemo
