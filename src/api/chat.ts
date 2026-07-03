import { api } from "./client";

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  sender: { id: string; name: string; avatarUrl: string | null };
  createdAt: string;
}

export interface FriendUser {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface ConversationSummary {
  id: string;
  isGroup: boolean;
  otherParticipants: { id: string; name: string; avatarUrl: string | null }[];
  lastMessage: { content: string | null; createdAt: string } | null;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  attachmentUrl: string | null;
  createdAt: string;
  sender: { id: string; name: string; avatarUrl: string | null };
}

export function listConversations() {
  return api.get<ConversationSummary[]>("/conversations");
}

export function startConversation(otherUserId: string) {
  return api.post<{ id: string }>("/conversations", { otherUserId });
}

export function getMessages(conversationId: string, before?: string) {
  const query = before ? `?before=${encodeURIComponent(before)}` : "";
  return api.get<ChatMessage[]>(
    `/conversations/${conversationId}/messages${query}`,
  );
}

export function markConversationRead(conversationId: string) {
  return api.patch(`/conversations/${conversationId}/read`);
}

export function sendFriendRequest(receiverId: string) {
  return api.post("/friend-requests", { receiverId });
}

export function listPendingFriendRequests() {
  return api.get<FriendRequest[]>("/friend-requests/pending");
}

export function respondFriendRequest(id: string, accept: boolean) {
  return api.patch(`/friend-requests/${id}/${accept ? "accept" : "reject"}`);
}

export function listFriends() {
  return api.get<FriendUser[]>("/friends");
}

export function removeFriend(friendId: string) {
  return api.delete(`/friends/${friendId}`);
}
