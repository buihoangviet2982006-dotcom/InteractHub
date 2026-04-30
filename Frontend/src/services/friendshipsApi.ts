import type { Friendship } from '../types';
import { http } from './http';
import { formatImageData } from './postsApi';

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
    friendAvatarData: formatImageData(f.friendAvatarData || f.FriendAvatarData),
    status: f.status || f.Status,
    createdAt: f.createdAt || f.CreatedAt,
  }));
}

export async function getPendingRequests(): Promise<Friendship[]> {
  const response = await http.get<any[]>('/friendships/pending');
  return response.data.map((f) => ({
    friendId: (f.friendId || f.FriendId || '').toString(),
    friendName: f.friendName || f.FriendName,
    friendAvatarData: formatImageData(f.friendAvatarData || f.FriendAvatarData),
    status: f.status || f.Status,
    createdAt: f.createdAt || f.CreatedAt,
  }));
}

export async function acceptFriendRequest(requestorId: string): Promise<void> {
  await http.post(`/friendships/accept/${requestorId}`);
}

export async function declineFriendRequest(requestorId: string): Promise<void> {
  await http.post(`/friendships/decline/${requestorId}`);
}
