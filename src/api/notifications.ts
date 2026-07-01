import { api } from './client';

export type NotificationType =
  | 'COMMENT'
  | 'MESSAGE'
  | 'SOLVED'
  | 'REWARD'
  | 'FRIEND_REQUEST'
  | 'REPORT_UPDATE'
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  type: NotificationType;
  payload: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export function listNotifications() {
  return api.get<AppNotification[]>('/notifications');
}

export function getUnreadCount() {
  return api.get<number>('/notifications/unread-count');
}

export function markNotificationRead(id: string) {
  return api.patch(`/notifications/${id}/read`);
}

export function markAllNotificationsRead() {
  return api.patch('/notifications/read-all');
}
