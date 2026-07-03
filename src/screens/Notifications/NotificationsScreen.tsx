import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, spacing, typography } from "../../theme";
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  AppNotification,
} from "../../api/notifications";
import { formatRelativeTime } from "../../utils/formatRelativeTime";

const NOTIFICATION_ICONS: Record<
  string,
  { name: keyof typeof Ionicons.glyphMap; color: (c: any) => string }
> = {
  MESSAGE: {
    name: "chatbubble",
    color: (c) => c.primary,
  },
  FRIEND_REQUEST: {
    name: "person-add",
    color: (c) => c.tertiary,
  },
  COMMENT: {
    name: "chatbubble-ellipses",
    color: (c) => c.primary,
  },
  SOLVED: {
    name: "checkmark-circle",
    color: (c) => c.secondary,
  },
  REWARD: {
    name: "star",
    color: (c) => c.warning,
  },
};

function notificationText(n: AppNotification): string {
  const p = n.payload;
  switch (n.type) {
    case "MESSAGE":
      return `${p.from?.name ?? "Someone"}: ${p.preview ?? "sent a message"}`;
    case "FRIEND_REQUEST":
      return `${p.from?.name ?? "Someone"} sent you a friend request`;
    case "COMMENT":
      return `${p.from?.name ?? "Someone"} commented on your post`;
    case "SOLVED":
      return "Your problem was marked as solved";
    case "REWARD":
      return `You received ${p.points ?? ""} reputation points`;
    default:
      return "You have a new notification";
  }
}

export default function NotificationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        center: { flex: 1, alignItems: "center", justifyContent: "center" },
        header: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.lg,
          gap: spacing.md,
        },
        backBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        title: { ...typography.h2, color: colors.onSurface, flex: 1 },
        markAll: { ...typography.caption, color: colors.primary },
        empty: { ...typography.body, color: colors.onSurfaceVariant },
        row: {
          flexDirection: "row",
          gap: spacing.md,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.outlineVariant,
        },
        rowUnread: {
          borderLeftWidth: 3,
          borderLeftColor: colors.primary,
          paddingLeft: spacing.sm,
          backgroundColor: `${colors.primaryContainer}40`,
          borderRadius: 8,
          paddingHorizontal: spacing.sm,
          marginBottom: 2,
        },
        iconWrap: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        body: { ...typography.body, color: colors.onSurface },
        bodyUnread: {
          ...typography.body,
          color: colors.onSurface,
          fontWeight: "600",
        },
        time: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          marginTop: 2,
        },
      }),
    [colors],
  );

  const load = () => {
    listNotifications()
      .then(setItems)
      .catch(console.warn)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handlePress = async (item: AppNotification) => {
    if (!item.isRead) {
      await markNotificationRead(item.id);
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
      );
    }
    if (item.type === "MESSAGE" && item.payload.conversationId) {
      navigation.navigate("Chat", {
        screen: "ChatThread",
        params: {
          conversationId: item.payload.conversationId,
          otherUser: item.payload.from,
        },
      });
    } else if (item.type === "FRIEND_REQUEST") {
      navigation.navigate("Chat", { screen: "FriendRequests" });
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const getNotifIcon = (type: string) => {
    const config = NOTIFICATION_ICONS[type] ?? {
      name: "notifications" as keyof typeof Ionicons.glyphMap,
      color: (c: any) => c.primary,
    };
    return config;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        paddingTop: insets.top + spacing.lg,
      }}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <Pressable
          onPress={async () => {
            await markAllNotificationsRead();
            load();
          }}
        >
          <Text style={styles.markAll}>Mark all read</Text>
        </Pressable>
      </View>

      {items.length === 0 ? (
        <View style={styles.center}>
          <Ionicons
            name="notifications-off-outline"
            size={48}
            color={colors.outlineVariant}
            style={{ marginBottom: spacing.md }}
          />
          <Text style={styles.empty}>No notifications yet.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xl,
          }}
          renderItem={({ item }) => {
            const iconConfig = getNotifIcon(item.type);
            return (
              <Pressable
                style={[styles.row, !item.isRead && styles.rowUnread]}
                onPress={() => handlePress(item)}
              >
                <View
                  style={[
                    styles.iconWrap,
                    !item.isRead && {
                      backgroundColor: `${iconConfig.color(colors)}20`,
                    },
                  ]}
                >
                  <Ionicons
                    name={iconConfig.name}
                    size={16}
                    color={iconConfig.color(colors)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={!item.isRead ? styles.bodyUnread : styles.body}>
                    {notificationText(item)}
                  </Text>
                  <Text style={styles.time}>
                    {formatRelativeTime(item.createdAt)}
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
