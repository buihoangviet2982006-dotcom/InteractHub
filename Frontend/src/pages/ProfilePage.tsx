import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, type UserProfile } from '../services/userApi';
import { useAuth } from '../contexts/AuthContext';
import { useFriendships } from '../contexts/FriendshipContext';
import { PostItem } from '../components/feed/PostItem';
import { mapBackendPostToFrontend } from '../services/postsApi';
import { http } from '../services/http';
import type { Post } from '../types';

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const { sendRequest, requestSent } = useFriendships();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      if (!userId) return;
      setLoading(true);
      try {
        const [profileData, postsResponse] = await Promise.all([
          getUserProfile(userId),
          http.get<any>(`/posts/user/${userId}?limit=20`)
        ]);
        setProfile(profileData);
        
        const rawItems = postsResponse.data.items || [];
        setPosts(rawItems.map(mapBackendPostToFrontend));
      } catch (error) {
        console.error('Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    }
    void fetchProfileData();
  }, [userId]);

  if (loading) {
    return <div className="max-w-[800px] mx-auto py-10 text-center text-gray-500">Đang tải trang cá nhân...</div>;
  }

  if (!profile) {
    return <div className="max-w-[800px] mx-auto py-10 text-center text-gray-500">Người dùng không tồn tại.</div>;
  }

  const isSelf = currentUser?.id.toString() === userId;
  const isSent = requestSent.includes(profile.id);

  return (
    <div className="max-w-[800px] mx-auto bg-white min-h-screen">
      {/* Cover Photo Area - Placeholder */}
      <div className="h-[300px] bg-gradient-to-r from-blue-300 to-blue-500 rounded-b-lg relative">
      </div>

      {/* Profile Info */}
      <div className="px-8 pb-4 border-b">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center -mt-[50px] relative z-10 space-y-4 md:space-y-0">
          <div className="flex items-end space-x-6">
            <img 
              src={profile.avatarUrl || `https://i.pravatar.cc/150?u=${profile.id}`} 
              alt={profile.name}
              className="w-[160px] h-[160px] rounded-full border-4 border-white object-cover bg-white"
            />
            <div className="pb-4">
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500 font-medium mt-1">{profile.friendCount} bạn bè</p>
            </div>
          </div>
          
          <div className="pb-4">
            {!isSelf && (
              profile.isFriend ? (
                <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md">
                  Đã là bạn bè
                </button>
              ) : (
                <button 
                  onClick={async () => {
                    if (!isSent) {
                      await sendRequest(profile.id);
                    }
                  }}
                  disabled={isSent}
                  className={`px-4 py-2 font-semibold rounded-md ${isSent ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {isSent ? 'Đã gửi lời mời' : 'Thêm bạn bè'}
                </button>
              )
            )}
            {isSelf && (
              <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors">
                Chỉnh sửa trang cá nhân
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-[#f0f2f5] p-4 min-h-[500px]">
        <div className="max-w-[800px] mx-auto space-y-4">
          {/* Top Section - Intro */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-xl mb-4 text-gray-900 border-b pb-2">Giới thiệu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-[15px]">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-800">Email:</span>
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-800">Tham gia:</span>
                <span>Thành viên mới</span>
              </div>
              {/* Could add more details here later */}
            </div>
          </div>

          {/* Bottom Section - Posts */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl px-2 text-gray-900">Bài viết</h3>
            {posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                <p className="text-lg font-medium">Chưa có bài viết nào</p>
                <p className="text-sm">Khi {profile.name} đăng bài, chúng sẽ xuất hiện ở đây.</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostItem key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
