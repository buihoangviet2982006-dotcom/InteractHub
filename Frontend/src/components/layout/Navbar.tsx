import { Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { usePosts } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

export function Navbar() {
  const { search, setSearch } = usePosts();
  const { logout, user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const clickedInNotifications = notificationsRef.current?.contains(event.target as Node);
      const clickedInUserMenu = userMenuRef.current?.contains(event.target as Node);

      if (!clickedInNotifications && !clickedInUserMenu) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user ? user.fullName : 'Khách';
  const displayAvatar = user ? user.avatarData : defaultAvatar;

  return (
    <nav className="bg-[#1877f2] h-14 flex items-center justify-between px-4 sticky top-0 z-50 shadow-md">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center space-x-2 w-1/4 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-white p-1 rounded-full w-9 h-9 flex items-center justify-center">
          <span className="text-[#1877f2] font-black text-xl">S</span>
        </div>
        <h1 className="text-white text-xl font-bold tracking-tight hidden lg:block">Social Media</h1>
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
        <div className="relative" ref={notificationsRef}>
          <button
            className="text-white hover:bg-white/10 p-2 rounded-full transition-colors hidden sm:block relative"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowUserMenu(false);
            }}
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#1877f2]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[60]">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-900">Thông báo</h3>
                <span
                  className="text-xs text-blue-600 font-medium cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                >
                  Đánh dấu tất cả là đã đọc
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-sm">Không có thông báo nào</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {notifications.map((notif) => (
                      <li
                        key={notif.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                        onClick={() => {
                          if (!notif.isRead) markAsRead(notif.id);
                          setShowNotifications(false);
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`mt-1 p-2 rounded-full ${notif.type === 'Like' ? 'bg-blue-100 text-blue-600' : notif.type === 'Comment' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                            <Bell className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                              {notif.content}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-1">
                              {new Date(notif.createdAt).toLocaleString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit'
                              })}
                            </p>
                          </div>
                          {!notif.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="p-2 border-t border-gray-100 text-center bg-gray-50">
                <button className="text-xs text-blue-600 font-bold hover:underline">Xem tất cả</button>
              </div>
            </div>
          )}
        </div>
        <button
          className="text-white hover:bg-white/10 px-3 py-1 rounded-full transition-colors hidden sm:inline-flex items-center"
          onClick={() => navigate('/friends')}
        >
          Bạn bè
        </button>

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            className="flex items-center focus:outline-none hover:bg-white/10 p-2 rounded-full transition-colors"
            onClick={() => {
              setShowUserMenu((prev) => !prev);
              setShowNotifications(false);
            }}
          >
            <img
              className="h-8 w-8 rounded-full object-cover border border-white/20"
              src={displayAvatar || defaultAvatar}
              alt={displayName}
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-[60]">
              <button
                type="button"
                className="flex items-center gap-3 w-full text-left px-4 py-4 border-b border-gray-100 hover:bg-gray-50"
                onClick={() => {
                  setShowUserMenu(false);
                  if (user) navigate(`/profile/${user.id}`);
                }}
              >
                <img
                  className="h-12 w-12 rounded-full object-cover border border-gray-200"
                  src={displayAvatar || defaultAvatar}
                  alt={displayName}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                  <p className="text-xs text-gray-500">Trang cá nhân</p>
                </div>
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-800 font-medium transition-colors"
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
              >
                Cài đặt
              </button>
              {user?.role === 'Admin' && (
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600 font-medium transition-colors border-t border-gray-100"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/admin/reports');
                  }}
                >
                  Quản lý báo cáo
                </button>
              )}
              <button
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-800 font-medium transition-colors border-t border-gray-100"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
