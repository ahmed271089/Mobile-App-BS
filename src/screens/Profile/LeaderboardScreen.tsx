import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, radius, spacing, typography } from "../../theme";
import { Badge } from "../../components/Badge";
import { getLeaderboard, ApiUser } from "../../api/users";
import { UPLOADS_BASE_URL } from "../../api/config";

export default function LeaderboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [users, setUsers] = useState<(ApiUser & { activityScore?: number })[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = useCallback(async () => {
    try {
      const data = await getLeaderboard();
      const filteredUsers = data.filter(u => {
        const n = u.name.toLowerCase();
        return n !== "ai agent" && n !== "system admin";
      });
      setUsers(filteredUsers);
    } catch (err) {
      console.warn("Failed to load leaderboard", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLeaderboard();
    }, [loadLeaderboard])
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        center: { flex: 1, alignItems: "center", justifyContent: "center" },
        container: { flex: 1, backgroundColor: colors.surface },
        header: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.outlineVariant,
        },
        backBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.md,
        },
        title: { ...typography.h2, color: colors.onSurface },
        listContent: {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
        },
        userCard: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surfaceContainer,
          borderRadius: radius.lg,
          padding: spacing.md,
          marginBottom: spacing.md,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
        },
        rankContainer: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.md,
        },
        rankText: {
          ...typography.bodyBold,
          color: colors.card,
        },
        avatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.md,
        },
        avatarText: {
          ...typography.bodyBold,
          color: colors.card,
        },
        avatarImage: { width: 40, height: 40, borderRadius: 20, marginRight: spacing.md },
        userInfo: { flex: 1 },
        name: { ...typography.bodyBold, color: colors.onSurface },
        reputationRow: {
          flexDirection: "row",
          alignItems: "center",
          marginTop: 2,
          gap: spacing.xs,
        },
        reputationPoints: {
          ...typography.caption,
          color: colors.primary,
          fontWeight: "600",
        },
        activityText: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
        },
      }),
    [colors]
  );

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.title}>Top Contributors</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const initials = item.name
            ?.split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "??";
          return (
            <View style={styles.userCard}>
              <View style={[styles.rankContainer, index < 3 && { backgroundColor: colors.primary }]}>
                <Text style={[styles.rankText, index < 3 && { color: colors.onPrimary }]}>
                  #{index + 1}
                </Text>
              </View>

              {item.avatarUrl ? (
                <Image
                  source={{ uri: item.avatarUrl.replace(/http:\/\/localhost:\d+/, UPLOADS_BASE_URL) }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}

              <View style={styles.userInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.reputationRow}>
                  <Text style={styles.reputationPoints}>
                    🏆 {item.reputationPoints.toLocaleString()} pts
                  </Text>
                  {item.reputationLevel && (
                    <Text style={{ ...typography.caption, color: colors.onSurfaceVariant, fontWeight: "bold" }}>
                      · {item.reputationLevel}
                    </Text>
                  )}
                  {item.isVerified && (
                    <Badge label="Verified" variant="success" icon="✓" />
                  )}
                </View>
              </View>

              {item.activityScore !== undefined && (
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.activityText}>Activity</Text>
                  <Text style={{ ...typography.bodyBold, color: colors.onSurface }}>
                    {item.activityScore}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
