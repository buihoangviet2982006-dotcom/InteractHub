import type { Comment } from '../../types';
import { currentUser } from '../../data/mockData';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { usePosts } from '../../contexts/PostContext';

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
}

export function CommentSection({ comments, postId }: CommentSectionProps) {
  const [content, setContent] = useState('');
  const { addComment } = usePosts();

  const handleSubmit = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const value = content.trim();
    if (!value) return;
    await addComment(postId, value);
    setContent('');
  };

  return (
    <div className="border-t p-4 bg-gray-50/50">
      {/* Existing Comments Filter/Count */}
      {comments.length > 0 && (
        <div className="mb-4">
          <span className="text-gray-500 font-medium text-sm hover:underline cursor-pointer">
            Xem các bình luận trước
          </span>
        </div>
      )}

      {/* Render Comments */}
      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-2">
            <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-8 h-8 rounded-full mt-1" />
            <div className="flex-1">
              <div className="bg-gray-100 rounded-2xl px-4 py-2 inline-block">
                <span className="font-semibold text-sm text-gray-900 block">{comment.user.name}</span>
                <span className="text-gray-800 text-sm">{comment.content}</span>
              </div>
              <div className="flex items-center space-x-3 mt-1 ml-2 text-xs text-gray-500 font-medium">
                <button className="hover:underline">Thích</button>
                <button className="hover:underline">Trả lời</button>
                <span>{comment.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write a comment */}
      <div className="flex space-x-2 items-start mt-4">
        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
        <div className="flex-1 relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => void handleSubmit(e)}
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none placeholder-gray-500 focus:bg-gray-200 transition-colors"
            placeholder="Viết bình luận..."
          />
          <div className="text-xs text-gray-400 mt-1 ml-2">Nhấn Enter để đăng.</div>
        </div>
      </div>
    </div>
  );
}
