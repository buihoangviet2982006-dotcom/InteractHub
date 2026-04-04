import { CreatePost } from './CreatePost';
import { PostList } from './PostList';

export function Feed() {
  return (
    <div className="w-full">
      <CreatePost />
      <PostList />
    </div>
  );
}
