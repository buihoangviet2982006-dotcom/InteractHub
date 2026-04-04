import { friendsOnline, suggestions } from '../../data/mockData';

export function RightSidebar() {
  return (
    <aside className="w-[300px] h-[calc(100vh-56px)] overflow-y-auto sticky top-14 py-4 px-2 hidden lg:block bg-[#f0f2f5]">
      
      {/* Friends Online */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h3 className="text-gray-900 font-semibold mb-3">Friends Online</h3>
        <ul className="space-y-3">
          {friendsOnline.map((friend, index) => (
            <li key={friend.id + index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1 -mx-1 rounded-md transition-colors">
              <div className="relative">
                <img src={friend.avatarUrl} alt={friend.name} className="w-8 h-8 rounded-full" />
                {friend.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <span className="font-medium text-gray-700 text-sm">{friend.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-gray-900 font-semibold mb-3">Suggestions</h3>
        <ul className="space-y-4">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img src={suggestion.avatarUrl} alt={suggestion.name} className="w-8 h-8 rounded-full" />
                <span className="font-medium text-gray-700 text-sm">{suggestion.name}</span>
              </div>
              <button className="text-sm text-blue-600 font-medium border border-blue-600 rounded-md px-2 py-1 hover:bg-blue-50 transition-colors">
                Add Friend
              </button>
            </li>
          ))}
        </ul>
      </div>

    </aside>
  );
}
