import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu profile người dùng từ bảng public.profiles
  const fetchUserProfile = async (userId, userEmail, userMeta) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
        setRole(data.role || 'student');
        return data;
      } else {
        // Nếu trigger chưa kịp tạo, fallback từ metadata
        const fallbackProfile = {
          id: userId,
          email: userEmail,
          full_name: userMeta?.full_name || userEmail.split('@')[0],
          role: userMeta?.role || 'student',
          avatar_url: userMeta?.avatar_url || ''
        };
        setProfile(fallbackProfile);
        setRole(fallbackProfile.role);
        return fallbackProfile;
      }
    } catch (err) {
      console.error('Lỗi khi tải thông tin hồ sơ:', err);
    }
    return null;
  };

  useEffect(() => {
    // 1. Kiểm tra session hiện tại
    const getInitialSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id, session.user.email, session.user.user_metadata);
        } else {
          setUser(null);
          setProfile(null);
          setRole('student');
        }
      } catch (err) {
        console.error('Lỗi kiểm tra session:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Lắng nghe thay đổi trạng thái xác thực
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user.id, session.user.email, session.user.user_metadata);
      } else {
        setUser(null);
        setProfile(null);
        setRole('student');
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Đăng ký tài khoản mới với email + password + role
  const signUp = async ({ email, password, full_name, role: selectedRole }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role: selectedRole || 'student'
        }
      }
    });

    if (error) throw error;

    // Đảm bảo tạo bản ghi trong bảng profiles ngay cả khi trigger trễ
    if (data?.user) {
      try {
        await supabase.from('profiles').upsert([
          {
            id: data.user.id,
            email,
            full_name: full_name || email.split('@')[0],
            role: selectedRole || 'student'
          }
        ]);
      } catch (e) {
        console.warn('Profiles upsert note:', e);
      }
    }

    return data;
  };

  // Đăng nhập
  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  // Đăng xuất
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
    setRole('student');
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id, user.email, user.user_metadata);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        isAdmin: role === 'admin',
        isTeacher: role === 'teacher' || role === 'admin',
        isStudent: role === 'student'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
