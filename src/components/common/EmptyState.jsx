import React from 'react';
import { FolderSearch, PlusCircle } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FolderSearch,
  title = 'Chưa có dữ liệu',
  description = 'Hiện tại chưa có bản ghi nào trong hệ thống Supabase Database.',
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl shadow-sm my-4">
      <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white text-sm font-semibold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};
