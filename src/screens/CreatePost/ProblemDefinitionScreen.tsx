import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { categories } from '../../data/mockData';

export default function ProblemDefinitionScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { type } = route.params ?? { type: 'PROBLEM' };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);

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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Problem Definition</Text>
          <View style={{ width: 36 }} />
        </View>

        <Input label="Title" placeholder="e.g. Samsung Fridge Screen Flickering" value={title} onChangeText={setTitle} />
        <Input
          label="Description"
          placeholder="Describe the symptoms, when it started, what you've already tried…"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          style={{ height: 110, textAlignVertical: 'top' }}
        />

        <Text style={styles.label}>Categorization</Text>
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

        <Pressable style={styles.mediaBox}>
          <Ionicons name="camera-outline" size={22} color={colors.textSecondary} />
          <Text style={styles.mediaText}>Add photo or video</Text>
        </Pressable>

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

        <Button
          label="Next"
          style={{ marginTop: spacing.xl }}
          disabled={!title || !description || !categoryId}
          onPress={() => navigation.navigate('ShareFinalize', { type, title, description, categoryId })}
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
  mediaBox: {
    height: 90,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  mediaText: {
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
