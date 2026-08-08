import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  BookOpen, 
  GraduationCap, 
  Gamepad2, 
  Sparkles, 
  Layers, 
  Users, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Award, 
  ShieldCheck, 
  School,
  Database,
  Cpu,
  Flame,
  Search,
  ExternalLink,
  ChevronRight,
  Star
} from 'lucide-react';

export const HomePage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPublicMaterials();
  }, []);

  const fetchPublicMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (err) {
      console.warn('Lỗi lấy học liệu từ Supabase:', err.message);
      // Dữ liệu mẫu dự phòng
      setMaterials([
        {
          id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
          title: 'Game Vòng Quay Tri Thức: 8 Biện Pháp Tu Từ',
          description: 'Trò chơi tương tác giúp học sinh nhận diện nhanh so sánh, ẩn dụ, hoán dụ trong Ngữ văn 7.',
          type: 'game_iframe',
          grade_level: 7,
          subject: 'Ngữ văn',
          file_url: 'https://wordwall.net/embed/4f6d4d5e2a3b4c5d6e7f'
        },
        {
          id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
          title: 'Bài giảng PPTX: Cội Nguồn Yêu Thương - Bài 3',
          description: 'Giáo án điện tử số hóa tích hợp video tư liệu trực quan cho học sinh.',
          type: 'document',
          grade_level: 7,
          subject: 'Ngữ văn',
          file_url: 'https://dcmlhyzjkuagjafbvspj.supabase.co/storage/v1/object/public/materials/coi-nguon-yeu-thuong.pptx'
        },
        {
          id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
          title: 'Trò chơi Giải Mã Ô Chữ: Tục Ngữ Về Thiên Nhiên',
          description: 'Học sinh khối 7 thử tài giải nghĩa các câu tục ngữ dự báo thời tiết và sản xuất nông nghiệp.',
          type: 'game_iframe',
          grade_level: 7,
          subject: 'Ngữ văn',
          file_url: 'https://wordwall.net/embed/4f6d4d5e2a3b4c5d6e7f'
        },
        {
          id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
          title: 'Phiếu học tập: Kỹ năng Viết đoạn văn Nghị Luận',
          description: 'Hướng dẫn cấu trúc câu mở đoạn, thân đoạn, kết đoạn và liên kết ý chặt chẽ cho khối 8 & 9.',
          type: 'document',
          grade_level: 8,
          subject: 'Ngữ văn',
          file_url: 'https://dcmlhyzjkuagjafbvspj.supabase.co/storage/v1/object/public/materials/phieu-nghi-luan.docx'
        }
      ]);
    } finally {
      setLoadingMaterials(false);
    }
  };

  const filteredMaterials = materials.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'all') return matchSearch;
    if (activeTab === 'game') return matchSearch && (item.type === 'game_iframe' || item.type === 'game_html5');
    if (activeTab === 'doc') return matchSearch && item.type === 'document';
    if (activeTab === 'grade7') return matchSearch && item.grade_level === 7;
    if (activeTab === 'grade8') return matchSearch && item.grade_level === 8;
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* 1. TOP HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow Background Circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <School className="w-4 h-4" />
              <span>HỆ SINH THÁI CHUYỂN ĐỔI SỐ GIÁO DỤC 4.0</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              HÀNH TRÌNH SỐ <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                TRƯỜNG THCS PHÚ BÌNH
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
              Không gian số hóa bài giảng, học liệu số thông minh, tích hợp Game ôn tập tương tác và theo dõi tiến độ thời gian thực trên nền tảng Supabase.
              <br className="hidden sm:inline" />
              Sáng lập và phát triển bởi <strong className="text-emerald-400">Cô Huỳnh Ngân Giang</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {user ? (
                <button
                  onClick={() => navigate(profile?.role === 'teacher' ? '/teacher' : profile?.role === 'admin' ? '/admin' : '/student')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Vào Bàn Làm Việc Của Bạn</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <Users className="w-5 h-5" />
                    <span>Đăng Ký Tài Khoản Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-bold text-slate-200 hover:text-white flex items-center gap-2 transition-all"
                  >
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    <span>Đăng Nhập Username</span>
                  </Link>
                </>
              )}
            </div>

            {/* Real-time Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">128+</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Bài giảng & Học liệu</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">100%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Số Hóa & Tương Tác</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">4 Khối</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Khối 6, 7, 8, 9</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">24/7</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Supabase Cloud</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KHO HỌC LIỆU & TRÒ CHƠI TƯƠNG TÁC SHOWCASE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 text-emerald-600" />
              <span>Học tập chủ động & Đổi mới sáng tạo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Kho Bài Giảng & Game Tương Tác
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Trực tiếp trải nghiệm các tài nguyên số hóa được biên soạn chuyên nghiệp cho THCS Phú Bình
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài giảng, game..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-2 border-b border-slate-200">
          {[
            { id: 'all', label: 'Tất cả tài nguyên' },
            { id: 'game', label: '🎮 Game tương tác (Wordwall)' },
            { id: 'doc', label: '📄 Bài giảng PPTX / DOCX' },
            { id: 'grade7', label: 'Khối 7' },
            { id: 'grade8', label: 'Khối 8' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        {loadingMaterials ? (
          <div className="py-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-medium">Đang tải kho học liệu từ Supabase Database...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Chưa tìm thấy bài giảng phù hợp</h3>
            <p className="text-xs text-slate-500 mt-1">Hãy thử tìm kiếm với từ khóa khác hoặc chuyển danh mục.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((item) => {
              const isGame = item.type === 'game_iframe' || item.type === 'game_html5';
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  <div className={`p-5 text-white flex items-center justify-between ${
                    isGame ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-emerald-600 to-teal-700'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      {isGame ? <Gamepad2 className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                      <span className="text-xs font-black uppercase tracking-wider bg-black/20 px-2.5 py-1 rounded-lg">
                        {isGame ? 'Game Tương Tác' : 'Bài Giảng Số'}
                      </span>
                    </div>
                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                      Khối {item.grade_level || 7}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                        {item.description || 'Học liệu số hóa phục vụ giảng dạy và ôn tập kiến thức cho học sinh.'}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">Môn: {item.subject || 'Ngữ văn'}</span>
                      {user ? (
                        <Link
                          to={isGame ? `/student/game/${item.id}` : `/student/materials/${item.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                        >
                          <span>{isGame ? 'Chơi ngay' : 'Xem bài giảng'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                        >
                          <span>Đăng nhập để xem</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. KIẾN TRÚC 4 TẦNG EDTECH & CÔNG NGHỆ CHUYÊN NGHIỆP */}
      <section className="py-16 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">CÔNG NGHỆ SỐ HÓA</span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">Kiến Trúc Hệ Thống 4 Tầng</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Hệ thống được thiết kế theo tiêu chuẩn EdTech hiện đại, đảm bảo tốc độ cao, bảo mật và khả năng mở rộng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <School className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Tầng 1: Trải Nghiệm Học Sinh</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Giao diện React hiện đại, tương thích hoàn toàn trên máy tính, máy tính bảng và điện thoại thông minh.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Tầng 2: Game & Học Liệu Tương Tác</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tích hợp iFrame nhúng trò chơi Wordwall, Quizizz và bài giảng số hóa PPTX, PDF lưu trên Supabase Storage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Tầng 3: Cơ Sở Dữ Liệu Supabase</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lưu trữ đám mây an toàn với PostgreSQL, bảo vệ dữ liệu bằng Row Level Security (RLS) và sao lưu tự động.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Tầng 4: Trợ Lý AI Hỗ Trợ 24/7</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Giải đáp câu hỏi Ngữ văn, hướng dẫn phân tích tác phẩm và gợi ý dàn ý bài văn cho học sinh bất kỳ lúc nào.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>HÀNH TRÌNH SỐ - THCS PHÚ BÌNH</span>
            </div>
            <p className="text-slate-500">
              Chuyển đổi số giáo dục & Học tập thông minh 2026. Sáng lập bởi <strong>Huỳnh Ngân Giang</strong>.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-emerald-400 transition-colors">Đăng nhập</Link>
            <Link to="/register" className="hover:text-emerald-400 transition-colors">Đăng ký tài khoản</Link>
            <a href="https://dcmlhyzjkuagjafbvspj.supabase.co" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
              Supabase Cloud
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
