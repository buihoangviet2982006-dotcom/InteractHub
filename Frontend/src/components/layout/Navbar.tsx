import { Search, Bell, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const { search, setSearch } = usePosts();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  const displayName = user ? user.fullName : 'Khách';
  const displayAvatar = user ? user.avatarData : defaultAvatar;

  return (
    <nav className="bg-[#1877f2] h-14 flex items-center justify-between px-4 sticky top-0 z-50 shadow-md">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center space-x-2 w-1/4 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-white p-1 rounded-full w-9 h-9 flex items-center justify-center">
          <span className="text-[#1877f2] font-black text-xl">i</span>
        </div>
        <h1 className="text-white text-xl font-bold tracking-tight hidden lg:block">InteractHub</h1>
      </div>

      {/* Search */}
      <div className="flex-1 flex justify-center px-4 max-w-[712px]">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (search.trim()) {
              navigate(`/search?q=${encodeURIComponent(search.trim())}`);
            }
          }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-1.5 border border-transparent rounded-full leading-5 bg-[#f0f2f5] placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-300 sm:text-sm transition-all"
              placeholder="Tìm kiếm nội dung..."
            />
          </form>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center justify-end space-x-2 sm:space-x-3 w-1/4">
        <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors hidden sm:block">
          <Bell className="h-6 w-6" />
        </button>
        <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors hidden sm:block">
          <MessageCircle className="h-6 w-6" />
        </button>
        
        {/* User Info & Logout */}
        <div className="flex items-center space-x-2">
          <button 
            type="button" 
            className="flex items-center space-x-2 focus:outline-none hover:bg-white/10 px-2 py-1 rounded-full transition-colors"
            onClick={() => user && navigate(`/profile/${user.id}`)}
          >
            <img
              className="h-8 w-8 rounded-full object-cover border border-white/20"
              src={displayAvatar || defaultAvatar}
              alt={displayName}
            />
            <span className="text-white text-sm font-semibold hidden md:block">{displayName}</span>
          </button>
          
          <button
            className="text-xs text-white border border-white/40 rounded-md px-2 py-1.5 hover:bg-white/20 font-medium transition-all"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
}
