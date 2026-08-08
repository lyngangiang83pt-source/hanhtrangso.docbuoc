import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  School, 
  Gamepad2, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  KeyRound, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [myClasses, setMyClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinMsg, setJoinMsg] = useState('');

  const loadStudentData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Tải danh sách lớp học mà học sinh đã gia nhập
      const { data: memberData, error: memErr } = await supabase
        .from('class_members')
        .select(`
          joined_at,
          classes (
            id,
            name,
            code,
            description,
            profiles (full_name, email)
          )
        `)
        .eq('student_id', user.id);

      if (!memErr && memberData) {
        const classesList = memberData.map((m) => m.classes).filter(Boolean);
        setMyClasses(classesList);

        // 2. Tải bài tập / game được giao cho các lớp này
        if (classesList.length > 0) {
          const classIds = classesList.map((c) => c.id);
          const { data: assignData, error: assignErr } = await supabase
            .from('assignments')
            .select(`
              id,
              due_date,
              classes (name),
              materials (id, title, type, file_url, description),
              student_progress (id, status, score, completed_at, student_id)
            `)
            .in('class_id', classIds)
            .order('created_at', { ascending: false });

          if (!assignErr && assignData) {
            setAssignments(assignData);
          }
        }
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu học sinh:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [user]);

  // Học sinh tự nhập Mã Lớp (Join Code) để gia nhập
  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoining(true);
    setJoinMsg('');

    try {
      // Tìm lớp học theo mã code
      const { data: foundClass, error: findErr } = await supabase
        .from('classes')
        .select('id, name')
        .eq('code', joinCode.trim().toUpperCase())
        .single();

      if (findErr || !foundClass) {
        setJoinMsg('❌ Mã lớp không tồn tại trên hệ thống. Vui lòng hỏi lại Thầy/Cô!');
        return;
      }

      // Thêm bản ghi vào class_members
      const { error: joinErr } = await supabase
        .from('class_members')
        .insert([
          {
            class_id: foundClass.id,
            student_id: user.id
          }
        ]);

      if (joinErr) {
        if (joinErr.message.includes('duplicate')) {
          setJoinMsg('⚠️ Em đã gia nhập lớp học này từ trước rồi nhé!');
        } else {
          setJoinMsg('❌ Lỗi: ' + joinErr.message);
        }
        return;
      }

      setJoinMsg(`🎉 Chúc mừng em đã gia nhập thành công lớp "${foundClass.name}"!`);
      setJoinCode('');
      loadStudentData();
    } catch (err) {
      setJoinMsg('❌ Lỗi kết nối Supabase: ' + err.message);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Đang đồng bộ lớp học và nhiệm vụ học tập của em..." />;
  }

  const completedCount = assignments.filter((a) =>
    a.student_progress?.some((p) => p.student_id === user?.id && p.status === 'completed')
  ).length;

  return (
    <div className="space-y-8">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-sky-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Không Gian Học Tập Số Khối 6, 7, 8, 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Xin chào {profile?.full_name || user?.email.split('@')[0]}!
          </h1>
          <p className="text-sm text-emerald-100 mt-2 max-w-xl">
            Hoàn thành các bài tập, ôn luyện kiến thức qua các trò chơi tương tác hấp dẫn và tích lũy điểm thưởng XP.
          </p>
        </div>

        {/* Join Class Quick Box */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-full md:w-80 shadow-lg">
          <form onSubmit={handleJoinClass} className="space-y-2">
            <label className="block text-xs font-bold text-emerald-100 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Nhập Mã Lớp (Join Code):</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Ví dụ: PB-7A1"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white text-slate-900 font-mono font-bold text-xs uppercase focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <button
                type="submit"
                disabled={joining}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs rounded-xl shadow transition-all disabled:opacity-50 flex-shrink-0"
              >
                {joining ? '...' : 'Vào Lớp'}
              </button>
            </div>
            {joinMsg && <p className="text-[11px] font-bold text-amber-200 mt-1">{joinMsg}</p>}
          </form>
        </div>
      </div>

      {/* 3 Metrics: Classes, Completed, XP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <School className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Lớp Đã Gia Nhập</p>
            <p className="text-2xl font-black text-slate-900">{myClasses.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Nhiệm Vụ Đã Xong</p>
            <p className="text-2xl font-black text-slate-900">{completedCount} / {assignments.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Huy Hiệu & Điểm XP</p>
            <p className="text-2xl font-black text-amber-600">{(completedCount * 50) + 100} XP</p>
          </div>
        </div>
      </div>

      {/* Main Content: 2 Columns (Left: Assigned Tasks & Games, Right: My Classes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Tasks & Games (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-sky-600" />
              <span>Nhiệm Vụ & Trò Chơi Thầy/Cô Đã Giao ({assignments.length})</span>
            </h2>
          </div>

          {assignments.length === 0 ? (
            <EmptyState
              title="Chưa có bài tập hoặc game nào"
              description="Khi Thầy/Cô giao bài tập cho lớp, nhiệm vụ sẽ tự động hiển thị ở đây."
            />
          ) : (
            <div className="space-y-4">
              {assignments.map((item) => {
                const mat = item.materials;
                const progress = item.student_progress?.find((p) => p.student_id === user?.id);
                const isDone = progress?.status === 'completed';

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-sky-100 text-sky-800">
                          {mat?.type}
                        </span>
                        <span className="text-xs font-bold text-slate-500">Lớp {item.classes?.name}</span>
                        {isDone && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành ({progress?.score || 100}đ)
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-base text-slate-900 mb-1">{mat?.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{mat?.description || 'Nhiệm vụ học tập số'}</p>

                      {item.due_date && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mt-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Hạn nộp: {new Date(item.due_date).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}
                    </div>

                    <Link
                      to={mat?.type.includes('game') ? `/games/${item.id}` : `/materials/${mat?.id}`}
                      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex-shrink-0 ${
                        isDone
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white'
                      }`}
                    >
                      {mat?.type.includes('game') ? (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          <span>{isDone ? 'Chơi Lại Game' : 'Chơi Game Ngay'}</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4" />
                          <span>{isDone ? 'Xem Lại Bài' : 'Học Bài Ngay'}</span>
                        </>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: My Classes List (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <School className="w-4 h-4 text-sky-600" />
              <span>Lớp Học Của Em ({myClasses.length})</span>
            </h3>

            {myClasses.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                Em chưa tham gia lớp nào. Hãy nhập Mã Lớp ở góc trên nhé!
              </p>
            ) : (
              <div className="space-y-3">
                {myClasses.map((cls) => (
                  <div key={cls.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900">{cls.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Giáo viên: {cls.profiles?.full_name || cls.profiles?.email}
                    </p>
                    <div className="mt-2 text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md inline-block">
                      Mã lớp: {cls.code}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
