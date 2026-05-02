import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User as UserIcon, Loader2, CheckCircle2 } from 'lucide-react';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password
      });
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-xl shadow-teal-500/30 mb-4 transform hover:scale-105 transition-transform">
            <span className="text-3xl font-bold text-white">S</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tham gia Social Media</h1>
          <p className="text-gray-500 mt-2">Bắt đầu kết nối với bạn bè trên khắp thế giới</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl shadow-2xl ring-1 ring-gray-900/5 rounded-3xl p-8">
          <form className="space-y-4" onSubmit={onSubmit}>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Họ và Tên</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <UserIcon className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-white/50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white/50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-white/50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Xác nhận Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full bg-white/50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
                <span className="font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl py-3 font-semibold shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-md mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Tạo tài khoản'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
