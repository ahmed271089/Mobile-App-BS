import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme';
import { listConversations, ConversationSummary } from '../../api/chat';

export default function ConversationsListScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listConversations()
      .then(setConversations)
      .catch((err) => console.warn('Failed to load conversations', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + spacing.lg }}>
      <Text style={styles.title}>Messages</Text>

      {conversations.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>No conversations yet. Start one from a user's profile.</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }}
          renderItem={({ item }) => {
            const other = item.otherParticipants[0];
            return (
              <Pressable
                style={styles.row}
                onPress={() => navigation.navigate('ChatThread', { conversationId: item.id, otherUser: other })}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{other?.name?.slice(0, 2).toUpperCase() ?? '??'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{other?.name ?? 'Unknown user'}</Text>
                  <Text style={styles.preview} numberOfLines={1}>
                    {item.lastMessage?.content ?? 'Say hello 👋'}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  name: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  preview: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
