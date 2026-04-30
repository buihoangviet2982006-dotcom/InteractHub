import { http } from './http';
import type { User, Post } from '../types';
import { formatImageData, mapBackendPostToFrontend } from './postsApi';

export interface SearchResults {
  users: User[];
  posts: Post[];
}

export async function searchAll(q: string): Promise<SearchResults> {
  const response = await http.get<any>('search', {
    params: { q }
  });
  
  const data = response.data;
  
  return {
    users: (data.users || data.Users || []).map((u: any) => ({
      id: (u.id || u.Id || '').toString(),
      name: u.fullName || u.FullName,
      avatarData: formatImageData(u.avatarData || u.AvatarData),
    })),
    posts: (data.posts || data.Posts || []).map(mapBackendPostToFrontend)
  };
}
