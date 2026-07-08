import { api } from './client';

export function createReport(targetType: 'POST' | 'COMMENT' | 'MESSAGE' | 'USER', targetId: string, reason: string, details?: string) {
  return api.post('/reports', { targetType, targetId, reason, details });
}
