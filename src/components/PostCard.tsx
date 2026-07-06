import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, TextInput, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors, radius, spacing, typography } from "../theme";
import { Badge } from "./Badge";
import { MockPost } from "../data/mockData";
import { createComment } from "../api/comments";

export function PostCard({
  post,
  onPress,
}: {
  post: MockPost;
  onPress?: () => void;
}) {
  const colors = useColors();
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localCommentsCount, setLocalCommentsCount] = useState(post.commentsCount);

  const [localLastComment, setLocalLastComment] = useState(post.lastComment);

  useEffect(() => {
    setLocalCommentsCount(post.commentsCount);
    setLocalLastComment(post.lastComment);
  }, [post.commentsCount, post.lastComment]);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await createComment(post.id, commentText.trim());
      setLocalLastComment({ authorName: "You", content: commentText.trim() });
      setCommentText("");
      setLocalCommentsCount((prev) => prev + 1);
    } catch (err) {
      Alert.alert("Error", "Could not post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.surfaceContainer,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          padding: spacing.md,
          marginBottom: spacing.lg,
        },
        thumbnail: {
          height: 140,
          borderRadius: radius.md,
          marginBottom: spacing.md,
        },
        topRow: {
          flexDirection: "row",
          gap: spacing.xs,
          marginBottom: spacing.sm,
          flexWrap: "wrap",
        },
        title: {
          ...typography.h3,
          color: colors.onSurface,
          marginBottom: 4,
        },
        description: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          marginBottom: spacing.md,
        },
        footer: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing.sm,
        },
        authorRow: {
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        },
        avatar: {
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.xs,
        },
        avatarText: {
          fontSize: 10,
          fontWeight: "700",
          color: colors.primary,
        },
        authorName: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
        },
        dot: {
          color: colors.onSurfaceVariant,
          marginHorizontal: 4,
        },
        time: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
        },
        statsRow: {
          flexDirection: "row",
          gap: spacing.md,
        },
        statItem: {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        },
        statText: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
        },
        lastCommentRow: {
          marginTop: spacing.sm,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
        },
        lastCommentAuthor: {
          ...typography.caption,
          fontWeight: "bold",
          color: colors.onSurface,
        },
        lastCommentText: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
        },
        commentInputRow: {
          flexDirection: "row",
          alignItems: "center",
          marginTop: spacing.xs,
          borderTopWidth: 1,
          borderTopColor: colors.outlineVariant,
          paddingTop: spacing.sm,
        },
        commentInput: {
          flex: 1,
          height: 36,
          backgroundColor: colors.surface,
          borderRadius: 18,
          paddingHorizontal: spacing.md,
          ...typography.body,
          color: colors.onSurface,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
        },
        sendBtn: {
          marginLeft: spacing.sm,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        },
        sendBtnDisabled: {
          backgroundColor: colors.outlineVariant,
        },
      }),
    [colors],
  );

  const Thumbnail = ({ seed }: { seed: string }) => {
    if (seed.startsWith("http")) {
      return <Image source={{ uri: seed }} style={styles.thumbnail} />;
    }
    const hue = (seed.length * 37) % 360;
    return (
      <View
        style={[
          styles.thumbnail,
          {
            backgroundColor: `hsl(${hue}, 30%, 18%)`,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Ionicons name="image-outline" size={32} color={`hsl(${hue}, 40%, 45%)`} />
      </View>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
      ]}
    >
      <Thumbnail seed={post.thumbnail} />

      <View style={styles.topRow}>
        <Badge label={post.category.name} variant="info" />
        {post.status === "SOLVED" ? (
          <Badge label="Solved" variant="success" icon="✓" />
        ) : null}
        {post.isTrending ? (
          <Badge label="Trending" variant="warning" icon="🔥" />
        ) : null}
        {post.author.verified ? (
          <Badge label="Verified" variant="success" icon="✓" />
        ) : null}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {post.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{post.author.avatar}</Text>
          </View>
          <Text style={styles.authorName}>{post.author.name}</Text>
          {post.author.reputationLevel && (
            <Text style={{ ...typography.caption, color: colors.primary, fontWeight: 'bold', marginLeft: 4 }}>
              · {post.author.reputationLevel}
            </Text>
          )}
          {post.author.reputationPoints !== undefined ? (
            <Text style={{ ...typography.caption, color: colors.primary, marginLeft: 4 }}>
              ({post.author.reputationPoints.toLocaleString()})
            </Text>
          ) : null}
          <Text style={styles.dot}>·</Text>
          <Text style={styles.time}>{post.createdAt}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons
              name="chatbubble-outline"
              size={14}
              color={colors.onSurfaceVariant}
            />
            <Text style={styles.statText}>{localCommentsCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="heart-outline"
              size={14}
              color={colors.onSurfaceVariant}
            />
            <Text style={styles.statText}>{post.likesCount}</Text>
          </View>
        </View>
      </View>

      {localLastComment ? (
        <View style={styles.lastCommentRow}>
          <Text style={styles.lastCommentAuthor}>{localLastComment.authorName}</Text>
          <Text style={styles.lastCommentText} numberOfLines={2}>
            {localLastComment.content}
          </Text>
        </View>
      ) : null}

      <Pressable
        style={styles.commentInputRow}
        onPress={(e) => {
          if (e && e.stopPropagation) {
            e.stopPropagation();
          }
        }}
      >
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          placeholderTextColor={colors.onSurfaceVariant}
          value={commentText}
          onChangeText={setCommentText}
          onSubmitEditing={handleSubmitComment}
          returnKeyType="send"
          maxLength={500}
        />
        <Pressable
          style={[styles.sendBtn, (!commentText.trim() || submitting) && styles.sendBtnDisabled]}
          onPress={(e) => {
            if (e && e.stopPropagation) {
              e.stopPropagation();
            }
            handleSubmitComment();
          }}
          disabled={!commentText.trim() || submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Ionicons name="send" size={16} color={colors.white} />
          )}
        </Pressable>
      </Pressable>
    </Pressable>
  );
}
