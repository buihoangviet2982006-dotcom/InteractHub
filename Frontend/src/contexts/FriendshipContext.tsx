import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Friendship, User } from '../types';
import { useAuth } from './AuthContext';
import { deleteFriendship, getFriends, sendFriendRequest } from '../services/friendshipsApi';
import { getSuggestions } from '../services/userApi';

interface FriendshipContextValue {
  friends: Friendship[];
  suggestions: User[];
  requestSent: string[];
  loading: boolean;
  error: string | null;
  sendRequest: (receiverId: string) => Promise<void>;
  removeFriend: (targetUserId: string) => Promise<void>;
  refreshFriends: () => Promise<void>;
  loadSuggestions: () => Promise<void>;
}

const FriendshipContext = createContext<FriendshipContextValue | undefined>(undefined);

export function FriendshipProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [requestSent, setRequestSent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
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
  }, [user, isAuthenticated]);

  const loadSuggestions = useCallback(async () => {
    if (!user || !isAuthenticated) {
      setSuggestions([]);
      return;
    }
    try {
      const data = await getSuggestions(5);
      setSuggestions(data);
    } catch (err) {
      console.error('Không thể tải gợi ý', err);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    void loadFriends();
    void loadSuggestions();
  }, [loadFriends, loadSuggestions]);

  const value = useMemo<FriendshipContextValue>(() => ({
    friends,
    suggestions,
    requestSent,
    loading,
    error,
    sendRequest: async (receiverId: string) => {
      try {
        await sendFriendRequest(receiverId);
        setRequestSent((prev) => [...prev, receiverId]);
        // Also refresh friends or let backend decide. But for now, just mark request sent.
        // If it's auto-accept, we can fetch friends again.
        void loadFriends();
        void loadSuggestions(); // Refresh suggestions since they might have changed
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
    loadSuggestions
  }), [friends, suggestions, loading, error, requestSent, loadFriends, loadSuggestions]);

  return <FriendshipContext.Provider value={value}>{children}</FriendshipContext.Provider>;
}

export function useFriendships() {
  const context = useContext(FriendshipContext);
  if (!context) {
    throw new Error('useFriendships phải được sử dụng bên trong FriendshipProvider');
  }
  return context;
}
