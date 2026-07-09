import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, TextInput, ActivityIndicator, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors, radius, spacing, typography } from "../theme";
import { Badge } from "./Badge";
import { MockPost } from "../data/mockData";
import { createComment } from "../api/comments";
import { toggleFavoritePost } from "../api/posts";

export function PostCard({
  post,
  onPress,
  onToggleSave,
}: {
  post: MockPost;
  onPress?: () => void;
  onToggleSave?: (isSaved: boolean) => void;
}) {
  const colors = useColors();
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localCommentsCount, setLocalCommentsCount] = useState(post.commentsCount);

  const [localLastComment, setLocalLastComment] = useState(post.lastComment);
  const [isSaved, setIsSaved] = useState((post as any).isSaved || false);

  useEffect(() => {
    setLocalCommentsCount(post.commentsCount);
    setLocalLastComment(post.lastComment);
    if ((post as any).isSaved !== undefined) {
      setIsSaved((post as any).isSaved);
    }
  }, [post.commentsCount, post.lastComment, (post as any).isSaved]);

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

  const handleToggleSave = async () => {
    const previousState = isSaved;
    const newState = !previousState;
    setIsSaved(newState);
    if (onToggleSave) onToggleSave(newState);
    
    try {
      const res = await toggleFavoritePost(post.id);
      setIsSaved(res.data.favorited);
      if (onToggleSave && res.data.favorited !== newState) {
        onToggleSave(res.data.favorited);
      }
    } catch (err) {
      setIsSaved(previousState);
      if (onToggleSave) onToggleSave(previousState);
      Alert.alert("Error", "Could not save the post.");
    }
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.surfaceContainer,
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
          padding: spacing.md,
          marginBottom: spacing.lg,
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
        thumbnail: {
          height: 140,
          borderRadius: radius.md,
          marginBottom: spacing.md,
        },
        topRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: spacing.sm,
        },
        badgeContainer: {
          flexDirection: "row",
          gap: spacing.xs,
          flexWrap: "wrap",
          flex: 1,
          paddingRight: spacing.sm,
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
          color: colors.onPrimaryContainer,
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
          backgroundColor: colors.surfaceContainerLow,
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
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.outlineVariant,
          paddingTop: spacing.sm,
        },
        commentInput: {
          flex: 1,
          height: 36,
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: 18,
          paddingHorizontal: spacing.md,
          ...typography.body,
          color: colors.onSurface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.outlineVariant,
        },
        sendBtn: {
          marginLeft: spacing.sm,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        sendBtnDisabled: {
          backgroundColor: colors.surfaceContainerHigh,
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
            backgroundColor: colors.surfaceContainerHigh,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Ionicons name="image-outline" size={32} color={colors.onSurfaceVariant} />
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
        <View style={styles.badgeContainer}>
          <Badge
            label={post.type}
            variant={post.type === "PROBLEM" ? "danger" : "success"}
          />
          {post.status === "SOLVED" && (
            <Badge label="Solved" variant="success" icon="✓" />
          )}
          {post.status === "OPEN" && post.type === "PROBLEM" && (
            <Badge label="Unsolved" variant="warning" icon="?" />
          )}
          {post.isTrending && (
            <Badge label="Trending" variant="warning" icon="🔥" />
          )}
          {post.isHidden && (
            <Badge label="Hidden" variant="danger" icon="🚫" />
          )}
          {post.author.verified ? (
            <Badge label="Verified" variant="success" icon="✓" />
          ) : null}
          {isSaved && (
            <Badge label="Saved" variant="primary" icon="🔖" />
          )}
        </View>
        <Pressable
          onPress={handleToggleSave}
          hitSlop={8}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={isSaved ? colors.primary : colors.onSurfaceVariant}
          />
        </Pressable>
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
          <Pressable 
            style={styles.statItem} 
            onPress={async (e) => {
              if (e && e.stopPropagation) {
                e.stopPropagation();
              }
              const newSavedState = !isSaved;
              setIsSaved(newSavedState);
              try {
                await toggleFavoritePost(post.id);
              } catch (err) {
                setIsSaved(!newSavedState);
                Alert.alert("Error", "Could not save post.");
              }
            }}
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={14}
              color={isSaved ? colors.primary : colors.onSurfaceVariant}
            />
          </Pressable>
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
            <ActivityIndicator size="small" color={colors.onPrimaryContainer} />
          ) : (
            <Ionicons name="send" size={16} color={commentText.trim() ? colors.onPrimaryContainer : colors.onSurfaceVariant} />
          )}
        </Pressable>
      </Pressable>
    </Pressable>
  );
}
