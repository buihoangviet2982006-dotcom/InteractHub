import { friendsOnline, suggestions } from '../../data/mockData';
import { useFriendships } from '../../contexts/FriendshipContext';

export function RightSidebar() {
  const { friends, requestSent, sendRequest, loading } = useFriendships();
  const filteredSuggestions = suggestions.filter(
    (suggestion) => !friends.some((friend) => friend.friendId === suggestion.id),
  );

  return (
    <aside className="w-[300px] h-[calc(100vh-56px)] overflow-y-auto sticky top-14 py-4 px-2 hidden lg:block bg-[#f0f2f5]">
      
      {/* Friends Online */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h3 className="text-gray-900 font-semibold mb-3">Bạn bè đang trực tuyến</h3>
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

      {/* Friends List */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h3 className="text-gray-900 font-semibold mb-3">Bạn bè của bạn</h3>
        {loading ? (
          <div className="text-gray-500 text-sm">Đang tải bạn bè...</div>
        ) : friends.length === 0 ? (
          <div className="text-gray-500 text-sm">Bạn chưa có bạn bè nào.</div>
        ) : (
          <ul className="space-y-3">
            {friends.map((friend) => (
              <li key={friend.friendId} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1 -mx-1 rounded-md transition-colors">
                <div className="relative">
                  <img src={friend.friendAvatarUrl || `https://i.pravatar.cc/150?u=${friend.friendId}`} alt={friend.friendName} className="w-8 h-8 rounded-full" />
                </div>
                <span className="font-medium text-gray-700 text-sm">{friend.friendName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-gray-900 font-semibold mb-3">Gợi ý</h3>
        {filteredSuggestions.length === 0 ? (
          <div className="text-gray-500 text-sm">Không có gợi ý mới.</div>
        ) : (
          <ul className="space-y-4">
            {filteredSuggestions.map((suggestion) => {
              const isSent = requestSent.includes(suggestion.id);
              return (
                <li key={suggestion.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <img src={suggestion.avatarUrl} alt={suggestion.name} className="w-8 h-8 rounded-full" />
                    <span className="font-medium text-gray-700 text-sm">{suggestion.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await sendRequest(suggestion.id);
                      } catch {
                        // ignore, error handled by context
                      }
                    }}
                    disabled={isSent}
                    className={`text-sm font-medium border rounded-md px-2 py-1 transition-colors ${
                      isSent
                        ? 'text-gray-500 border-gray-300 bg-gray-100 cursor-not-allowed'
                        : 'text-blue-600 border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {isSent ? 'Đã gửi' : 'Kết bạn'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

    </aside>
  );
}
