import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, radius, spacing, typography } from "../../theme";
import { useSocket } from "../../api/socket";
import { getMessages, markConversationRead, ChatMessage } from "../../api/chat";

export default function ChatThreadScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { conversationId, otherUser } = route.params;
  const { socket, connected } = useSocket();
  const colors = useColors();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [otherTyping, setOtherTyping] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load history over REST, then join the room for live updates over the socket.
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.outlineVariant,
        },
        backBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        },
        headerName: {
          ...typography.bodyBold,
          color: colors.onSurface,
        },
        headerStatus: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
        },
        bubbleRow: {
          flexDirection: "row",
        },
        bubbleRowMine: {
          justifyContent: "flex-end",
        },
        bubbleRowTheirs: {
          justifyContent: "flex-start",
        },
        bubble: {
          maxWidth: "78%",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: radius.lg,
        },
        bubbleMine: {
          backgroundColor: colors.primary,
        },
        bubbleTheirs: {
          backgroundColor: colors.surfaceContainer,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
        },
        bubbleText: {
          ...typography.body,
          color: colors.onSurface,
        },
        inputRow: {
          flexDirection: "row",
          alignItems: "flex-end",
          gap: spacing.sm,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          borderTopWidth: 1,
          borderTopColor: colors.outlineVariant,
        },
        input: {
          flex: 1,
          maxHeight: 100,
          backgroundColor: colors.surfaceContainer,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          borderRadius: radius.lg,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          color: colors.onSurface,
          ...typography.body,
        },
        sendBtn: {
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        },
      }),
    [colors],
  );

  useEffect(() => {
    getMessages(conversationId)
      .then((history) => setMessages(history.reverse())) // backend returns newest-first
      .catch((err) => console.warn("Failed to load messages", err));

    markConversationRead(conversationId).catch(() => {});
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_conversation", { conversationId });

    const onNewMessage = (message: ChatMessage) => {
      if (message.conversationId !== conversationId) return;
      setMessages((prev) => [...prev, message]);
    };

    const onTyping = (payload: { conversationId: string }) => {
      if (payload.conversationId !== conversationId) return;
      setOtherTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setOtherTyping(false), 2000);
    };

    socket.on("new_message", onNewMessage);
    socket.on("typing", onTyping);

    return () => {
      socket.emit("leave_conversation", { conversationId });
      socket.off("new_message", onNewMessage);
      socket.off("typing", onTyping);
    };
  }, [socket, conversationId]);

  const handleSend = () => {
    if (!draft.trim() || !socket) return;
    socket.emit("send_message", { conversationId, content: draft.trim() });
    setDraft("");
  };

  const handleChangeText = (text: string) => {
    setDraft(text);
    socket?.emit("typing", { conversationId });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surface }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName}>
            {otherUser?.name ?? "Conversation"}
          </Text>
          <Text style={styles.headerStatus}>
            {!connected ? "Connecting…" : otherTyping ? "Typing…" : "Online"}
          </Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
        renderItem={({ item }) => {
          const isMine = item.senderId !== otherUser?.id;
          return (
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
                  style={[styles.bubbleText, isMine && { color: colors.white }]}
                >
                  {item.content}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View
        style={[styles.inputRow, { paddingBottom: insets.bottom + spacing.sm }]}
      >
        <TextInput
          value={draft}
          onChangeText={handleChangeText}
          placeholder="Message…"
          placeholderTextColor={colors.onSurfaceVariant}
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={handleSend}
          style={styles.sendBtn}
          disabled={!draft.trim()}
        >
          <Ionicons name="arrow-up" size={18} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
