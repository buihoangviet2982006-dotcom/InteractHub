import type { Comment, Post } from '../types';
import { http } from './http';

const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  return date.toLocaleDateString('vi-VN');
};

// Helper to convert Base64 from backend to displayable Data URL
export const formatImageData = (base64?: string) => {
  if (!base64) return undefined;
  return `data:image/jpeg;base64,${base64}`;
};

const mapBackendCommentToFrontend = (c: any): Comment => ({
  id: (c.id || c.Id || '').toString(),
  userId: (c.userId || c.UserId || '').toString(),
  user: {
    id: (c.userId || c.UserId || '').toString(),
    name: c.userFullName || c.UserFullName,
    avatarData: formatImageData(c.userAvatarData || c.UserAvatarData),
  },
  content: c.content || c.Content,
  timestamp: formatTimestamp(c.createdAt || c.CreatedAt),
});

export const mapBackendPostToFrontend = (p: any): Post => {
  return {
    id: (p.id || p.Id || '').toString(),
    userId: (p.userId || p.UserId || '').toString(),
    user: {
      id: (p.userId || p.UserId || '').toString(),
      name: p.userFullName || p.UserFullName,
      avatarData: formatImageData(p.userAvatarData || p.UserAvatarData),
    },
    content: p.content || p.Content,
    imageData: formatImageData(p.imageData || p.ImageData),
    timestamp: formatTimestamp(p.createdAt || p.CreatedAt),
    likes: p.likeCount || p.LikeCount || 0,
    shares: 0,
    comments: [],
    isLiked: p.isLiked || p.IsLiked || false,
  };
};

export interface PaginatedPosts {
  items: Post[];
  nextCursorId: number | null;
  hasNextPage: boolean;
}

export async function fetchPosts(cursorId?: number, limit = 5): Promise<PaginatedPosts> {
  const response = await http.get<{ items: any[]; nextCursorId: number | null; hasNextPage: boolean }>('/posts', {
    params: { cursorId, limit },
  });
  
  const data = response.data;
  const items = data.items || data.Items || [];
  const nextCursorId = data.nextCursorId ?? data.NextCursorId ?? null;
  const hasNextPage = data.hasNextPage ?? data.HasNextPage ?? false;
  
  return {
    items: Array.isArray(items) ? items.map(mapBackendPostToFrontend) : [],
    nextCursorId: nextCursorId,
    hasNextPage: hasNextPage,
  };
}

export async function likePost(postId: string): Promise<{ isLiked: boolean }> {
  const response = await http.post<{ isLiked: boolean; message: string }>(`/posts/${postId}/likes`, {
    postId: Number(postId),
  });
  return { isLiked: response.data.isLiked };
}

export async function createComment(postId: string, content: string): Promise<Comment> {
  const response = await http.post<any>(`/posts/${postId}/comments`, {
    postId: Number(postId),
    content,
  });
  return mapBackendCommentToFrontend(response.data);
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const response = await http.get<any[]>(`/posts/${postId}/comments`);
  return response.data.map(mapBackendCommentToFrontend);
}

export async function deletePost(postId: string): Promise<void> {
  await http.delete(`/posts/${postId}`);
}

export async function updatePost(postId: string, content: string, imageFile?: File): Promise<Post> {
  const formData = new FormData();
  formData.append('content', content);
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await http.put<any>(`/posts/${postId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return mapBackendPostToFrontend(response.data);
}

export async function createPost(content: string, imageFile?: File): Promise<Post> {
  const formData = new FormData();
  formData.append('content', content);
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await http.post<any>('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return mapBackendPostToFrontend(response.data);
}
