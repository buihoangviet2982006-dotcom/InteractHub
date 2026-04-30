import { CreatePost } from './CreatePost';
import { PostList } from './PostList';
import { StoryBar } from '../story/StoryBar';

export function Feed() {
  return (
    <div className="w-full">
      <CreatePost />
      <StoryBar />
      <PostList />
    </div>
  );
}
