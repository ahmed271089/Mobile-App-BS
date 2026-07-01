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

  useEffect(() => {
    loadFriends();
  }, []);

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
          backgroundColor: colors.error,
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
    console.log("\n=== REMOVE FRIEND FUNCTION CALLED ===");
    console.log("Friend:", friend);
    console.log("Friend ID:", friend.id);
    console.log("Friend Name:", friend.name);

    // Afficher le modal de confirmation
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
    console.log("User cancelled removal");
    setConfirmModalVisible(false);
    setFriendToRemove(null);
  };

  // Fonction pour effectuer la suppression (utilisée par web et mobile)
  const performRemoval = async (friend: FriendUser) => {
    console.log("User confirmed removal");
    console.log("Setting removing state for:", friend.id);
    setRemoving(friend.id);

    try {
      console.log("Calling removeFriend API with ID:", friend.id);
      const result = await removeFriend(friend.id);
      console.log("API call successful! Result:", result);

      console.log("Updating friends list - removing ID:", friend.id);
      setFriends((prev) => {
        const newList = prev.filter((f) => f.id !== friend.id);
        console.log("Old list length:", prev.length);
        console.log("New list length:", newList.length);
        return newList;
      });

      console.log("Friend removed successfully!");
      Alert.alert(
        "Success",
        `${friend.name} has been removed from your friends.`,
      );
    } catch (error: any) {
      console.error("\n=== ERROR REMOVING FRIEND ===");
      console.error("Error object:", error);
      console.error("Error message:", error.message);
      console.error("Error status:", error.status);
      console.error("Error stack:", error.stack);

      Alert.alert(
        "Error",
        `Could not remove friend. ${error.message || "Please try again."}`,
      );
    } finally {
      console.log("Clearing removing state");
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
        <>
          {/* BOUTON DE TEST - TEMPORAIRE */}
          <Pressable
            onPress={() => {
              console.log("🔴 TEST BUTTON CLICKED!");
              console.log("🔴 Friends list:", friends);
              if (friends.length > 0) {
                console.log("🔴 Testing with first friend:", friends[0]);
                handleRemoveFriend(friends[0]);
              } else {
                Alert.alert("No friends to test");
              }
            }}
            style={{
              backgroundColor: colors.error,
              padding: 20,
              marginHorizontal: spacing.lg,
              marginBottom: spacing.md,
              borderRadius: 8,
              borderWidth: 3,
              borderColor: "yellow",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              🧪 TEST: Remove First Friend
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 12,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              (Temporary debug button)
            </Text>
          </Pressable>
          {/* FIN DU BOUTON DE TEST */}

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
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={colors.white}
                    />
                  )}
                </Pressable>
              </View>
            )}
          />
        </>
      )}

      {/* Modal de Confirmation */}
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

// Styles now created dynamically inside component using useMemo
