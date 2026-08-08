import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu hồ sơ người dùng từ bảng public.profiles trên Supabase
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
        const fallbackUsername = userMeta?.username || userEmail?.split('@')[0] || 'user';
        const fallbackProfile = {
          id: userId,
          email: userEmail,
          username: fallbackUsername,
          full_name: userMeta?.full_name || fallbackUsername,
          role: userMeta?.role || 'student',
          grade_level: userMeta?.grade_level || 7,
          class_name: userMeta?.class_name || '7A1',
          avatar_url: userMeta?.avatar_url || ''
        };
        setProfile(fallbackProfile);
        setRole(fallbackProfile.role);
        return fallbackProfile;
      }
    } catch (err) {
      console.error('Lỗi khi tải thông tin profile từ Supabase:', err);
    }
    return null;
  };

  useEffect(() => {
    // 1. Kiểm tra session hiện tại từ Supabase Auth
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

    // 2. Lắng nghe sự kiện thay đổi trạng thái Auth realtime
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

  // Đăng ký tài khoản với Username + Mật khẩu
  const signUp = async ({ username, password, full_name, role: selectedRole, grade_level, class_name }) => {
    const cleanUsername = username.trim().toLowerCase();
    const internalEmail = `${cleanUsername}@docbuoc.vn`;

    const { data, error } = await supabase.auth.signUp({
      email: internalEmail,
      password: password,
      options: {
        data: {
          username: cleanUsername,
          full_name: full_name.trim(),
          role: selectedRole || 'student',
          grade_level: grade_level ? Number(grade_level) : 7,
          class_name: class_name || '7A1'
        }
      }
    });

    if (error) throw error;

    // Đảm bảo tạo bản ghi vào bảng public.profiles
    if (data?.user) {
      try {
        await supabase.from('profiles').upsert([
          {
            id: data.user.id,
            email: internalEmail,
            username: cleanUsername,
            full_name: full_name.trim(),
            role: selectedRole || 'student',
            grade_level: grade_level ? Number(grade_level) : 7,
            class_name: class_name || '7A1'
          }
        ], { onConflict: 'id' });
      } catch (e) {
        console.warn('Ghi chú profiles upsert:', e);
      }
    }

    return data;
  };

  // Đăng nhập bằng Username hoặc Email + Mật khẩu
  const signIn = async ({ username, password }) => {
    let cleanInput = username.trim().toLowerCase();
    let authEmail = cleanInput.includes('@') ? cleanInput : `${cleanInput}@docbuoc.vn`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: password
    });

    if (error) {
      // Nếu đăng nhập bằng username không tìm thấy theo định dạng mặc định, thử tìm email trong profiles
      if (!cleanInput.includes('@')) {
        const { data: userProf } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', cleanInput)
          .single();

        if (userProf?.email) {
          const retry = await supabase.auth.signInWithPassword({
            email: userProf.email,
            password: password
          });
          if (!retry.error) return retry.data;
        }
      }
      throw error;
    }

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
