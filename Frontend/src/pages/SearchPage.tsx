import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAll, type SearchResults } from '../services/searchApi';
import { useFriendships } from '../contexts/FriendshipContext';
import { PostItem } from '../components/feed/PostItem';
import { Users, FileText, Search } from 'lucide-react';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResults>({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const { friends, requestSent, sendRequest } = useFriendships();

  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  useEffect(() => {
    async function fetchResults() {
      if (!query.trim()) {
        setResults({ users: [], posts: [] });
        return;
      }
      setLoading(true);
      try {
        const data = await searchAll(query);
        setResults(data);
        // Switch to posts if users is empty but posts isn't
        if (data.users.length === 0 && data.posts.length > 0) {
          setActiveTab('posts');
        } else {
          setActiveTab('users');
        }
      } catch (error) {
        console.error('Search error', error);
      } finally {
        setLoading(false);
      }
    }
    void fetchResults();
  }, [query]);

  return (
    <div className="max-w-[680px] mx-auto py-6 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center space-x-3 mb-1">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Search className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Tìm kiếm cho "{query}"</h2>
        </div>
        <p className="text-gray-500 ml-10">
          Tìm thấy {results.users.length} người dùng và {results.posts.length} bài viết
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg font-bold transition-all ${activeTab === 'users'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
          <Users className="w-4 h-4" />
          <span>Người dùng ({results.users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg font-bold transition-all ${activeTab === 'posts'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
          <FileText className="w-4 h-4" />
          <span>Bài viết ({results.posts.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Đang tìm kiếm...</p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {activeTab === 'users' ? (
            results.users.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không tìm thấy người dùng nào phù hợp.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.users.map((user) => {
                  const isFriend = friends.some((f) => f.friendId === user.id);
                  const isSent = requestSent.includes(user.id);
                  return (
                    <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <Link to={`/profile/${user.id}`}>
                          <img
                            src={user.avatarData || defaultAvatar}
                            alt={user.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-50"
                          />
                        </Link>
                        <div>
                          <Link to={`/profile/${user.id}`} className="font-bold text-lg hover:text-blue-600 transition-colors">
                            {user.name}
                          </Link>
                          <p className="text-sm text-gray-500">{isFriend ? 'Bạn bè' : 'Người lạ'}</p>
                        </div>
                      </div>
                      <div>
                        {isFriend ? (
                          <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-sm font-bold">Bạn bè</span>
                        ) : (
                          <button
                            type="button"
                            disabled={isSent}
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                await sendRequest(user.id);
                              } catch { }
                            }}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${isSent
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100'
                              }`}
                          >
                            {isSent ? 'Đã gửi' : 'Kết bạn'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            results.posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không tìm thấy bài viết nào phù hợp.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.posts.map((post) => (
                  <PostItem key={post.id} post={post} />
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
