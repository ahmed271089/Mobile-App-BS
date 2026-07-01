import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../theme";
import {
  listFriends,
  startConversation,
  removeFriend,
  FriendUser,
} from "../../api/chat";

export default function FriendsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = () => {
    setLoading(true);
    listFriends()
      .then(setFriends)
      .catch(console.warn)
      .finally(() => setLoading(false));
  };

  const openChat = async (friend: FriendUser) => {
    try {
      const conv = await startConversation(friend.id);
      navigation.navigate("ChatThread", {
        conversationId: conv.id,
        otherUser: friend,
      });
    } catch {
      Alert.alert("Error", "Could not open conversation. Please try again.");
    }
  };

  const handleRemoveFriend = (friend: FriendUser) => {
    Alert.alert(
      "Remove Friend",
      `Are you sure you want to remove ${friend.name} from your friends?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setRemoving(friend.id);
            try {
              await removeFriend(friend.id);
              setFriends((prev) => prev.filter((f) => f.id !== friend.id));
              // Success feedback - no alert, just remove from list
            } catch (error) {
              console.error("Error removing friend:", error);
              Alert.alert(
                "Error",
                "Could not remove friend. Please try again.",
              );
            } finally {
              setRemoving(null);
            }
          },
        },
      ],
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        paddingTop: insets.top + spacing.lg,
      }}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>My Friends</Text>
        <Pressable onPress={() => navigation.navigate("AddFriend")}>
          <Ionicons
            name="person-add-outline"
            size={22}
            color={colors.primary}
          />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator
          color={colors.primary}
          style={{ marginTop: spacing.xl }}
        />
      ) : friends.length === 0 ? (
        <Text style={styles.empty}>
          No friends yet. Search for users to add.
        </Text>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {/* Avatar */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>

              {/* Name - tappable to open chat */}
              <Pressable
                onPress={() => openChat(item)}
                style={styles.nameContainer}
              >
                <Text style={styles.name}>{item.name}</Text>
              </Pressable>

              {/* Chat button */}
              <Pressable
                onPress={() => openChat(item)}
                style={styles.actionBtn}
                hitSlop={8}
              >
                <Ionicons
                  name="chatbubble"
                  size={20}
                  color={colors.primary}
                />
              </Pressable>

              {/* Remove button */}
              <Pressable
                onPress={() => handleRemoveFriend(item)}
                style={styles.removeActionBtn}
                hitSlop={8}
                disabled={removing === item.id}
              >
                {removing === item.id ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Ionicons name="close-circle" size={20} color={colors.white} />
                )}
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { ...typography.h2, color: colors.textPrimary, flex: 1 },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },
  nameContainer: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  name: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.xs,
  },
  removeActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.xs,
  },
});
