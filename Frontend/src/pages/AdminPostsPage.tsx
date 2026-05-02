import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchPosts, deletePostAsAdmin, fetchComments } from '../services/postsApi';
import type { Post, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Layers, Trash2, ShieldAlert } from 'lucide-react';

export function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [cursorId, setCursorId] = useState<number | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedPostId) {
      loadComments(selectedPostId);
    } else {
      setComments([]);
    }
  }, [selectedPostId]);

  const loadComments = async (postId: string) => {
    setIsLoadingComments(true);
    try {
      const data = await fetchComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Lỗi tải bình luận:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // For infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasNextPage]);

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      navigate('/');
      return;
    }
    loadInitialPosts();
  }, [user, navigate]);

  const loadInitialPosts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPosts(undefined, 20);
      setPosts(data.items);
      setNextCursor(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!cursorId || !hasNextPage || isLoading) return;
    try {
      setIsLoading(true);
      const data = await fetchPosts(cursorId, 20);
      setPosts(prev => [...prev, ...data.items]);
      setNextCursor(data);
    } catch (error) {
      console.error('Error fetching more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setNextCursor = (data: any) => {
    setHasNextPage(data.hasNextPage);
    if (data.nextCursorId !== null && data.nextCursorId !== undefined) {
      setCursorId(data.nextCursorId);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động này sẽ gửi thông báo đến tác giả.')) {
      return;
    }

    try {
      await deletePostAsAdmin(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      if (selectedPostId === postId) setSelectedPostId(null);
      alert('Đã xóa bài viết thành công.');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Lỗi khi xóa bài viết.');
    }
  };

  const selectedPost = posts.find(p => p.id === selectedPostId);

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      {/* Cột Danh sách Bài viết (Master) */}
      <div className="w-[35%] min-w-[320px] bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10">
        <div className="px-5 py-4 border-b border-gray-100 bg-white sticky top-0">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="text-indigo-500" size={24} />
            Tất cả bài viết
          </h2>
          <p className="text-sm text-gray-500 mt-1">Giám sát mọi nội dung trên hệ thống.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {posts.length === 0 && !isLoading ? (
            <div className="text-center p-8 text-gray-500">
              <p>Không có bài viết nào.</p>
            </div>
          ) : (
            posts.map((post, index) => {
              const isLast = index === posts.length - 1;
              return (
                <div
                  ref={isLast ? lastPostElementRef : null}
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedPostId === post.id
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-500/20'
                      : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {post.user.avatarData ? (
                          <img src={post.user.avatarData} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                            {post.user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{post.user.name}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {post.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.content || (post.imageData ? '[Hình ảnh]' : '')}
                  </p>
                </div>
              );
            })
          )}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
          )}
        </div>
      </div>

      {/* Cột Chi tiết (Detail) */}
      <div className="flex-1 bg-[#f8f9fa] overflow-y-auto">
        {selectedPost ? (
          <div className="max-w-3xl mx-auto p-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              <div className="px-6 py-4 border-b border-gray-100 bg-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chi tiết bài viết</h3>
                  <p className="text-xs text-gray-500">ID: {selectedPost.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-4 text-sm text-gray-500 mr-2 border-r border-gray-200 pr-4">
                    <span>👍 {selectedPost.likes}</span>
                    <span>💬 {selectedPost.comments.length}</span>
                  </div>
                  <button
                    onClick={() => handleDeletePost(selectedPost.id)}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-500/20 shadow-sm transition-all"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa bài viết
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                    {selectedPost.user.avatarData ? (
                      <img src={selectedPost.user.avatarData} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-xl">
                        {selectedPost.user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">{selectedPost.user.name}</p>
                    <p className="text-xs text-gray-500">{selectedPost.timestamp}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  {selectedPost.content ? (
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedPost.content}
                    </p>
                  ) : null}

                  {selectedPost.imageData && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 bg-black/5 flex justify-center">
                      <img
                        src={selectedPost.imageData}
                        alt="Đính kèm"
                        className="max-h-[500px] object-contain w-full"
                      />
                    </div>
                  )}
                </div>

                {/* Phần bình luận */}
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Bình luận ({comments.length})</h4>
                  {isLoadingComments ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {comment.user.avatarData ? (
                              <img src={comment.user.avatarData} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-xs font-bold text-gray-500">
                                {comment.user.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-xl rounded-tl-none p-3 border border-gray-100">
                              <p className="text-sm font-semibold text-gray-900">{comment.user.name}</p>
                              <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                            </div>
                            <span className="text-[11px] text-gray-400 mt-1 ml-1 block">{comment.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Chưa có bình luận nào.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
              <Layers size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-600">Quản lý bài viết</h3>
            <p className="text-sm mt-2 max-w-sm text-center">
              Chọn một bài viết bên trái để kiểm tra nội dung và quản lý.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
