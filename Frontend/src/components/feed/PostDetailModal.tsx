import { X, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import type { Post } from '../../types';
import { CommentSection } from './CommentSection';
import { usePosts } from '../../contexts/PostContext';
import { Link } from 'react-router-dom';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
}

export function PostDetailModal({ post, onClose }: PostDetailModalProps) {
  const { toggleLike } = usePosts();
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Close button (top right of screen for desktop) */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-[110]"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="bg-white w-full max-w-[1200px] h-full sm:h-[90vh] sm:rounded-xl shadow-2xl flex flex-col sm:flex-row overflow-hidden relative">
        {/* Left Side: Image (Only if exists) */}
        {post.imageData && (
          <div className="flex-1 bg-black flex items-center justify-center border-r">
            <img 
              src={post.imageData} 
              alt="Post content" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}

        {/* Right Side: Info and Comments */}
        <div className={`flex flex-col ${post.imageData ? 'w-full sm:w-[400px] md:w-[450px]' : 'w-full'} h-full bg-white`}>
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to={`/profile/${post.userId}`} onClick={onClose}>
                <img 
                  src={post.user.avatarData || defaultAvatar} 
                  alt={post.user.name} 
                  className="w-10 h-10 rounded-full object-cover" 
                />
              </Link>
              <div>
                <Link to={`/profile/${post.userId}`} onClick={onClose} className="font-bold text-gray-900 hover:underline">
                  {post.user.name}
                </Link>
                <div className="text-sm text-gray-500">{post.timestamp}</div>
              </div>
            </div>
            {/* Close button for mobile inside the modal header */}
            <button onClick={onClose} className="sm:hidden text-gray-500 p-2">
               <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content & Scrollable Comments Area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {/* Post content in detail */}
            <div className="p-4 text-gray-800 text-lg whitespace-pre-wrap">
              {(() => {
                if (!post.content) return null;
                const parts = post.content.split(/(#\w+)/g);
                return parts.map((part, index) => {
                  if (part.startsWith('#')) {
                    return (
                      <Link
                        key={index}
                        to={`/search?q=${encodeURIComponent(part)}`}
                        className="text-blue-600 hover:underline font-bold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {part}
                      </Link>
                    );
                  }
                  return part;
                });
              })()}
            </div>

            {/* Stats */}
            <div className="px-4 py-3 border-t border-b flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="bg-blue-500 p-1 rounded-full text-white">
                  <ThumbsUp className="w-3 h-3 fill-current" />
                </div>
                <span>{post.likes}</span>
              </div>
              <div className="flex space-x-3">
                <span>{post.comments.length} bình luận</span>
                <span>{post.shares} chia sẻ</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-2 py-1 flex items-center justify-between border-b">
              <button
                onClick={() => void toggleLike(post.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md hover:bg-gray-100 transition-colors font-semibold ${
                  post.isLiked ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>Thích</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600 font-semibold">
                <MessageSquare className="w-5 h-5" />
                <span>Bình luận</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600 font-semibold">
                <Share2 className="w-5 h-5" />
                <span>Chia sẻ</span>
              </button>
            </div>

            {/* Comments List */}
            <div className="p-0">
               <CommentSection comments={post.comments} postId={post.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
