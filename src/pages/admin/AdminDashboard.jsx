import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
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
  Sparkles
} from 'lucide-react';

export const AdminDashboard = () => {
  const [usersList, setUsersList] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [materialsCount, setMaterialsCount] = useState(0);
  const [progressCount, setProgressCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Tải dữ liệu thực tế từ Supabase
  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Tải danh sách người dùng từ public.profiles
      const { data: users, error: usersErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!usersErr && users) {
        setUsersList(users);
      }

      // 2. Tải danh sách lớp học
      const { data: classes, error: classErr } = await supabase
        .from('classes')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });

      if (!classErr && classes) {
        setClassesList(classes);
      }

      // 3. Đếm số lượng học liệu & game
      const { count: matCount } = await supabase
        .from('materials')
        .select('*', { count: 'exact', head: true });
      setMaterialsCount(matCount || 0);

      // 4. Đếm số lượng tiến độ học tập
      const { count: progCount } = await supabase
        .from('student_progress')
        .select('*', { count: 'exact', head: true });
      setProgressCount(progCount || 0);

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
      } else {
        alert('Lỗi cập nhật quyền: ' + error.message);
      }
    } catch (err) {
      console.error('Lỗi phân quyền:', err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Xóa lớp học
  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Thầy/Cô có chắc chắn muốn xóa lớp học này khỏi Supabase không?')) return;
    try {
      const { error } = await supabase.from('classes').delete().eq('id', classId);
      if (!error) {
        setClassesList((prev) => prev.filter((c) => c.id !== classId));
      } else {
        alert('Lỗi xóa lớp: ' + error.message);
      }
    } catch (err) {
      console.error('Lỗi:', err);
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Đang tải dữ liệu Quản trị viên từ Supabase PostgreSQL..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-purple-600" />
            <span>BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN (ADMIN RBAC)</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Giám sát toàn bộ Người dùng, Lớp học, Học liệu số & Phân quyền bảo mật qua Supabase Database.
          </p>
        </div>
        <button
          onClick={loadAdminData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Làm Mới Dữ Liệu</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Tổng Người Dùng</p>
            <p className="text-2xl font-black text-slate-900">{usersList.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <School className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Tổng Lớp Học</p>
            <p className="text-2xl font-black text-slate-900">{classesList.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Học Liệu & Game</p>
            <p className="text-2xl font-black text-slate-900">{materialsCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Lượt Hoàn Thành</p>
            <p className="text-2xl font-black text-slate-900">{progressCount}</p>
          </div>
        </div>
      </div>

      {/* Users Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-slate-900">Danh Sách Người Dùng & Phân Quyền Trực Tiếp</h2>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <EmptyState
            title="Không tìm thấy người dùng"
            description="Chưa có bản ghi người dùng nào phù hợp trong Supabase Database."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Họ Và Tên</th>
                  <th className="py-3 px-4">Địa Chỉ Email</th>
                  <th className="py-3 px-4">Vai Trò Hiện Tại (Role)</th>
                  <th className="py-3 px-4">Thay Đổi Quyền</th>
                  <th className="py-3 px-4">Ngày Tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                        {(u.full_name || u.email).charAt(0).toUpperCase()}
                      </div>
                      <span>{u.full_name || 'Chưa đặt tên'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'teacher'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        disabled={updatingUserId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="text-xs font-semibold py-1 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      >
                        <option value="student">Học sinh (student)</option>
                        <option value="teacher">Giáo viên (teacher)</option>
                        <option value="admin">Quản trị viên (admin)</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {new Date(u.created_at).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Classes Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-sky-600" />
            <h2 className="font-bold text-slate-900">Quản Lý Toàn Bộ Lớp Học Trong Trường</h2>
          </div>
          <span className="text-xs font-bold text-slate-400">{classesList.length} Lớp học</span>
        </div>

        {classesList.length === 0 ? (
          <EmptyState
            title="Chưa có lớp học nào"
            description="Giáo viên hoặc Admin có thể tạo lớp học mới để bắt đầu giảng dạy."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Tên Lớp Học</th>
                  <th className="py-3 px-4">Mã Gia Nhập (Code)</th>
                  <th className="py-3 px-4">Giáo Viên Phụ Trách</th>
                  <th className="py-3 px-4">Mô Tả Lớp</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classesList.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-mono font-bold text-xs rounded-md">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="font-bold text-slate-800">{c.profiles?.full_name || 'Chưa gán'}</span>
                      <span className="text-slate-400 block">{c.profiles?.email}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 max-w-xs truncate">{c.description || 'Không có mô tả'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteClass(c.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa lớp học"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
