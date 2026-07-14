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
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, spacing, typography } from "../../theme";
import { ConfirmModal } from "../../components/ConfirmModal";
import {
  listFriends,
  startConversation,
  removeFriend,
  FriendUser,
} from "../../api/chat";

export default function FriendsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState<FriendUser | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadFriends();
    }, [])
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
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
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        title: { ...typography.h2, color: colors.onSurface, flex: 1 },
        empty: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          textAlign: "center",
          marginTop: spacing.xxl,
          paddingHorizontal: spacing.xl,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: spacing.md,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.outlineVariant,
        },
        avatar: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.md,
        },
        avatarText: {
          ...typography.caption,
          color: colors.card,
          fontWeight: "700",
        },
        nameContainer: {
          flex: 1,
          paddingVertical: spacing.sm,
        },
        name: {
          ...typography.bodyBold,
          color: colors.onSurface,
        },
        actionBtn: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: spacing.xs,
        },
        removeActionBtn: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.surfaceContainer,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: spacing.xs,
        },
      }),
    [colors],
  );

  const loadFriends = () => {
    setLoading(true);
    listFriends()
      .then((data) => {
        const filtered = data.filter((u) => {
          const n = u.name.toLowerCase();
          return n !== "ai agent" && n !== "system admin";
        });
        setFriends(filtered);
      })
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
    setFriendToRemove(friend);
    setConfirmModalVisible(true);
  };

  const handleConfirmRemove = () => {
    if (friendToRemove) {
      performRemoval(friendToRemove);
      setConfirmModalVisible(false);
    }
  };

  const handleCancelRemove = () => {
    setConfirmModalVisible(false);
    setFriendToRemove(null);
  };

  const performRemoval = async (friend: FriendUser) => {
    setRemoving(friend.id);

    try {
      await removeFriend(friend.id);
      setFriends((prev) => prev.filter((f) => f.id !== friend.id));

      Alert.alert(
        "Success",
        `${friend.name} has been removed from your friends.`,
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        `Could not remove friend. ${error.message || "Please try again."}`,
      );
    } finally {
      setRemoving(null);
    }
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
              <View style={styles.avatar} >
                <Text style={styles.avatarText} >
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

              {/* Remove button — subtle outline style */}
              <Pressable
                onPress={() => handleRemoveFriend(item)}
                style={styles.removeActionBtn}
                hitSlop={8}
                disabled={removing === item.id}
              >
                {removing === item.id ? (
                  <ActivityIndicator size="small" color={colors.error} />
                ) : (
                  <Ionicons
                    name="person-remove-outline"
                    size={18}
                    color={colors.error}
                  />
                )}
              </Pressable>
            </View>
          )}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        visible={confirmModalVisible}
        title="Remove Friend"
        message={`Are you sure you want to remove ${friendToRemove?.name || "this friend"} from your friends list?`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        loading={removing === friendToRemove?.id}
        confirmColor={colors.error}
      />
    </View>
  );
}
