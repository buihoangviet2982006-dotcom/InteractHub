import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFriendships } from '../contexts/FriendshipContext';
import { UserPlus, UserCheck } from 'lucide-react';

type Tab = 'home' | 'requests' | 'suggestions' | 'all';

export function FriendsPage() {
  const { friends, pendingRequests, suggestions, requestSent, sendRequest, acceptRequest, declineRequest, loading } = useFriendships();
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  const renderTab = (id: Tab, label: string) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition-colors ${isActive
            ? 'text-blue-600 border-b-[3px] border-blue-600 rounded-t-sm'
            : 'text-gray-500 hover:bg-gray-100 rounded-lg'
          }`}
      >
        {label}
      </button>
    );
  };

  const renderFriendRequests = () => (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Lời mời kết bạn</h2>
        {activeTab === 'home' && (
          <button onClick={() => setActiveTab('requests')} className="text-blue-600 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors">
            Xem tất cả
          </button>
        )}
      </div>
      {pendingRequests.length === 0 ? (
        <div className="text-gray-500 bg-white p-6 rounded-xl border border-gray-200 text-center">Bạn không có lời mời kết bạn nào.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {pendingRequests.map((request) => (
            <div key={request.friendId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <Link to={`/profile/${request.friendId}`}>
                <img src={request.friendAvatarData || defaultAvatar} alt={request.friendName} className="w-full aspect-square object-cover" />
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/profile/${request.friendId}`} className="flex-1">
                  <h3 className="font-semibold text-gray-900 truncate hover:underline">{request.friendName}</h3>
                </Link>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    onClick={() => void acceptRequest(request.friendId)}
                    className="w-full bg-blue-600 text-white rounded-lg py-1.5 font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Xác nhận
                  </button>
                  <button
                    onClick={() => void declineRequest(request.friendId)}
                    className="w-full bg-gray-200 text-gray-800 rounded-lg py-1.5 font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const renderSuggestions = () => (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Những người bạn có thể biết</h2>
        {activeTab === 'home' && (
          <button onClick={() => setActiveTab('suggestions')} className="text-blue-600 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors">
            Xem tất cả
          </button>
        )}
      </div>
      {suggestions.length === 0 ? (
        <div className="text-gray-500 bg-white p-6 rounded-xl border border-gray-200 text-center">Không có gợi ý kết bạn nào.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {suggestions.map((suggestion) => {
            const isSent = requestSent.includes(suggestion.id);
            return (
              <div key={suggestion.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <Link to={`/profile/${suggestion.id}`}>
                  <img src={suggestion.avatarData || defaultAvatar} alt={suggestion.name} className="w-full aspect-square object-cover" />
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <Link to={`/profile/${suggestion.id}`} className="flex-1">
                    <h3 className="font-semibold text-gray-900 truncate hover:underline">{suggestion.name}</h3>
                  </Link>
                  <div className="mt-3">
                    <button
                      disabled={isSent}
                      onClick={async () => {
                        if (!isSent) await sendRequest(suggestion.id);
                      }}
                      className={`w-full flex items-center justify-center gap-2 rounded-lg py-1.5 font-semibold transition-colors ${isSent ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                    >
                      {isSent ? 'Đã gửi lời mời' : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Thêm bạn bè
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );

  const renderAllFriends = () => (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Tất cả bạn bè</h2>
      </div>
      {friends.length === 0 ? (
        <div className="text-gray-500 bg-white p-6 rounded-xl border border-gray-200 text-center">Bạn chưa có bạn bè nào.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <div key={friend.friendId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <Link to={`/profile/${friend.friendId}`}>
                <img src={friend.friendAvatarData || defaultAvatar} alt={friend.friendName} className="w-full aspect-square object-cover" />
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/profile/${friend.friendId}`} className="flex-1">
                  <h3 className="font-semibold text-gray-900 truncate hover:underline">{friend.friendName}</h3>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const renderContent = () => {
    if (loading) {
      return <div className="text-gray-500 flex justify-center py-10">Đang tải...</div>;
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            {renderFriendRequests()}
            <hr className="border-gray-200" />
            {renderSuggestions()}
          </div>
        );
      case 'requests':
        return renderFriendRequests();
      case 'suggestions':
        return renderSuggestions();
      case 'all':
        return renderAllFriends();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bạn bè</h1>
        <div className="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
          <Link to="/profile/me">
            <UserCheck className="w-5 h-5 text-gray-700" />
          </Link>
        </div>
      </div>

      {/* Horizontal Tabs */}
      <div className="px-4 border-b border-gray-200 flex gap-2 overflow-x-auto no-scrollbar">
        {renderTab('home', 'Trang chủ')}
        {renderTab('requests', 'Lời mời kết bạn')}
        {renderTab('suggestions', 'Gợi ý')}
        {renderTab('all', 'Tất cả bạn bè')}
      </div>

      {/* Main Content */}
      <div className="p-4 bg-gray-50/50 min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
}
