import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { SubjectManager } from '../teacher/SubjectManager';
import { 
  Users, 
  School, 
  FileText, 
  Trophy, 
  ShieldCheck, 
  Trash2, 
  Search, 
  UserCheck, 
  RefreshCw,
  TrendingUp,
  Sparkles,
  Layers,
  Gamepad2,
  Database,
  Eye,
  CheckCircle2,
  Clock,
  Award,
  BookOpen
} from 'lucide-react';

export const AdminDashboard = () => {
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [usersList, setUsersList] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Tải toàn bộ dữ liệu quản trị từ Supabase PostgreSQL
  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Tải danh sách người dùng từ public.profiles
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (users) setUsersList(users);

      // 2. Tải danh sách lớp học
      const { data: classes } = await supabase
        .from('classes')
        .select('*, profiles(full_name, email, username)')
        .order('created_at', { ascending: false });

      if (classes) setClassesList(classes);

      // 3. Tải danh sách học liệu & game
      const { data: mats } = await supabase
        .from('materials')
        .select('*, profiles(full_name, username)')
        .order('created_at', { ascending: false });

      if (mats) setMaterialsList(mats);

      // 4. Tải danh sách tiến độ học sinh
      const { data: progs } = await supabase
        .from('student_progress')
        .select('*, profiles(full_name, username), assignments(materials(title, type))')
        .order('score', { ascending: false });

      if (progs) setProgressList(progs);

    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Admin từ Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Thay đổi quyền (Role) của người dùng trực tiếp trên Supabase
  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (!error) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        alert(`Đã cập nhật quyền hạn thành công sang [${newRole.toUpperCase()}]!`);
      } else {
        alert('Lỗi cập nhật quyền: ' + error.message);
      }
    } catch (err) {
      console.error('Lỗi phân quyền:', err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Xóa tài khoản người dùng
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Thầy/Cô có chắc chắn muốn xóa người dùng "${userName}" khỏi cơ sở dữ liệu Supabase?`)) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (!error) {
        setUsersList((prev) => prev.filter((u) => u.id !== userId));
        alert(`Đã xóa thành công người dùng "${userName}"!`);
      }
    } catch (err) {
      console.error('Lỗi xóa user:', err);
    }
  };

  // Xóa lớp học
  const handleDeleteClass = async (classId, className) => {
    if (!window.confirm(`Thầy/Cô có chắc chắn muốn xóa lớp "${className}" khỏi Supabase không?`)) return;
    try {
      const { error } = await supabase.from('classes').delete().eq('id', classId);
      if (!error) {
        setClassesList((prev) => prev.filter((c) => c.id !== classId));
        alert('Đã xóa lớp học thành công!');
      }
    } catch (err) {
      console.error('Lỗi xóa lớp học:', err);
    }
  };

  // Xóa học liệu
  const handleDeleteMaterial = async (matId, matTitle) => {
    if (!window.confirm(`Thầy/Cô có chắc chắn muốn xóa học liệu "${matTitle}" khỏi Supabase?`)) return;
    try {
      const { error } = await supabase.from('materials').delete().eq('id', matId);
      if (!error) {
        setMaterialsList(prev => prev.filter(m => m.id !== matId));
        alert('Đã xóa học liệu thành công!');
      }
    } catch (err) {
      console.error('Lỗi xóa học liệu:', err);
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Đang đồng bộ dữ liệu quản trị toàn trường từ Supabase Cloud..." />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>TRUNG TÂM ĐIỀU HÀNH QUẢN TRỊ VIÊN (SUPER ADMIN)</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Hệ Thống Quản Lý Toàn Diện Trường THCS Phú Bình</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Toàn quyền quản lý Người dùng, Môn học, Lớp học, Kho học liệu và Báo cáo điểm số học sinh.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 rounded-xl text-xs font-bold transition-all border border-indigo-400/30 shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Làm Mới Dữ Liệu</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'overview', label: '📊 Tổng quan Chỉ số', icon: TrendingUp },
          { id: 'users', label: `👥 Người dùng (${usersList.length})`, icon: Users },
          { id: 'subjects', label: '📚 Quản lý Môn học', icon: Layers },
          { id: 'classes', label: `🏫 Lớp học (${classesList.length})`, icon: School },
          { id: 'materials', label: `🎮 Kho Học liệu & Game (${materialsList.length})`, icon: Gamepad2 },
          { id: 'progress', label: `🏆 Bảng Điểm & Tiến độ (${progressList.length})`, icon: Trophy }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: TỔNG QUAN CHỈ SỐ ================= */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Tổng Thành Viên</p>
                <h3 className="text-2xl font-black text-slate-800">{usersList.length}</h3>
                <span className="text-[11px] text-blue-600 font-bold">
                  {usersList.filter((u) => u.role === 'teacher').length} Giáo viên • {usersList.filter((u) => u.role === 'student').length} Học sinh
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <School className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Lớp Học Trực Tuyến</p>
                <h3 className="text-2xl font-black text-slate-800">{classesList.length}</h3>
                <span className="text-[11px] text-emerald-600 font-bold">100% Có mã Join Code</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Kho Học Liệu & Game</p>
                <h3 className="text-2xl font-black text-slate-800">{materialsList.length}</h3>
                <span className="text-[11px] text-purple-600 font-bold">Supabase Cloud</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Lượt Hoàn Thành Bài</p>
                <h3 className="text-2xl font-black text-slate-800">{progressList.length}</h3>
                <span className="text-[11px] text-amber-600 font-bold">Tự động chấm & lưu điểm</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Phím Tắt Thao Tác Nhanh Quản Trị</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveAdminTab('users')}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all group"
              >
                <Users className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm text-slate-800">Thăng / Hạ Quyền Người Dùng</h4>
                <p className="text-xs text-slate-500 mt-1">Cấp quyền Giáo viên hoặc Admin chỉ với 1 click chuột.</p>
              </button>

              <button
                onClick={() => setActiveAdminTab('subjects')}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all group"
              >
                <Layers className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm text-slate-800">Thêm Môn Học Mới</h4>
                <p className="text-xs text-slate-500 mt-1">Tạo thẻ môn học toàn trường kèm mã môn, icon và màu sắc.</p>
              </button>

              <button
                onClick={() => setActiveAdminTab('materials')}
                className="p-4 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all group"
              >
                <Gamepad2 className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm text-slate-800">Quản Trị Game & Học Liệu</h4>
                <p className="text-xs text-slate-500 mt-1">Duyệt bài giảng và kiểm tra liên kết Wordwall/Quizizz.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN ================= */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Danh Sách Người Dùng & Phân Quyền</h2>
              <p className="text-xs text-slate-500 mt-0.5">Thay đổi quyền Admin, Giáo viên hoặc Học sinh tức thì</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo Tên, Username hoặc Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4">Tài Khoản / Username</th>
                  <th className="py-3 px-4">Họ và Tên</th>
                  <th className="py-3 px-4">Khối / Lớp</th>
                  <th className="py-3 px-4">Vai Trò Hiện Tại</th>
                  <th className="py-3 px-4">Thao Tác Phân Quyền</th>
                  <th className="py-3 px-4 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      <div>@{user.username || user.email?.split('@')[0]}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{user.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{user.full_name || 'Chưa cập nhật'}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-xs">
                        {user.class_name || `Khối ${user.grade_level || 7}`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.role === 'admin'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : user.role === 'teacher'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        {user.role === 'admin' ? 'Quản Trị Viên' : user.role === 'teacher' ? 'Giáo Viên' : 'Học Sinh'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <select
                          disabled={updatingUserId === user.id}
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="student">Học Sinh</option>
                          <option value="teacher">Giáo Viên</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.full_name || user.username)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa người dùng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: QUẢN LÝ MÔN HỌC ================= */}
      {activeAdminTab === 'subjects' && (
        <SubjectManager />
      )}

      {/* ================= TAB 4: QUẢN LÝ LỚP HỌC ================= */}
      {activeAdminTab === 'classes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Danh Sách Lớp Học Toàn Trường</h2>
              <p className="text-xs text-slate-500">Giám sát giáo viên phụ trách và mã gia nhập Join Code</p>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              {classesList.length} Lớp đang mở
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classesList.map((cls) => (
              <div key={cls.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono">
                      Mã: {cls.code}
                    </span>
                    <button
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Xóa lớp học"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{cls.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{cls.description || 'Chưa có mô tả cho lớp học này.'}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>GV: <strong>{cls.profiles?.full_name || 'Huỳnh Ngân Giang'}</strong></span>
                  <span className="text-[11px] text-slate-400">{new Date(cls.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: QUẢN LÝ KHO HỌC LIỆU & GAME ================= */}
      {activeAdminTab === 'materials' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Kho Học Liệu & Trò Chơi Wordwall Toàn Trường</h2>
              <p className="text-xs text-slate-500">Giám sát tài nguyên số hóa và xóa bài giảng vi phạm</p>
            </div>
            <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
              {materialsList.length} Học liệu & Game
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materialsList.map((mat) => (
              <div key={mat.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      {mat.type}
                    </span>
                    <button
                      onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Xóa học liệu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{mat.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mat.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Môn: <strong>{mat.subject || 'Ngữ văn'}</strong></span>
                  <a
                    href={mat.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Mở xem</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: TIẾN ĐỘ & BẢNG XẾP HẠNG HỌC SINH ================= */}
      {activeAdminTab === 'progress' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Bảng Xếp Hạng & Tiến Độ Làm Bài Toàn Trường</h2>
            <p className="text-xs text-slate-500">Thống kê điểm số và thời gian hoàn thành bài tập của học sinh</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4">Học Sinh</th>
                  <th className="py-3 px-4">Bài Tập / Game</th>
                  <th className="py-3 px-4">Điểm Số</th>
                  <th className="py-3 px-4">Thời Gian Làm Bài</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {progressList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      Chưa có học sinh nào nộp bài. Dữ liệu sẽ tự động nhảy vào đây khi học sinh làm bài tập.
                    </td>
                  </tr>
                ) : (
                  progressList.map((prog) => (
                    <tr key={prog.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {prog.profiles?.full_name || prog.profiles?.username || 'Học sinh'}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {prog.assignments?.materials?.title || 'Game Ôn tập'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {prog.score} / 100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {prog.completion_time_seconds ? `${prog.completion_time_seconds} giây` : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Hoàn thành
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
