import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  UploadCloud, 
  Gamepad2, 
  FileText, 
  Video, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  PlusCircle, 
  Eye,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';

export const MaterialManager = () => {
  const { user, isTeacher } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('document');
  const [subject, setSubject] = useState('Ngữ văn');
  const [gradeLevel, setGradeLevel] = useState(7);
  const [isPublic, setIsPublic] = useState(true);
  const [iframeUrl, setIframeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [successNotice, setSuccessNotice] = useState('');

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMaterials(data);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách học liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setUploading(true);
    setSuccessNotice('');

    try {
      let finalFileUrl = iframeUrl;

      // Nếu là upload file (PDF, DOCX, PPTX, MP4) -> Tải trực tiếp lên Supabase Storage
      if (type === 'document' || type === 'video' || type === 'game_html5') {
        if (selectedFile) {
          const fileExt = selectedFile.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { data: storageData, error: storageErr } = await supabase.storage
            .from('materials')
            .upload(fileName, selectedFile);

          if (storageErr) throw storageErr;

          const { data: urlData } = supabase.storage
            .from('materials')
            .getPublicUrl(fileName);

          finalFileUrl = urlData.publicUrl;
        } else if (!iframeUrl) {
          throw new Error('Vui lòng chọn tệp tin hoặc nhập đường dẫn file!');
        }
      }

      // Ghi bản ghi vào bảng materials
      const { data, error } = await supabase
        .from('materials')
        .insert([
          {
            title: title.trim(),
            description: description.trim(),
            type: type,
            subject: subject,
            grade_level: Number(gradeLevel),
            is_public: isPublic,
            file_url: finalFileUrl,
            author_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setSuccessNotice(`Đã lưu thành công [${type.toUpperCase()}] "${title}" lên Supabase!`);
      setTitle('');
      setDescription('');
      setIframeUrl('');
      setSelectedFile(null);
      loadMaterials();
    } catch (err) {
      alert('Lỗi tạo học liệu: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Thầy/Cô có chắc muốn xóa học liệu/game này?')) return;
    try {
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (!error) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Lỗi xóa:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Đang tải kho học liệu số & game từ Supabase Storage..." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <UploadCloud className="w-8 h-8 text-sky-600" />
          <span>KHO HỌC LIỆU SỐ & TRÒ CHƠI GIÁO DỤC TƯƠNG TÁC</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tải tài liệu PDF, DOCX, PPTX, MP4 lên Supabase Storage hoặc Nhúng Game iFrame (Wordwall, Quizizz, Kahoot, HTML5).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Upload & Embed (1 Col) */}
        {isTeacher && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-sky-600" />
              <span>Thêm Học Liệu / Game Mới</span>
            </h2>

            {successNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            <form onSubmit={handleCreateMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Loại Học Liệu / Game:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-sky-500"
                >
                  <option value="document">📄 Tài liệu bài giảng (PDF / DOCX / PPTX)</option>
                  <option value="video">📽️ Video bài giảng / Phim tư liệu (MP4)</option>
                  <option value="game_iframe">🎮 Trò chơi nhúng iFrame (Wordwall, Quizizz, Kahoot)</option>
                  <option value="game_html5">🕹️ Game HTML5 đóng gói</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề học liệu / Game:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ôn tập biện pháp tu từ Ngữ văn 7"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Môn học:</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khối lớp:</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>
              </div>

              {type === 'game_iframe' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đường dẫn iFrame Embed (Wordwall / Quizizz / Kahoot):
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://wordwall.net/embed/..."
                    value={iframeUrl}
                    onChange={(e) => setIframeUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tải tệp tin lên Supabase Storage:
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả tóm tắt:</label>
                <textarea
                  rows="2"
                  placeholder="Gợi ý phương pháp làm bài, mục tiêu cần đạt..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublicCheck"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <label htmlFor="isPublicCheck" className="text-xs font-bold text-slate-700">
                  Cho phép toàn trường truy cập công khai
                </label>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {uploading ? 'Đang tải lên Supabase Storage...' : 'Lưu Vào Kho Học Liệu'}
              </button>
            </form>
          </div>
        )}

        {/* List of Materials & Games (2 Cols) */}
        <div className={`space-y-4 ${isTeacher ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Danh Mục Tài Liệu & Game ({materials.length})</h2>
            <span className="text-xs font-bold text-slate-400">Đồng bộ Supabase Realtime</span>
          </div>

          {materials.length === 0 ? (
            <EmptyState
              title="Kho học liệu đang trống"
              description="Hãy bắt đầu tải bài giảng hoặc nhúng các game Wordwall/Quizizz đầu tiên."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {materials.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-sky-100 text-sky-800">
                        {item.type}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        {item.is_public ? (
                          <Globe className="w-3.5 h-3.5 text-emerald-600" title="Công khai" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-amber-600" title="Riêng tư" />
                        )}
                        <span>Khối {item.grade_level || 7}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                      {item.description || 'Học liệu phục vụ việc dạy và học sáng tạo.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{item.type.includes('game') ? 'Mở Trò Chơi' : 'Xem / Tải File'}</span>
                    </a>

                    {isTeacher && item.author_id === user.id && (
                      <button
                        onClick={() => handleDeleteMaterial(item.id)}
                        className="p-1.5 text-slate-300 hover:text-red-600 rounded-lg"
                        title="Xóa học liệu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
