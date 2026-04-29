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
  createdAt: string;
}
