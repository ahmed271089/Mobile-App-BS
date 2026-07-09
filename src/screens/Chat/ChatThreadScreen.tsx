import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, radius, spacing, typography } from "../../theme";
import { useSocket, setActiveConversationId } from "../../api/socket";
import { getMessages, markConversationRead, ChatMessage } from "../../api/chat";
import { ReportModal } from "../../components/ReportModal";
import { createReport } from "../../api/reports";

/* ── Animated typing dots ─────────────────────────────────────── */
function TypingIndicator({ name, colors }: { name: string; colors: any }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -4,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 280,
            useNativeDriver: true,
          }),
        ]),
      );
    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 150);
    const a3 = animate(dot3, 300);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={typingStyles(colors).row}>
      <View style={typingStyles(colors).bubble}>
        {[dot1, dot2, dot3].map((d, i) => (
          <Animated.View
            key={i}
            style={[
              typingStyles(colors).dot,
              { transform: [{ translateY: d }] },
            ]}
          />
        ))}
      </View>
      <Text style={typingStyles(colors).label}>
        {name} is typing
      </Text>
    </View>
  );
}

const typingStyles = (colors: any) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: spacing.lg + 4,
      paddingBottom: spacing.xs,
    },
    bubble: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.surfaceContainer,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.onSurfaceVariant,
    },
    label: {
      ...typography.caption,
      color: colors.onSurfaceVariant,
      fontStyle: "italic",
    },
  });

