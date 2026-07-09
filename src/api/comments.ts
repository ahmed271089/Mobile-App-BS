import { api } from './client';

export interface ApiComment {
  id: string;
  postId: string;
  content: string;
  isAIComment: boolean;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
  author: { id: string; name: string; avatarUrl: string | null; reputationPoints?: number; reputationLevel?: string; };
}

export function listComments(postId: string) {
  return api.get<ApiComment[]>(`/posts/${postId}/comments`);
}

export function createComment(postId: string, content: string, parentId?: string) {
  return api.post<ApiComment>(`/posts/${postId}/comments`, { content, parentId });
}

export function toggleLikeComment(postId: string, commentId: string) {
  return api.post<{ liked: boolean }>(`/posts/${postId}/comments/${commentId}/like`);
}

export function updateComment(postId: string, commentId: string, content: string) {
  return api.patch<ApiComment>(`/posts/${postId}/comments/${commentId}`, { content });
}

export function deleteComment(postId: string, commentId: string) {
  return api.delete(`/posts/${postId}/comments/${commentId}`);
}

export function rewardContributor(postId: string, commentId: string, points: number) {
  return api.post(`/posts/${postId}/reward`, { commentId, points });
}
