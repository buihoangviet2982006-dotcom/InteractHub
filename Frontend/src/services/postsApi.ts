import type { Comment, Post } from '../types';
import { posts as mockPosts, currentUser } from '../data/mockData';
import { http } from './http';

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

const mapBackendPostToFrontend = (p: any): Post => ({
  id: p.id.toString(),
  userId: p.userId.toString(),
  user: {
    id: p.userId.toString(),
    name: p.userFullName,
    avatarUrl: p.userAvatarUrl || 'https://i.pravatar.cc/150?u=' + p.userId,
  },
  content: p.content,
  imageUrl: p.imageUrl,
  timestamp: formatTimestamp(p.createdAt),
  likes: p.likeCount,
  shares: 0, // Backend chưa hỗ trợ
  comments: [], // Backend trả về CommentCount thay vì mảng comment ở feed
  isLiked: false, // Cần API riêng để check hoặc gán từ backend
});

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
    
    const { items, nextCursorId, hasNextPage } = response.data;
    
    return {
      items: Array.isArray(items) ? items.map(mapBackendPostToFrontend) : [],
      nextCursorId: nextCursorId || null,
      hasNextPage: hasNextPage || false,
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

export async function likePost(postId: string): Promise<{ likes: number; isLiked: boolean }> {
  try {
    const response = await http.post<{ likes: number; isLiked: boolean }>(`/posts/${postId}/like`);
    return response.data;
  } catch {
    await simulateDelay();
    const post = localPosts.find((item) => item.id === postId);
    if (!post) {
      throw new Error('Không tìm thấy bài viết');
    }
    const isLiked = !post.isLiked;
    post.isLiked = isLiked;
    post.likes += isLiked ? 1 : -1;
    return { likes: post.likes, isLiked };
  }
}

export async function createComment(postId: string, content: string): Promise<Comment> {
  try {
    const response = await http.post<Comment>(`/posts/${postId}/comments`, { content });
    return response.data;
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
      timestamp: 'Vừa xong',
      likes: 0,
      shares: 0,
      comments: [],
      isLiked: false,
    };
    localPosts.unshift(newPost);
    return newPost;
  }
}
