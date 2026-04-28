import { useMemo, useState } from 'react';
import { usePosts } from '../../contexts/PostContext';
import { useDebounce } from '../../hooks/useDebounce';
import { PostSkeleton } from '../common/PostSkeleton';
import { PostItem } from './PostItem';

export function PostList() {
  const { posts, loading, error, search } = usePosts();
  const [visibleCount, setVisibleCount] = useState(3);
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
      {filteredPosts.slice(0, visibleCount).map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
      {visibleCount < filteredPosts.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 3)}
          className="w-full bg-white hover:bg-gray-50 border rounded-lg py-2.5 text-sm font-medium text-gray-700"
        >
          Xem thêm bài viết
        </button>
      )}
    </div>
  );
}
