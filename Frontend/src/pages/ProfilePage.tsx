import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, updateAvatar, updateCover, type UserProfile } from '../services/userApi';
import { useAuth } from '../contexts/AuthContext';
import { useFriendships } from '../contexts/FriendshipContext';
import { PostItem } from '../components/feed/PostItem';
import { http } from '../services/http';
import { mapBackendPostToFrontend } from '../services/postsApi';
import type { Post } from '../types';
import { Camera, Image as ImageIcon, Info } from 'lucide-react';
import { EditProfileModal } from '../components/profile/EditProfileModal';

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, setUser } = useAuth();
  const { friends, sendRequest, acceptRequest, declineRequest, requestSent, pendingRequests, sentRequests } = useFriendships();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [isUpdatingCover, setIsUpdatingCover] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const profileId = userId === 'me' ? currentUser?.id?.toString() : userId;

  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTRFNkVCIi8+PHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDE0QzkuMzMzMzMgMTQgNCAxNS4zMzMzIDQgMThWMjBIMjBWMThDMjAgMTUuMzMzMyAxNC42NjY3IDE0IDEyIDE0WiIgZmlsbD0iIzhBOEQ5MSIvPjwvc3ZnPg==';

  useEffect(() => {
    async function fetchProfileData() {
      if (!profileId) return;
      setLoading(true);
      try {
        const [profileData, postsResponse] = await Promise.all([
          getUserProfile(profileId),
          http.get<any>(`/posts/user/${profileId}?limit=20`)
        ]);
        setProfile(profileData);

        const rawItems = postsResponse.data.items || postsResponse.data.Items || [];
        setPosts(rawItems.map(mapBackendPostToFrontend));
      } catch (error) {
        console.error('Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    }
    void fetchProfileData();
  }, [profileId]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile || !profileId) return;

    setIsUpdatingAvatar(true);
    try {
      await updateAvatar(file);
      // Refresh profile to get new binary data
      const updatedProfile = await getUserProfile(profileId);
      setProfile(updatedProfile);

      if (currentUser && (currentUser.id.toString() === userId || userId === 'me')) {
        setUser({ ...currentUser, avatarData: updatedProfile.avatarData });
      }
    } catch (error) {
      console.error('Failed to update avatar', error);
      alert('Không thể cập nhật ảnh đại diện. Vui lòng thử lại.');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile || !profileId) return;

    setIsUpdatingCover(true);
    try {
      await updateCover(file);
      // Refresh profile
      const updatedProfile = await getUserProfile(profileId);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to update cover', error);
      alert('Không thể cập nhật ảnh bìa. Vui lòng thử lại.');
    } finally {
      setIsUpdatingCover(false);
    }
  };

  if (loading) {
    return <div className="max-w-[800px] mx-auto py-10 text-center text-gray-500">Đang tải trang cá nhân...</div>;
  }

  if (!profile) {
    return <div className="max-w-[800px] mx-auto py-10 text-center text-gray-500">Người dùng không tồn tại.</div>;
  }

  const isSelf = currentUser && (currentUser.id.toString() === userId || currentUser.id === Number(userId) || userId === 'me');
  const isFriend = profile.isFriend || friends.some(f => f.friendId === profile.id);
  const isSent = sentRequests.some(r => r.friendId === profile.id) || requestSent.includes(profile.id);
  const incomingRequest = pendingRequests.find(r => r.friendId === profile.id);

  return (
    <div className="max-w-[800px] mx-auto bg-white min-h-screen">
      {/* Cover Photo Area */}
      <div
        className="h-[300px] bg-gradient-to-r from-blue-300 to-blue-500 rounded-b-lg relative group"
        style={profile.coverData ? { backgroundImage: `url(${profile.coverData})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {isSelf && (
          <label className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-md font-semibold text-sm cursor-pointer transition-colors flex items-center space-x-2 shadow-md z-30">
            <ImageIcon className="w-5 h-5 text-gray-600" />
            <span>{profile.coverData ? 'Thay đổi ảnh bìa' : 'Thêm ảnh bìa'}</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleCoverChange} disabled={isUpdatingCover} />
          </label>
        )}
        {isUpdatingCover && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-b-lg">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-8 pb-4 border-b">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center -mt-[50px] relative z-10 space-y-4 md:space-y-0">
          <div className="flex items-end space-x-6">
            <div className="relative group">
              <img
                src={profile.avatarData || defaultAvatar}
                alt={profile.name}
                className={`w-[160px] h-[160px] rounded-full border-4 border-white object-cover bg-white ${isUpdatingAvatar ? 'opacity-50' : ''}`}
              />
              {isSelf && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-30">
                  <div className="flex flex-col items-center">
                    <Camera className="w-8 h-8 text-white" />
                    <span className="text-white text-xs font-semibold mt-1">Thay đổi</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isUpdatingAvatar} />
                </label>
              )}
              {isUpdatingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center z-40 bg-white/40 rounded-full">
                  <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="pb-4">
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500 font-medium mt-1">{profile.friendCount} bạn bè</p>
            </div>
          </div>

          <div className="pb-4">
            {!isSelf && (
              isFriend ? (
                <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md">
                  Đã là bạn bè
                </button>
              ) : incomingRequest ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => acceptRequest(profile.id)}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                  >
                    Chấp nhận
                  </button>
                  <button
                    onClick={() => declineRequest(profile.id)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300"
                  >
                    Từ chối
                  </button>
                </div>
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
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
              >
                Chỉnh sửa trang cá nhân
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-[#f0f2f5] p-4 min-h-[500px]">
        <div className="max-w-[800px] mx-auto space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-xl mb-4 text-gray-900 border-b pb-2">Giới thiệu</h3>
            <div className="space-y-4 text-gray-700">
              {profile.bio ? (
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                  <p className="text-[15px] italic">"{profile.bio}"</p>
                </div>
              ) : (
                <p className="text-gray-500 text-[15px] italic">Chưa có thông tin giới thiệu.</p>
              )}
            </div>
          </div>

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

      {showEditProfileModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditProfileModal(false)}
          onUpdate={(updated) => {
            setProfile(updated);
            if (currentUser && (currentUser.id.toString() === userId || userId === 'me')) {
              setUser({ ...currentUser, fullName: updated.name });
            }
          }}
        />
      )}
    </div>
  );
}
