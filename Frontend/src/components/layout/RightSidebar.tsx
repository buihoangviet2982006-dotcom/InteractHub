import { Link } from 'react-router-dom';
import { useFriendships } from '../../contexts/FriendshipContext';

export function RightSidebar() {
  const { friends, suggestions, requestSent, sendRequest, loading } = useFriendships();
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  const filteredSuggestions = suggestions.filter(
    (suggestion) => !friends.some((friend) => friend.friendId === suggestion.id),
  );

  return (
    <aside className="w-[300px] h-[calc(100vh-56px)] overflow-y-auto sticky top-14 py-4 px-2 hidden lg:block bg-[#f0f2f5]">
      
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
              <li key={friend.friendId}>
                <Link to={`/profile/${friend.friendId}`} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1 -mx-1 rounded-md transition-colors">
                  <div className="relative">
                    <img src={friend.friendAvatarData || defaultAvatar} alt={friend.friendName} className="w-8 h-8 rounded-full object-cover" />
                  </div>
                  <span className="font-medium text-gray-700 text-sm">{friend.friendName}</span>
                </Link>
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
                  <Link to={`/profile/${suggestion.id}`} className="flex items-center space-x-3 cursor-pointer hover:underline decoration-blue-500 underline-offset-2">
                    <img src={suggestion.avatarData || defaultAvatar} alt={suggestion.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-medium text-gray-700 text-sm">{suggestion.name}</span>
                  </Link>
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
