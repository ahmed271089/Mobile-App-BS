import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useColors, radius, spacing, typography } from "../../theme";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { getCategories, previewPostAnalysis } from "../../api/posts";

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
      dot: { height: 4, borderRadius: 2 },
      dotActive: { flex: 1, backgroundColor: colors.primary },
      dotDone: { flex: 1, backgroundColor: colors.primary, opacity: 0.55 },
      dotInactive: { flex: 1, backgroundColor: colors.outlineVariant },
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

type PickedMedia = {
  uri: string;
  mimeType: string;
  fileName: string;
  type?: "image" | "video";
};

export default function ProblemDefinitionScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { type } = route.params ?? { type: "PROBLEM" };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { id: string; name: string; icon: string | null }[]
  >([]);
  const [images, setImages] = useState<PickedMedia[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);

  const styles = React.useMemo(
    () => ({
      container: { paddingHorizontal: spacing.lg },
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
      label: {
        ...typography.caption,
        color: colors.onSurfaceVariant,
        marginBottom: spacing.sm,
      },
      categoryGrid: {
        flexDirection: "row" as const,
        flexWrap: "wrap" as const,
        gap: spacing.sm,
        marginBottom: spacing.lg,
      },
      categoryPill: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 6,
        backgroundColor: colors.surfaceContainer,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.outlineVariant,
        borderRadius: 999,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
      },
      categoryPillSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryContainer,
      },
      categoryPillLabel: { ...typography.caption, color: colors.onSurface },
      thumbRow: { marginBottom: spacing.sm },
      thumbWrap: {
        position: "relative" as const,
        width: 84,
        height: 84,
        borderRadius: radius.md,
        overflow: "visible" as const,
      },
      thumb: {
        width: 84,
        height: 84,
        borderRadius: radius.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.outlineVariant,
      },
      thumbRemove: {
        position: "absolute" as const,
        top: -8,
        right: -8,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: colors.error,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      },
      videoIndicator: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: radius.md,
      },
      mediaBox: {
        height: 100,
        borderWidth: 1.5,
        borderColor: colors.primary,
        borderStyle: "dashed" as const,
        borderRadius: radius.lg,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        gap: 4,
        marginBottom: spacing.lg,
        backgroundColor: colors.primaryContainer,
      },
      mediaText: { ...typography.bodyBold, color: colors.card },
      mediaHint: { ...typography.caption, color: colors.onSurface },
      aiCard: {
        backgroundColor: `${colors.primaryContainer}33`,
        borderRadius: radius.lg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.primaryContainer,
        padding: spacing.lg,
        marginBottom: spacing.md,
      },
      aiHeader: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: spacing.sm,
        marginBottom: spacing.sm,
      },
      aiTitle: { ...typography.h3, color: colors.onSurface },
      aiDesc: {
        ...typography.caption,
        color: colors.onSurfaceVariant,
        lineHeight: 16,
        marginBottom: spacing.md,
      },
      suggestionsBox: { gap: spacing.sm },
      suggestedDetailsLabel: {
        ...typography.bodyBold,
        color: colors.onSurface,
        marginBottom: 4,
      },
      suggestionRow: {
        flexDirection: "row" as const,
        gap: spacing.sm,
        alignItems: "flex-start" as const,
      },
      suggestionDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
        marginTop: 6,
      },
      suggestionText: {
        ...typography.caption,
        color: colors.onSurfaceVariant,
        flex: 1,
        lineHeight: 16,
      },
    }),
    [colors],
  );

  useEffect(() => {
    getCategories().then(setCategories).catch(console.warn);
  }, []);

  const handlePickImage = async (source: "camera-photo" | "camera-video" | "library") => {
    if (source === "camera-photo") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Camera access is needed to take a photo.",
        );
        return;
      }
    } else if (source === "camera-video") {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: micStatus } = await ImagePicker.requestMicrophonePermissionsAsync();
      if (cameraStatus !== "granted" || micStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Camera and microphone access are needed to record a video.",
        );
        return;
      }
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Photo library access is needed to select images.",
        );
        return;
      }
    }

    const result =
      source === "camera-photo"
        ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.85,
          allowsEditing: true,
          aspect: [4, 3],
        })
        : source === "camera-video"
          ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 0.85,
            allowsEditing: false,
            videoMaxDuration: 60, // Max 60 seconds for videos
          })
          : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.85,
            allowsMultipleSelection: true,
            selectionLimit: 5 - images.length,
            videoMaxDuration: 60, // Max 60 seconds for videos
          });

    if (!result.canceled && result.assets.length > 0) {
      const newMedia = result.assets.map((a) => {
        const isVideo = a.type === "video" || a.mimeType?.startsWith("video/");
        return {
          uri: a.uri,
          mimeType: a.mimeType ?? (isVideo ? "video/mp4" : "image/jpeg"),
          fileName:
            a.fileName ??
            `${isVideo ? "video" : "photo"}-${Date.now()}.${isVideo ? "mp4" : "jpg"}`,
          type: isVideo ? ("video" as const) : ("image" as const),
        };
      });
      setImages((prev) => [...prev, ...newMedia].slice(0, 5));
    }
  };

  const handleShowImagePicker = () => {
    if (images.length >= 5) {
      Alert.alert("Limit reached", "You can attach up to 5 images per post.");
      return;
    }

    if (Platform.OS === "web") {
      // Alert.alert with custom buttons is not supported on web.
      // The web file picker naturally allows picking files or taking photos if on mobile web.
      handlePickImage("library");
      return;
    }

    Alert.alert("Add Media", "Choose a source", [
      { text: "Take a Photo", onPress: () => handlePickImage("camera-photo") },
      { text: "Record a Video", onPress: () => handlePickImage("camera-video") },
      { text: "Photo & Video Library", onPress: () => handlePickImage("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleGenerateSuggestions = async () => {
    if (!title || !description || !categoryId) return;
    setAiLoading(true);
    try {
      const result = await previewPostAnalysis({
        categoryId,
        title,
        description,
      });
      if (
        Array.isArray(result.suggestedSolutions) &&
        result.suggestedSolutions.length > 0
      ) {
        setAiSuggestions(result.suggestedSolutions);
      } else if (result.diagnosis) {
        setAiSuggestions([result.diagnosis]);
      } else {
        setAiSuggestions([
          "AI analysis is temporarily unavailable. You can still post without suggestions.",
        ]);
      }
    } catch {
      Alert.alert(
        "AI unavailable",
        "Could not reach the AI agent. You can still post without suggestions.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  const canGoNext = !!title && !!description && !!categoryId;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface }}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
          >
            <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {type === "PROBLEM" ? "Problem Definition" : "Solution Details"}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <StepIndicator current={2} total={3} colors={colors} />

        <Input
          label="Title"
          placeholder={
            type === "PROBLEM"
              ? "e.g. Samsung Fridge Screen Flickering"
              : "e.g. Fixed washing machine not draining"
          }
          value={title}
          onChangeText={setTitle}
        />
        <Input
          label="Description"
          placeholder={
            type === "PROBLEM"
              ? "Describe the symptoms…"
              : "Explain your fix step-by-step…"
          }
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          style={{ minHeight: 110, textAlignVertical: "top" }}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setCategoryId(c.id)}
              style={[
                styles.categoryPill,
                categoryId === c.id && styles.categoryPillSelected,
              ]}
            >
              <Text>{c.icon}</Text>
              <Text
                style={[
                  styles.categoryPillLabel,
                  categoryId === c.id && { color: colors.primary },
                ]}
              >
                {c.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Attachments ({images.length}/5)</Text>
        {images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbRow}
            contentContainerStyle={{
              gap: spacing.sm,
              paddingRight: spacing.md,
            }}
          >
            {images.map((media) => (
              <View key={media.uri} style={styles.thumbWrap}>
                <Image source={{ uri: media.uri }} style={styles.thumb} />
                {media.type === "video" && (
                  <View style={styles.videoIndicator}>
                    <Ionicons
                      name="play-circle"
                      size={32}
                      color={colors.white}
                    />
                  </View>
                )}
                <Pressable
                  style={styles.thumbRemove}
                  onPress={() =>
                    setImages((prev) => prev.filter((u) => u.uri !== media.uri))
                  }
                >
                  <Ionicons
                    name="close"
                    size={14}
                    color={colors.white}
                  />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
        {images.length < 5 && (
          <Pressable style={styles.mediaBox} onPress={handleShowImagePicker}>
            <Ionicons name="camera-outline" size={24} color={colors.card} />
            <Text style={styles.mediaText}>
              {images.length === 0 ? "Add photo or video" : "Add more photos"}
            </Text>
            <Text style={styles.mediaHint}>Tap to open camera or library</Text>
          </Pressable>
        )}

        {/* // {type === "PROBLEM" && ( 
          // <View style={styles.aiCard}>
          //   <View style={styles.aiHeader}>
          //     <Badge label="AI Agent" variant="info" icon="✨" />
          //     <Text style={styles.aiTitle}>AI Agent Assistant</Text>
          //   </View>
          //   <Text style={styles.aiDesc}>
          //     Get AI suggestions before you share publicly.
          //   </Text>
          //   {!aiSuggestions ? (
          //     <Button
          //       label={aiLoading ? "Analyzing…" : "Generate Suggestions"}
          //       variant="secondary"
          //       loading={aiLoading}
          //       disabled={!title || !description || !categoryId}
          //       onPress={handleGenerateSuggestions}
          //     />
          //   ) : (
          //     <View style={styles.suggestionsBox}>
          //       <Text style={styles.suggestedDetailsLabel}>
          //         AI Suggested Details
          //       </Text>
          //       {aiSuggestions.map((s, i) => (
          //         <View key={i} style={styles.suggestionRow}>
          //           <View style={styles.suggestionDot} />
          //           <Text style={styles.suggestionText}>{s}</Text>
          //         </View>
          //       ))}
          //     </View>
          //   )}
          // </View>
        // )} */}

        <Button
          label="Next: Review & Share"
          style={{ marginTop: spacing.xl }}
          disabled={!canGoNext}
          onPress={() =>
            navigation.navigate("ShareFinalize", {
              type,
              title,
              description,
              categoryId,
              images,
            })
          }
        />
      </View>
    </ScrollView>
  );
}
