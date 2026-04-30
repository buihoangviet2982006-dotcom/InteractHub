import { useState } from 'react';
import { X } from 'lucide-react';
import { updateProfile, type UserProfile } from '../../services/userApi';

interface EditProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onUpdate: (updatedProfile: UserProfile) => void;
}

export function EditProfileModal({ profile, onClose, onUpdate }: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tên không được để trống');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updated = await updateProfile(name, bio);
      onUpdate(updated);
      onClose();
    } catch (err) {
      setError('Lỗi khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 text-lg">Chỉnh sửa trang cá nhân</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Họ và tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Nhập tên của bạn"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tiểu sử (Bio)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-32"
              placeholder="Hãy viết gì đó về bản thân..."
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-md transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
