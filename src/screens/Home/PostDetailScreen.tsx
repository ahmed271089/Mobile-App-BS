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
import { createComment, toggleLikeComment, deleteComment, updateComment, ApiComment } from "../../api/comments";
import { createReport } from "../../api/reports";
import { getMe, ApiUser } from "../../api/users";
import { formatRelativeTime } from "../../utils/formatRelativeTime";
import { UPLOADS_BASE_URL } from "../../api/config";

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
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'POST'|'COMMENT'|'USER', id: string } | null>(null);
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
          borderWidth: StyleSheet.hairlineWidth,
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
          marginBottom: spacing.lg,
          paddingHorizontal: spacing.md,
        },
        solutionRow: {
          backgroundColor: colors.successContainer,
          borderColor: colors.success,
          borderWidth: 1,
          borderRadius: radius.md,
          paddingVertical: spacing.md,
          marginHorizontal: spacing.xs,
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
          borderWidth: StyleSheet.hairlineWidth,
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

  const loadData = () => {
    if (!id) return;
    Promise.all([
      getPost(id).then(setPost),
      getMe().then(setCurrentUser).catch(() => null),
    ])
      .catch((err) => console.warn("Failed to load post data", err))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim() || !id) return;
    setSubmitting(true);
    try {
      await createComment(id, commentText.trim());
      setCommentText("");
      loadData();
    } catch (err: any) {
      let msg = "Could not post comment.";
      try { msg = JSON.parse(err.message).message || msg; } catch {}
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
      // The modal handles its own success state now.
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

  const handleToggleCommentLike = async (commentId: string) => {
    setPost((prev: any) => {
      if (!prev) return prev;
      const updatedComments = prev.comments.map((c: any) => {
        if (c.id === commentId) {
          const wasLiked = !!c.isLiked;
          return {
            ...c,
            isLiked: !wasLiked,
            likesCount: wasLiked ? Math.max(0, c.likesCount - 1) : c.likesCount + 1,
          };
        }
        return c;
      });
      return { ...prev, comments: updatedComments };
    });

    try {
      const res = await toggleLikeComment(id, commentId);
      setPost((prev: any) => {
        if (!prev) return prev;
        const updatedComments = prev.comments.map((c: any) => {
          if (c.id === commentId) {
            return { ...c, isLiked: res.data.liked };
          }
          return c;
        });
        return { ...prev, comments: updatedComments };
      });
    } catch {
      Alert.alert("Error", "Could not update like.");
      setPost((prev: any) => {
        if (!prev) return prev;
        const updatedComments = prev.comments.map((c: any) => {
          if (c.id === commentId) {
            const wasLiked = !!c.isLiked;
            return {
              ...c,
              isLiked: !wasLiked,
              likesCount: wasLiked ? Math.max(0, c.likesCount - 1) : c.likesCount + 1,
            };
          }
          return c;
        });
        return { ...prev, comments: updatedComments };
      });
    }
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert("Delete Comment", "Are you sure you want to delete this comment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
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
            try { msg = JSON.parse(err.message).message || msg; } catch {}
            Alert.alert("Error", msg);
          } finally {
            setDeletingCommentId(null);
          }
        },
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
      try { msg = JSON.parse(err.message).message || msg; } catch {}
      Alert.alert("Error", msg);
    } finally {
      setSavingCommentId(null);
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
          {currentUser?.id === post.author.id && (
            <Pressable style={styles.backBtn} onPress={handleDeletePost}>
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </Pressable>
          )}
          <Pressable style={styles.backBtn} onPress={() => handleReport('POST', id)}>
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
          ) : post.type === "PROBLEM" ? (
            <Badge label="Unsolved" variant="warning" icon="?" />
          ) : (
            <Badge label="Open" variant="warning" />
          )}
        </View>

        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm }}>
            <Text style={{ ...typography.bodyBold, color: colors.primary }}>
              {post.author?.name?.slice(0, 2).toUpperCase() || '??'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <Text style={{ ...typography.bodyBold, color: colors.onSurface }}>{post.author?.name || 'Unknown'}</Text>
              {post.author?.reputationLevel && (
                <Badge label={post.author.reputationLevel} variant="warning" icon="⭐" />
              )}
              {currentUser?.id !== post.author?.id && (
                <Pressable onPress={() => handleReport('USER', post.author?.id)} style={{ marginLeft: 'auto' }}>
                  <Ionicons name="flag-outline" size={16} color={colors.error} />
                </Pressable>
              )}
            </View>
            {post.author?.reputationPoints !== undefined && (
              <Text style={{ ...typography.caption, color: colors.primary, marginTop: 2 }}>
                🏆 {post.author.reputationPoints.toLocaleString()} points
              </Text>
            )}
          </View>
        </View>

        {post.attachments?.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }}>
            {post.attachments.map((media: any) => (
              <Image
                key={media.id}
                source={{ uri: media.url.replace(/http:\/\/localhost:\d+/, UPLOADS_BASE_URL) }}
                style={{ width: 250, height: 250, borderRadius: radius.md, marginRight: spacing.md, backgroundColor: colors.surfaceContainer }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {post.aiAnalysis && (
          <View style={styles.aiBox}>
            <Badge label="AI Diagnosis" variant="info" icon="✨" />
            <Text style={styles.aiText}>{post.aiAnalysis.diagnosis}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          Comments ({post.comments?.length ?? 0})
        </Text>
        {[...(post.comments ?? [])].sort((a, b) => {
          if (a.id === post.solvedCommentId) return -1;
          if (b.id === post.solvedCommentId) return 1;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }).map((c: ApiComment) => (
          <View key={c.id} style={[styles.commentRow, post.solvedCommentId === c.id && styles.solutionRow]}>
            <View style={styles.commentAvatar}>
              <Text style={styles.commentAvatarText}>
                {c.author.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.commentMeta}>
                <Text style={styles.commentAuthor}>{c.author.name}</Text>
                {c.author.reputationLevel && (
                  <Badge label={c.author.reputationLevel} variant="warning" />
                )}
                {c.author.reputationPoints !== undefined && (
                  <Text style={{ ...typography.caption, color: colors.primary, marginLeft: 2 }}>
                    ({c.author.reputationPoints.toLocaleString()})
                  </Text>
                )}
                {c.isAIComment && <Badge label="AI" variant="info" />}
                {post.solvedCommentId === c.id && (
                  <Badge label="Solution" variant="success" icon="✓" />
                )}
                <Text style={styles.commentTime}>
                  {formatRelativeTime(c.createdAt)}
                </Text>
                {currentUser?.id !== c.author.id && (
                  <View style={{ flexDirection: 'row', marginLeft: 'auto', gap: spacing.sm, alignItems: 'center' }}>
                    <Pressable onPress={() => handleToggleCommentLike(c.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginRight: spacing.sm }}>
                      <Ionicons name={c.isLiked ? "heart" : "heart-outline"} size={16} color={c.isLiked ? colors.error : colors.onSurfaceVariant} />
                      <Text style={{ ...typography.caption, color: colors.onSurfaceVariant }}>{c.likesCount}</Text>
                    </Pressable>
                    <Pressable onPress={() => handleReport('USER', c.author.id)}>
                      <Ionicons name="person-remove-outline" size={14} color={colors.error} />
                    </Pressable>
                    <Pressable onPress={() => handleReport('COMMENT', c.id)}>
                      <Ionicons name="flag-outline" size={14} color={colors.onSurfaceVariant} />
                    </Pressable>
                  </View>
                )}
                {currentUser?.id === c.author.id && (
                  <View style={{ flexDirection: 'row', marginLeft: 'auto', gap: spacing.sm, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginRight: spacing.sm }}>
                      <Ionicons name="heart" size={16} color={colors.error} />
                      <Text style={{ ...typography.caption, color: colors.onSurfaceVariant }}>{c.likesCount}</Text>
                    </View>
                    <Pressable onPress={() => {
                      setEditingCommentId(c.id);
                      setEditCommentText(c.content);
                    }}>
                      <Ionicons name="pencil-outline" size={14} color={colors.onSurfaceVariant} />
                    </Pressable>
                    <Pressable onPress={() => handleDeleteComment(c.id)} disabled={deletingCommentId === c.id}>
                      {deletingCommentId === c.id ? <ActivityIndicator size={14} color={colors.error} /> : <Ionicons name="trash-outline" size={14} color={colors.error} />}
                    </Pressable>
                  </View>
                )}
              </View>

              {editingCommentId === c.id ? (
                <View style={{ marginTop: spacing.sm }}>
                  <TextInput
                    value={editCommentText}
                    onChangeText={setEditCommentText}
                    style={{ ...typography.body, color: colors.onSurface, padding: spacing.sm, borderRadius: radius.sm, backgroundColor: colors.surfaceContainer, borderWidth: 1, borderColor: colors.primary, minHeight: 60 }}
                    multiline
                    autoFocus
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.xs, gap: spacing.sm }}>
                    <Pressable onPress={() => setEditingCommentId(null)} style={{ paddingVertical: 4, paddingHorizontal: 12, borderRadius: radius.sm, backgroundColor: colors.surfaceContainerHigh }}>
                      <Text style={{ ...typography.caption, color: colors.onSurfaceVariant }}>Cancel</Text>
                    </Pressable>
                    <Pressable onPress={() => handleSaveEditComment(c.id)} disabled={savingCommentId === c.id} style={{ paddingVertical: 4, paddingHorizontal: 12, borderRadius: radius.sm, backgroundColor: colors.primary, minWidth: 50, alignItems: 'center' }}>
                      {savingCommentId === c.id ? <ActivityIndicator size={14} color={colors.onPrimary} /> : <Text style={{ ...typography.caption, color: colors.onPrimary }}>Save</Text>}
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Text style={styles.commentText}>{c.content}</Text>
              )}

              {post.status !== "SOLVED" &&
                post.type === "PROBLEM" &&
                currentUser?.id === post.author.id && (
                  <Pressable
                    onPress={() => handleMarkSolved(c.id)}
                    style={{ marginTop: spacing.sm, alignSelf: "flex-start" }}
                  >
                    <Text style={{ ...typography.caption, color: colors.primary, fontWeight: "600" }}>
                      Mark as Solution
                    </Text>
                  </Pressable>
                )}
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
            {submitting ? <ActivityIndicator size={16} color={colors.onPrimary} /> : <Ionicons name="send" size={16} color={colors.onPrimary} />}
          </Pressable>
        </View>

        {post.status !== "SOLVED" && post.type === "PROBLEM" && currentUser?.id === post.author.id && (
          <Button
            label="Mark as Solved"
            variant="secondary"
            style={{ marginTop: spacing.xl }}
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
  );
}
