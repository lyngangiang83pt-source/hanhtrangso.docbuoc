-- ====================================================================
-- HÀNH TRÌNH SỐ - THCS PHÚ BÌNH (hanhtrinhso.docbuoc.vn)
-- BẢN MIGRATION SQL CHUẨN XÁC THỰC USERNAME & MẬT KHẨU (SUPABASE DB: dcmlhyzjkuagjafbvspj)
-- Sáng lập viên: Huỳnh Ngân Giang | Phân quyền: admin | teacher | student
-- ====================================================================

-- 0. KÍCH HOẠT TIỆN ÍCH MÃ ĐỊNH DANH (UUID & PGCRYPTO)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES - HỖ TRỢ USERNAME & PASSWORD)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    grade_level INT CHECK (grade_level BETWEEN 6 AND 9),
    class_name VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 2. BẢNG LỚP HỌC (CLASSES)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    code VARCHAR(10) UNIQUE NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 3. BẢNG THÀNH VIÊN LỚP HỌC (CLASS_MEMBERS)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_class_student UNIQUE(class_id, student_id)
);

-- ====================================================================
-- 4. BẢNG KHO HỌC LIỆU & GAME (MATERIALS)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('document', 'video', 'game_iframe', 'game_html5')),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    grade_level INT CHECK (grade_level BETWEEN 6 AND 9),
    subject TEXT DEFAULT 'Ngữ văn',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 5. BẢNG BÀI TẬP & NHIỆM VỤ GIAO (ASSIGNMENTS)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 6. BẢNG TIẾN ĐỘ & ĐIỂM SỐ HỌC SINH (STUDENT_PROGRESS)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    score NUMERIC(5, 2) DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    completion_time_seconds INT DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_assignment_student UNIQUE(assignment_id, student_id)
);

