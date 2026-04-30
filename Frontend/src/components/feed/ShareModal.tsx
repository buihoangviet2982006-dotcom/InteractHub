import { X } from 'lucide-react';
import { useFriendships } from '../../contexts/FriendshipContext';
import { usePosts } from '../../contexts/PostContext';
import { useState } from 'react';

interface ShareModalProps {
  postId: string;
  onClose: () => void;
}

export function ShareModal({ postId, onClose }: ShareModalProps) {
  const { friends } = useFriendships();
  const { sharePost } = usePosts();
  const [sharing, setSharing] = useState<string | null>(null);

  const handleShare = async (friendId: string) => {
    setSharing(friendId);
    try {
      await sharePost(postId, friendId);
      alert('Đã chia sẻ bài viết thành công!');
      onClose();
    } catch (error) {
      alert('Lỗi khi chia sẻ bài viết');
    } finally {
      setSharing(null);
    }
  };

  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Chia sẻ bài viết</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {friends.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Bạn chưa có bạn bè nào để chia sẻ.</p>
          ) : (
            <ul className="space-y-1">
              {friends.map((friend) => (
                <li key={friend.friendId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img src={friend.friendAvatarData || defaultAvatar} alt={friend.friendName} className="w-10 h-10 rounded-full object-cover" />
                    <span className="font-medium text-sm text-gray-800">{friend.friendName}</span>
                  </div>
                  <button 
                    disabled={sharing === friend.friendId}
                    onClick={() => handleShare(friend.friendId)}
                    className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {sharing === friend.friendId ? 'Đang gửi...' : 'Gửi'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
