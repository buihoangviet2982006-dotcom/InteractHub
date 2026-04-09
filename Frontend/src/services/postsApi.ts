import type { Comment, Post } from '../types';
import { posts as mockPosts, currentUser } from '../data/mockData';
import { http } from './http';

const localPosts: Post[] = JSON.parse(JSON.stringify(mockPosts)) as Post[];

const simulateDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await http.get<Post[]>('/posts');
    return response.data;
  } catch {
    await simulateDelay(500);
    return localPosts;
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

export async function createPost(content: string): Promise<Post> {
  try {
    const response = await http.post<Post>('/posts', { content });
    return response.data;
  } catch {
    await simulateDelay();
    const newPost: Post = {
      id: `p-${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      content,
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
