import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Atom,
  Globe,
  Cpu,
  Calculator,
  Compass,
  Palette,
  FileCode,
  Search,
  X
} from 'lucide-react';

const ICON_MAP = {
  BookOpen,
  Atom,
  Globe,
  Cpu,
  Calculator,
  Compass,
  Palette,
  FileCode
};

const COLOR_OPTIONS = [
  { id: 'emerald', label: 'Xanh Lá (Emerald)', class: 'from-emerald-600 to-teal-700', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'blue', label: 'Xanh Dương (Blue)', class: 'from-blue-600 to-indigo-700', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'purple', label: 'Tím (Purple)', class: 'from-purple-600 to-pink-700', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'amber', label: 'Vàng Cam (Amber)', class: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'teal', label: 'Xanh Mòng Két (Teal)', class: 'from-teal-600 to-cyan-700', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'rose', label: 'Đỏ Hồng (Rose)', class: 'from-rose-600 to-pink-700', bg: 'bg-rose-50 text-rose-700 border-rose-200' }
];

export const SubjectManager = () => {
  const { user, profile } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [gradeLevel, setGradeLevel] = useState(7);
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('BookOpen');
  const [color, setColor] = useState('emerald');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback demo data if table is freshly created
        console.warn('Lỗi tải môn học từ Supabase:', error.message);
        setSubjects([
          {
            id: 's0000000-0000-0000-0000-000000000001',
            name: 'Ngữ Văn 7 - Kết Nối Tri Thức',
            code: 'VAN7',
            grade_level: 7,
            description: 'Chương trình số hóa môn Ngữ văn 7 tích hợp AI và Game tương tác',
            icon: 'BookOpen',
            color: 'emerald'
          },
          {
            id: 's0000000-0000-0000-0000-000000000002',
            name: 'Ngữ Văn 8 - Bồi Dưỡng Nghị Luận',
            code: 'VAN8',
            grade_level: 8,
            description: 'Học phần văn học trung đại và rèn luyện kỹ năng phân tích văn bản số',
            icon: 'BookOpen',
            color: 'blue'
          },
          {
            id: 's0000000-0000-0000-0000-000000000003',
            name: 'Lịch Sử & Địa Lí 7',
            code: 'LSDL7',
            grade_level: 7,
            description: 'Số hóa tư liệu lịch sử địa phương và bản đồ số tương tác',
            icon: 'Globe',
            color: 'amber'
          }
        ]);
      } else {
        setSubjects(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingSubject(null);
    setName('');
    setCode('');
    setGradeLevel(7);
    setDescription('');
    setIcon('BookOpen');
    setColor('emerald');
    setFeedback({ type: '', msg: '' });
    setShowModal(true);
  };

  const handleOpenEditModal = (sub) => {
    setEditingSubject(sub);
    setName(sub.name);
    setCode(sub.code);
    setGradeLevel(sub.grade_level || 7);
    setDescription(sub.description || '');
    setIcon(sub.icon || 'BookOpen');
    setColor(sub.color || 'emerald');
    setFeedback({ type: '', msg: '' });
    setShowModal(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', msg: '' });

    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '');
    const cleanName = name.trim();

    try {
      if (editingSubject) {
        // CẬP NHẬT MÔN HỌC
        const { error } = await supabase
          .from('subjects')
          .update({
            name: cleanName,
            code: cleanCode,
            grade_level: Number(gradeLevel),
            description: description.trim(),
            icon: icon,
            color: color
          })
          .eq('id', editingSubject.id);

        if (error) throw error;
        setFeedback({ type: 'success', msg: `Cập nhật môn học "${cleanName}" thành công trên Supabase!` });
      } else {
        // THÊM MỚI MÔN HỌC
        const { error } = await supabase
          .from('subjects')
          .insert([
            {
              name: cleanName,
              code: cleanCode,
              grade_level: Number(gradeLevel),
              description: description.trim(),
              icon: icon,
              color: color,
              teacher_id: user?.id
            }
          ]);

        if (error) throw error;
        setFeedback({ type: 'success', msg: `Thêm mới môn học "${cleanName}" (${cleanCode}) thành công!` });
      }

      await fetchSubjects();
      setTimeout(() => {
        setShowModal(false);
      }, 1200);
    } catch (err) {
      console.error('Lỗi lưu môn học:', err);
      setFeedback({ type: 'error', msg: err.message || 'Lỗi đồng bộ môn học lên Supabase Database' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubject = async (subjectId, subjectName) => {
    if (!window.confirm(`Thầy/cô có chắc chắn muốn xóa môn học "${subjectName}" khỏi hệ thống không?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (error) throw error;
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
      alert(`Đã xóa thành công môn học "${subjectName}"!`);
    } catch (err) {
      console.error('Lỗi xóa môn học:', err);
      alert('Không thể xóa môn học: ' + err.message);
    }
  };

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>PHÂN HỆ QUẢN LÝ DÀNH CHO GIÁO VIÊN & ADMIN</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Quản Lý Thẻ Môn Học</h1>
          <p className="text-sm text-slate-500 mt-1">
            Thêm, chỉnh sửa và xóa môn học đồng bộ thời gian thực với Supabase PostgreSQL Database.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Môn Học Mới</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên môn học hoặc mã môn (VD: VAN7, KHTN7)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>
        <div className="text-xs font-bold text-slate-500">
          Tổng số: <span className="text-emerald-600 font-extrabold text-sm">{filteredSubjects.length}</span> môn học
        </div>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
          <p className="text-sm font-medium">Đang tải danh sách môn học từ Supabase...</p>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-base">Chưa có môn học nào phù hợp</h3>
          <p className="text-xs text-slate-400 mt-1">Bấm nút "Thêm Môn Học Mới" để tạo môn đầu tiên cho trường.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub) => {
            const IconComponent = ICON_MAP[sub.icon] || BookOpen;
            const colorScheme = COLOR_OPTIONS.find(c => c.id === sub.color) || COLOR_OPTIONS[0];

            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className={`p-5 bg-gradient-to-r ${colorScheme.class} text-white flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                          Mã: {sub.code}
                        </span>
                        <h3 className="font-bold text-base mt-1 text-white leading-snug">{sub.name}</h3>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">
                      Khối {sub.grade_level || 7}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-slate-600 leading-relaxed min-h-[3rem]">
                      {sub.description || 'Chưa có mô tả chi tiết cho môn học này.'}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    ID: {sub.id.slice(0, 8)}...
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(sub)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                      title="Chỉnh sửa môn học"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(sub.id, sub.name)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                      title="Xóa môn học khỏi Supabase"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL THÊM / SỬA MÔN HỌC */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-base">
                  {editingSubject ? 'Chỉnh Sửa Môn Học' : 'Thêm Môn Học Mới'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="p-6 space-y-4 overflow-y-auto">
              {feedback.msg && (
                <div
                  className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  <span>{feedback.msg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên môn học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Ngữ Văn 7 - Kết Nối Tri Thức"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã môn học (Code) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="VD: VAN7, KHTN7"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khối lớp:</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả môn học:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả nội dung chương trình, mục tiêu học tập..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Biểu tượng đại diện (Icon):</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(ICON_MAP).map((iconKey) => {
                    const IconComp = ICON_MAP[iconKey];
                    const isSelected = icon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setIcon(iconKey)}
                        className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-[11px] truncate">{iconKey}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Scheme */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Bảng màu thẻ (Color Scheme):</label>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_OPTIONS.map((col) => {
                    const isSelected = color === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setColor(col.id)}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${col.class}`} />
                        <span className="text-[11px] truncate">{col.id.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu lên Supabase...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingSubject ? 'Cập Nhật Môn Học' : 'Tạo Môn Học Mới'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
