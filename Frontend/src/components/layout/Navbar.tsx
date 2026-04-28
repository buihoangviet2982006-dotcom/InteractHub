import { Search, Bell, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { currentUser } from '../../data/mockData';
import { usePosts } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';

type DisplayUser = {
  avatarUrl?: string;
  name: string;
};

export function Navbar() {
  const { search, setSearch } = usePosts();
  const { logout, user, updateAvatar } = useAuth();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState(user?.avatarUrl ?? '');
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setAvatarUrlInput(user?.avatarUrl ?? '');
  }, [user]);

  const displayUser: DisplayUser = user
    ? { avatarUrl: user.avatarUrl, name: user.fullName }
    : currentUser;

  return (
    <>
      <nav className="bg-[#1877f2] h-14 flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center space-x-2 w-1/4">
        <div className="bg-white p-1 rounded-full w-9 h-9 flex items-center justify-center">
          <span className="text-[#1877f2] font-black text-xl">i</span>
        </div>
        <h1 className="text-white text-xl font-bold tracking-tight hidden lg:block">InteractHub</h1>
      </div>

      {/* Search - Centered and aligned with Feed width (680px) */}
      <div className="flex-1 flex justify-center px-4 max-w-[712px]"> {/* 680px + padding */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-9 pr-3 py-1.5 border border-transparent rounded-full leading-5 bg-[#f0f2f5] placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-300 sm:text-sm transition-all"
            placeholder="Tìm bài viết..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex-shrink-0 flex items-center justify-end space-x-2 sm:space-x-4 w-1/4">
        <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
          <Bell className="h-6 w-6" />
        </button>
        <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
          <MessageCircle className="h-6 w-6" />
        </button>
        <button type="button" className="flex focus:outline-none" onClick={() => setShowAvatarModal(true)}>
          <img
            className="h-9 w-9 rounded-full object-cover border-2 border-transparent hover:border-white transition-colors"
            src={displayUser.avatarUrl || 'https://i.pravatar.cc/150?u=a042581f4e29026024d'}
            alt={displayUser.name}
            loading="lazy"
          />
        </button>
        <button
          className="text-xs text-white border border-white/40 rounded-md px-2 py-1 hover:bg-white/10"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Đăng xuất
        </button>
      </div>
    </nav>

    {showAvatarModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b">
            <h2 className="text-lg font-semibold">Cập nhật ảnh đại diện</h2>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800"
              onClick={() => {
                setShowAvatarModal(false);
                setAvatarError(null);
              }}
            >
              Đóng
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <img
                className="h-20 w-20 rounded-full object-cover border"
                src={avatarUrlInput || displayUser.avatarUrl || 'https://i.pravatar.cc/150?u=a042581f4e29026024d'}
                alt="Avatar preview"
              />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">URL ảnh đại diện</label>
                <input
                  type="url"
                  value={avatarUrlInput}
                  onChange={(e) => setAvatarUrlInput(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
            {avatarError && <p className="text-sm text-red-600">{avatarError}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setShowAvatarModal(false);
                setAvatarError(null);
              }}
            >
              Hủy
            </button>
            <button
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              disabled={!avatarUrlInput || isSavingAvatar}
              onClick={async () => {
                const trimmedAvatarUrl = avatarUrlInput.trim();
                if (!trimmedAvatarUrl) {
                  setAvatarError('Vui lòng nhập URL ảnh');
                  return;
                }

                const validStart =
                  trimmedAvatarUrl.startsWith('http://') ||
                  trimmedAvatarUrl.startsWith('https://') ||
                  trimmedAvatarUrl.startsWith('data:');
                if (!validStart) {
                  setAvatarError('URL ảnh phải bắt đầu bằng http://, https:// hoặc data:');
                  return;
                }

                try {
                  setAvatarError(null);
                  setIsSavingAvatar(true);
                  await updateAvatar(trimmedAvatarUrl);
                  setShowAvatarModal(false);
                } catch (error) {
                  console.error('Avatar update error:', error);
                  const axiosError = error as AxiosError<{ message: string }>;
                  console.error('Avatar update response data:', axiosError.response?.data);
                  console.error('Avatar update response status:', axiosError.response?.status);
                  const message = axiosError.response?.data?.message || (error instanceof Error ? error.message : 'Không thể cập nhật ảnh đại diện');
                  setAvatarError(message);
                } finally {
                  setIsSavingAvatar(false);
                }
              }}
            >
              {isSavingAvatar ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
