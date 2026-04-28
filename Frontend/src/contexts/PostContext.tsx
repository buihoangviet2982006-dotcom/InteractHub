import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Comment, Post } from '../types';
import { createComment, createPost, fetchPosts, likePost } from '../services/postsApi';
import { useAuth } from './AuthContext';

interface PostContextValue {
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  search: string;
  hasNextPage: boolean;
  setSearch: (value: string) => void;
  addPost: (content: string, imageUrl?: string) => Promise<void>;
  loadMore: () => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
}

const PostContext = createContext<PostContextValue | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [nextCursorId, setNextCursorId] = useState<number | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      if (!isAuthenticated) {
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetchPosts();
        if (mounted) {
          setPosts(res.items);
          setNextCursorId(res.nextCursorId);
          setHasNextPage(res.hasNextPage);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Không thể tải bài viết');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadPosts();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  const value = useMemo<PostContextValue>(
    () => ({
      posts,
      loading,
      loadingMore,
      error,
      search,
      hasNextPage,
      setSearch,
      addPost: async (content: string, imageUrl?: string) => {
        const optimisticPost = await createPost(content, imageUrl);
        setPosts((prev) => [optimisticPost, ...prev.filter((p) => p.id !== optimisticPost.id)]);
      },
      loadMore: async () => {
        if (loadingMore || !hasNextPage || !nextCursorId) return;

        try {
          setLoadingMore(true);
          const res = await fetchPosts(nextCursorId);
          setPosts((prev) => [...prev, ...res.items]);
          setNextCursorId(res.nextCursorId);
          setHasNextPage(res.hasNextPage);
        } catch (err) {
          console.error('Lỗi khi tải thêm bài viết:', err);
        } finally {
          setLoadingMore(false);
        }
      },
      toggleLike: async (postId: string) => {
        const previousPosts = posts;

        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  likes: post.likes + (post.isLiked ? -1 : 1),
                }
              : post,
          ),
        );

        try {
          const serverState = await likePost(postId);
          setPosts((prev) =>
            prev.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes: serverState.likes,
                    isLiked: serverState.isLiked,
                  }
                : post,
            ),
          );
        } catch {
          setPosts(previousPosts);
        }
      },
      addComment: async (postId: string, content: string) => {
        const optimisticComment: Comment = {
          id: `tmp-${Date.now()}`,
          userId: 'u1',
          user: {
            id: 'u1',
            name: 'Bạn',
            avatarUrl: 'https://i.pravatar.cc/150?u=you',
          },
          content,
          timestamp: 'Đang gửi...',
        };

        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, comments: [optimisticComment, ...post.comments] } : post,
          ),
        );

        try {
          const created = await createComment(postId, content);
          setPosts((prev) =>
            prev.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    comments: post.comments.map((comment) =>
                      comment.id === optimisticComment.id ? created : comment,
                    ),
                  }
                : post,
            ),
          );
        } catch {
          setPosts((prev) =>
            prev.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    comments: post.comments.filter((comment) => comment.id !== optimisticComment.id),
                  }
                : post,
            ),
          );
        }
      },
    }),
    [posts, loading, loadingMore, error, search, hasNextPage, nextCursorId],
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts phải được sử dụng bên trong PostProvider');
  }
  return context;
}
