import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  School, 
  Users, 
  UserPlus, 
  Trash2, 
  PlusCircle, 
  Calendar, 
  FileText, 
  Gamepad2, 
  Copy, 
  Check, 
  ArrowLeft,
  Upload,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const ClassDetailView = () => {
  const { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  // Modals state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const loadClassDetail = async () => {
    setLoading(true);
    try {
      // 1. Tải thông tin lớp học
      const { data: cls, error: clsErr } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      if (!clsErr && cls) setClassInfo(cls);

      // 2. Tải danh sách học sinh trong lớp
      const { data: members, error: memErr } = await supabase
        .from('class_members')
        .select('id, joined_at, profiles(id, full_name, email, avatar_url)')
        .eq('class_id', classId);

      if (!memErr && members) {
        setStudents(members);
      }

      // 3. Tải danh sách bài tập / game đã giao cho lớp
      const { data: assigns, error: assignErr } = await supabase
        .from('assignments')
        .select(`
          id,
          due_date,
          created_at,
          materials(id, title, type, subject, file_url),
          student_progress(id, status, score, student_id)
        `)
        .eq('class_id', classId)
        .order('created_at', { ascending: false });

      if (!assignErr && assigns) {
        setAssignments(assigns);
      }

      // 4. Tải kho học liệu của giáo viên để giao bài
      const { data: mats } = await supabase
        .from('materials')
        .select('id, title, type, subject')
        .order('created_at', { ascending: false });
      if (mats) setMaterials(mats);

    } catch (err) {
      console.error('Lỗi khi tải chi tiết lớp học:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassDetail();
  }, [classId]);

  // Thêm học sinh theo Email
  const handleAddStudentByEmail = async (e) => {
    e.preventDefault();
    if (!studentEmail.trim()) return;

    try {
      // Tìm học sinh trong bảng profiles
      const { data: prof, error: findErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', studentEmail.trim().toLowerCase())
        .single();

      if (findErr || !prof) {
        alert('Không tìm thấy học sinh với email này trên Supabase. Học sinh cần đăng ký tài khoản trước!');
        return;
      }

      const { error: joinErr } = await supabase
        .from('class_members')
        .insert([
          {
            class_id: classId,
            student_id: prof.id
          }
        ]);

      if (joinErr) {
        if (joinErr.message.includes('duplicate')) {
          alert('Học sinh này đã có trong lớp rồi!');
        } else {
          alert('Lỗi: ' + joinErr.message);
        }
        return;
      }

      setStudentEmail('');
      setShowAddStudentModal(false);
      loadClassDetail();
    } catch (err) {
      console.error('Lỗi thêm học sinh:', err);
    }
  };

  // Giao bài tập / Trò chơi cho lớp
  const handleAssignMaterial = async (e) => {
    e.preventDefault();
    if (!selectedMaterialId) return;

    try {
      const { error } = await supabase
        .from('assignments')
        .insert([
          {
            class_id: classId,
            material_id: selectedMaterialId,
            due_date: dueDate ? new Date(dueDate).toISOString() : null
          }
        ]);

      if (error) throw error;

      setShowAssignModal(false);
      setSelectedMaterialId('');
      setDueDate('');
      loadClassDetail();
    } catch (err) {
      alert('Lỗi giao bài tập: ' + err.message);
    }
  };

  // Xóa học sinh khỏi lớp
  const handleRemoveStudent = async (memberId) => {
    if (!window.confirm('Thầy/Cô có chắc muốn xóa học sinh này khỏi lớp?')) return;
    try {
      const { error } = await supabase.from('class_members').delete().eq('id', memberId);
      if (!error) {
        setStudents((prev) => prev.filter((m) => m.id !== memberId));
      }
    } catch (e) {}
  };

  const copyCode = () => {
    if (classInfo?.code) {
      navigator.clipboard.writeText(classInfo.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Đang tải danh sách học sinh và bài tập từ Supabase..." />;
  }

  if (!classInfo) {
    return <EmptyState title="Không tìm thấy lớp học" description="Lớp học này không tồn tại hoặc đã bị xóa." />;
  }

  return (
    <div className="space-y-8">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/teacher" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 mb-2">
            <ArrowLeft className="w-4 h-4" /> Quay lại Bàn Làm Việc
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{classInfo.name}</h1>
            <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-3 py-1 rounded-xl">
              <span className="text-xs text-slate-500 font-bold">Mã lớp:</span>
              <span className="text-xs font-mono font-black text-sky-800">{classInfo.code}</span>
              <button onClick={copyCode} className="text-sky-600 hover:text-sky-800 ml-1">
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">{classInfo.description || 'Không có mô tả chi tiết'}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Học Sinh Trực Tiếp</span>
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Giao Bài Tập / Game Mới</span>
          </button>
        </div>
      </div>

      {/* 2 Columns: Left is Student Roster, Right is Assigned Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Roster (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h2 className="font-bold text-slate-900">Sĩ Số Học Sinh Trong Lớp ({students.length})</h2>
              </div>
              <span className="text-xs font-bold text-slate-400">Cách tham gia: Nhập mã {classInfo.code}</span>
            </div>

            {students.length === 0 ? (
              <EmptyState
                title="Chưa có học sinh nào trong lớp"
                description={`Chia sẻ mã lớp [ ${classInfo.code} ] cho học sinh để tự gia nhập hoặc Thêm theo Email.`}
                actionText="Thêm Học Sinh Ngay"
                onAction={() => setShowAddStudentModal(true)}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Họ Và Tên</th>
                      <th className="py-3 px-4">Địa Chỉ Email</th>
                      <th className="py-3 px-4">Ngày Gia Nhập</th>
                      <th className="py-3 px-4 text-right">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((mem) => {
                      const p = mem.profiles;
                      return (
                        <tr key={mem.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                              {(p?.full_name || p?.email || 'H').charAt(0).toUpperCase()}
                            </div>
                            <span>{p?.full_name || 'Học sinh'}</span>
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-slate-500">{p?.email}</td>
                          <td className="py-3 px-4 text-xs text-slate-400">
                            {new Date(mem.joined_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleRemoveStudent(mem.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa học sinh khỏi lớp"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Materials & Games (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900">Bài Tập & Game Đã Giao ({assignments.length})</h3>
              </div>
            </div>

            {assignments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                Chưa giao bài tập hoặc trò chơi nào cho lớp này.
              </p>
            ) : (
              <div className="space-y-3">
                {assignments.map((item) => {
                  const mat = item.materials;
                  const completedCount = item.student_progress?.filter((p) => p.status === 'completed').length || 0;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{mat?.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 uppercase">
                          {mat?.type}
                        </span>
                      </div>

                      {item.due_date && (
                        <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold mb-2">
                          <Clock className="w-3 h-3" />
                          <span>Hạn chót: {new Date(item.due_date).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                        <span>Đã hoàn thành:</span>
                        <span className="font-bold text-emerald-600">
                          {completedCount} / {students.length} HS
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Thêm Học Sinh Vào Lớp</h3>
            <p className="text-xs text-slate-500 mb-6">
              Nhập địa chỉ Email học sinh đã đăng ký trên Supabase Database.
            </p>

            <form onSubmit={handleAddStudentByEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email học sinh:</label>
                <input
                  type="email"
                  required
                  placeholder="hocsinh7a1@phubinh.edu.vn"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Thêm Học Sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN MATERIAL MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Giao Học Liệu / Game Cho Lớp</h3>
            <p className="text-xs text-slate-500 mb-6">
              Học sinh trong lớp sẽ nhìn thấy bài tập này trong mục Bàn Học Cá Nhân.
            </p>

            <form onSubmit={handleAssignMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Học Liệu / Trò Chơi:</label>
                <select
                  required
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">-- Chọn bài học hoặc trò chơi --</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.type.toUpperCase()}] {m.title} ({m.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hạn chót nộp bài (Tùy chọn):</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Giao Bài Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
