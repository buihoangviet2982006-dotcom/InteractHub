import { Users, MessageSquare, Settings } from 'lucide-react';
import { currentUser } from '../../data/mockData';

export function LeftSidebar() {
  return (
    <aside className="w-[300px] h-[calc(100vh-56px)] overflow-y-auto sticky top-14 py-4 px-2 hidden lg:block bg-[#f0f2f5]">
      <div className="bg-white rounded-lg shadow-sm p-4 h-full">
        <ul className="space-y-1 content-start">
          <li>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
              <span className="font-medium text-gray-900">{currentUser.name}</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-md bg-blue-50 text-blue-600 font-medium">
              <Users className="w-6 h-6" />
              <span>Friends</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 transition-colors text-gray-700 font-medium">
              <MessageSquare className="w-6 h-6" />
              <span>Messages</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 transition-colors text-gray-700 font-medium">
              <Settings className="w-6 h-6" />
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
