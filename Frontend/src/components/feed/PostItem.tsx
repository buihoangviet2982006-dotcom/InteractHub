import { useState } from 'react';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Trash2, Edit3, X } from 'lucide-react';
import type { Post } from '../../types';
import { CommentSection } from './CommentSection';
import { usePosts } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const [showComments, setShowComments] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImageUrl, setEditImageUrl] = useState(post.imageUrl ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const { toggleLike, deletePost, updatePost } = usePosts();
  const { user } = useAuth();
  const currentUserId = user?.id.toString();
  const isOwner = currentUserId === post.userId;

  const handleDelete = async () => {
    setShowActions(false);
    await deletePost(post.id);
  };

  const handleEdit = () => {
    setShowActions(false);
    setEditContent(post.content);
    setEditImageUrl(post.imageUrl ?? '');
    setShowEditModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      {/* Post Header */}
      <div className="relative p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={post.user.avatarUrl} alt={post.user.name} className="w-10 h-10 rounded-full" loading="lazy" />
          <div>
            <h4 className="font-semibold text-gray-900 leading-tight">{post.user.name}</h4>
            <span className="text-sm text-gray-500 leading-none">{post.timestamp}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowActions((prev) => !prev)}
            className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
            aria-label="Thao tác bài viết"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {showActions && isOwner && (
          <div className="fixed inset-0 z-30" onClick={() => setShowActions(false)} />
        )}

        {showActions && isOwner && (
          <div className="absolute right-4 top-14 z-40 w-48 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="font-semibold text-sm text-gray-800">Tùy chọn</span>
              <button type="button" onClick={() => setShowActions(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleEdit}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700"
            >
              <Edit3 className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa</span>
            </button>
          </div>
        )}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa bài viết</h3>
              <button type="button" onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <textarea
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Link ảnh (tùy chọn)"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
              />
              <div className="flex justify-end items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={isSaving || editContent.trim().length === 0}
                  onClick={async () => {
                    setIsSaving(true);
                    await updatePost(post.id, editContent.trim(), editImageUrl.trim() || undefined);
                    setIsSaving(false);
                    setShowEditModal(false);
                  }}
                  className="py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-800 text-base">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="w-full mt-2">
          <img src={post.imageUrl} alt="Nội dung bài viết" className="w-full h-auto object-cover max-h-[500px]" loading="lazy" />
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
          <span className="hover:underline cursor-pointer">{post.comments.length} bình luận</span>
          <span className="hover:underline cursor-pointer">{post.shares} chia sẻ</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-2 py-1 flex items-center justify-between">
        <button
          onClick={() => void toggleLike(post.id)}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium ${
            post.isLiked ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
          <span>{post.isLiked ? 'Đã thích' : 'Thích'}</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors font-medium ${showComments ? 'bg-gray-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Bình luận</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600 font-medium">
          <Share2 className="w-5 h-5" />
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Embedded Comment Section */}
      {showComments && (
        <CommentSection comments={post.comments} postId={post.id} />
      )}
    </div>
  );
}
