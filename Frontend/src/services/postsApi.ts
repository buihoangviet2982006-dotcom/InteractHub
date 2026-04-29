import type { Comment, Post } from '../types';
import { posts as mockPosts, currentUser } from '../data/mockData';
import { http, baseURL } from './http';

const API_ROOT = baseURL.replace('/api', '');

const localPosts: Post[] = JSON.parse(JSON.stringify(mockPosts)) as Post[];

const simulateDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  return date.toLocaleDateString('vi-VN');
};

const getCurrentTimestamp = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

const mapBackendCommentToFrontend = (c: any): Comment => ({
  id: (c.id || c.Id || '').toString(),
  userId: (c.userId || c.UserId || '').toString(),
  user: {
    id: (c.userId || c.UserId || '').toString(),
    name: c.userFullName || c.UserFullName,
    avatarUrl: (c.userAvatarUrl || c.UserAvatarUrl) || `https://i.pravatar.cc/150?u=${c.userId || c.UserId}`,
  },
  content: c.content || c.Content,
  timestamp: formatTimestamp(c.createdAt || c.CreatedAt),
});

export const mapBackendPostToFrontend = (p: any): Post => {
  const imageUrl = p.imageUrl || p.ImageUrl;
  return {
    id: (p.id || p.Id || '').toString(),
    userId: (p.userId || p.UserId || '').toString(),
    user: {
      id: (p.userId || p.UserId || '').toString(),
      name: p.userFullName || p.UserFullName,
      avatarUrl: (p.userAvatarUrl || p.UserAvatarUrl) || 'https://i.pravatar.cc/150?u=' + (p.userId || p.UserId),
    },
    content: p.content || p.Content,
    imageUrl: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : API_ROOT + imageUrl) : undefined,
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
  try {
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
  } catch (error) {
    console.error('Lỗi khi tải bài viết:', error);
    await simulateDelay(500);
    return {
      items: localPosts,
      nextCursorId: null,
      hasNextPage: false,
    };
  }
}

export async function likePost(postId: string): Promise<{ isLiked: boolean }> {
  try {
    const response = await http.post<{ isLiked: boolean; message: string }>(`/posts/${postId}/likes`, {
      postId: Number(postId),
    });
    return { isLiked: response.data.isLiked };
  } catch {
    await simulateDelay();
    const post = localPosts.find((item) => item.id === postId);
    if (!post) {
      throw new Error('Không tìm thấy bài viết');
    }
    const isLiked = !post.isLiked;
    post.isLiked = isLiked;
    post.likes += isLiked ? 1 : -1;
    return { isLiked };
  }
}

export async function createComment(postId: string, content: string): Promise<Comment> {
  try {
    const response = await http.post<any>(`/posts/${postId}/comments`, {
      postId: Number(postId),
      content,
    });
    return mapBackendCommentToFrontend(response.data);
  } catch {
    await simulateDelay();
    const post = localPosts.find((item) => item.id === postId);
    if (!post) {
      throw new Error('Không tìm thấy bài viết');
    }
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      content,
      timestamp: 'Vừa xong',
    };
    post.comments.unshift(newComment);
    return newComment;
  }
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  try {
    const response = await http.get<any[]>(`/posts/${postId}/comments`);
    return response.data.map(mapBackendCommentToFrontend);
  } catch {
    await simulateDelay();
    return [];
  }
}

export async function deletePost(postId: string): Promise<void> {
  try {
    await http.delete(`/posts/${postId}`);
  } catch {
    await simulateDelay();
  }
}

export async function updatePost(postId: string, content: string, imageUrl?: string): Promise<Post> {
  try {
    const response = await http.put<any>(`/posts/${postId}`, { content, imageUrl });
    return mapBackendPostToFrontend(response.data);
  } catch {
    await simulateDelay();
    const post = localPosts.find((item) => item.id === postId);
    if (!post) {
      throw new Error('Không tìm thấy bài viết');
    }
    post.content = content;
    post.imageUrl = imageUrl;
    return post;
  }
}

export async function createPost(content: string, imageUrl?: string): Promise<Post> {
  try {
    const response = await http.post<any>('/posts', { content, imageUrl });
    return mapBackendPostToFrontend(response.data);
  } catch (error) {
    console.error('Lỗi khi tạo bài viết:', error);
    await simulateDelay();
    const newPost: Post = {
      id: `p-${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      content,
      imageUrl,
      timestamp: getCurrentTimestamp(),
      likes: 0,
      shares: 0,
      comments: [],
      isLiked: false,
    };
    localPosts.unshift(newPost);
    return newPost;
  }
}

export async function uploadImage(file: File): Promise<{ id: number; url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await http.post<{ id: number; url: string }>('/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return {
    ...response.data,
    url: API_ROOT + response.data.url
  };
}
