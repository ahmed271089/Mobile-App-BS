import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
  
  const [feedData, setFeedData] = useState<MockPost[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string | null }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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
        sectionHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing.md,
          marginTop: spacing.sm,
        },
        sectionTitle: { ...typography.h3, color: colors.onSurface },
        iconBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        empty: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          textAlign: "center",
          marginVertical: spacing.xl,
        },
        footerLoading: {
          marginVertical: spacing.lg,
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

  const loadInitial = useCallback(async () => {
    try {
      const [posts, cats] = await Promise.all([
        getFeed({ categoryId: selectedCategory ?? undefined }),
        getCategories(),
      ]);
      setFeedData(posts.map(adaptApiPost));
      setCategories(cats);
      setHasMore(posts.length >= 20); // backend take is 20
    } catch (err) {
      console.warn("Failed to load initial feed", err);
    }
  }, [selectedCategory]);

  const loadMore = async () => {
    if (loadingMore || !hasMore || feedData.length === 0) return;
    setLoadingMore(true);
    
    const cursor = feedData[feedData.length - 1].id;
    try {
      const posts = await getFeed({
        categoryId: selectedCategory ?? undefined,
        cursor,
      });
      setFeedData((prev) => [...prev, ...posts.map(adaptApiPost)]);
      setHasMore(posts.length >= 20);
    } catch (err) {
      console.warn("Failed to load more feed", err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadInitial().finally(() => setLoading(false));
  }, [loadInitial]);

  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
    }, [loadUnreadCount]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadInitial(), loadUnreadCount()]);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const renderHeader = () => (
    <View>
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

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryRow}
        data={[{ id: "all", name: "All", icon: null }, ...categories]}
        keyExtractor={(c) => c.id}
        renderItem={({ item: c }) => {
          const isActive =
            (c.id === "all" && !selectedCategory) || selectedCategory === c.id;
          return (
            <Pressable
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(c.id === "all" ? null : c.id)}
            >
              {c.icon && <Text style={{ fontSize: 14 }}>{c.icon}</Text>}
              <Text style={styles.categoryLabel}>{c.name}</Text>
            </Pressable>
          );
        }}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <FlatList
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + spacing.lg },
        ]}
        data={feedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate("PostDetail", { id: item.id })}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={styles.empty}>No activity found.</Text>
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.footerLoading} color={colors.primary} />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
