import { Link } from 'react-router-dom';
import { useFriendships } from '../../contexts/FriendshipContext';
import { useState, useEffect } from 'react';
import { hashtagsApi, type TrendingHashtag } from '../../services/hashtagsApi';
import { TrendingUp } from 'lucide-react';

export function RightSidebar() {
  const { friends, suggestions, pendingRequests, requestSent, sendRequest, acceptRequest, declineRequest, loading } = useFriendships();
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  const filteredSuggestions = suggestions.filter(
    (suggestion) => !friends.some((friend) => friend.friendId === suggestion.id),
  );

  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await hashtagsApi.getTrending(5);
        setTrendingHashtags(data);
      } catch (error) {
        console.error('Failed to fetch trending hashtags:', error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <aside className="w-[300px] h-[calc(100vh-56px)] overflow-y-auto sticky top-14 py-4 px-2 hidden lg:block bg-[#f0f2f5]">
      
      {/* Trending Hashtags */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 font-semibold">Xu hướng cho bạn</h3>
          <Link to="/hashtags" className="text-blue-600 text-xs hover:underline">Xem tất cả</Link>
        </div>
        <div className="space-y-3">
          {trendingHashtags.length === 0 ? (
            <p className="text-gray-500 text-xs italic">Chưa có xu hướng mới</p>
          ) : (
            trendingHashtags.map((tag) => (
              <Link 
                key={tag.id} 
                to={`/search?q=${encodeURIComponent(tag.name)}`}
                className="block group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-blue-600 font-bold text-sm group-hover:underline">{tag.name}</span>
                    <span className="text-gray-500 text-[11px]">{tag.postCount} bài viết</span>
                  </div>
                  <TrendingUp className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="text-gray-900 font-semibold mb-3">Lời mời kết bạn</h3>
          <ul className="space-y-4">
            {pendingRequests.map((request) => (
              <li key={request.friendId} className="space-y-2">
                <div className="flex items-center space-x-3">
                  <img src={request.friendAvatarData || defaultAvatar} alt={request.friendName} className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-medium text-gray-700 text-sm truncate">{request.friendName}</span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => acceptRequest(request.friendId)}
                    className="flex-1 bg-blue-600 text-white text-xs font-bold py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Chấp nhận
                  </button>
                  <button 
                    onClick={() => declineRequest(request.friendId)}
                    className="flex-1 bg-gray-200 text-gray-800 text-xs font-bold py-1.5 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Friends List */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 font-semibold">Bạn bè của bạn</h3>
          <Link to="/friends" className="text-blue-600 text-xs hover:underline">
            Xem tất cả
          </Link>
        </div>
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
