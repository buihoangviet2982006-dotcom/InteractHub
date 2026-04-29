import type { Friendship } from '../types';
import { http } from './http';

export async function sendFriendRequest(receiverId: string): Promise<void> {
  await http.post('/friendships/request', {
    receiverId: Number(receiverId),
  });
}

export async function deleteFriendship(targetUserId: string): Promise<void> {
  await http.delete(`/friendships/${targetUserId}`);
}

export async function getFriends(userId: string): Promise<Friendship[]> {
  const response = await http.get<any[]>(`/friendships/${userId}`);
  return response.data.map((f) => ({
    friendId: (f.friendId || f.FriendId || '').toString(),
    friendName: f.friendName || f.FriendName,
    friendAvatarUrl: f.friendAvatarUrl || f.FriendAvatarUrl,
    createdAt: f.createdAt || f.CreatedAt,
  }));
}
