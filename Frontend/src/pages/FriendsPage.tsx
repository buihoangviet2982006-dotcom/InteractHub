import { Link } from 'react-router-dom';
import { useFriendships } from '../contexts/FriendshipContext';
import { Check, Users, X } from 'lucide-react';

export function FriendsPage() {
  const { friends, pendingRequests, suggestions, requestSent, sendRequest, acceptRequest, declineRequest, loading } = useFriendships();

  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  return (
    <div className="max-w-[980px] mx-auto py-6 px-4">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bạn bè của bạn</h1>
          <p className="text-gray-500 mt-2">Quản lý danh sách bạn bè, lời mời kết bạn và gợi ý kết nối.</p>
        </div>
        <Link
          to="/profile/me"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Users className="w-4 h-4" />
          Trang cá nhân
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Lời mời kết bạn</h2>
                <p className="text-sm text-gray-500">Những người gửi lời mời đến bạn.</p>
              </div>
              <span className="text-sm text-blue-600 font-semibold">{pendingRequests.length} mới</span>
            </div>
            {loading ? (
              <div className="text-gray-500">Đang tải...</div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-gray-500">Bạn hiện không có lời mời mới.</div>
            ) : (
              <ul className="space-y-4">
                {pendingRequests.map((request) => (
                  <li key={request.friendId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <img src={request.friendAvatarData || defaultAvatar} alt={request.friendName} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-gray-900">{request.friendName}</p>
                        <p className="text-sm text-gray-500">Lời mời ngày {new Date(request.createdAt || '').toLocaleDateString('vi-VN') || '...'} </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => void acceptRequest(request.friendId)}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Chấp nhận
                      </button>
                      <button
                        onClick={() => void declineRequest(request.friendId)}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Từ chối
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Bạn bè của bạn</h2>
                <p className="text-sm text-gray-500">Danh sách bạn bè đã chấp nhận.</p>
              </div>
              <span className="text-sm text-blue-600 font-semibold">{friends.length}</span>
            </div>
            {loading ? (
              <div className="text-gray-500">Đang tải...</div>
            ) : friends.length === 0 ? (
              <div className="text-gray-500">Bạn chưa có bạn bè nào.</div>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {friends.map((friend) => (
                  <li key={friend.friendId} className="rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                    <Link to={`/profile/${friend.friendId}`} className="flex items-center gap-3">
                      <img src={friend.friendAvatarData || defaultAvatar} alt={friend.friendName} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-gray-900">{friend.friendName}</p>
                        <p className="text-sm text-gray-500">Bạn bè</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Gợi ý kết bạn</h2>
                <p className="text-sm text-gray-500">Những người bạn có thể kết nối.</p>
              </div>
              <span className="text-sm text-blue-600 font-semibold">{suggestions.length}</span>
            </div>
            {suggestions.length === 0 ? (
              <div className="text-gray-500">Không có gợi ý mới.</div>
            ) : (
              <ul className="space-y-4">
                {suggestions.map((suggestion) => {
                  const isSent = requestSent.includes(suggestion.id);
                  return (
                    <li key={suggestion.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-3">
                      <Link to={`/profile/${suggestion.id}`} className="flex items-center gap-3 truncate">
                        <img src={suggestion.avatarData || defaultAvatar} alt={suggestion.name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="truncate">
                          <p className="font-semibold text-gray-900 truncate">{suggestion.name}</p>
                          <p className="text-sm text-gray-500 truncate">Xem trang cá nhân</p>
                        </div>
                      </Link>
                      <button
                        type="button"
                        disabled={isSent}
                        onClick={async () => {
                          if (!isSent) await sendRequest(suggestion.id);
                        }}
                        className={`text-sm font-semibold rounded-full px-3 py-2 transition-colors ${isSent ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        {isSent ? 'Đã gửi' : 'Kết bạn'}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
