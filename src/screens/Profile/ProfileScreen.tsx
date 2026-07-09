import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
  RefreshControl,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useColors, radius, spacing, typography } from "../../theme";
import { Badge } from "../../components/Badge";
import { ThemeToggle } from "../../components/ThemeToggle";
import { clearTokens } from "../../utils/tokenStorage";
import { useSocket } from "../../api/socket";
import { getMe, ApiUser, updateProfile } from "../../api/users";
import { uploadFile } from "../../api/uploads";
import { getFeed, getMyPosts, deleteAllPosts } from "../../api/posts";
import { adaptApiPost } from "../../utils/adaptApiPost";
import { PostCard } from "../../components/PostCard";
import { MockPost } from "../../data/mockData";
import { UPLOADS_BASE_URL } from "../../api/config";

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { disconnect } = useSocket();
  
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Feed State
  const [posts, setPosts] = useState<MockPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        center: { flex: 1, alignItems: "center", justifyContent: "center" },
        container: {
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xxl,
        },
        headerRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing.xl,
        },
        title: { ...typography.h2, color: colors.onSurface },
        iconBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        profileCard: {
          alignItems: "center",
          backgroundColor: colors.surfaceContainer,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
          borderRadius: radius.lg,
          padding: spacing.xl,
          marginBottom: spacing.xl,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
            },
            android: { elevation: 2 },
          }),
        },
        avatarWrap: { position: "relative", marginBottom: spacing.md },
        avatar: {
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        avatarImage: { width: 72, height: 72, borderRadius: 36 },
        avatarText: { ...typography.h1, color: colors.white },
        cameraBadge: {
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        },
        name: {
          ...typography.h2,
          color: colors.onSurface,
          marginBottom: spacing.sm,
        },
        statsRow: {
          flexDirection: "row",
          alignItems: "center",
          marginTop: spacing.lg,
          width: "100%",
        },
        statItem: { flex: 1, alignItems: "center", paddingHorizontal: spacing.xs },
        statDivider: {
          width: 1,
          height: 30,
          backgroundColor: colors.outlineVariant,
        },
        statValue: { ...typography.h3, color: colors.onSurface },
        statLabel: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          marginTop: 2,
          textAlign: "center",
        },
        sectionTitle: {
          ...typography.h3,
          color: colors.onSurface,
          marginBottom: spacing.md,
        },
        listRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          backgroundColor: colors.surfaceContainer,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
          borderRadius: radius.lg,
          padding: spacing.md,
          marginBottom: spacing.sm,
        },
        listIcon: {
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        listTitle: { ...typography.bodyBold, color: colors.onSurface },
        listDesc: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          marginTop: 2,
        },
        logoutBtn: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.sm,
          paddingVertical: spacing.md,
          marginTop: spacing.lg,
        },
        logoutText: { ...typography.bodyBold, color: colors.error },
        emptyPosts: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          textAlign: "center",
          marginVertical: spacing.xl,
        },
        footerLoading: {
          marginVertical: spacing.lg,
        },
      }),
    [colors],
  );

  const loadInitialPosts = async (userId: string) => {
    try {
      const feed = await getMyPosts();
      setPosts(feed.map(adaptApiPost));
      setHasMorePosts(feed.length >= 20);
    } catch (err) {
      console.warn("Failed to load user posts", err);
    }
  };

  const loadMorePosts = async () => {
    if (loadingPosts || !hasMorePosts || posts.length === 0 || !user) return;
    setLoadingPosts(true);
    const cursor = posts[posts.length - 1].id;
    try {
      const feed = await getMyPosts(cursor);
      setPosts((prev) => [...prev, ...feed.map(adaptApiPost)]);
      setHasMorePosts(feed.length >= 20);
    } catch (err) {
      console.warn("Failed to load more posts", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadUserAndPosts = useCallback(async () => {
    try {
      const userData = await getMe();
      setUser(userData);
      await loadInitialPosts(userData.id);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserAndPosts().finally(() => setLoading(false));
    }, [loadUserAndPosts]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserAndPosts();
    setRefreshing(false);
  };

  const handleChangeAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Photo library access is needed.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setUploading(true);
    try {
      const uploaded = await uploadFile(
        asset.uri,
        asset.mimeType ?? "image/jpeg",
        asset.fileName ?? "avatar.jpg",
      );
      const updated = await updateProfile({ avatarUrl: uploaded.url });
      setUser(updated);
    } catch {
      Alert.alert("Upload failed", "Could not update profile photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAllPosts = () => {
    Alert.alert(
      "Delete All Posts",
      "Are you sure you want to delete all your posts? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAllPosts();
              setPosts([]);
              Alert.alert("Success", "All posts have been deleted.");
            } catch (err) {
              Alert.alert("Error", "Could not delete posts.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "??";
  const topCategory = user?.expertise?.[0]?.category.name ?? "Community Member";

  const renderHeader = () => (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Profile</Text>
        <Pressable
          style={styles.iconBtn}
          onPress={() => navigation.navigate("EditProfile", { user })}
        >
          <Ionicons
            name="create-outline"
            size={18}
            color={colors.onSurface}
          />
        </Pressable>
      </View>

      <View style={styles.profileCard}>
        <Pressable onPress={handleChangeAvatar} style={styles.avatarWrap}>
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl.replace(/http:\/\/localhost:\d+/, UPLOADS_BASE_URL) }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            {uploading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Ionicons name="camera" size={12} color={colors.white} />
            )}
          </View>
        </Pressable>
        <Text style={styles.name}>{user?.name ?? "User"}</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          <Badge
            label={user?.reputationLevel || 'Novice'}
            variant="warning"
            icon="⭐"
          />
          <Badge
            label={user?.isVerified ? `Expert · ${topCategory}` : topCategory}
            variant="info"
            icon={user?.isVerified ? "🛡️" : undefined}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {(user?.reputationPoints ?? 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Reputation</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.expertise?.length ?? 0}</Text>
            <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Categories</Text>
          </View>
        </View>

        {(user?.rank !== undefined || user?.activityScore !== undefined) && (
          <View style={[styles.statsRow, { marginTop: spacing.md }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                #{user?.rank ?? '-'}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Global Rank</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {(user?.activityScore ?? 0).toLocaleString()}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Contributions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {user?.isVerified ? "Yes" : "No"}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Verified</Text>
            </View>
          </View>
        )}

        {user?.nextLevel && user.nextLevelPoints && user.currentLevelPoints !== undefined ? (
          <View style={{ width: '100%', marginTop: spacing.xl }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
              <Text style={{ ...typography.caption, color: colors.onSurfaceVariant }}>
                {user.reputationPoints} / {user.nextLevelPoints} pts
              </Text>
              <Text style={{ ...typography.caption, color: colors.onSurfaceVariant, fontWeight: 'bold' }}>
                Next: {user.nextLevel}
              </Text>
            </View>
            <View style={{ height: 8, backgroundColor: colors.surface, borderRadius: 4, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.outlineVariant }}>
              <View
                style={{
                  height: '100%',
                  backgroundColor: colors.primary,
                  width: `${Math.min(100, Math.max(0, ((user.reputationPoints - user.currentLevelPoints) / (user.nextLevelPoints - user.currentLevelPoints)) * 100))}%`
                }}
              />
            </View>
          </View>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Community</Text>
      <Pressable
        style={styles.listRow}
        onPress={() => navigation.navigate("Leaderboard")}
      >
        <View style={styles.listIcon}>
          <Ionicons name="trophy-outline" size={18} color={colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.listTitle}>Leaderboard</Text>
          <Text style={styles.listDesc}>
            View the top contributors and experts
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceVariant} />
      </Pressable>

      <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>Chat & Friends</Text>
      <Pressable
        style={styles.listRow}
        onPress={() => navigation.navigate("Chat", { screen: "Friends" })}
      >
        <View style={styles.listIcon}>
          <Ionicons name="people-outline" size={18} color={colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.listTitle}>My Friends</Text>
          <Text style={styles.listDesc}>
            View friends and start conversations
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceVariant} />
      </Pressable>
      <Pressable
        style={styles.listRow}
        onPress={() =>
          navigation.navigate("Chat", { screen: "FriendRequests" })
        }
      >
        <View style={styles.listIcon}>
          <Ionicons
            name="person-add-outline"
            size={18}
            color={colors.white}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.listTitle}>Friend Requests</Text>
          <Text style={styles.listDesc}>
            Accept or decline incoming requests
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceVariant} />
      </Pressable>
      <Pressable
        style={styles.listRow}
        onPress={() => navigation.navigate("Chat", { screen: "AddFriend" })}
      >
        <View style={styles.listIcon}>
          <Ionicons name="search-outline" size={18} color={colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.listTitle}>Add Friend</Text>
          <Text style={styles.listDesc}>Search users to connect with</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceVariant} />
      </Pressable>

      <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
        Appearance
      </Text>
      <View style={[styles.listRow, { justifyContent: "space-between" }]}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <View style={styles.listIcon}>
            <Ionicons
              name="color-palette-outline"
              size={18}
              color={colors.white}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>Theme</Text>
            <Text style={styles.listDesc}>
              Switch between light and dark mode
            </Text>
          </View>
        </View>
        <ThemeToggle size={20} showLabel={false} />
      </View>

      <Pressable
        style={styles.logoutBtn}
        onPress={async () => {
          await clearTokens();
          disconnect();
          navigation.navigate("Auth", { screen: "Login" });
        }}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.error} />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>

      <View style={[styles.headerRow, { marginTop: spacing.xl, marginBottom: spacing.sm }]}>
        <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>My Posts</Text>
        {posts.length > 0 && (
          <Pressable onPress={handleDeleteAllPosts}>
            <Text style={{ ...typography.bodyBold, color: colors.error }}>Delete All</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <FlatList
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + spacing.lg },
        ]}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => {
              if (item.isHidden) {
                Alert.alert("Hidden", "This post is hidden by moderation and cannot be viewed.");
              } else {
                navigation.navigate("PostDetail", { id: item.id });
              }
            }}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={styles.emptyPosts}>You haven't created any posts yet.</Text>
        }
        ListFooterComponent={
          loadingPosts ? (
            <ActivityIndicator style={styles.footerLoading} color={colors.primary} />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
