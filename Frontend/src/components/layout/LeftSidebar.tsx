import { Users, MessageSquare, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { currentUser } from '../../data/mockData';

import { useAuth } from '../../contexts/AuthContext';

type DisplayUser = {
  avatarUrl?: string;
  name: string;
};

export function LeftSidebar() {
  const { user } = useAuth();
  const displayUser: DisplayUser = user
    ? { avatarUrl: user.avatarUrl, name: user.fullName }
    : currentUser;

  return (
    <aside className="w-[300px] h-[calc(100vh-56px)] overflow-y-auto sticky top-14 py-4 px-2 hidden lg:block bg-[#f0f2f5]">
      <div className="bg-white rounded-lg shadow-sm p-4 h-full">
        <ul className="space-y-1 content-start">
          <li>
            <NavLink to={user ? `/profile/${user.id}` : '#'} className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
              <img src={displayUser.avatarUrl || 'https://i.pravatar.cc/150?u=a042581f4e29026024d'} alt={displayUser.name} className="w-8 h-8 rounded-full" />
              <span className="font-medium text-gray-900">{displayUser.name}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className="flex items-center space-x-3 p-3 rounded-md bg-blue-50 text-blue-600 font-medium">
              <Users className="w-6 h-6" />
              <span>Bảng tin</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/hashtags" className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 transition-colors text-gray-700 font-medium">
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
