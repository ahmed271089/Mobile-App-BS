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
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { searchUsers, ApiUser } from "../../api/users";
import { sendFriendRequest, listFriends, startConversation } from "../../api/chat";

export default function AddFriendScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    Pick<
      ApiUser,
      "id" | "name" | "avatarUrl" | "reputationPoints" | "isVerified"
    >[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    listFriends()
      .then((friends) => {
        setFriendIds(new Set(friends.map((f) => f.id)));
      })
      .catch(console.warn);
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
        title: { ...typography.h2, color: colors.onSurface },
        empty: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          textAlign: "center",
          marginTop: spacing.xxl,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
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
        },
        avatarText: {
          ...typography.caption,
          color: colors.card,
          fontWeight: "700",
        },
        name: { ...typography.bodyBold, color: colors.onSurface },
        sub: { ...typography.caption, color: colors.onSurfaceVariant },
      }),
    [colors],
  );

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      searchUsers(query.trim())
        .then((data) => {
          const filtered = data.filter((u) => {
            const n = u.name.toLowerCase();
            return n !== "ai agent" && n !== "system admin";
          });
          setResults(filtered);
        })
        .catch(console.warn)
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSend = async (userId: string) => {
    try {
      await sendFriendRequest(userId);
      setSent((prev) => new Set(prev).add(userId));
      Alert.alert("Sent!", "Friend request sent successfully.");
    } catch {
      Alert.alert("Error", "Could not send friend request.");
    }
  };

  const handleOpenChat = async (user: ApiUser) => {
    try {
      const conv = await startConversation(user.id);
      navigation.navigate("ChatThread", {
        conversationId: conv.id,
        otherUser: user,
      });
    } catch {
      Alert.alert("Error", "Could not open conversation.");
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
        <Text style={styles.title}>Add Friend</Text>
      </View>

      <View style={{ paddingHorizontal: spacing.lg }}>
        <Input
          placeholder="Search by name or email…"
          value={query}
          onChangeText={setQuery}
          autoFocus
          icon={
            <Ionicons name="search" size={16} color={colors.onSurfaceVariant} />
          }
        />
      </View>

      {loading ? (
        <ActivityIndicator
          color={colors.primary}
          style={{ marginTop: spacing.xl }}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
          }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {query ? "No users found." : "Search for someone to add."}
            </Text>
          }
          renderItem={({ item }) => {
            const isFriend = friendIds.has(item.id);
            return (
              <Pressable
                style={styles.row}
                onPress={() => {
                  if (isFriend) handleOpenChat(item as ApiUser);
                }}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.sub}>
                    {item.reputationPoints.toLocaleString()} reputation
                  </Text>
                </View>
                {!isFriend && (
                  <Button style={{width:"25%"}}
                    label={sent.has(item.id) ? "Sent" : "Add"}
                    disabled={sent.has(item.id)}
                    onPress={() => handleSend(item.id)}
                  />
                )}
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
