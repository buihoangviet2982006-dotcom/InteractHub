import { Search, Bell, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { currentUser } from '../../data/mockData';
import { usePosts } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const { search, setSearch } = usePosts();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const displayUser = user || currentUser;

  return (
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
        <button className="flex focus:outline-none">
          <img
            className="h-9 w-9 rounded-full object-cover border-2 border-transparent hover:border-white transition-colors"
            src={displayUser.avatarUrl || 'https://i.pravatar.cc/150?u=a042581f4e29026024d'}
            alt={displayUser.fullName || displayUser.name}
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
  );
}
