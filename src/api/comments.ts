import { api } from './client';

export interface ApiComment {
  id: string;
  postId: string;
  content: string;
  isAIComment: boolean;
  likesCount: number;
  userVote?: number;
  createdAt: string;
  author: { id: string; name: string; avatarUrl: string | null; reputationPoints?: number; reputationLevel?: string; };
}

export function listComments(postId: string) {
  return api.get<ApiComment[]>(`/posts/${postId}/comments`);
}

export function createComment(postId: string, content: string, parentId?: string) {
  return api.post<ApiComment>(`/posts/${postId}/comments`, { content, parentId });
}

export function voteComment(postId: string, commentId: string, value: number) {
  return api.post<{ userVote: number }>(`/posts/${postId}/comments/${commentId}/vote`, { value });
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
