import { useEffect, useState } from 'react';
import { reportApi } from '../services/reportApi';
import { deletePostAsAdmin } from '../services/postsApi';
import type { PostReportResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2, XCircle, CheckCircle2 } from 'lucide-react';

export function AdminReportsPage() {
  const [reports, setReports] = useState<PostReportResponse[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      navigate('/');
      return;
    }
    fetchReports();
  }, [user, navigate]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const data = await reportApi.getReports(50);
      setReports(data.items || data.Items || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Không thể tải danh sách báo cáo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: number, reportId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động này sẽ gửi thông báo đến tác giả.')) {
      return;
    }

    try {
      await deletePostAsAdmin(postId);
      setReports(prev => prev.filter(r => r.postId !== postId));
      if (selectedReportId === reportId) setSelectedReportId(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Lỗi khi xóa bài viết.');
    }
  };

  const handleDismissReport = async (reportId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn bỏ qua báo cáo này?')) {
      return;
    }

    try {
      await reportApi.deleteReport(reportId);
      setReports(prev => prev.filter(r => r.id !== reportId));
      if (selectedReportId === reportId) setSelectedReportId(null);
    } catch (error) {
      console.error('Error dismissing report:', error);
      alert('Lỗi khi bỏ qua báo cáo.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const selectedReport = reports.find(r => r.id === selectedReportId);

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      {/* Cột Danh sách Báo cáo (Master) */}
      <div className="w-[35%] min-w-[320px] bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10">
        <div className="px-5 py-4 border-b border-gray-100 bg-white sticky top-0">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={24} />
            Danh sách báo cáo
          </h2>
          <p className="text-sm text-gray-500 mt-1">Đang chờ xử lý: {reports.length}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {reports.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-400 mb-3" />
              <p>Hiện không có báo cáo nào.</p>
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  selectedReportId === report.id
                    ? 'bg-red-50 border-red-200 shadow-sm ring-1 ring-red-500/20'
                    : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                    Báo cáo
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                  Lý do: {report.reason}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  Người báo cáo: <span className="font-medium text-gray-700">{report.reporterName}</span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cột Chi tiết (Detail) */}
      <div className="flex-1 bg-[#f8f9fa] overflow-y-auto">
        {selectedReport ? (
          <div className="max-w-3xl mx-auto p-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Header Chi tiết */}
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chi tiết bài viết vi phạm</h3>
                  <p className="text-sm text-gray-500">Xem xét nội dung trước khi đưa ra quyết định.</p>
                </div>
              </div>

              {/* Nội dung Bài viết */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                    {selectedReport.postAuthorAvatarData ? (
                      <img src={`data:image/jpeg;base64,${selectedReport.postAuthorAvatarData}`} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-xl">
                        {selectedReport.postAuthorName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">{selectedReport.postAuthorName}</p>
                    <p className="text-xs text-gray-500">Tác giả bài viết</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  {selectedReport.postContent ? (
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedReport.postContent}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">Không có nội dung chữ.</p>
                  )}
                  
                  {selectedReport.postImageData && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 bg-black/5 flex justify-center">
                      <img 
                        src={`data:image/jpeg;base64,${selectedReport.postImageData}`} 
                        alt="Đính kèm" 
                        className="max-h-[400px] object-contain w-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Nút Hành động */}
              <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex gap-4">
                <button
                  onClick={() => handleDeletePost(selectedReport.postId, selectedReport.id)}
                  className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-500/20 shadow-sm transition-all"
                >
                  <Trash2 className="mr-2 h-5 w-5" />
                  Xóa bài viết (Báo vi phạm)
                </button>
                <button
                  onClick={() => handleDismissReport(selectedReport.id)}
                  className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900 focus:ring-4 focus:ring-gray-200 transition-all shadow-sm"
                >
                  <XCircle className="mr-2 h-5 w-5 text-gray-500" />
                  Bỏ qua báo cáo
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
              <AlertTriangle size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-600">Chưa chọn báo cáo</h3>
            <p className="text-sm mt-2 max-w-sm text-center">
              Hãy chọn một báo cáo từ danh sách bên trái để xem chi tiết và thực hiện hành động.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
