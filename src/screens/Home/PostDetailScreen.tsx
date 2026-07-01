import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, radius, spacing, typography } from "../../theme";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import {
  getPost,
  markPostSolved,
  toggleLikePost,
  toggleFavoritePost,
} from "../../api/posts";
import { createComment, ApiComment } from "../../api/comments";
import { createReport } from "../../api/reports";
import { formatRelativeTime } from "../../utils/formatRelativeTime";

export default function PostDetailScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { id } = route.params ?? {};
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        center: { flex: 1, alignItems: "center", justifyContent: "center" },
        empty: { ...typography.body, color: colors.onSurfaceVariant },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.lg,
        },
        headerActions: { flexDirection: "row", gap: spacing.sm },
        backBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        content: { paddingHorizontal: spacing.lg },
        badgeRow: {
          flexDirection: "row",
          gap: spacing.xs,
          marginBottom: spacing.md,
        },
        title: {
          ...typography.h1,
          color: colors.onSurface,
          marginBottom: spacing.sm,
        },
        description: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          lineHeight: 20,
          marginBottom: spacing.lg,
        },
        aiBox: {
          backgroundColor: colors.primaryContainer + "80",
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.primaryContainer,
          padding: spacing.lg,
          marginBottom: spacing.xl,
          gap: spacing.sm,
        },
        aiText: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          lineHeight: 17,
        },
        sectionTitle: {
          ...typography.h3,
          color: colors.onSurface,
          marginBottom: spacing.md,
        },
        commentRow: {
          flexDirection: "row",
          gap: spacing.sm,
          marginBottom: spacing.md,
        },
        commentAvatar: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        commentAvatarText: {
          ...typography.caption,
          color: colors.primary,
          fontWeight: "700",
        },
        commentMeta: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs,
          flexWrap: "wrap",
        },
        commentAuthor: { ...typography.bodyBold, color: colors.onSurface },
        commentTime: { ...typography.caption, color: colors.onSurfaceVariant },
        commentText: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          marginTop: 2,
        },
        commentInputRow: {
          flexDirection: "row",
          alignItems: "flex-end",
          gap: spacing.sm,
          marginTop: spacing.md,
        },
        commentInput: {
          flex: 1,
          backgroundColor: colors.surfaceContainer,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          borderRadius: radius.lg,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          color: colors.onSurface,
          maxHeight: 80,
        },
        sendCommentBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        },
      }),
    [colors],
  );

  const loadPost = () => {
    if (!id) return;
    getPost(id)
      .then(setPost)
      .catch((err) => console.warn("Failed to load post", err))
      .finally(() => setLoading(false));
  };

  useEffect(loadPost, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim() || !id) return;
    setSubmitting(true);
    try {
      await createComment(id, commentText.trim());
      setCommentText("");
      loadPost();
    } catch (err) {
      Alert.alert("Error", "Could not post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkSolved = async () => {
    const humanComments = (post?.comments ?? []).filter(
      (c: ApiComment) => !c.isAIComment,
    );
    if (humanComments.length === 0) {
      Alert.alert(
        "No comments",
        "Wait for a community reply before marking as solved.",
      );
      return;
    }
    const best = humanComments[humanComments.length - 1];
    try {
      await markPostSolved(id, best.id);
      loadPost();
      Alert.alert("Solved!", "This problem has been marked as solved.");
    } catch {
      Alert.alert("Error", "Could not mark as solved.");
    }
  };

  const handleReport = () => {
    const submitReport = async (reason: string) => {
      if (!reason.trim()) return;
      try {
        await createReport("POST", id, reason.trim());
        Alert.alert("Reported", "Thank you. Our team will review it.");
      } catch {
        Alert.alert("Error", "Could not submit report.");
      }
    };

    const reasons = [
      "Spam or misleading",
      "Harassment or hate",
      "Inappropriate content",
      "Other",
    ];
    Alert.alert("Report post", "Why are you reporting this?", [
      ...reasons.map((reason) => ({
        text: reason,
        onPress: () => submitReport(reason),
      })),
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleToggleLike = async () => {
    try {
      const result = await toggleLikePost(id);
      setLiked(result.liked);
      setPost((prev: any) =>
        prev
          ? { ...prev, likesCount: prev.likesCount + (result.liked ? 1 : -1) }
          : prev,
      );
    } catch {
      Alert.alert("Error", "Could not update like.");
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const result = await toggleFavoritePost(id);
      setFavorited(result.favorited);
    } catch {
      Alert.alert("Error", "Could not update favorite.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.empty}>Post not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface }}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable style={styles.backBtn} onPress={handleToggleLike}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={18}
              color={liked ? colors.error : colors.onSurfaceVariant}
            />
          </Pressable>
          <Pressable style={styles.backBtn} onPress={handleToggleFavorite}>
            <Ionicons
              name={favorited ? "bookmark" : "bookmark-outline"}
              size={18}
              color={favorited ? colors.primary : colors.onSurfaceVariant}
            />
          </Pressable>
          <Pressable style={styles.backBtn} onPress={handleReport}>
            <Ionicons
              name="flag-outline"
              size={18}
              color={colors.onSurfaceVariant}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <Badge label={post.category.name} variant="info" />
          {post.status === "SOLVED" ? (
            <Badge label="Solved" variant="success" icon="✓" />
          ) : (
            <Badge label="Open" variant="warning" />
          )}
        </View>

        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>

        {post.aiAnalysis && (
          <View style={styles.aiBox}>
            <Badge label="AI Diagnosis" variant="info" icon="✨" />
            <Text style={styles.aiText}>{post.aiAnalysis.diagnosis}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          Comments ({post.comments?.length ?? 0})
        </Text>
        {(post.comments ?? []).map((c: ApiComment) => (
          <View key={c.id} style={styles.commentRow}>
            <View style={styles.commentAvatar}>
              <Text style={styles.commentAvatarText}>
                {c.author.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.commentMeta}>
                <Text style={styles.commentAuthor}>{c.author.name}</Text>
                {c.isAIComment && <Badge label="AI" variant="info" />}
                <Text style={styles.commentTime}>
                  {formatRelativeTime(c.createdAt)}
                </Text>
              </View>
              <Text style={styles.commentText}>{c.content}</Text>
            </View>
          </View>
        ))}

        <View style={styles.commentInputRow}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment…"
            placeholderTextColor={colors.onSurfaceVariant}
            style={styles.commentInput}
            multiline
          />
          <Pressable
            onPress={handleAddComment}
            style={styles.sendCommentBtn}
            disabled={submitting}
          >
            <Ionicons name="send" size={16} color={colors.white} />
          </Pressable>
        </View>

        {post.status !== "SOLVED" && post.type === "PROBLEM" && (
          <Button
            label="Mark as Solved"
            variant="secondary"
            style={{ marginTop: spacing.xl }}
            onPress={handleMarkSolved}
          />
        )}
      </View>
    </ScrollView>
  );
}
