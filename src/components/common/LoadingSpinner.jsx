import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Đang tải dữ liệu thực từ Supabase...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700">
        <Loader2 className="w-12 h-12 text-sky-600 animate-spin mb-4" />
        <p className="font-semibold text-lg animate-pulse">{text}</p>
        <span className="text-xs text-slate-400 mt-2">Đang đồng bộ cơ sở dữ liệu Supabase</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-600">
      <Loader2 className="w-8 h-8 text-sky-600 animate-spin mb-2" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
};
