import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  Lock, 
  User, 
  Shield, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  BookOpen,
  School,
  Eye,
  EyeOff,
  AtSign
} from 'lucide-react';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [gradeLevel, setGradeLevel] = useState(7);
  const [className, setClassName] = useState('7A1');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Kiểm tra định dạng username (chỉ chữ cái, số, dấu gạch dưới)
    const cleanUsername = username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
      setErrorMsg('Tên đăng nhập chỉ được chứa chữ thường (a-z), chữ số (0-9) và dấu gạch dưới (_), độ dài từ 3 đến 30 ký tự!');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có độ dài tối thiểu 6 ký tự!');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    setSubmitting(true);

    try {
      await signUp({
        username: cleanUsername,
        password,
        full_name: fullName,
        role: selectedRole,
        grade_level: gradeLevel,
        class_name: className
      });

      setSuccessMsg(
        `Đăng ký thành công tài khoản "${cleanUsername}"! Dữ liệu đã được đồng bộ lên Supabase Database. Đang chuyển hướng...`
      );

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      setErrorMsg(
        err.message.includes('already registered')
          ? 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên đăng nhập khác!'
          : err.message || 'Lỗi tạo tài khoản trên Supabase Database'
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
          Sử dụng Username & Mật khẩu đồng bộ Supabase (ID: dcmlhyzjkuagjafbvspj)
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
                Tên đăng nhập (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <AtSign className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="Ví dụ: nam_8a2 hoặc ngangiang"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Họ và tên đầy đủ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Lê Hoàng Nam"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Xác nhận mật khẩu
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
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
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedRole === 'student' && (
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Khối lớp:</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Tên lớp:</label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Ví dụ: 7A1"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>
            )}

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
                  <span>Hoàn Tất Đăng Ký Tài Khoản</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
                Đăng nhập bằng Username ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
