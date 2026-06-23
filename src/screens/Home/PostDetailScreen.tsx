import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { trendingPosts, recentSolutions } from '../../data/mockData';

export default function PostDetailScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { id } = route.params ?? {};
  const post = [...trendingPosts, ...recentSolutions].find((p) => p.id === id) ?? trendingPosts[0];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Pressable style={styles.backBtn}>
          <Ionicons name="flag-outline" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <Badge label={post.category.name} variant="info" />
          {post.status === 'SOLVED' ? <Badge label="Solved" variant="success" icon="✓" /> : <Badge label="Open" variant="warning" />}
        </View>

        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>

        <View style={styles.aiBox}>
          <Badge label="AI Diagnosis" variant="info" icon="✨" />
          <Text style={styles.aiText}>
            Based on the symptoms described, this is likely caused by a loose connector or a failed component
            near the affected area. The community can help confirm and refine this.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Comments ({post.commentsCount})</Text>
        <View style={styles.commentRow}>
          <View style={styles.commentAvatar}>
            <Text style={styles.commentAvatarText}>JD</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.commentAuthor}>Jordan D.</Text>
            <Text style={styles.commentText}>Had this exact issue — turned out to be a corroded connector pin.</Text>
          </View>
        </View>

        <Button label="Mark as Solved" variant="secondary" style={{ marginTop: spacing.xl }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  aiBox: {
    backgroundColor: colors.infoMuted,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  aiText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  commentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  commentAuthor: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  commentText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
