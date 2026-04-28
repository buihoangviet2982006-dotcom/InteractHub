import { useState } from 'react';
import { Image, X } from 'lucide-react';
import { currentUser } from '../../data/mockData';
import { usePosts } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';

export function CreatePost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const { addPost } = usePosts();
  const { user } = useAuth();
  const displayUser = (user || currentUser) as any;
  
  const handlePost = async () => {
    const value = postText.trim();
    if (!value) return;
    await addPost(value, imageUrl.trim() || undefined);
    setPostText('');
    setImageUrl('');
    setShowImageInput(false);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Trigger Box */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 relative z-10 w-full">
        <div className="flex space-x-3 mb-3">
          <img src={displayUser.avatarUrl || 'https://i.pravatar.cc/150?u=a042581f4e29026024d'} alt={displayUser.fullName || displayUser.name} className="w-10 h-10 rounded-full" />
          <div 
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 hover:bg-gray-200 transition-colors cursor-pointer flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-gray-500">Bạn đang nghĩ gì, {displayUser.fullName || displayUser.name}?</span>
          </div>
        </div>
        
        <div className="border-t pt-3 flex items-center px-2">
          <button 
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors flex-1 sm:flex-none justify-center"
            onClick={() => {
              setIsModalOpen(true);
              setShowImageInput(true);
            }}
          >
            <Image className="w-6 h-6 text-green-500" />
            <span className="text-gray-600 font-medium text-sm">Ảnh/video</span>
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/80 sm:bg-black/40 sm:backdrop-blur-[2px] z-50 flex items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full h-full sm:h-auto sm:max-w-[500px] sm:rounded-xl sm:shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 relative">
              <h2 className="text-xl font-bold text-gray-900 w-full text-center">Tạo bài viết</h2>
              <button 
                className="absolute right-4 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 flex flex-col flex-1 sm:h-[400px]">
              <div className="flex items-center space-x-3 mb-4">
                <img src={displayUser.avatarUrl || 'https://i.pravatar.cc/150?u=a042581f4e29026024d'} alt={displayUser.fullName || displayUser.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight">{displayUser.fullName || displayUser.name}</h3>
                  <div className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-md mt-1 flex items-center w-max">
                    Bạn bè
                  </div>
                </div>
              </div>

              <textarea
                className="w-full text-xl sm:text-2xl placeholder-gray-500 outline-none resize-none flex-1 min-h-[120px]"
                placeholder={`Bạn đang nghĩ gì, ${displayUser.fullName || displayUser.name}?`}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                autoFocus
              />

              {showImageInput && (
                <div className="mb-4 animate-in slide-in-from-top-2 duration-200">
                  <input
                    type="text"
                    className="w-full p-2 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/30 text-sm"
                    placeholder="Dán link ảnh vào đây (ví dụ: https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    autoFocus={!postText}
                  />
                  {imageUrl && (
                    <div className="mt-2 relative group">
                      <img src={imageUrl} alt="Preview" className="max-h-40 w-full object-cover rounded-lg border shadow-sm" />
                      <button 
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-auto">
                {/* Add to your post */}
                <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between shadow-sm mb-4 mt-2">
                  <span className="font-semibold text-gray-900">Thêm vào bài viết</span>
                  <button 
                    onClick={() => setShowImageInput(!showImageInput)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${showImageInput ? 'bg-green-100' : 'hover:bg-gray-100'}`}
                  >
                    <Image className="w-6 h-6 text-green-500" />
                  </button>
                </div>

                {/* Post Action */}
                <button 
                  className={`w-full py-2 rounded-md font-semibold text-base transition-colors ${
                    postText.trim().length > 0 
                      ? 'bg-[#1b74e4] hover:bg-blue-600 text-white shadow-sm' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={postText.trim().length === 0}
                  onClick={handlePost}
                >
                  Đăng bài
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
