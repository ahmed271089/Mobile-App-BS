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
import { Button } from "../../components/Button";
import {
  listPendingFriendRequests,
  respondFriendRequest,
  FriendRequest,
} from "../../api/chat";

export default function FriendRequestsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

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
        sub: { ...typography.caption, color: colors.onSurfaceVariant },
        actions: { gap: spacing.xs },
      }),
    [colors],
  );

  const load = () => {
    listPendingFriendRequests()
      .then(setRequests)
      .catch(console.warn)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const respond = async (id: string, accept: boolean) => {
    try {
      await respondFriendRequest(id, accept);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      Alert.alert("Error", "Could not respond to request.");
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
        <Text style={styles.title}>Friend Requests</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          color={colors.primary}
          style={{ marginTop: spacing.xl }}
        />
      ) : requests.length === 0 ? (
        <Text style={styles.empty}>No pending friend requests.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.sender.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.sender.name}</Text>
                <Text style={styles.sub}>Wants to connect with you</Text>
              </View>
              <View style={styles.actions}>
                <Button label="Accept" onPress={() => respond(item.id, true)} />
                <Button
                  variant="secondary"
                  label="Decline"
                  onPress={() => respond(item.id, false)}
                />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
