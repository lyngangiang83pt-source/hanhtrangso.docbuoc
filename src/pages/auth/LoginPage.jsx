import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const data = await signIn({ username, password });
      if (data?.user) {
        navigate('/');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setErrorMsg(
        err.message.includes('Invalid login credentials')
          ? 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!'
          : err.message || 'Lỗi kết nối tới máy chủ Supabase Database'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 bg-gradient-to-tr from-sky-600 to-blue-700 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">HÀNH TRÌNH SỐ</h2>
        <p className="mt-2 text-sm text-slate-600">
          Đăng nhập bằng Tên đăng nhập (Username) & Mật khẩu trên Supabase Database
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Đăng nhập không thành công</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Tên đăng nhập (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ví dụ: ngangiang hoặc an_7a1"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Mật khẩu (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <Link to="/register" className="text-xs text-sky-600 hover:text-sky-700 font-bold">
                Chưa có tài khoản?
              </Link>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xác thực Supabase...</span>
                </>
              ) : (
                <>
                  <span>Đăng Nhập Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Học sinh / Giáo viên mới?{' '}
              <Link to="/register" className="font-bold text-sky-600 hover:text-sky-700">
                Đăng ký tài khoản ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Fast Login Helper */}
        <div className="mt-4 p-4 rounded-xl bg-sky-50/80 border border-sky-100 text-xs text-sky-900">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Tài khoản kiểm thử nhanh (Demo Supabase Credentials):</span>
          </div>
          <p className="text-slate-600">
            Username Giáo viên: <code>ngangiang</code> / Mật khẩu: <code>123456</code><br />
            Username Học sinh: <code>nam_8a2</code> / Mật khẩu: <code>123456</code>
          </p>
        </div>
      </div>
    </div>
  );
};
