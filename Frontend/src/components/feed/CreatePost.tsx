import { useState } from 'react';
import { Image, X } from 'lucide-react';
import { currentUser } from '../../data/mockData';
import { usePosts } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
import { uploadImage } from '../../services/postsApi';

export function CreatePost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const { addPost } = usePosts();
  const { user } = useAuth();
  const displayUser = (user || currentUser) as any;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePost = async () => {
    const value = postText.trim();
    if (!value && !selectedFile && !imageUrl) return;

    setIsUploading(true);
    let finalImageUrl = imageUrl.trim() || undefined;

    try {
      if (selectedFile) {
        const uploadRes = await uploadImage(selectedFile);
        finalImageUrl = uploadRes.url;
      }

      await addPost(value, finalImageUrl);
      setPostText('');
      setImageUrl('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowImageInput(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      alert('Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
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
                  <div className="space-y-3">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition-colors bg-gray-50 group relative">
                      {previewUrl ? (
                        <div className="relative w-full">
                          <img src={previewUrl} alt="Preview" className="max-h-[200px] w-full object-contain rounded-lg" />
                          <button 
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl(null);
                            }}
                            className="absolute -top-2 -right-2 bg-gray-800 text-white p-1.5 rounded-full shadow-md hover:bg-gray-900 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center cursor-pointer w-full py-4">
                          <div className="bg-gray-200 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
                            <Image className="w-8 h-8 text-gray-600 group-hover:text-blue-600" />
                          </div>
                          <span className="mt-2 text-sm font-semibold text-gray-700">Thêm ảnh</span>
                          <span className="text-xs text-gray-500">hoặc kéo và thả</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                      )}
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Hoặc dán URL</span>
                      </div>
                    </div>

                    <input
                      type="text"
                      className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                      placeholder="Dán link ảnh vào đây..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
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
                    (postText.trim().length > 0 || selectedFile || imageUrl) && !isUploading
                      ? 'bg-[#1b74e4] hover:bg-blue-600 text-white shadow-sm' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={(postText.trim().length === 0 && !selectedFile && !imageUrl) || isUploading}
                  onClick={handlePost}
                >
                  {isUploading ? 'Đang đăng...' : 'Đăng bài'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
