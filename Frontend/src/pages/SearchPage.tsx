import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchUsers } from '../services/userApi';
import type { User } from '../types';
import { useFriendships } from '../contexts/FriendshipContext';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { friends, requestSent, sendRequest } = useFriendships();

  useEffect(() => {
    async function fetchResults() {
      if (!query.trim()) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const results = await searchUsers(query);
        setUsers(results);
      } catch (error) {
        console.error('Search error', error);
      } finally {
        setLoading(false);
      }
    }
    void fetchResults();
  }, [query]);

  return (
    <div className="max-w-[680px] mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Kết quả tìm kiếm cho "{query}"</h2>
      {loading ? (
        <div className="text-gray-500">Đang tìm kiếm...</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500">Không tìm thấy người dùng nào.</div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const isFriend = friends.some((f) => f.friendId === user.id);
            const isSent = requestSent.includes(user.id);
            return (
              <div key={user.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link to={`/profile/${user.id}`}>
                    <img
                      src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <Link to={`/profile/${user.id}`} className="font-semibold text-lg hover:underline text-gray-900">
                    {user.name}
                  </Link>
                </div>
                <div>
                  {isFriend ? (
                    <span className="text-green-600 font-medium">Bạn bè</span>
                  ) : (
                    <button
                      type="button"
                      disabled={isSent}
                      onClick={async () => {
                        try {
                          await sendRequest(user.id);
                        } catch {}
                      }}
                      className={`px-4 py-2 rounded-md font-medium ${
                        isSent
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isSent ? 'Đã gửi lời mời' : 'Kết bạn'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