-- ====================================================================
-- TẠO CHỈ MỤC TỐI ƯU HIỆU NĂNG TRUY VẤN (INDEXES)
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_code ON public.classes(code);
CREATE INDEX IF NOT EXISTS idx_class_members_student ON public.class_members(student_id);
CREATE INDEX IF NOT EXISTS idx_class_members_class ON public.class_members(class_id);
CREATE INDEX IF NOT EXISTS idx_materials_author ON public.materials(author_id);
CREATE INDEX IF NOT EXISTS idx_materials_type_grade ON public.materials(type, grade_level);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON public.assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_material ON public.assignments(material_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_assignment ON public.student_progress(assignment_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student ON public.student_progress(student_id);

-- ====================================================================
-- TRIGGER TỰ ĐỘNG LƯU USERNAME VÀO PROFILES KHI ĐĂNG KÝ SUPABASE AUTH
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    extracted_username TEXT;
BEGIN
    extracted_username := LOWER(COALESCE(
        new.raw_user_meta_data->>'username',
        split_part(new.email, '@', 1)
    ));

    INSERT INTO public.profiles (
        id, 
        email, 
        username, 
        full_name, 
        role, 
        grade_level,
        class_name,
        avatar_url
    )
    VALUES (
        new.id,
        new.email,
        extracted_username,
        COALESCE(new.raw_user_meta_data->>'full_name', extracted_username),
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        (new.raw_user_meta_data->>'grade_level')::INT,
        new.raw_user_meta_data->>'class_name',
        COALESCE(new.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        username = EXCLUDED.username,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        role = COALESCE(EXCLUDED.role, public.profiles.role),
        grade_level = COALESCE(EXCLUDED.grade_level, public.profiles.grade_level),
        class_name = COALESCE(EXCLUDED.class_name, public.profiles.class_name);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- BẬT ROW LEVEL SECURITY (RLS)
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- XÓA TẤT CẢ CHÍNH SÁCH CŨ TRƯỚC KHI TẠO MỚI (TRÁNH LỖI DUPLICATE)
-- ====================================================================
DROP POLICY IF EXISTS "Cho phép đọc hồ sơ công khai" ON public.profiles;
DROP POLICY IF EXISTS "Người dùng tự cập nhật hồ sơ cá nhân" ON public.profiles;
DROP POLICY IF EXISTS "Cho phép đăng ký hồ sơ mới" ON public.profiles;
DROP POLICY IF EXISTS "Admin toàn quyền quản lý hồ sơ" ON public.profiles;

DROP POLICY IF EXISTS "Đọc lớp học nếu là giáo viên dạy hoặc học sinh trong lớp" ON public.classes;
DROP POLICY IF EXISTS "Giáo viên và Admin được tạo lớp học" ON public.classes;
DROP POLICY IF EXISTS "Giáo viên và Admin được sửa xóa lớp học của mình" ON public.classes;
DROP POLICY IF EXISTS "Giáo viên và Admin được xóa lớp học của mình" ON public.classes;

DROP POLICY IF EXISTS "Xem thành viên nếu là giáo viên lớp hoặc học sinh trong lớp" ON public.class_members;
DROP POLICY IF EXISTS "Học sinh tự tham gia lớp học qua mã hoặc giáo viên thêm" ON public.class_members;
DROP POLICY IF EXISTS "Giáo viên hoặc Admin được xóa học sinh khỏi lớp" ON public.class_members;

DROP POLICY IF EXISTS "Đọc học liệu công khai hoặc do giáo viên tạo hoặc được giao cho lớp" ON public.materials;
DROP POLICY IF EXISTS "Giáo viên và Admin được thêm học liệu" ON public.materials;
DROP POLICY IF EXISTS "Tác giả và Admin được sửa xóa học liệu" ON public.materials;
DROP POLICY IF EXISTS "Tác giả và Admin được xóa học liệu" ON public.materials;

DROP POLICY IF EXISTS "Xem bài tập nếu là học sinh lớp đó hoặc giáo viên dạy" ON public.assignments;
DROP POLICY IF EXISTS "Giáo viên tạo bài tập cho lớp mình dạy" ON public.assignments;
DROP POLICY IF EXISTS "Giáo viên xóa bài tập lớp mình" ON public.assignments;

DROP POLICY IF EXISTS "Học sinh xem tiến độ của mình, giáo viên xem tiến độ cả lớp" ON public.student_progress;
DROP POLICY IF EXISTS "Học sinh tự tạo hoặc cập nhật tiến độ của mình" ON public.student_progress;
DROP POLICY IF EXISTS "Học sinh tự cập nhật điểm số và trạng thái hoàn thành" ON public.student_progress;

-- ====================================================================
-- TÁI TẠO CÁC CHÍNH SÁCH BẢO MẬT RLS CHUẨN XÁC
-- ====================================================================

-- 1. PROFILES
CREATE POLICY "Cho phép đọc hồ sơ công khai" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Cho phép đăng ký hồ sơ mới" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Người dùng tự cập nhật hồ sơ cá nhân" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. CLASSES
CREATE POLICY "Đọc lớp học nếu là giáo viên dạy hoặc học sinh trong lớp" ON public.classes FOR SELECT USING (
    public.classes.teacher_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.class_members 
        WHERE public.class_members.class_id = public.classes.id 
          AND public.class_members.student_id = auth.uid()
    )
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Giáo viên và Admin được tạo lớp học" ON public.classes FOR INSERT WITH CHECK (
    auth.uid() = public.classes.teacher_id 
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Giáo viên và Admin được sửa xóa lớp học của mình" ON public.classes FOR UPDATE USING (
    public.classes.teacher_id = auth.uid() 
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Giáo viên và Admin được xóa lớp học của mình" ON public.classes FOR DELETE USING (
    public.classes.teacher_id = auth.uid() 
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 3. CLASS_MEMBERS
CREATE POLICY "Xem thành viên nếu là giáo viên lớp hoặc học sinh trong lớp" ON public.class_members FOR SELECT USING (
    public.class_members.student_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.classes 
        WHERE public.classes.id = public.class_members.class_id 
          AND public.classes.teacher_id = auth.uid()
    )
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Học sinh tự tham gia lớp học qua mã hoặc giáo viên thêm" ON public.class_members FOR INSERT WITH CHECK (
    public.class_members.student_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.classes 
        WHERE public.classes.id = public.class_members.class_id 
          AND public.classes.teacher_id = auth.uid()
    )
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Giáo viên hoặc Admin được xóa học sinh khỏi lớp" ON public.class_members FOR DELETE USING (
    public.class_members.student_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.classes 
        WHERE public.classes.id = public.class_members.class_id 
          AND public.classes.teacher_id = auth.uid()
    )
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 4. MATERIALS
CREATE POLICY "Đọc học liệu công khai hoặc do giáo viên tạo hoặc được giao cho lớp" ON public.materials FOR SELECT USING (
    public.materials.is_public = true
    OR public.materials.author_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.assignments a
        JOIN public.class_members cm ON cm.class_id = a.class_id
        WHERE a.material_id = public.materials.id AND cm.student_id = auth.uid()
    )
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Giáo viên và Admin được thêm học liệu" ON public.materials FOR INSERT WITH CHECK (
    auth.uid() = public.materials.author_id 
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Tác giả và Admin được sửa xóa học liệu" ON public.materials FOR UPDATE USING (
    public.materials.author_id = auth.uid() 
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Tác giả và Admin được xóa học liệu" ON public.materials FOR DELETE USING (
    public.materials.author_id = auth.uid() 
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 5. ASSIGNMENTS
CREATE POLICY "Xem bài tập nếu là học sinh lớp đó hoặc giáo viên dạy" ON public.assignments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.classes 
        WHERE public.classes.id = public.assignments.class_id 
          AND public.classes.teacher_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.class_members 
        WHERE public.class_members.class_id = public.assignments.class_id 
          AND public.class_members.student_id = auth.uid()
    )
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Giáo viên tạo bài tập cho lớp mình dạy" ON public.assignments FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.classes 
        WHERE public.classes.id = public.assignments.class_id 
          AND public.classes.teacher_id = auth.uid()
    )
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Giáo viên xóa bài tập lớp mình" ON public.assignments FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.classes 
        WHERE public.classes.id = public.assignments.class_id 
          AND public.classes.teacher_id = auth.uid()
    )
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 6. STUDENT_PROGRESS
CREATE POLICY "Học sinh xem tiến độ của mình, giáo viên xem tiến độ cả lớp" ON public.student_progress FOR SELECT USING (
    public.student_progress.student_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.assignments a
        JOIN public.classes c ON c.id = a.class_id
        WHERE a.id = public.student_progress.assignment_id AND c.teacher_id = auth.uid()
    )
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Học sinh tự tạo hoặc cập nhật tiến độ của mình" ON public.student_progress FOR INSERT WITH CHECK (
    public.student_progress.student_id = auth.uid()
);

CREATE POLICY "Học sinh tự cập nhật điểm số và trạng thái hoàn thành" ON public.student_progress FOR UPDATE USING (
    public.student_progress.student_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.assignments a
        JOIN public.classes c ON c.id = a.class_id
        WHERE a.id = public.student_progress.assignment_id AND c.teacher_id = auth.uid()
    )
);

-- ====================================================================
-- CẤU HÌNH SUPABASE STORAGE BUCKETS
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Cho phép đọc Storage materials công khai" ON storage.objects;
DROP POLICY IF EXISTS "Người dùng tải file vào materials" ON storage.objects;

CREATE POLICY "Cho phép đọc Storage materials công khai" ON storage.objects FOR SELECT USING (bucket_id = 'materials');
CREATE POLICY "Người dùng tải file vào materials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'materials' AND auth.role() = 'authenticated');
