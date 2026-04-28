import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Friendship, User } from '../types';
import { suggestions as mockSuggestions } from '../data/mockData';
import { useAuth } from './AuthContext';
import { deleteFriendship, getFriends, sendFriendRequest } from '../services/friendshipsApi';

interface FriendshipContextValue {
  friends: Friendship[];
  suggestions: User[];
  requestSent: string[];
  loading: boolean;
  error: string | null;
  sendRequest: (receiverId: string) => Promise<void>;
  removeFriend: (targetUserId: string) => Promise<void>;
  refreshFriends: () => Promise<void>;
}

const FriendshipContext = createContext<FriendshipContextValue | undefined>(undefined);

export function FriendshipProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [requestSent, setRequestSent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = async () => {
    if (!user || !isAuthenticated) {
      setFriends([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getFriends(user.id.toString());
      setFriends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải bạn bè');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFriends();
  }, [user, isAuthenticated]);

  const value = useMemo<FriendshipContextValue>(() => ({
    friends,
    suggestions: mockSuggestions,
    requestSent,
    loading,
    error,
    sendRequest: async (receiverId: string) => {
      try {
        await sendFriendRequest(receiverId);
        setRequestSent((prev) => [...prev, receiverId]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể gửi lời mời kết bạn');
        throw err;
      }
    },
    removeFriend: async (targetUserId: string) => {
      await deleteFriendship(targetUserId);
      setFriends((prev) => prev.filter((friend) => friend.friendId !== targetUserId));
    },
    refreshFriends: loadFriends,
  }), [friends, loading, error, requestSent, user, isAuthenticated]);

  return <FriendshipContext.Provider value={value}>{children}</FriendshipContext.Provider>;
}

export function useFriendships() {
  const context = useContext(FriendshipContext);
  if (!context) {
    throw new Error('useFriendships phải được sử dụng bên trong FriendshipProvider');
  }
  return context;
}
