import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  Shield, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có độ dài tối thiểu 6 ký tự để đảm bảo an toàn!');
      return;
    }

    setSubmitting(true);

    try {
      await signUp({
        email,
        password,
        full_name: fullName,
        role: selectedRole
      });

      setSuccessMsg(
        'Đăng ký tài khoản thành công! Dữ liệu đã được đồng bộ vào Supabase Database. Đang chuyển hướng...'
      );

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      setErrorMsg(
        err.message.includes('already registered')
          ? 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác!'
          : err.message || 'Lỗi tạo tài khoản trên Supabase Auth'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-700 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">TẠO TÀI KHOẢN MỚI</h2>
        <p className="mt-2 text-sm text-slate-600">
          Gia nhập nền tảng Giáo dục Số THCS Phú Bình (Đồng bộ Supabase RBAC)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Đăng ký không thành công</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <p className="font-bold">Đăng ký thành công!</p>
                <p>{successMsg}</p>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Họ và tên đầy đủ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Huỳnh Ngân Giang hoặc Lê Hoàng Nam"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@phubinh.edu.vn"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Mật khẩu (Tối thiểu 6 ký tự)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Vai trò của bạn trong trường
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'student', label: 'Học sinh', icon: GraduationCap },
                  { id: 'teacher', label: 'Giáo viên', icon: BookOpen },
                  { id: 'admin', label: 'Admin', icon: Shield }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedRole === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedRole(item.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang khởi tạo trên Supabase...</span>
                </>
              ) : (
                <>
                  <span>Hoàn Tất Đăng Ký</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