/* ── Main Screen ──────────────────────────────────────────────── */
export default function ChatThreadScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { conversationId, otherUser } = route.params;
  const { socket, connected } = useSocket();
  const colors = useColors();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [otherTyping, setOtherTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);

  const submitReport = async (reason: string, details: string) => {
    if (!otherUser) return;
    try {
      await createReport("USER", otherUser.id, reason, details);
      // Modal handles its own success state now
    } catch {
      Alert.alert("Error", "Could not submit report.");
      throw new Error("Failed");
    }
  };

  // Send button scale animation
  const sendScale = useRef(new Animated.Value(1)).current;
  const handleSendPressIn = () => {
    Animated.spring(sendScale, {
      toValue: 0.88,
      useNativeDriver: true,
    }).start();
  };
  const handleSendPressOut = () => {
    Animated.spring(sendScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  /* ── Styles ──────────────────────────────────────────────────── */
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        /* Header */
        header: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          paddingHorizontal: spacing.lg,
          paddingBottom: 14,
          backgroundColor: colors.surface,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.outlineVariant,
        },
        backBtn: {
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: colors.surfaceContainerHigh,
          alignItems: "center",
          justifyContent: "center",
        },
        avatarWrap: {
          position: "relative",
        },
        avatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        avatarText: {
          ...typography.bodyBold,
          fontSize: 16,
          color: colors.onPrimaryContainer,
        },
        onlineDot: {
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: "#22c55e",
          borderWidth: 2,
          borderColor: colors.surface,
        },
        offlineDot: {
          backgroundColor: colors.outline,
        },
        headerInfo: {
          flex: 1,
        },
        headerName: {
          ...typography.bodyBold,
          color: colors.onSurface,
        },
        headerStatus: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          marginTop: 1,
        },

        /* Messages */
        bubbleRow: {
          flexDirection: "row",
          marginBottom: 2,
        },
        bubbleRowMine: {
          justifyContent: "flex-end",
          paddingLeft: 48,
        },
        bubbleRowTheirs: {
          justifyContent: "flex-start",
          paddingRight: 48,
        },
        bubble: {
          maxWidth: "100%",
          paddingHorizontal: 14,
          paddingVertical: 10,
        },
        bubbleMine: {
          backgroundColor: colors.primaryContainer,
          borderRadius: 18,
          borderBottomRightRadius: 6,
          ...Platform.select({
            ios: {
              shadowColor: colors.primaryContainer,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
            },
            android: { elevation: 1 },
          }),
        },
        bubbleTheirs: {
          backgroundColor: colors.surfaceContainerHigh,
          borderRadius: 18,
          borderBottomLeftRadius: 6,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 2,
            },
            android: { elevation: 1 },
          }),
        },
        bubbleTextMine: {
          ...typography.body,
          color: colors.onPrimaryContainer,
          lineHeight: 22,
        },
        bubbleTextTheirs: {
          ...typography.body,
          color: colors.onSurface,
          lineHeight: 22,
        },
        timestamp: {
          ...typography.caption,
          fontSize: 10,
          color: colors.onSurfaceVariant,
          marginTop: 4,
          marginBottom: 6,
          opacity: 0.7,
        },
        timestampMine: {
          textAlign: "right",
          marginRight: 4,
        },
        timestampTheirs: {
          textAlign: "left",
          marginLeft: 4,
        },

        /* Input Area */
        inputArea: {
          backgroundColor: colors.surface,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.outlineVariant,
        },
        inputRow: {
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 8,
          paddingHorizontal: spacing.lg,
          paddingTop: 10,
        },
        attachBtn: {
          width: 38,
          height: 38,
          borderRadius: 19,
          alignItems: "center",
          justifyContent: "center",
        },
        input: {
          flex: 1,
          maxHeight: 120,
          minHeight: 40,
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "ios" ? 10 : 8,
          paddingBottom: Platform.OS === "ios" ? 10 : 8,
          color: colors.onSurface,
          ...typography.body,
          fontSize: 15,
        },
        sendBtn: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        sendBtnActive: {
          backgroundColor: colors.primaryContainer,
        },
        sendBtnDisabled: {
          backgroundColor: colors.surfaceContainerHigh,
        },
      }),
    [colors],
  );

  /* ── Data loading & Socket ──────────────────────────────────── */
  const loadHistory = useCallback(() => {
    setLoading(true);
    setError(null);
    getMessages(conversationId)
      .then((history) => setMessages(history))
      .catch((err) => {
        console.warn("Failed to load messages", err);
        setError("Failed to load conversation history.");
      })
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    loadHistory();
    markConversationRead(conversationId).catch(() => { });
  }, [loadHistory, conversationId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_conversation", { conversationId });

    const onNewMessage = (message: ChatMessage) => {
      if (message.conversationId !== conversationId) return;
      setMessages((prev) => [message, ...prev]);
    };

    const onTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId !== conversationId) return;
      setOtherTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setOtherTyping(false), 2000);
    };

    socket.on("new_message", onNewMessage);
    socket.on("typing", onTyping);
    setActiveConversationId(conversationId);

    return () => {
      socket.emit("leave_conversation", { conversationId });
      socket.off("new_message", onNewMessage);
      socket.off("typing", onTyping);
      setActiveConversationId(null);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    if (!socket || !otherUser?.id) return;

    // Check initial status
    socket.emit("check_user_status", { userId: otherUser.id }, (response: any) => {
      if (response && typeof response.isOnline === "boolean") {
        setIsOtherUserOnline(response.isOnline);
      }
    });

    const onUserStatusChanged = (payload: { userId: string; isOnline: boolean }) => {
      if (payload.userId === otherUser.id) {
        setIsOtherUserOnline(payload.isOnline);
      }
    };

    socket.on("user_status_changed", onUserStatusChanged);

    return () => {
      socket.off("user_status_changed", onUserStatusChanged);
    };
  }, [socket, otherUser?.id]);

  /* ── Actions ────────────────────────────────────────────────── */
  const handleSend = useCallback(() => {
    if (!draft.trim() || !socket || !connected || isSending) return;
    setIsSending(true);
    
    try {
      socket.emit("send_message", { conversationId, content: draft.trim() });
      setDraft("");
    } catch (err) {
      console.warn("Failed to send", err);
    } finally {
      setIsSending(false);
    }
  }, [draft, socket, connected, isSending, conversationId]);

  const handleChangeText = useCallback(
    (text: string) => {
      setDraft(text);
      socket?.emit("typing", { conversationId });
    },
    [socket, conversationId],
  );

  /* ── Helpers ────────────────────────────────────────────────── */
  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const hasDraft = draft.trim().length > 0;

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.surface }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
      {/* ── Header ──────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backBtn,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>

        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(otherUser?.name)}
            </Text>
          </View>
          <View
            style={[
              styles.onlineDot,
              (!connected || !isOtherUserOnline) && styles.offlineDot,
            ]}
          />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>
            {otherUser?.name ?? "Conversation"}
          </Text>
          <Text style={styles.headerStatus}>
            {!connected
              ? "Connecting…"
              : otherTyping
                ? "Typing…"
                : isOtherUserOnline
                  ? "Online"
                  : "Offline"}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.backBtn,
            pressed && { opacity: 0.6 },
          ]}
          onPress={() => setReportModalVisible(true)}
        >
          <Ionicons
            name="flag-outline"
            size={18}
            color={colors.error}
          />
        </Pressable>
      </View>

      {/* ── Message List or Loading/Error ─────────────────────── */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} style={{ marginBottom: spacing.md }} />
          <Text style={{ color: colors.error, textAlign: "center", ...typography.body }}>{error}</Text>
          <Pressable onPress={loadHistory} style={{ marginTop: spacing.lg, padding: spacing.sm }}>
            <Text style={{ color: colors.primary, ...typography.bodyBold }}>Tap to Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          inverted
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: 20,
            paddingTop: 10,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isMine = item.senderId !== otherUser?.id;
            const time = item.createdAt
              ? new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : null;

            const nextMsg = messages[index + 1];
            const isClusterEnd =
              !nextMsg || nextMsg.senderId !== item.senderId;

            return (
              <View>
                <View
                  style={[
                    styles.bubbleRow,
                    isMine ? styles.bubbleRowMine : styles.bubbleRowTheirs,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      isMine ? styles.bubbleMine : styles.bubbleTheirs,
                    ]}
                  >
                    <Text
                      style={
                        isMine
                          ? styles.bubbleTextMine
                          : styles.bubbleTextTheirs
                      }
                    >
                      {item.content}
                    </Text>
                  </View>
                </View>
                {isClusterEnd && time && (
                  <Text
                    style={[
                      styles.timestamp,
                      isMine
                        ? styles.timestampMine
                        : styles.timestampTheirs,
                    ]}
                  >
                    {time}
                  </Text>
                )}
              </View>
            );
          }}
        />
      )}

      {/* ── Typing indicator ────────────────────────────────── */}
      {otherTyping && (
        <TypingIndicator
          name={otherUser?.name ?? "They"}
          colors={colors}
        />
      )}

      {/* ── Input Bar ───────────────────────────────────────── */}
      <View
        style={[
          styles.inputArea,
          { paddingBottom: insets.bottom + spacing.xs },
        ]}
      >
        <View style={styles.inputRow}>
          <Pressable
            style={({ pressed }) => [
              styles.attachBtn,
              pressed && { opacity: 0.5 },
            ]}
          >
            <Ionicons
              name="add-circle-outline"
              size={26}
              color={colors.onSurfaceVariant}
            />
          </Pressable>

          <TextInput
            value={draft}
            onChangeText={handleChangeText}
            placeholder="Type a message…"
            placeholderTextColor={colors.onSurfaceVariant}
            style={styles.input}
            multiline
          />

          <Animated.View style={{ transform: [{ scale: sendScale }] }}>
            <Pressable
              onPress={handleSend}
              onPressIn={handleSendPressIn}
              onPressOut={handleSendPressOut}
              disabled={!hasDraft || !connected || isSending}
              style={[
                styles.sendBtn,
                hasDraft && connected && !isSending ? styles.sendBtnActive : styles.sendBtnDisabled,
              ]}
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={
                  hasDraft
                    ? colors.onPrimaryContainer
                    : colors.onSurfaceVariant
                }
              />
            </Pressable>
          </Animated.View>
        </View>
      </View>
      </KeyboardAvoidingView>
      <ReportModal
        visible={reportModalVisible}
        targetType="USER"
        onClose={() => setReportModalVisible(false)}
        onSubmit={submitReport}
      />
    </>
  );
}
