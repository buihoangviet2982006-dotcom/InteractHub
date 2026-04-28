import { useMemo } from 'react';
import { usePosts } from '../../contexts/PostContext';
import { useDebounce } from '../../hooks/useDebounce';
import { PostSkeleton } from '../common/PostSkeleton';
import { PostItem } from './PostItem';

export function PostList() {
  const { posts, loading, loadingMore, error, search, hasNextPage, loadMore } = usePosts();
  const debouncedSearch = useDebounce(search, 300);

 const filteredPosts = useMemo(
  () =>
    Array.isArray(posts)
      ? posts.filter((post) =>
          `${post.user.name} ${post.content}`
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()),
        )
      : [],
  [debouncedSearch, posts],
);

  if (loading) {
    return (
      <div className="space-y-4">
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => loadMore()}
          disabled={loadingMore}
          className="w-full bg-white hover:bg-gray-50 border rounded-lg py-2.5 text-sm font-medium text-gray-700 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loadingMore ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              <span>Đang tải...</span>
            </>
          ) : (
            <span>Xem thêm bài viết</span>
          )}
        </button>
      )}
    </div>
  );
}
