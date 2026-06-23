import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { PostCard } from '../../components/PostCard';
import { trendingPosts, recentSolutions, categories } from '../../data/mockData';

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Best Solving</Text>
            <Text style={styles.subGreeting}>What needs fixing today?</Text>
          </View>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
          </Pressable>
        </View>

        <Pressable style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search problems, solutions, experts…</Text>
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
          {categories.map((c) => (
            <Pressable key={c.id} style={styles.categoryChip}>
              <Text style={{ fontSize: 14 }}>{c.icon}</Text>
              <Text style={styles.categoryLabel}>{c.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Trending Problems</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>
        {trendingPosts.map((post) => (
          <PostCard key={post.id} post={post} onPress={() => navigation.navigate('PostDetail', { id: post.id })} />
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Solutions</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>
        {recentSolutions.map((post) => (
          <PostCard key={post.id} post={post} onPress={() => navigation.navigate('PostDetail', { id: post.id })} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subGreeting: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    height: 46,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchPlaceholder: {
    ...typography.body,
    color: colors.textMuted,
  },
  categoryRow: {
    marginBottom: spacing.xl,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  sectionLink: {
    ...typography.caption,
    color: colors.primary,
  },
});
