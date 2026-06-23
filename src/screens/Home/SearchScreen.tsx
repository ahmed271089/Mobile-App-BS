import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';
import { Input } from '../../components/Input';
import { PostCard } from '../../components/PostCard';
import { trendingPosts, recentSolutions } from '../../data/mockData';

export default function SearchScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const results = [...trendingPosts, ...recentSolutions].filter((p) =>
    query ? p.title.toLowerCase().includes(query.toLowerCase()) : true,
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Input
            placeholder="Search the solved library…"
            value={query}
            onChangeText={setQuery}
            autoFocus
            icon={<Ionicons name="search" size={16} color={colors.textMuted} />}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.results}>
        {results.length === 0 ? (
          <Text style={styles.empty}>No matching problems or solutions yet.</Text>
        ) : (
          results.map((post) => (
            <PostCard key={post.id} post={post} onPress={() => navigation.navigate('PostDetail', { id: post.id })} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  results: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
