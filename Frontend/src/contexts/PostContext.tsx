import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Comment, Post } from '../types';
import { createComment, createPost, fetchPosts, likePost } from '../services/postsApi';

interface PostContextValue {
  posts: Post[];
  loading: boolean;
  error: string | null;
  search: string;
  setSearch: (value: string) => void;
  addPost: (content: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
}

const PostContext = createContext<PostContextValue | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        if (mounted) {
          setPosts(data);
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
  }, []);

  const value = useMemo<PostContextValue>(
    () => ({
      posts,
      loading,
      error,
      search,
      setSearch,
      addPost: async (content: string) => {
        const optimisticPost = await createPost(content);
        setPosts((prev) => [optimisticPost, ...prev.filter((p) => p.id !== optimisticPost.id)]);
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
    [posts, loading, error, search],
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
