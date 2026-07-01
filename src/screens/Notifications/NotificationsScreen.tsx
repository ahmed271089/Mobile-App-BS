import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { listNotifications, markNotificationRead, markAllNotificationsRead, AppNotification } from '../../api/notifications';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

function notificationText(n: AppNotification): string {
  const p = n.payload;
  switch (n.type) {
    case 'MESSAGE':
      return `${p.from?.name ?? 'Someone'}: ${p.preview ?? 'sent a message'}`;
    case 'FRIEND_REQUEST':
      return `${p.from?.name ?? 'Someone'} sent you a friend request`;
    case 'COMMENT':
      return `${p.from?.name ?? 'Someone'} commented on your post`;
    case 'SOLVED':
      return 'Your problem was marked as solved';
    case 'REWARD':
      return `You received ${p.points ?? ''} reputation points`;
    default:
      return 'You have a new notification';
  }
}

export default function NotificationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

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
      setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)));
    }
    if (item.type === 'MESSAGE' && item.payload.conversationId) {
      navigation.navigate('Chat', {
        screen: 'ChatThread',
        params: { conversationId: item.payload.conversationId, otherUser: item.payload.from },
      });
    } else if (item.type === 'FRIEND_REQUEST') {
      navigation.navigate('Chat', { screen: 'FriendRequests' });
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + spacing.lg }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <Pressable onPress={async () => { await markAllNotificationsRead(); load(); }}>
          <Text style={styles.markAll}>Mark all read</Text>
        </Pressable>
      </View>

      {items.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>No notifications yet.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }}
          renderItem={({ item }) => (
            <Pressable style={[styles.row, !item.isRead && styles.rowUnread]} onPress={() => handlePress(item)}>
              <View style={styles.iconWrap}>
                <Ionicons name="notifications" size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.body}>{notificationText(item)}</Text>
                <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.lg, gap: spacing.md },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.h2, color: colors.textPrimary, flex: 1 },
  markAll: { ...typography.caption, color: colors.primary },
  empty: { ...typography.body, color: colors.textMuted },
  row: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  rowUnread: { backgroundColor: colors.primaryMuted, borderRadius: 8, paddingHorizontal: spacing.sm, marginBottom: 2 },
  iconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  body: { ...typography.body, color: colors.textPrimary },
  time: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
});
