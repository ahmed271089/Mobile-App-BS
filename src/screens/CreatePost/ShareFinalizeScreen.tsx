import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';
import { Button } from '../../components/Button';

type Audience = 'PUBLIC' | 'COMMUNITY';

/** ─── Step Indicator ─────────────────────────────────────────── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={stepStyles.wrapper}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            stepStyles.dot,
            i < current ? stepStyles.dotDone : i === current - 1 ? stepStyles.dotActive : stepStyles.dotInactive,
          ]}
        />
      ))}
      <Text style={stepStyles.label}>
        Step {current} of {total}
      </Text>
    </View>
  );
}

const stepStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  dotDone: {
    flex: 1,
    backgroundColor: colors.primary,
    opacity: 0.55,
  },
  dotInactive: {
    flex: 1,
    backgroundColor: colors.cardBorder,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 4,
    flexShrink: 0,
  },
});

/** ─── Screen ─────────────────────────────────────────────────── */
export default function ShareFinalizeScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { title, description, type, categoryId, images = [] } = route.params ?? {};

  const [audience, setAudience] = useState<Audience>('PUBLIC');
  const [shareToFeed, setShareToFeed] = useState(true);
  const [posting, setPosting] = useState(false);

  const handlePost = () => {
    setPosting(true);
    // TODO: call POST /api/posts with { type, categoryId, title, description, attachments: images, audience, shareToFeed }
    setTimeout(() => {
      setPosting(false);
      navigation.navigate('MainTabs', { screen: 'Home' });
    }, 1000);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.lg }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Finalize & Share</Text>
        <View style={{ width: 36 }} />
      </View>

      <StepIndicator current={3} total={3} />

      {/* Post Preview Card */}
      <View style={styles.previewCard}>
        {/* Type badge */}
        <View style={[styles.typeBadge, type === 'PROBLEM' ? styles.typeBadgeProblem : styles.typeBadgeSolution]}>
          <Ionicons
            name={type === 'PROBLEM' ? 'warning-outline' : 'bulb-outline'}
            size={12}
            color={type === 'PROBLEM' ? colors.danger : colors.success}
          />
          <Text style={[styles.typeBadgeLabel, { color: type === 'PROBLEM' ? colors.danger : colors.success }]}>
            {type === 'PROBLEM' ? 'Problem' : 'Solution'}
          </Text>
        </View>

        <Text style={styles.previewTitle} numberOfLines={2}>
          {title || 'Untitled post'}
        </Text>
        <Text style={styles.previewDesc} numberOfLines={3}>
          {description || 'No description provided.'}
        </Text>

        {/* Image thumbnails preview */}
        {images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.previewThumbRow}
            contentContainerStyle={{ gap: spacing.sm }}
          >
            {images.map((uri: string, idx: number) => (
              <Image key={idx} source={{ uri }} style={styles.previewThumb} />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Audience */}
      <Text style={styles.label}>Who can see this?</Text>

      <Pressable
        style={[styles.audienceOption, audience === 'PUBLIC' && styles.audienceSelected]}
        onPress={() => setAudience('PUBLIC')}
      >
        <Ionicons
          name="globe-outline"
          size={20}
          color={audience === 'PUBLIC' ? colors.primary : colors.textSecondary}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.audienceTitle}>Public</Text>
          <Text style={styles.audienceDesc}>Visible in the community feed and search results.</Text>
        </View>
        {audience === 'PUBLIC' && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
      </Pressable>

      <Pressable
        style={[styles.audienceOption, audience === 'COMMUNITY' && styles.audienceSelected]}
        onPress={() => setAudience('COMMUNITY')}
      >
        <Ionicons
          name="people-outline"
          size={20}
          color={audience === 'COMMUNITY' ? colors.primary : colors.textSecondary}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.audienceTitle}>Community</Text>
          <Text style={styles.audienceDesc}>Visible only to verified experts in this category.</Text>
        </View>
        {audience === 'COMMUNITY' && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
      </Pressable>

      {/* Share to feed toggle */}
      <View style={styles.toggleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.audienceTitle}>Share to News Feed</Text>
          <Text style={styles.audienceDesc}>Notify your followers when this goes live.</Text>
        </View>
        <Switch
          value={shareToFeed}
          onValueChange={setShareToFeed}
          trackColor={{ false: colors.cardBorder, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>

      {/* Post button */}
      <Button
        label="Share Now"
        style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}
        loading={posting}
        onPress={handlePost}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  previewCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 4,
  },
  typeBadgeProblem: {
    backgroundColor: colors.dangerMuted,
  },
  typeBadgeSolution: {
    backgroundColor: colors.successMuted,
  },
  typeBadgeLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  previewTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  previewDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  previewThumbRow: {
    marginTop: spacing.sm,
  },
  previewThumb: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  audienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  audienceSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  audienceTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  audienceDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
});
