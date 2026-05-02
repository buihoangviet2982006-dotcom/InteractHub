import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { usePosts } from '../../contexts/PostContext';

interface ReportPostModalProps {
  postId: number;
  onClose: () => void;
}

const REPORT_REASONS = [
  'Nội dung không phù hợp',
  'Spam / Quấy rối',
  'Thông tin sai lệch',
  'Bạo lực / Ngôn từ thù ghét',
  'Vi phạm bản quyền',
  'Khác',
];

export function ReportPostModal({ postId, onClose }: ReportPostModalProps) {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { reportPost } = usePosts();

  const handleSubmit = async () => {
    const finalReason = reason === 'Khác' ? otherReason : reason;
    if (!finalReason.trim()) {
      setError('Vui lòng chọn hoặc nhập lý do báo cáo');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await reportPost(postId, finalReason);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Đã xảy ra lỗi khi gửi báo cáo. Vui lòng thử lại sau.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Báo cáo bài viết</h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Cảm ơn bạn đã báo cáo</h4>
              <p className="text-gray-600">Chúng tôi sẽ xem xét báo cáo này sớm nhất có thể.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6 text-sm">
                Tại sao bạn muốn báo cáo bài viết này? Phản hồi của bạn giúp chúng tôi giữ cộng đồng an toàn hơn.
              </p>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {REPORT_REASONS.map((r) => (
                  <label 
                    key={r} 
                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      reason === r ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="reportReason" 
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      checked={reason === r}
                      onChange={() => {
                        setReason(r);
                        setError(null);
                      }}
                    />
                    <span className="ml-3 font-medium text-gray-700">{r}</span>
                  </label>
                ))}
              </div>

              {reason === 'Khác' && (
                <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                  <textarea
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                    placeholder="Mô tả thêm về lý do..."
                    rows={3}
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-center text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || !reason}
                  onClick={handleSubmit}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
