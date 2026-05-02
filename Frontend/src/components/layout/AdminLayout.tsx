import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Flag, LogOut, LayoutDashboard, ShieldAlert, Layers } from 'lucide-react';

export function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1c1e21] text-gray-300 flex flex-col shadow-xl flex-shrink-0">
        <div className="h-16 flex items-center px-6 bg-[#16181b] border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 text-white p-1.5 rounded-lg flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
            <span className="text-white text-lg font-bold tracking-wide">Admin Portal</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3">
          <div className="mb-6 px-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quản lý</p>
            <nav className="space-y-1">
              <NavLink
                to="/admin/reports"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                      : 'hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Flag size={18} />
                Quản lý báo cáo
              </NavLink>
              <NavLink
                to="/admin/posts"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30'
                      : 'hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Layers size={18} />
                Quản lý bài viết
              </NavLink>
            </nav>
          </div>
          
          <div className="px-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Ứng dụng</p>
            <nav className="space-y-1">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm hover:bg-white/5 hover:text-white text-gray-300"
              >
                <LayoutDashboard size={18} />
                Về trang chính
              </button>
            </nav>
          </div>
        </div>

        <div className="p-4 bg-[#16181b] border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img
              src={user?.avatarData || 'https://ui-avatars.com/api/?name=Admin&background=random'}
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full border border-gray-700"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50">
        <Outlet />
      </main>
    </div>
  );
}
