import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  LogOut, 
  User, 
  ShieldCheck, 
  BookOpen, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { user, profile, role, signOut, isAdmin, isTeacher } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  const getRoleBadge = () => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
          <ShieldCheck className="w-3 h-3" /> Quản Trị Viên
        </span>
      );
    }
    if (role === 'teacher') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <BookOpen className="w-3 h-3" /> Giáo Viên
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <GraduationCap className="w-3 h-3" /> Học Sinh
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-800 tracking-tight">HÀNH TRÌNH SỐ</span>
              <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 font-bold rounded-md">THCS Phú Bình</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Kho Học Liệu & Game Giáo Dục Tương Tác</p>
          </div>
        </Link>

        {/* Live Supabase Indicator & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Supabase Cloud Database: Sẵn sàng</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-bold text-slate-800">
                    {profile?.full_name || profile?.username || user.email.split('@')[0]}
                  </span>
                  {getRoleBadge()}
                </div>
                <p className="text-xs text-slate-400 font-mono">@{profile?.username || user.email.split('@')[0]}</p>
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold flex items-center justify-center shadow-inner">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  (profile?.full_name || profile?.username || user.email).charAt(0).toUpperCase()
                )}
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md transition-all"
              >
                Đăng ký ngay
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
