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
  Platform,
  Image,
  KeyboardAvoidingView,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, radius, spacing, typography } from "../../theme";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { ReportModal } from "../../components/ReportModal";
import {
  getPost,
  markPostSolved,
  toggleLikePost,
  toggleFavoritePost,
  deletePost,
} from "../../api/posts";
import { createComment, voteComment, deleteComment, updateComment, ApiComment } from "../../api/comments";
import { createReport } from "../../api/reports";
import { getMe, ApiUser } from "../../api/users";
import { formatRelativeTime } from "../../utils/formatRelativeTime";
import { UPLOADS_BASE_URL } from "../../api/config";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function PostDetailScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { id } = route.params ?? {};
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'POST' | 'COMMENT' | 'USER', id: string } | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [savingCommentId, setSavingCommentId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        center: { flex: 1, alignItems: "center", justifyContent: "center" },
        empty: { ...typography.body, color: colors.onSurfaceVariant },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.sm,
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

        /* ── Author Card ── */
        authorCard: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: spacing.sm,
          marginBottom: spacing.md,
        },
        authorAvatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.sm,
        },
        authorAvatarText: {
          ...typography.bodyBold,
          color: colors.onPrimary,
          fontSize: 14,
        },
        authorName: {
          ...typography.bodyBold,
          color: colors.onSurface,
        },
        authorMeta: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
        },

        /* ── Post Content ── */
        badgeRow: {
          flexDirection: "row",
          gap: spacing.xs,
          flexWrap: "wrap",
          marginBottom: spacing.sm,
        },
        title: {
          ...typography.h2,
          color: colors.onSurface,
          marginBottom: spacing.xs,
        },
        description: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          lineHeight: 22,
          marginBottom: spacing.sm,
        },

        /* ── Action Bar ── */
        actionBar: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingVertical: spacing.sm,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
          marginBottom: spacing.md,
          marginTop: spacing.sm,
        },
        actionBtn: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
        },
        actionBtnText: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          fontWeight: "600",
        },
        actionSeparator: {
          width: 1,
          height: 20,
          backgroundColor: colors.outlineVariant,
          marginHorizontal: spacing.xs,
        },

        /* ── AI Box (kept for future use) ── */
        aiBox: {
          backgroundColor: colors.primaryContainer + "80",
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.primaryContainer,
          padding: spacing.lg,
          marginBottom: spacing.md,
          gap: spacing.sm,
        },
        aiText: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          lineHeight: 17,
        },

        /* ── Comments ── */
        sectionTitle: {
          ...typography.h3,
          color: colors.onSurface,
          marginBottom: spacing.sm,
        },
        commentCard: {
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: radius.lg,
          padding: spacing.sm,
          marginBottom: spacing.sm,
        },
        commentCardSolution: {
          backgroundColor: colors.successMuted,
          borderWidth: 1.5,
          borderColor: colors.success,
        },
        commentHeader: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: spacing.xs,
        },
        commentAvatar: {
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.xs,
        },
        commentAvatarText: {
          fontSize: 10,
          color: colors.onPrimary,
          fontWeight: "700",
        },
        commentAuthor: {
          ...typography.caption,
          fontWeight: "700",
          color: colors.onSurface,
        },
        commentDot: {
          width: 3,
          height: 3,
          borderRadius: 1.5,
          backgroundColor: colors.onSurfaceVariant,
          marginHorizontal: 6,
          opacity: 0.5,
        },
        commentTime: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          fontSize: 11,
        },
        commentText: {
          ...typography.body,
          color: colors.onSurface,
          lineHeight: 21,
          fontSize: 14,
        },
        commentActions: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: spacing.xs,
          gap: spacing.md,
        },
        commentActionBtn: {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingVertical: 4,
        },
        commentActionText: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          fontSize: 11,
        },
        markSolutionBtn: {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingVertical: 4,
          paddingHorizontal: 10,
          borderRadius: radius.md,
          backgroundColor: colors.primaryContainer,
          marginTop: spacing.xs,
          alignSelf: "flex-start",
        },
        markSolutionText: {
          ...typography.caption,
          color: colors.card,
          fontWeight: "700",
        },
        emptyComments: {
          alignItems: "center",
          paddingVertical: spacing.xl,
          gap: spacing.sm,
        },

        /* ── Bottom Bar ── */
        bottomBar: {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.outlineVariant,
          backgroundColor: colors.surfaceContainerLowest,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          flexDirection: "row",
          alignItems: "flex-end",
          gap: spacing.sm,
        },
        commentInput: {
          flex: 1,
          backgroundColor: colors.surfaceContainer,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
          borderRadius: 22,
          paddingHorizontal: 16,
          paddingVertical: Platform.OS === "ios" ? 10 : 8,
          color: colors.onSurface,
          maxHeight: 100,
          fontSize: 14,
        },
        sendCommentBtn: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 2,
        },
      }),
    [colors],
  );

  const loadData = () => {
    if (!id) return Promise.resolve();
    return Promise.all([
      getPost(id).then(data => {
        setPost(data);
        setFavorited(!!data?.isSaved);
      }),
      getMe().then(setCurrentUser).catch(() => null),
    ])
      .catch((err) => console.warn("Failed to load post data", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !id) return;
    setSubmitting(true);
    try {
      await createComment(id, commentText.trim());
      setCommentText("");
      loadData();
    } catch (err: any) {
      let msg = "Could not post comment.";
      try { msg = JSON.parse(err.message).message || msg; } catch { }
      Alert.alert("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkSolved = async (commentId?: string) => {
    const comments = post?.comments ?? [];
    const targetCommentId = (typeof commentId === "string" && commentId)
      ? commentId
      : comments[comments.length - 1]?.id;

    if (!targetCommentId) {
      Alert.alert(
        "No comments",
        "Wait for a reply before marking as solved.",
      );
      return;
    }

    try {
      await markPostSolved(id, targetCommentId);
      loadData();
      Alert.alert("Solved!", "This problem has been marked as solved.");
    } catch (err: any) {
      let msg = "Could not mark as solved.";
      try {
        const body = JSON.parse(err.message);
        msg = body.message || msg;
      } catch {
        msg = err.message || msg;
      }
      Alert.alert("Error", msg);
    }
  };

  const handleReport = (type: 'POST' | 'COMMENT' | 'USER', targetId: string) => {
    setReportTarget({ type, id: targetId });
    setReportModalVisible(true);
  };

  const submitReport = async (reason: string, details: string) => {
    if (!reportTarget) return;
    try {
      await createReport(reportTarget.type, reportTarget.id, reason, details);
    } catch {
      Alert.alert("Error", "Could not submit report.");
      throw new Error("Failed");
    }
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

  const handleDeletePost = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to delete this post?")) {
        deletePost(id)
          .then(() => navigation.goBack())
          .catch(() => Alert.alert("Error", "Could not delete post."));
      }
      return;
    }

    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(id);
            navigation.goBack();
          } catch {
            Alert.alert("Error", "Could not delete post.");
          }
        },
      },
    ]);
  };

  const handleVoteComment = async (commentId: string, value: number) => {
    setPost((prev: any) => {
      if (!prev) return prev;
      const updatedComments = prev.comments.map((c: any) => {
        if (c.id === commentId) {
          const currentVote = c.userVote || 0;
          let newVote = currentVote === value ? 0 : value;
          let voteDiff = newVote - currentVote;
          return {
            ...c,
            userVote: newVote,
            likesCount: c.likesCount + voteDiff,
          };
        }
        return c;
      });
      return { ...prev, comments: updatedComments };
    });

    try {
      const res = await voteComment(id, commentId, value);
      setPost((prev: any) => {
        if (!prev) return prev;
        const updatedComments = prev.comments.map((c: any) => {
          if (c.id === commentId) {
            return { ...c, userVote: res.userVote };
          }
          return c;
        });
        return { ...prev, comments: updatedComments };
      });
    } catch {
      Alert.alert("Error", "Could not update vote.");
      // Rollback logic could be improved here, but for now we reload data on severe failure
      loadData();
    }
  };

  const handleDeleteComment = (commentId: string) => {
    const doDelete = async () => {
      setDeletingCommentId(commentId);
      try {
        await deleteComment(id, commentId);
        setPost((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: prev.comments.filter((c: any) => c.id !== commentId),
            commentsCount: Math.max(0, prev.commentsCount - 1),
          };
        });
        loadData();
      } catch (err: any) {
        let msg = "Could not delete comment.";
        try { msg = JSON.parse(err.message).message || msg; } catch { }
        Alert.alert("Error", msg);
      } finally {
        setDeletingCommentId(null);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to delete this comment?")) {
        doDelete();
      }
      return;
    }

    Alert.alert("Delete Comment", "Are you sure you want to delete this comment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: doDelete,
      },
    ]);
  };

  const handleSaveEditComment = async (commentId: string) => {
    if (!editCommentText.trim()) return;
    setSavingCommentId(commentId);
    try {
      await updateComment(id, commentId, editCommentText.trim());
      setPost((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.map((c: any) =>
            c.id === commentId ? { ...c, content: editCommentText.trim() } : c
          ),
        };
      });
      setEditingCommentId(null);
      setEditCommentText("");
      loadData();
    } catch (err: any) {
      let msg = "Could not update comment.";
      try { msg = JSON.parse(err.message).message || msg; } catch { }
      Alert.alert("Error", msg);
    } finally {
      setSavingCommentId(null);
    }
  };

  /* ── Render helpers ── */

  const renderComment = (c: ApiComment) => {
    const isSolution = post.solvedCommentId === c.id;
    const isOwn = currentUser?.id === c.author.id;

    return (
      <View
        key={c.id}
        style={[styles.commentCard, isSolution && styles.commentCardSolution]}
      >
        <View style={{ flexDirection: "row" }}>
          {/* Avatar column */}
          <View style={styles.commentAvatar}>
            <Text style={styles.commentAvatarText}>
              {c.author.name.slice(0, 2).toUpperCase()}
            </Text>
          </View>

          {/* Content column */}
          <View style={{ flex: 1 }}>
            {/* Header meta: name · time · badges */}
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>{c.author.name}</Text>
              <View style={styles.commentDot} />
              <Text style={styles.commentTime}>{formatRelativeTime(c.createdAt)}</Text>

              {c.author.reputationLevel && (
                <>
                  <View style={styles.commentDot} />
                  <Badge label={c.author.reputationLevel} variant="warning" />
                </>
              )}
              {c.isAIComment && (
                <>
                  <View style={styles.commentDot} />
                  <Badge label="AI" variant="info" />
                </>
              )}
              {isSolution && (
                <>
                  <View style={styles.commentDot} />
                  <Badge label="Solution" variant="success" icon="✓" />
                </>
              )}
            </View>

            {/* Comment body */}
            {editingCommentId === c.id ? (
              <View style={{ marginTop: spacing.xs }}>
                <TextInput
                  value={editCommentText}
                  onChangeText={setEditCommentText}
                  style={{
                    ...typography.body,
                    fontSize: 14,
                    color: colors.onSurface,
                    padding: spacing.sm,
                    borderRadius: radius.md,
                    backgroundColor: colors.surfaceContainer,
                    borderWidth: 1,
                    borderColor: colors.primary,
                    minHeight: 60,
                  }}
                  multiline
                  autoFocus
                />
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: spacing.xs, gap: spacing.sm }}>
                  <Pressable
                    onPress={() => setEditingCommentId(null)}
                    style={{ paddingVertical: 6, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.surfaceContainerHigh }}
                  >
                    <Text style={{ ...typography.caption, color: colors.onSurfaceVariant }}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleSaveEditComment(c.id)}
                    disabled={savingCommentId === c.id}
                    style={{ paddingVertical: 6, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.primary, minWidth: 50, alignItems: "center" }}
                  >
                    {savingCommentId === c.id
                      ? <ActivityIndicator size={14} color={colors.onPrimary} />
                      : <Text style={{ ...typography.caption, color: colors.onPrimary, fontWeight: "600" }}>Save</Text>}
                  </Pressable>
                </View>
              </View>
            ) : (
              <Text style={styles.commentText}>{c.content}</Text>
            )}

            {/* Action row */}
            <View style={styles.commentActions}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Pressable onPress={() => !isOwn && handleVoteComment(c.id, 1)} hitSlop={8}>
                  <Ionicons name={c.userVote === 1 ? "caret-up" : "caret-up-outline"} size={20} color={c.userVote === 1 ? colors.primary : colors.onSurfaceVariant} />
                </Pressable>
                <Text style={[styles.commentActionText, { fontSize: 13, minWidth: 16, textAlign: 'center' }]}>{c.likesCount}</Text>
                <Pressable onPress={() => !isOwn && handleVoteComment(c.id, -1)} hitSlop={8}>
                  <Ionicons name={c.userVote === -1 ? "caret-down" : "caret-down-outline"} size={20} color={c.userVote === -1 ? colors.primary : colors.onSurfaceVariant} />
                </Pressable>
              </View>

              {isOwn && (
                <>
                  <Pressable
                    onPress={() => { setEditingCommentId(c.id); setEditCommentText(c.content); }}
                    style={styles.commentActionBtn}
                  >
                    <Ionicons name="pencil-outline" size={14} color={colors.onSurfaceVariant} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDeleteComment(c.id)}
                    disabled={deletingCommentId === c.id}
                    style={styles.commentActionBtn}
                  >
                    {deletingCommentId === c.id
                      ? <ActivityIndicator size={14} color={colors.error} />
                      : <Ionicons name="trash-outline" size={14} color={colors.error} />}
                  </Pressable>
                </>
              )}

              {!isOwn && !c.isAIComment && (
                <Pressable onPress={() => handleReport('COMMENT', c.id)} style={styles.commentActionBtn}>
                  <Ionicons name="flag-outline" size={13} color={colors.onSurfaceVariant} />
                </Pressable>
              )}
            </View>

            {/* Mark as Solution button */}
            {post.status !== "SOLVED" &&
              post.type === "PROBLEM" &&
              currentUser?.id === post.author.id && (
                <Pressable onPress={() => handleMarkSolved(c.id)} style={styles.markSolutionBtn}>
                  <Ionicons name="checkmark-circle-outline" size={14} color={colors.card} />
                  <Text style={styles.markSolutionText}>Mark as Solution</Text>
                </Pressable>
              )}
          </View>
        </View>
      </View>
    );
  };

  /* ── Screen states ── */

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

  const sortedComments = [...(post.comments ?? [])].sort((a, b) => {
    if (a.id === post.solvedCommentId) return -1;
    if (b.id === post.solvedCommentId) return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surface }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
          </Pressable>
          <View style={styles.headerActions}>
            {currentUser?.id === post.author.id && (
              <Pressable style={styles.backBtn} onPress={handleDeletePost}>
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </Pressable>
            )}
            {currentUser?.id !== post.author?.id && post.author?.name !== 'AI Agent' && (
              <Pressable style={styles.backBtn} onPress={() => handleReport('POST', id)}>
                <Ionicons name="ellipsis-horizontal" size={18} color={colors.onSurfaceVariant} />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {/* ── Author ── */}
          <View style={styles.authorCard}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorAvatarText}>
                {post.author?.name?.slice(0, 2).toUpperCase() || "??"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                <Text style={styles.authorName}>{post.author?.name || "Unknown"}</Text>
                {post.author?.reputationLevel && (
                  <Badge label={post.author.reputationLevel} variant="warning" icon="⭐" />
                )}
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
                {post.author?.reputationPoints !== undefined && (
                  <Text style={styles.authorMeta}>
                    🏆 {post.author.reputationPoints.toLocaleString()} pts
                  </Text>
                )}
                <Text style={styles.authorMeta}>
                  · {formatRelativeTime(post.createdAt)}
                </Text>
              </View>
            </View>
            {currentUser?.id !== post.author?.id && post.author?.name !== 'AI Agent' && (
              <Pressable onPress={() => handleReport('USER', post.author?.id)} hitSlop={8}>
                <Ionicons name="flag-outline" size={16} color={colors.onSurfaceVariant} />
              </Pressable>
            )}
          </View>

          {/* ── Badges ── */}
          <View style={styles.badgeRow}>
            <Badge label={post.category.name} variant="info" />
            {post.status === "SOLVED" ? (
              <Badge label="Solved" variant="success" icon="✓" />
            ) : post.type === "PROBLEM" ? (
              <Badge label="Unsolved" variant="neutral" />
            ) : (
              <Badge label="Open" variant="neutral" />
            )}
          </View>

          {/* ── Title + Description ── */}
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.description}>{post.description}</Text>

          {/* ── Attachments ── */}
          {post.attachments && post.attachments.length > 0 && (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: spacing.xs, marginBottom: spacing.xs, marginHorizontal: -spacing.lg }}
              contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
            >
              {post.attachments.map((attachment: any) => (
                <View key={attachment.id} style={{ position: "relative" }}>
                  <Image
                    source={{ uri: attachment.url.replace(/http:\/\/localhost:\d+/, UPLOADS_BASE_URL) }}
                    style={{
                      width: SCREEN_WIDTH - spacing.lg * 2,
                      height: SCREEN_WIDTH - spacing.lg * 2,
                      borderRadius: radius.lg,
                      backgroundColor: colors.surfaceContainer,
                    }}
                    resizeMode="cover"
                  />
                  {attachment.type === "VIDEO" && (
                    <View style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.3)",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: radius.lg,
                    }}>
                      <Ionicons name="play-circle" size={48} color={colors.white} />
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          {/* ── Action Bar ── */}
          <View style={styles.actionBar}>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.sm }}>
              <Pressable onPress={handleToggleLike} hitSlop={8}>
                <Ionicons
                  name={liked ? "caret-up" : "caret-up-outline"}
                  size={24}
                  color={liked ? colors.primary : colors.onSurfaceVariant}
                />
              </Pressable>
              <Text style={[styles.actionBtnText, liked && { color: colors.primary }, { fontSize: 16 }]}>
                {post.likesCount || 0}
              </Text>
              <Pressable onPress={() => Alert.alert("Coming soon", "Downvoting is not supported yet.")} hitSlop={8}>
                <Ionicons
                  name="caret-down-outline"
                  size={24}
                  color={colors.onSurfaceVariant}
                />
              </Pressable>
            </View> */}

            {/* <View style={styles.actionSeparator} /> */}

            <Pressable style={styles.actionBtn} onPress={handleToggleFavorite}>
              <Ionicons
                name={favorited ? "bookmark" : "bookmark-outline"}
                size={20}
                color={favorited ? colors.primary : colors.onSurfaceVariant}
              />
              <Text style={[styles.actionBtnText, favorited && { color: colors.primary }]}>
                {favorited ? "Saved" : "Save"}
              </Text>
            </Pressable>

            <View style={styles.actionSeparator} />

            <View style={styles.actionBtn}>
              <Ionicons name="chatbubble-outline" size={18} color={colors.onSurfaceVariant} />
              <Text style={styles.actionBtnText}>{post.comments?.length ?? 0}</Text>
            </View>
          </View>

          {/* ── Comments ── */}
          <Text style={styles.sectionTitle}>
            Comments ({post.comments?.length ?? 0})
          </Text>

          {sortedComments.length === 0 ? (
            <View style={styles.emptyComments}>
              <Ionicons name="chatbubbles-outline" size={40} color={colors.outlineVariant} />
              <Text style={{ ...typography.body, color: colors.onSurfaceVariant, textAlign: "center" }}>
                No comments yet.{"\n"}Be the first to share your thoughts!
              </Text>
            </View>
          ) : (
            sortedComments.map(renderComment)
          )}

          {/* ── Global "Mark as Solved" ── */}
          {post.status !== "SOLVED" && post.type === "PROBLEM" && currentUser?.id === post.author.id && (
            <Button
              label="Mark as Solved"
              variant="secondary"
              style={{ marginTop: spacing.md }}
              onPress={() => handleMarkSolved()}
            />
          )}
        </View>

        <ReportModal
          visible={reportModalVisible}
          targetType={reportTarget?.type}
          onClose={() => setReportModalVisible(false)}
          onSubmit={submitReport}
        />
      </ScrollView>

      {/* ── Bottom Comment Input ── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
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
          style={[styles.sendCommentBtn, { opacity: commentText.trim() ? 1 : 0.5 }]}
          disabled={submitting || !commentText.trim()}
        >
          {submitting
            ? <ActivityIndicator size={16} color={colors.onPrimary} />
            : <Ionicons name="send" size={16} color={colors.onPrimary} />}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
