import { http, baseURL } from './http';
import type { User } from '../types';

const API_ROOT = baseURL.replace('/api', '');

const formatAvatarUrl = (url?: string) => {
  if (!url) return undefined;
  return url.startsWith('http') ? url : API_ROOT + url;
};

export interface UserProfile extends User {
  email?: string;
  coverUrl?: string;
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
    avatarUrl: formatAvatarUrl(u.avatarUrl || u.AvatarUrl),
    coverUrl: formatAvatarUrl(u.coverUrl || u.CoverUrl),
  }));
}

export async function getSuggestions(limit: number = 5): Promise<User[]> {
  const response = await http.get<any[]>(`/users/suggestions?limit=${limit}`);
  return response.data.map((u) => ({
    id: (u.id || u.Id || '').toString(),
    name: u.fullName || u.FullName,
    avatarUrl: formatAvatarUrl(u.avatarUrl || u.AvatarUrl),
    coverUrl: formatAvatarUrl(u.coverUrl || u.CoverUrl),
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
    avatarUrl: formatAvatarUrl(data.avatarUrl || data.AvatarUrl),
    coverUrl: formatAvatarUrl(data.coverUrl || data.CoverUrl),
  };
}

export async function updateAvatar(avatarUrl: string): Promise<void> {
  await http.patch('/users/me/avatar', { AvatarUrl: avatarUrl });
}

export async function updateCover(coverUrl: string): Promise<void> {
  await http.patch('/users/me/cover', { CoverUrl: coverUrl });
}
