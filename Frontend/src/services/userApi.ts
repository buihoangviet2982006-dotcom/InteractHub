import { http } from './http';
import type { User } from '../types';
import { formatImageData } from './postsApi';

export interface UserProfile extends Omit<User, 'id'> {
  id: string;
  email?: string;
  bio?: string;
  coverData?: string;
  friendCount: number;
  isFriend: boolean;
  requestSent: boolean;
}

export async function searchUsers(query: string): Promise<User[]> {
  if (!query.trim()) return [];
  const response = await http.get<any[]>(`/users/search?q=${encodeURIComponent(query)}`);
  return response.data.map((u) => ({
    id: (u.id || u.Id || '').toString(),
    name: u.fullName || u.FullName,
    avatarData: formatImageData(u.avatarData || u.AvatarData),
  }));
}

export async function getSuggestions(limit: number = 5): Promise<User[]> {
  const response = await http.get<any[]>(`/users/suggestions?limit=${limit}`);
  return response.data.map((u) => ({
    id: (u.id || u.Id || '').toString(),
    name: u.fullName || u.FullName,
    avatarData: formatImageData(u.avatarData || u.AvatarData),
  }));
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const response = await http.get<any>(`/users/${userId}`);
  const data = response.data;
  return {
    ...data,
    id: (data.id || data.Id || '').toString(),
    name: data.fullName || data.FullName,
    email: data.email || data.Email,
    bio: data.bio || data.Bio,
    avatarData: formatImageData(data.avatarData || data.AvatarData),
    coverData: formatImageData(data.coverData || data.CoverData),
    friendCount: data.friendCount ?? data.FriendCount ?? 0,
    isFriend: data.isFriend ?? data.IsFriend ?? false,
    requestSent: data.requestSent ?? data.RequestSent ?? false,
  };
}

export async function updateAvatar(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  await http.patch('/users/me/avatar', formData);
}

export async function updateCover(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  await http.patch('/users/me/cover', formData);
}

export async function updateProfile(fullName: string, bio: string): Promise<UserProfile> {
  const response = await http.patch<any>('/users/me/profile', { fullName, bio });
  const data = response.data;
  return {
    ...data,
    id: (data.id || data.Id || '').toString(),
    name: data.fullName || data.FullName,
    email: data.email || data.Email,
    bio: data.bio || data.Bio,
    avatarData: formatImageData(data.avatarData || data.AvatarData),
    coverData: formatImageData(data.coverData || data.CoverData),
    friendCount: data.friendCount ?? data.FriendCount ?? 0,
    isFriend: data.isFriend ?? data.IsFriend ?? false,
    requestSent: data.requestSent ?? data.RequestSent ?? false,
  };
}
