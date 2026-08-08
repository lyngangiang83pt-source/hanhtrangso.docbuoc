import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  School, 
  Users, 
  PlusCircle, 
  BookOpen, 
  FileText, 
  Gamepad2, 
  ArrowRight, 
  Sparkles, 
  Copy, 
  Check, 
  Calendar,
  Layers
} from 'lucide-react';

export const TeacherDashboard = () => {
  const { user, profile } = useAuth();
  const [classes, setClasses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Tải dữ liệu lớp học của giáo viên
  const loadTeacherData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Tải danh sách lớp học do giáo viên phụ trách kèm số lượng học sinh
      const { data: classData, error: classErr } = await supabase
        .from('classes')
        .select(`
          *,
          class_members (count),
          assignments (id)
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (!classErr && classData) {
        setClasses(classData);
      }

      // 2. Tải học liệu & game do giáo viên tạo
      const { data: matData, error: matErr } = await supabase
        .from('materials')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (!matErr && matData) {
        setMaterials(matData);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Giáo viên từ Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherData();
  }, [user]);

  // Tạo lớp học mới và tạo mã gia nhập ngẫu nhiên (Join Code)
  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setCreating(true);

    try {
      // Sinh mã lớp 6 ký tự viết hoa (VD: PB-7A1 hoặc PB-X9Y2)
      const randomCode = 'PB-' + Math.random().toString(36).substring(2, 6).toUpperCase();

      const { data, error } = await supabase
        .from('classes')
        .insert([
          {
            name: newClassName.trim(),
            description: newClassDesc.trim(),
            code: randomCode,
            teacher_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setClasses((prev) => [
        { ...data, class_members: [{ count: 0 }], assignments: [] },
        ...prev
      ]);
      setNewClassName('');
      setNewClassDesc('');
      setShowCreateModal(false);
    } catch (err) {
      alert('Lỗi tạo lớp học trên Supabase: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const copyJoinCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return <LoadingSpinner text="Đang đồng bộ lớp học và học liệu từ Supabase PostgreSQL..." />;
  }

  const totalStudents = classes.reduce((sum, c) => sum + (c.class_members?.[0]?.count || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Không Gian Giảng Dạy Số THCS Phú Bình</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Chào mừng Thầy/Cô {profile?.full_name || user?.email}!
          </h1>
          <p className="text-sm text-sky-100 mt-2 max-w-xl">
            Quản lý lớp học, phân phối bài giảng PPTX/DOCX số hóa và giao các trò chơi giáo dục tương tác tới học sinh.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-sky-900 font-bold text-sm shadow-md hover:bg-sky-50 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4 text-sky-600" />
            <span>Tạo Lớp Học Mới</span>
          </button>
          <Link
            to="/teacher/materials/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-600/80 hover:bg-sky-600 text-white font-bold text-sm border border-sky-400/30 backdrop-blur-md transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Tải Lên Học Liệu / Nhúng Game</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <School className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Lớp Học Phụ Trách</p>
            <p className="text-2xl font-black text-slate-900">{classes.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Tổng Số Học Sinh</p>
            <p className="text-2xl font-black text-slate-900">{totalStudents}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Học Liệu & Game Đã Tạo</p>
            <p className="text-2xl font-black text-slate-900">{materials.length}</p>
          </div>
        </div>
      </div>

      {/* My Classes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold text-slate-900">Danh Sách Lớp Học Của Tôi</h2>
          </div>
          <span className="text-xs font-bold text-slate-500">{classes.length} Lớp</span>
        </div>

        {classes.length === 0 ? (
          <EmptyState
            title="Thầy/Cô chưa tạo lớp học nào"
            description="Bấm vào nút Tạo Lớp Học Mới để cấp Mã Gia Nhập cho học sinh."
            actionText="Tạo Lớp Học Ngay"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => {
              const studentCount = cls.class_members?.[0]?.count || 0;
              const assignmentCount = cls.assignments?.length || 0;
              return (
                <div
                  key={cls.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-extrabold text-lg text-slate-900">{cls.name}</h3>
                      <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg">
                        <span className="text-xs font-mono font-bold text-sky-800">{cls.code}</span>
                        <button
                          onClick={() => copyJoinCode(cls.code)}
                          className="text-sky-600 hover:text-sky-800"
                          title="Sao chép mã lớp gửi cho học sinh"
                        >
                          {copiedCode === cls.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                      {cls.description || 'Không có mô tả chi tiết'}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span>{studentCount} Học sinh</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <Layers className="w-4 h-4 text-sky-600" />
                        <span>{assignmentCount} Bài tập/Game</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/teacher/classes/${cls.id}`}
                      className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                    >
                      <span>Vào Quản Lý Lớp & Học Sinh</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE CLASS MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Tạo Lớp Học Mới</h3>
            <p className="text-xs text-slate-500 mb-6">
              Hệ thống sẽ tự động tạo Mã Lớp (Join Code) ngẫu nhiên để học sinh tự gia nhập.
            </p>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Lớp Học:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ngữ Văn 7A1 - Phú Bình"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả hoặc Ghi chú:</label>
                <textarea
                  rows="3"
                  placeholder="Ghi chú về mục tiêu học tập, yêu cầu chuẩn bị..."
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-xl"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {creating ? 'Đang tạo trên Supabase...' : 'Xác Nhận Tạo Lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
