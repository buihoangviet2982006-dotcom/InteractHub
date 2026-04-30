export interface User {
  id: string;
  name: string;
  avatarData?: string; // Base64 string from backend
  isOnline?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  imageData?: string; // Base64 string from backend
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked?: boolean;
}

export interface Friendship {
  friendId: string;
  friendName: string;
  friendAvatarData?: string;
  status: string;
  createdAt: string;
}

export interface PostReportCreate {
  postId: number;
  reason: string;
}

export interface PostReportResponse {
  id: number;
  reporterId: number;
  reporterName: string;
  postId: number;
  reason: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
