import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, spacing, typography } from "../../theme";
import { Input } from "../../components/Input";
import { PostCard } from "../../components/PostCard";
import { searchPosts, getCategories } from "../../api/posts";
import { adaptApiPost } from "../../utils/adaptApiPost";
import { MockPost } from "../../data/mockData";

export default function SearchScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MockPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  useEffect(() => {
    getCategories().then((res) => setCategories(res)).catch(console.warn);
  }, []);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          paddingHorizontal: spacing.lg,
        },
        backBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        results: {
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xxl,
        },
        emptyContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: spacing.xxxl * 2,
          paddingHorizontal: spacing.xl,
        },
        emptyTitle: {
          ...typography.h3,
          color: colors.onSurface,
          marginTop: spacing.lg,
          textAlign: "center",
        },
        emptySub: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          marginTop: spacing.xs,
          textAlign: "center",
        },
        filterChip: {
          paddingHorizontal: spacing.md,
          paddingVertical: 6,
          borderRadius: 16,
          backgroundColor: colors.surfaceContainerHigh,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
        },
        filterChipActive: {
          backgroundColor: colors.primaryContainer,
          borderColor: colors.primary,
        },
        filterChipText: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
        },
        filterChipTextActive: {
          color: colors.onPrimaryContainer,
          fontWeight: "bold",
        },
      }),
    [colors],
  );

  useEffect(() => {
    if (!query.trim() && !selectedCategory) {
      setResults([]);
      setHasMore(true);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      searchPosts(query.trim(), selectedCategory)
        .then((posts) => {
          setResults(posts.map(adaptApiPost));
          setHasMore(posts.length === 20);
        })
        .catch((err) => console.warn("Search failed", err))
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  const loadMore = async () => {
    if (loadingMore || !hasMore || loading || results.length === 0) return;
    const lastPost = results[results.length - 1];
    setLoadingMore(true);
    try {
      const posts = await searchPosts(query.trim(), selectedCategory, lastPost.id);
      if (posts.length < 20) setHasMore(false);
      setResults((prev) => [...prev, ...posts.map(adaptApiPost)]);
    } catch (err) {
      console.warn("Failed to load more search results", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg, marginBottom: 0 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
        </Pressable>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Input
            placeholder="Search the solved library…"
            value={query}
            onChangeText={setQuery}
            autoFocus
            style={{ marginBottom: 0 }}
            icon={
              <Ionicons
                name="search"
                size={16}
                color={colors.onSurfaceVariant}
              />
            }
          />
        </View>
      </View>

      <View style={{ marginBottom: spacing.md, marginTop: spacing.md }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
        >
          <Pressable
            style={[styles.filterChip, !selectedCategory && styles.filterChipActive]}
            onPress={() => setSelectedCategory(undefined)}
          >
            <Text style={[styles.filterChipText, !selectedCategory && styles.filterChipTextActive]}>All</Text>
          </Pressable>
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              style={[styles.filterChip, selectedCategory === cat.id && styles.filterChipActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.filterChipText, selectedCategory === cat.id && styles.filterChipTextActive]}>{cat.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.results}
        keyboardShouldPersistTaps="handled"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          ) : query || selectedCategory ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color={colors.outlineVariant} />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySub}>
                We couldn't find anything matching your search. Try adjusting your keywords or filters.
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="library-outline" size={64} color={colors.outlineVariant} />
              <Text style={styles.emptyTitle}>Search the Library</Text>
              <Text style={styles.emptySub}>
                Find solved problems, detailed solutions, and trending discussions.
              </Text>
            </View>
          )
        }
        renderItem={({ item: post }) => (
          <PostCard
            post={post}
            onPress={() => navigation.navigate("Home", { screen: "PostDetail", params: { id: post.id } })}
          />
        )}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.md }} />
          ) : null
        }
      />
    </View>
  );
}
