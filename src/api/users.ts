import { api } from './client';

export interface ApiUser {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  reputationPoints: number;
  reputationLevel?: string;
  nextLevel?: string | null;
  nextLevelPoints?: number;
  currentLevelPoints?: number;
  rank?: number;
  activityScore?: number;
  isVerified: boolean;
  status?: string;
  role?: string;
  createdAt?: string;
  expertise?: { category: { id: string; name: string }; points: number }[];
}

export function getMe() {
  return api.get<ApiUser>('/users/me');
}

export function updateProfile(data: { name?: string; bio?: string; avatarUrl?: string }) {
  return api.patch<ApiUser>('/users/me', data);
}

export function getUser(id: string) {
  return api.get<ApiUser>(`/users/${id}`);
}

export function searchUsers(q: string) {
  return api.get<Pick<ApiUser, 'id' | 'name' | 'avatarUrl' | 'reputationPoints' | 'isVerified'>[]>(
    `/users/search?q=${encodeURIComponent(q)}`,
  );
}

export function getLeaderboard(categoryId?: string) {
  const url = categoryId ? `/users/leaderboard?categoryId=${categoryId}` : '/users/leaderboard';
  return api.get<(ApiUser & { activityScore?: number })[]>(url);
}
