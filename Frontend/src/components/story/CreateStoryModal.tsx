import { useState } from 'react';
import { X, Image, Upload } from 'lucide-react';
import { useStories } from '../../contexts/StoryContext';

interface CreateStoryModalProps {
  onClose: () => void;
}

export function CreateStoryModal({ onClose }: CreateStoryModalProps) {
  const [content, setContent] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addStory } = useStories();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!previewUrl && !content.trim()) return;

    setIsUploading(true);
    try {
      await addStory(previewUrl || undefined, content.trim() || undefined);
      onClose();
    } catch (error) {
      alert('Có lỗi xảy ra khi tạo tin. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[500px] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-xl font-bold text-gray-900">Tạo tin</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-4 flex flex-col space-y-4">
          <div className="relative aspect-[9/16] max-h-[400px] w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center group">
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setPreviewUrl(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center cursor-pointer p-8 text-center group-hover:text-blue-500 transition-colors">
                <div className="bg-blue-50 p-4 rounded-full mb-3 group-hover:bg-blue-100">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <span className="font-semibold">Thêm ảnh</span>
                <span className="text-sm text-gray-500">Tin sẽ biến mất sau 24 giờ</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>

          <textarea
            className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none h-24"
            placeholder="Thêm nội dung cho tin của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            onClick={handleCreate}
            disabled={(!previewUrl && !content.trim()) || isUploading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
              (previewUrl || content.trim()) && !isUploading
                ? 'bg-blue-600 hover:bg-blue-700 shadow-md'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isUploading ? 'Đang tạo tin...' : 'Chia sẻ lên tin'}
          </button>
        </div>
      </div>
    </div>
  );
}
