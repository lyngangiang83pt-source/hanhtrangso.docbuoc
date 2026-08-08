import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  School,
  FileText,
  Gamepad2,
  Trophy,
  ClipboardList,
  UploadCloud,
  BarChart3,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const { role } = useAuth();

  const getLinks = () => {
    if (role === 'admin') {
      return [
        { to: '/admin', label: 'Bảng Điều Khiển Admin', icon: LayoutDashboard },
        { to: '/teacher/subjects', label: 'Quản Lý Môn Học', icon: Layers },
        { to: '/admin', label: 'Quản Lý Người Dùng', icon: Users },
        { to: '/admin', label: 'Tất Cả Lớp Học', icon: School },
        { to: '/explore', label: 'Kho Học Liệu & Game', icon: FileText }
      ];
    }
    if (role === 'teacher') {
      return [
        { to: '/teacher', label: 'Tổng Quan Giảng Dạy', icon: LayoutDashboard },
        { to: '/teacher/subjects', label: 'Quản Lý Môn Học', icon: Layers },
        { to: '/teacher', label: 'Lớp Học Của Tôi', icon: School },
        { to: '/teacher/materials/new', label: 'Tải Lên File / Nhúng Game', icon: UploadCloud },
        { to: '/explore', label: 'Kho Học Liệu & Game', icon: FileText }
      ];
    }
    // Student
    return [
      { to: '/student', label: 'Bàn Học Cá Nhân', icon: LayoutDashboard },
      { to: '/student/classes', label: 'Lớp Học Của Em', icon: School },
      { to: '/materials', label: 'Học Liệu & Bài Giảng', icon: FileText },
      { to: '/student/games', label: 'Đấu Trường Game', icon: Gamepad2 },
      { to: '/student/progress', label: 'Thành Tích & Điểm Số', icon: Trophy }
    ];
  };

  const navLinks = getLinks();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Phân Hệ {role === 'admin' ? 'Quản Trị' : role === 'teacher' ? 'Giáo Viên' : 'Học Sinh'}
        </div>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin' || link.to === '/teacher' || link.to === '/student'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-900/50'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Slogan card */}
      <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-xs">
        <div className="flex items-center gap-2 text-sky-400 font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hành Trình Số 2026</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Nền tảng chuyển đổi số giáo dục THCS Phú Bình - Huỳnh Ngân Giang.
        </p>
      </div>
    </aside>
  );
};
