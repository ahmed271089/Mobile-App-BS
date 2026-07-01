import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, spacing, typography } from "../../theme";
import { Input } from "../../components/Input";
import { PostCard } from "../../components/PostCard";
import { searchPosts } from "../../api/posts";
import { adaptApiPost } from "../../utils/adaptApiPost";
import { MockPost } from "../../data/mockData";

export default function SearchScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MockPost[]>([]);
  const [loading, setLoading] = useState(false);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
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
        empty: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          textAlign: "center",
          marginTop: spacing.xxl,
        },
      }),
    [colors],
  );

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      searchPosts(query.trim())
        .then((posts) => setResults(posts.map(adaptApiPost)))
        .catch((err) => console.warn("Search failed", err))
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Input
            placeholder="Search the solved library…"
            value={query}
            onChangeText={setQuery}
            autoFocus
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

      <ScrollView contentContainerStyle={styles.results}>
        {loading ? (
          <ActivityIndicator
            color={colors.primary}
            style={{ marginTop: spacing.xl }}
          />
        ) : results.length === 0 ? (
          <Text style={styles.empty}>
            {query
              ? "No matching problems or solutions."
              : "Start typing to search…"}
          </Text>
        ) : (
          results.map((post) => (
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
