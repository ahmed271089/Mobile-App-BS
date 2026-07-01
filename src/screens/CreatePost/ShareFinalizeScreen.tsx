import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, radius, spacing, typography } from "../../theme";
import { Button } from "../../components/Button";
import { createPost } from "../../api/posts";
import { uploadFile } from "../../api/uploads";
import { ApiError } from "../../api/client";

function StepIndicator({
  current,
  total,
  colors,
}: {
  current: number;
  total: number;
  colors: ReturnType<typeof useColors>;
}) {
  const stepStyles = React.useMemo(
    () => ({
      wrapper: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 6,
        marginBottom: spacing.lg,
      },
      dot: { height: 4, borderRadius: 2, flex: 1 },
      dotActive: { backgroundColor: colors.primary },
      dotDone: { backgroundColor: colors.primary, opacity: 0.55 },
      dotInactive: { backgroundColor: colors.outlineVariant },
      label: {
        ...typography.caption,
        color: colors.onSurfaceVariant,
        marginLeft: 4,
        flexShrink: 0,
      },
    }),
    [colors],
  );

  return (
    <View style={stepStyles.wrapper}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            stepStyles.dot,
            i < current
              ? stepStyles.dotDone
              : i === current - 1
                ? stepStyles.dotActive
                : stepStyles.dotInactive,
          ]}
        />
      ))}
      <Text style={stepStyles.label}>
        Step {current} of {total}
      </Text>
    </View>
  );
}

function parseErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    try {
      const body = JSON.parse(error.message);
      const msg = body.message;
      if (Array.isArray(msg)) return msg.join("\n");
      if (typeof msg === "string") return msg;
    } catch {
      return error.message || "Request failed";
    }
  }
  if (error instanceof Error) return error.message;
  return "Could not share your post. Please try again.";
}

function normalizeMimeType(mimeType: string): string {
  if (mimeType === "image/jpg") return "image/jpeg";
  return mimeType || "image/jpeg";
}

export default function ShareFinalizeScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const {
    title,
    description,
    type,
    categoryId,
    images = [],
  } = route.params ?? {};
  const [shareToFeed, setShareToFeed] = useState(true);
  const [posting, setPosting] = useState(false);

  const styles = React.useMemo(
    () => ({
      scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
      },
      header: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "space-between" as const,
        marginBottom: spacing.xl,
      },
      closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.surfaceContainer,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      },
      headerTitle: { ...typography.h3, color: colors.onSurface },
      previewCard: {
        backgroundColor: colors.surfaceContainer,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        gap: spacing.sm,
      },
      typeBadge: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 4,
        alignSelf: "flex-start" as const,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        marginBottom: 4,
      },
      typeBadgeProblem: { backgroundColor: colors.errorContainer },
      typeBadgeSolution: { backgroundColor: colors.secondaryContainer },
      typeBadgeLabel: { ...typography.caption, fontWeight: "600" as const },
      previewTitle: { ...typography.h3, color: colors.onSurface },
      previewDesc: {
        ...typography.caption,
        color: colors.onSurfaceVariant,
        lineHeight: 18,
      },
      previewThumbRow: { marginTop: spacing.sm },
      previewThumb: {
        width: 72,
        height: 72,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
      },
      audienceTitle: { ...typography.bodyBold, color: colors.onSurface },
      audienceDesc: {
        ...typography.caption,
        color: colors.onSurfaceVariant,
        marginTop: 2,
      },
      toggleRow: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        backgroundColor: colors.surfaceContainer,
        borderRadius: radius.lg,
        padding: spacing.md,
      },
    }),
    [colors],
  );

  const handlePost = async () => {
    if (!title?.trim() || !description?.trim() || !categoryId) {
      Alert.alert(
        "Missing fields",
        "Go back and fill in the title, description, and category.",
      );
      return;
    }

    setPosting(true);
    try {
      const attachments = images.length
        ? await Promise.all(
            images.map(
              async (img: {
                uri: string;
                mimeType?: string;
                fileName?: string;
              }) => {
                const uploaded = await uploadFile(
                  img.uri,
                  normalizeMimeType(img.mimeType ?? "image/jpeg"),
                  img.fileName ?? `photo-${Date.now()}.jpg`,
                );
                return { type: uploaded.type, url: uploaded.url };
              },
            ),
          )
        : [];

      await createPost({
        type,
        categoryId,
        title: title.trim(),
        description: description.trim(),
        attachments,
      });

      // Close the create-post modal (it sits on top of MainTabs).
      const root = navigation.getParent();
      root?.goBack();
    } catch (err) {
      Alert.alert("Post failed", parseErrorMessage(err));
      console.warn("Share Now failed:", err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface }}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + spacing.lg },
      ]}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Finalize & Share</Text>
        <View style={{ width: 36 }} />
      </View>

      <StepIndicator current={3} total={3} colors={colors} />

      <View style={styles.previewCard}>
        <View
          style={[
            styles.typeBadge,
            type === "PROBLEM"
              ? styles.typeBadgeProblem
              : styles.typeBadgeSolution,
          ]}
        >
          <Ionicons
            name={type === "PROBLEM" ? "warning-outline" : "bulb-outline"}
            size={12}
            color={type === "PROBLEM" ? colors.error : colors.success}
          />
          <Text
            style={[
              styles.typeBadgeLabel,
              { color: type === "PROBLEM" ? colors.error : colors.success },
            ]}
          >
            {type === "PROBLEM" ? "Problem" : "Solution"}
          </Text>
        </View>
        <Text style={styles.previewTitle} numberOfLines={2}>
          {title || "Untitled post"}
        </Text>
        <Text style={styles.previewDesc} numberOfLines={3}>
          {description || "No description provided."}
        </Text>
        {images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.previewThumbRow}
            contentContainerStyle={{ gap: spacing.sm }}
          >
            {images.map((img: { uri: string }, idx: number) => (
              <Image
                key={idx}
                source={{ uri: img.uri }}
                style={styles.previewThumb}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.toggleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.audienceTitle}>Share to News Feed</Text>
          <Text style={styles.audienceDesc}>
            Show this post in the community feed.
          </Text>
        </View>
        <Switch
          value={shareToFeed}
          onValueChange={setShareToFeed}
          trackColor={{ false: colors.outlineVariant, true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      </View>

      <Button
        label="Share Now"
        style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}
        loading={posting}
        onPress={handlePost}
      />
    </ScrollView>
  );
}
