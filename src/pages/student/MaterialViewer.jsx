import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Video, 
  ExternalLink, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const MaterialViewer = () => {
  const { materialId } = useParams();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMaterial = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .eq('id', materialId)
          .single();

        if (!error && data) {
          setMaterial(data);
        }
      } catch (err) {
        console.error('Lỗi tải học liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMaterial();
  }, [materialId]);

  if (loading) {
    return <LoadingSpinner text="Đang tải học liệu từ Supabase Storage..." />;
  }

  if (!material) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 font-bold">Không tìm thấy học liệu yêu cầu.</p>
        <Link to="/student" className="text-xs text-sky-600 font-bold mt-2 inline-block">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <Link to="/student" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 mb-1">
            <ArrowLeft className="w-4 h-4" /> Quay lại Bàn Học
          </Link>
          <h1 className="text-xl font-black text-slate-900">{material.title}</h1>
        </div>

        <a
          href={material.file_url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Tải Tệp Về Máy</span>
        </a>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 uppercase">
            {material.type}
          </span>
          <span className="text-xs font-bold text-slate-400">Môn {material.subject} • Khối {material.grade_level}</span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">{material.description || 'Học liệu số hóa chuẩn chương trình giáo dục.'}</p>

        {material.type === 'video' ? (
          <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
            <video controls className="w-full max-h-[500px]">
              <source src={material.file_url} type="video/mp4" />
              Trình duyệt không hỗ trợ phát video.
            </video>
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FileText className="w-16 h-16 text-sky-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">Tài liệu đã sẵn sàng để học tập</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Bấm vào nút bên dưới để xem trực tiếp hoặc tải tài liệu DOCX/PPTX/PDF từ Supabase Cloud Storage.
            </p>
            <a
              href={material.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold text-xs shadow-lg hover:from-sky-500 hover:to-blue-600 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở Tài Liệu Số Trực Tuyến</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
