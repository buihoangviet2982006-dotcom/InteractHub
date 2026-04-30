import { Users, MessageSquare, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function LeftSidebar() {
  const { user } = useAuth();
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  const displayName = user ? user.fullName : 'Người dùng';
  const displayAvatar = user ? user.avatarData : defaultAvatar;

  return (
    <aside className="w-[300px] h-[calc(100vh-56px)] overflow-y-auto sticky top-14 py-4 px-2 hidden lg:block bg-[#f0f2f5]">
      <div className="bg-white rounded-lg shadow-sm p-4 h-full">
        <ul className="space-y-1 content-start">
          <li>
            <NavLink 
              to={user ? `/profile/${user.id}` : '#'} 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-md transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <img src={displayAvatar || defaultAvatar} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
              <span className="font-medium">{displayName}</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-md transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Users className="w-6 h-6" />
              <span>Bảng tin</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/hashtags" 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-md transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <MessageSquare className="w-6 h-6" />
              <span>Thẻ hashtag</span>
            </NavLink>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 transition-colors text-gray-700 font-medium">
              <Settings className="w-6 h-6" />
              <span>Cài đặt</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
