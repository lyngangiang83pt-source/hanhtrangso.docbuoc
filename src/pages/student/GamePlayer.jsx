import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  Gamepad2, 
  ArrowLeft, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Maximize2
} from 'lucide-react';

export const GamePlayer = () => {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [submittingScore, setSubmittingScore] = useState(false);
  const [scoreAchieved, setScoreAchieved] = useState(100);
  const [completedNotice, setCompletedNotice] = useState(false);

  useEffect(() => {
    const loadGameData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select(`
            id,
            due_date,
            classes (name),
            materials (*)
          `)
          .eq('id', assignmentId)
          .single();

        if (!error && data) {
          setAssignment(data);
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu trò chơi:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGameData();

    // Đồng hồ đếm thời gian chơi thực tế
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [assignmentId]);

  // Nộp điểm số và lưu trạng thái completed vào Supabase
  const handleSubmitGameScore = async () => {
    if (!user || !assignment) return;
    setSubmittingScore(true);

    try {
      const { error } = await supabase
        .from('student_progress')
        .upsert([
          {
            assignment_id: assignment.id,
            student_id: user.id,
            status: 'completed',
            score: Number(scoreAchieved),
            completion_time_seconds: elapsedSeconds,
            completed_at: new Date().toISOString()
          }
        ], { onConflict: 'assignment_id,student_id' });

      if (error) throw error;

      setCompletedNotice(true);
      setTimeout(() => {
        navigate('/student');
      }, 2000);
    } catch (err) {
      alert('Lỗi lưu điểm lên Supabase: ' + err.message);
    } finally {
      setSubmittingScore(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Đang khởi chạy trò chơi giáo dục tương tác từ Supabase..." />;
  }

  const mat = assignment?.materials;
  const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
  const seconds = String(elapsedSeconds % 60).padStart(2, '0');

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <Link to="/student" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 mb-1">
            <ArrowLeft className="w-4 h-4" /> Quay lại Bàn Học
          </Link>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-500" />
            <span>{mat?.title || 'Đấu Trường Trò Chơi Tương Tác'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Thời gian: {minutes}:{seconds}</span>
          </div>

          <button
            onClick={handleSubmitGameScore}
            disabled={submittingScore}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>{submittingScore ? 'Đang lưu...' : 'Hoàn Thành & Ghi Điểm'}</span>
          </button>
        </div>
      </div>

      {completedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in zoom-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold">CHÚC MỪNG EM ĐÃ HOÀN THÀNH XUẤT SẮC TRÒ CHƠI!</p>
            <p className="text-xs">
              Điểm số <strong>{scoreAchieved}/100</strong> và thời gian <strong>{minutes}:{seconds}</strong> đã được đồng bộ vào bảng <code>student_progress</code> trên Supabase.
            </p>
          </div>
        </div>
      )}

      {/* Game Runner Container (iFrame Embed or Interactive HTML5) */}
      <div className="w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 min-h-[580px] flex flex-col justify-between">
        {mat?.file_url?.includes('http') ? (
          <iframe
            src={mat.file_url}
            title={mat.title}
            className="w-full flex-1 min-h-[580px] border-0"
            allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : (
          <div className="p-12 text-center text-white flex flex-col items-center justify-center my-auto">
            <Gamepad2 className="w-16 h-16 text-amber-400 mb-4 animate-bounce" />
            <h3 className="text-2xl font-black mb-2">{mat?.title}</h3>
            <p className="text-slate-400 text-sm max-w-md mb-6">{mat?.description}</p>
            <button
              onClick={handleSubmitGameScore}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl"
            >
              Bắt Đầu Ghi Nhận Điểm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
