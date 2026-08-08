import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { HomePage } from './pages/public/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { ClassDetailView } from './pages/teacher/ClassDetailView';
import { MaterialManager } from './pages/teacher/MaterialManager';
import { SubjectManager } from './pages/teacher/SubjectManager';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { GamePlayer } from './pages/student/GamePlayer';
import { MaterialViewer } from './pages/student/MaterialViewer';

// Root Dispatcher
const RootRoute = () => {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  if (!user) return <HomePage />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'teacher') return <Navigate to="/teacher" replace />;
  return <Navigate to="/student" replace />;
};

// Main Layout Wrapper with Header and Sidebar
const MainLayout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {user && <Sidebar />}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/explore" element={<HomePage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <MainLayout>
                  <TeacherDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/subjects"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <MainLayout>
                  <SubjectManager />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/classes/:classId"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <MainLayout>
                  <ClassDetailView />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/materials/new"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <MainLayout>
                  <MaterialManager />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                <MainLayout>
                  <StudentDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/game/:materialId"
            element={
              <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                <MainLayout>
                  <GamePlayer />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/materials/:id"
            element={
              <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                <MainLayout>
                  <MaterialViewer />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
