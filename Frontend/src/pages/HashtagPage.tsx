import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hashtagsApi, type TrendingHashtag } from '../services/hashtagsApi';
import { TrendingUp, MessageSquare } from 'lucide-react';

export function HashtagPage() {
  const [hashtags, setHashtags] = useState<TrendingHashtag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const data = await hashtagsApi.getTrending(20);
        setHashtags(data);
      } catch (error) {
        console.error('Failed to fetch hashtags:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHashtags();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-200 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Hashtag thịnh hành</h2>
          </div>
          <p className="text-gray-600">Khám phá các chủ đề đang được quan tâm nhất hiện nay.</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Đang tải xu hướng...</p>
            </div>
          ) : hashtags.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Chưa có hashtag nào được tạo.</p>
              <p className="text-sm text-gray-400 mt-1">Hãy là người đầu tiên tạo bài viết với #hashtag!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hashtags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/search?q=${encodeURIComponent(tag.name)}`}
                  className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all duration-200"
                >
                  <div className="flex flex-col">
                    <span className="text-blue-600 font-bold text-lg group-hover:text-blue-700">
                      {tag.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {tag.postCount} bài viết
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <TrendingUp className="w-4 h-4 text-blue-600 group-hover:text-white" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
