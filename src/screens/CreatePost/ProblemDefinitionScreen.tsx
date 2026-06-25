import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, spacing, typography } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { categories } from '../../data/mockData';

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
export default function ProblemDefinitionScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { type } = route.params ?? { type: 'PROBLEM' };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]); // array of local URIs
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);

  /** Open image picker (library or camera) */
  const handlePickImage = async (source: 'library' | 'camera') => {
    // Request permissions
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera access is needed to take a photo.');
        return;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Photo library access is needed to select images.');
        return;
      }
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.85,
            allowsEditing: true,
            aspect: [4, 3],
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.85,
            allowsMultipleSelection: true,
            selectionLimit: 5 - images.length,
          });

    if (!result.canceled && result.assets.length > 0) {
      const newUris = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...newUris].slice(0, 5));
    }
  };

  const handleShowImagePicker = () => {
    if (images.length >= 5) {
      Alert.alert('Limit reached', 'You can attach up to 5 images per post.');
      return;
    }
    Alert.alert('Add Photo', 'Choose a source', [
      { text: 'Take a Photo', onPress: () => handlePickImage('camera') },
      { text: 'Photo Library', onPress: () => handlePickImage('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleRemoveImage = (uri: string) => {
    setImages((prev) => prev.filter((u) => u !== uri));
  };

  const handleGenerateSuggestions = () => {
    setAiLoading(true);
    // TODO: call POST /api/posts (draft) then the backend triggers agent-client.analyzeProblem
    setTimeout(() => {
      setAiSuggestions([
        'Check the power connector for loose pins before replacing any parts.',
        'Inspect for a blown fuse near the main board — common cause for this symptom.',
        'If the issue persists, the component may need pin-level reflow or replacement.',
      ]);
      setAiLoading(false);
    }, 1400);
  };

  const canGoNext = !!title && !!description && !!categoryId;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {type === 'PROBLEM' ? 'Problem Definition' : 'Solution Details'}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <StepIndicator current={2} total={3} />

        {/* Title & Description */}
        <Input
          label="Title"
          placeholder={
            type === 'PROBLEM'
              ? 'e.g. Samsung Fridge Screen Flickering'
              : 'e.g. Fixed washing machine not draining'
          }
          value={title}
          onChangeText={setTitle}
        />
        <Input
          label="Description"
          placeholder={
            type === 'PROBLEM'
              ? "Describe the symptoms, when it started, what you've already tried…"
              : "Explain your fix step-by-step so others can replicate it…"
          }
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          style={{ height: 110, textAlignVertical: 'top' }}
        />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setCategoryId(c.id)}
              style={[styles.categoryPill, categoryId === c.id && styles.categoryPillSelected]}
            >
              <Text>{c.icon}</Text>
              <Text style={[styles.categoryPillLabel, categoryId === c.id && { color: colors.primary }]}>
                {c.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Photo Attachment */}
        <Text style={styles.label}>Attachments ({images.length}/5)</Text>

        {/* Thumbnail row */}
        {images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbRow}
            contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.md }}
          >
            {images.map((uri) => (
              <View key={uri} style={styles.thumbWrap}>
                <Image source={{ uri }} style={styles.thumb} />
                <Pressable
                  style={styles.thumbRemove}
                  onPress={() => handleRemoveImage(uri)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={20} color={colors.white} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Add photo button */}
        {images.length < 5 && (
          <Pressable style={styles.mediaBox} onPress={handleShowImagePicker}>
            <Ionicons name="camera-outline" size={24} color={colors.primary} />
            <Text style={styles.mediaText}>
              {images.length === 0 ? 'Add photo or video' : 'Add more photos'}
            </Text>
            <Text style={styles.mediaHint}>Tap to open camera or library</Text>
          </Pressable>
        )}

        {/* AI Card (PROBLEM only) */}
        {type === 'PROBLEM' && (
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Badge label="AI Agent" variant="info" icon="✨" />
              <Text style={styles.aiTitle}>AI Agent Assistant</Text>
            </View>
            <Text style={styles.aiDesc}>
              Ask AI to help refine your diagnostic clarity by suggesting categorization, similar past
              cases, and possible fixes before you post.
            </Text>

            {!aiSuggestions ? (
              <Button
                label={aiLoading ? 'Analyzing…' : 'Generate Suggestions'}
                variant="secondary"
                loading={aiLoading}
                disabled={!title || !description}
                onPress={handleGenerateSuggestions}
              />
            ) : (
              <View style={styles.suggestionsBox}>
                <Text style={styles.suggestedDetailsLabel}>AI Suggested Details</Text>
                {aiSuggestions.map((s, i) => (
                  <View key={i} style={styles.suggestionRow}>
                    <View style={styles.suggestionDot} />
                    <Text style={styles.suggestionText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Next Button */}
        <Button
          label="Next: Review & Share"
          style={{ marginTop: spacing.xl }}
          disabled={!canGoNext}
          onPress={() =>
            navigation.navigate('ShareFinalize', {
              type,
              title,
              description,
              categoryId,
              images,
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
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
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryPillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  categoryPillLabel: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  thumbRow: {
    marginBottom: spacing.sm,
  },
  thumbWrap: {
    position: 'relative',
    width: 84,
    height: 84,
    borderRadius: radius.md,
    overflow: 'visible',
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  thumbRemove: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.bg,
    borderRadius: 12,
  },
  mediaBox: {
    height: 100,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryMuted,
  },
  mediaText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  mediaHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  aiCard: {
    backgroundColor: colors.infoMuted,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  aiTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  aiDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.md,
  },
  suggestionsBox: {
    gap: spacing.sm,
  },
  suggestedDetailsLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  suggestionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  suggestionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  suggestionText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
});
