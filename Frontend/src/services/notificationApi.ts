import { http } from './http';
import type { Notification } from '../types';

export async function getNotifications(): Promise<Notification[]> {
  const response = await http.get<any[]>('/notifications');
  return response.data.map((n) => ({
    id: n.id || n.Id,
    content: n.content || n.Content,
    type: n.type || n.Type,
    isRead: n.isRead !== undefined ? n.isRead : n.IsRead,
    createdAt: n.createdAt || n.CreatedAt,
  }));
}

export async function markAsRead(id: number): Promise<void> {
  await http.put(`/notifications/${id}/read`);
}
