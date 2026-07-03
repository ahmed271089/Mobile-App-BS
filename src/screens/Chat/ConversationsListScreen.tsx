import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, spacing, typography } from "../../theme";
import { listConversations, ConversationSummary } from "../../api/chat";

export default function ConversationsListScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        center: { flex: 1, alignItems: "center", justifyContent: "center" },
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.lg,
        },
        headerActions: { flexDirection: "row", gap: spacing.sm },
        iconBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        title: { ...typography.h2, color: colors.onSurface },
        empty: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          textAlign: "center",
          paddingHorizontal: spacing.xl,
        },
        link: {
          ...typography.bodyBold,
          color: colors.primary,
          marginTop: spacing.md,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.outlineVariant,
        },
        avatar: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        avatarText: {
          ...typography.caption,
          color: colors.primary,
          fontWeight: "700",
        },
        name: { ...typography.bodyBold, color: colors.onSurface },
        preview: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          marginTop: 2,
        },
        previewUnread: {
          ...typography.caption,
          color: colors.onSurface,
          fontWeight: "600",
          marginTop: 2,
        },
        nameUnread: {
          ...typography.bodyBold,
          color: colors.onSurface,
          fontWeight: "700",
        },
        unreadDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.primary,
          marginLeft: spacing.sm,
        },
      }),
    [colors],
  );

  const loadConversations = React.useCallback(() => {
    listConversations()
      .then(setConversations)
      .catch((err) => console.warn("Failed to load conversations", err))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadConversations();
    }, [loadConversations]),
  );

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        paddingTop: insets.top + spacing.lg,
      }}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.navigate("FriendRequests")}
          >
            <Ionicons
              name="mail-unread-outline"
              size={18}
              color={colors.onSurface}
            />
          </Pressable>
          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.navigate("AddFriend")}
          >
            <Ionicons
              name="person-add-outline"
              size={18}
              color={colors.onSurface}
            />
          </Pressable>
        </View>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.center}>
          <Ionicons
            name="chatbubbles-outline"
            size={48}
            color={colors.outlineVariant}
            style={{ marginBottom: spacing.md }}
          />
          <Text style={styles.empty}>No conversations yet.</Text>
          <Pressable onPress={() => navigation.navigate("Friends")}>
            <Text style={styles.link}>View friends or add someone</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xl,
          }}
          renderItem={({ item }) => {
            const other = item.otherParticipants[0];
            const unread = (item.unreadCount ?? 0) > 0;
            return (
              <Pressable
                style={styles.row}
                onPress={() =>
                  navigation.navigate("ChatThread", {
                    conversationId: item.id,
                    otherUser: other,
                  })
                }
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {other?.name?.slice(0, 2).toUpperCase() ?? "??"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={unread ? styles.nameUnread : styles.name}>
                    {other?.name ?? "Unknown user"}
                  </Text>
                  <Text style={unread ? styles.previewUnread : styles.preview} numberOfLines={1}>
                    {item.lastMessage?.content ?? "Say hello 👋"}
                  </Text>
                </View>
                {unread && <View style={styles.unreadDot} />}
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
