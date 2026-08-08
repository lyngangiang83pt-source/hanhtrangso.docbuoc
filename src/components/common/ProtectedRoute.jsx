import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang xác thực bảo mật Supabase Auth..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Nếu quyền không phù hợp, chuyển hướng về đúng dashboard tương ứng
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'teacher') return <Navigate to="/teacher" replace />;
    return <Navigate to="/student" replace />;
  }

  return children;
};
