import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';
import { Button } from '../../components/Button';

type Audience = 'PUBLIC' | 'COMMUNITY';

export default function ShareFinalizeScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { title, description } = route.params ?? {};

  const [audience, setAudience] = useState<Audience>('PUBLIC');
  const [shareToFeed, setShareToFeed] = useState(true);
  const [posting, setPosting] = useState(false);

  const handlePost = () => {
    setPosting(true);
    // TODO: call POST /api/posts with { type, categoryId, title, description, attachments, audience }
    setTimeout(() => {
      setPosting(false);
      navigation.navigate('MainTabs', { screen: 'Home' });
    }, 1000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Finalize Sharing</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.previewCard}>
        <Text style={styles.previewTitle} numberOfLines={1}>
          {title || 'Untitled post'}
        </Text>
        <Text style={styles.previewDesc} numberOfLines={2}>
          {description || 'No description provided.'}
        </Text>
      </View>

      <Text style={styles.label}>Who can see this?</Text>

      <Pressable
        style={[styles.audienceOption, audience === 'PUBLIC' && styles.audienceSelected]}
        onPress={() => setAudience('PUBLIC')}
      >
        <Ionicons name="globe-outline" size={20} color={audience === 'PUBLIC' ? colors.primary : colors.textSecondary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.audienceTitle}>Public</Text>
          <Text style={styles.audienceDesc}>The internal community feed and search results can find it.</Text>
        </View>
        {audience === 'PUBLIC' && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
      </Pressable>

      <Pressable
        style={[styles.audienceOption, audience === 'COMMUNITY' && styles.audienceSelected]}
        onPress={() => setAudience('COMMUNITY')}
      >
        <Ionicons name="people-outline" size={20} color={audience === 'COMMUNITY' ? colors.primary : colors.textSecondary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.audienceTitle}>Community</Text>
          <Text style={styles.audienceDesc}>Visible only to verified experts in this category.</Text>
        </View>
        {audience === 'COMMUNITY' && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
      </Pressable>

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

      <View style={{ flex: 1 }} />

      <Button label="Share Now" loading={posting} onPress={handlePost} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
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
  },
  previewTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  previewDesc: {
    ...typography.caption,
    color: colors.textSecondary,
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
