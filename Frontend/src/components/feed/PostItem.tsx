import { useState } from 'react';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import type { Post } from '../../types';
import { CommentSection } from './CommentSection';

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={post.user.avatarUrl} alt={post.user.name} className="w-10 h-10 rounded-full" />
          <div>
            <h4 className="font-semibold text-gray-900 leading-tight">{post.user.name}</h4>
            <span className="text-sm text-gray-500 leading-none">{post.timestamp}</span>
          </div>
        </div>
        <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-800 text-base">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="w-full mt-2">
          <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
        </div>
      )}

      {/* Post Stats (Likes, Comments, Shares) */}
      <div className="px-4 py-2 border-b flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="bg-blue-500 p-1 rounded-full text-white">
            <ThumbsUp className="w-3 h-3 fill-current" />
          </div>
          <span className="hover:underline cursor-pointer">{post.likes}</span>
        </div>
        <div className="flex space-x-3">
          <span className="hover:underline cursor-pointer">{post.comments.length} Comments</span>
          <span className="hover:underline cursor-pointer">{post.shares} Shares</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-2 py-1 flex items-center justify-between">
        <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600 font-medium">
          <ThumbsUp className="w-5 h-5" />
          <span>Like</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors font-medium ${showComments ? 'bg-gray-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600 font-medium">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Embedded Comment Section */}
      {showComments && (
        <CommentSection comments={post.comments} postId={post.id} />
      )}
    </div>
  );
}
