import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import type { UserUpdateDto, ChangePasswordDto } from '../types/user';

export function SettingsPage() {
  const { user, setUser } = useAuth(); // We might need a way to refresh user context if email/name changes
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  // Profile state
  const [profileData, setProfileData] = useState<UserUpdateDto>({
    fullName: '',
    email: '',
    bio: ''
  });

  // Password state
  const [passwordData, setPasswordData] = useState<ChangePasswordDto>({
    oldPassword: '',
    newPassword: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await userService.getProfile(user.id);
          setProfileData({
            fullName: profile.fullName,
            email: profile.email,
            bio: profile.bio || ''
          });
        } catch (error) {
          console.error("Lỗi khi tải thông tin cá nhân:", error);
          // Fallback nếu không tải được profile chi tiết
          setProfileData({
            fullName: user.fullName || '',
            email: user.email || '',
            bio: ''
          });
        }
      }
    };
    fetchProfile();
  }, [user?.id]); // Only refetch if the user ID changes

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const updatedProfile = await userService.updateProfile(profileData);
      
      // Cập nhật thông tin người dùng trong context để Navbar và các nơi khác cập nhật theo
      if (user && updatedProfile) {
        const newFullName = updatedProfile.fullName || (updatedProfile as any).FullName;
        const newEmail = updatedProfile.email || (updatedProfile as any).Email;
        
        if (newFullName || newEmail) {
          setUser({
            ...user,
            fullName: newFullName || user.fullName,
            email: newEmail || user.email,
          });
        }
      }
      
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (error: any) {
      const errorMsg = typeof error.response?.data === 'string' 
        ? error.response.data 
        : (error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await userService.changePassword(passwordData);
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPasswordData({ oldPassword: '', newPassword: '' });
      setConfirmPassword('');
    } catch (error: any) {
      const errorMsg = typeof error.response?.data === 'string' 
        ? error.response.data 
        : (error.response?.data?.message || 'Mật khẩu cũ không chính xác hoặc có lỗi xảy ra.');
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'profile'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            <User className="w-4 h-4" />
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'password'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            <Lock className="w-4 h-4" />
            Bảo mật & Mật khẩu
          </button>
        </div>

        <div className="p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Nhập họ tên mới"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Nhập email mới"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiểu sử (Bio)</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px]"
                  placeholder="Giới thiệu một chút về bản thân..."
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
