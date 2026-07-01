import { api } from './client';

export function createReport(targetType: 'POST' | 'COMMENT' | 'MESSAGE' | 'USER', targetId: string, reason: string) {
  return api.post('/reports', { targetType, targetId, reason });
}
