import { posts } from '../../data/mockData';
import { PostItem } from './PostItem';

export function PostList() {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
