import { api } from './client';

export interface ApiPost {
  id: string;
  type: 'PROBLEM' | 'SOLUTION';
  status: 'OPEN' | 'SOLVED' | 'CLOSED';
  title: string;
  description: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  isTrending: boolean;
  createdAt: string;
  author: { id: string; name: string; avatarUrl: string | null; reputationPoints: number };
  category: { id: string; name: string; slug: string; icon: string | null };
  attachments: { id: string; type: 'PHOTO' | 'VIDEO'; url: string }[];
  aiAnalysis: { diagnosis: string; suggestedSolutions: string[]; confidenceScore: number } | null;
  _count?: { comments: number; likes: number };
}

export interface CreatePostInput {
  type: 'PROBLEM' | 'SOLUTION';
  categoryId: string;
  title: string;
  description: string;
  attachments?: { type: 'PHOTO' | 'VIDEO'; url: string }[];
}

export function createPost(input: CreatePostInput) {
  return api.post<ApiPost>('/posts', input);
}

export function getFeed(params: {
  categoryId?: string;
  type?: 'PROBLEM' | 'SOLUTION';
  status?: 'OPEN' | 'SOLVED' | 'CLOSED';
  trending?: boolean;
} = {}) {
  const query = new URLSearchParams();
  if (params.categoryId) query.set('categoryId', params.categoryId);
  if (params.type) query.set('type', params.type);
  if (params.status) query.set('status', params.status);
  if (params.trending) query.set('trending', 'true');
  const qs = query.toString();
  return api.get<ApiPost[]>(`/posts${qs ? `?${qs}` : ''}`);
}

export function getPost(id: string) {
  return api.get<ApiPost & { comments: any[] }>(`/posts/${id}`);
}

export function searchPosts(q: string, categoryId?: string) {
  const query = new URLSearchParams({ q });
  if (categoryId) query.set('categoryId', categoryId);
  return api.get<ApiPost[]>(`/posts/search?${query.toString()}`);
}

export function toggleLikePost(id: string) {
  return api.post<{ liked: boolean }>(`/posts/${id}/like`);
}

export function toggleFavoritePost(id: string) {
  return api.post<{ favorited: boolean }>(`/posts/${id}/favorite`);
}

export function markPostSolved(id: string, solvedCommentId: string) {
  return api.patch(`/posts/${id}/solve`, { solvedCommentId });
}

export function getCategories() {
  return api.get<{ id: string; name: string; slug: string; icon: string | null }[]>('/categories');
}

export function previewPostAnalysis(input: { categoryId: string; title: string; description: string }) {
  return api.post<{ diagnosis: string; suggestedSolutions: string[]; confidenceScore: number }>(
    '/posts/analyze-preview',
    input,
  );
}
