-- ====================================================================
-- HÀNH TRÌNH SỐ - THCS PHÚ BÌNH (hanhtrinhso.docbuoc.vn)
-- BẢN MIGRATION SQL CHUẨN 100% UUID HỢP LỆ (VALID RFC 4122 HEX UUID)
-- Dự án Supabase ID: dcmlhyzjkuagjafbvspj
-- ====================================================================

-- 0. KÍCH HOẠT TIỆN ÍCH TỰ SINH MÃ ĐỊNH DANH (UUID EXTENSION)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. XÓA BẢNG CŨ ĐỂ KHẮC PHỤC TRIỆT ĐỂ MỌI XUNG ĐỘT (DROP CASCADE)
DROP TABLE IF EXISTS public.student_progress CASCADE;
DROP TABLE IF EXISTS public.assignments CASCADE;
DROP TABLE IF EXISTS public.materials CASCADE;
DROP TABLE IF EXISTS public.class_members CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ====================================================================
-- 2. BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES)
-- ====================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    grade_level INT DEFAULT 7 CHECK (grade_level BETWEEN 6 AND 9),
    class_name VARCHAR(50) DEFAULT '7A1',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 3. BẢNG LỚP HỌC (CLASSES)
-- ====================================================================
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    code VARCHAR(20) UNIQUE NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 4. BẢNG THÀNH VIÊN LỚP HỌC (CLASS_MEMBERS)
-- ====================================================================
CREATE TABLE public.class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_class_student UNIQUE(class_id, student_id)
);

-- ====================================================================
-- 5. BẢNG QUẢN LÝ MÔN HỌC (SUBJECTS - THÊM, SỬA, XÓA ĐỒNG BỘ SUPABASE)
-- ====================================================================
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    grade_level INT DEFAULT 7 CHECK (grade_level BETWEEN 6 AND 9),
    description TEXT,
    icon TEXT DEFAULT 'BookOpen',
    color TEXT DEFAULT 'emerald',
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 6. BẢNG KHO HỌC LIỆU & GAME (MATERIALS)
-- ====================================================================
CREATE TABLE public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('document', 'video', 'game_iframe', 'game_html5')),
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT true,
    grade_level INT DEFAULT 7 CHECK (grade_level BETWEEN 6 AND 9),
    subject TEXT DEFAULT 'Ngữ văn',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 6. BẢNG BÀI TẬP & NHIỆM VỤ GIAO (ASSIGNMENTS)
-- ====================================================================
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 7. BẢNG TIẾN ĐỘ & ĐIỂM SỐ HỌC SINH (STUDENT_PROGRESS)
-- ====================================================================
CREATE TABLE public.student_progress (
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
-- 8. TẠO CHỈ MỤC TĂNG TỐC ĐỘ TRUY VẤN (INDEXES)
-- ====================================================================
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_classes_code ON public.classes(code);
CREATE INDEX idx_classes_teacher ON public.classes(teacher_id);
CREATE INDEX idx_class_members_class ON public.class_members(class_id);
CREATE INDEX idx_class_members_student ON public.class_members(student_id);
CREATE INDEX idx_materials_author ON public.materials(author_id);
CREATE INDEX idx_assignments_class ON public.assignments(class_id);
CREATE INDEX idx_assignments_material ON public.assignments(material_id);
CREATE INDEX idx_student_progress_assignment ON public.student_progress(assignment_id);
CREATE INDEX idx_student_progress_student ON public.student_progress(student_id);

-- ====================================================================
-- 9. TRIGGER TỰ ĐỘNG XÁC THỰC EMAIL TỨC THÌ (AUTO-CONFIRM NO VERIFICATION NEEDED)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS trigger AS $$
BEGIN
    NEW.email_confirmed_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_auto_confirm
    BEFORE INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();

-- ====================================================================
-- 10. TRIGGER TỰ ĐỘNG LƯU USER VÀO BẢNG PROFILES KHI ĐĂNG KÝ AUTH
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    clean_user TEXT;
BEGIN
    clean_user := LOWER(COALESCE(
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
        clean_user,
        COALESCE(new.raw_user_meta_data->>'full_name', clean_user),
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        COALESCE((new.raw_user_meta_data->>'grade_level')::INT, 7),
        COALESCE(new.raw_user_meta_data->>'class_name', '7A1'),
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
-- 10. BẬT ROW LEVEL SECURITY (RLS) VÀ CẤP QUYỀN TOÀN DIỆN CHO FE & BE
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- CẤP QUYỀN CHO BẢNG PROFILES
CREATE POLICY "profiles_select_policy" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_policy" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update_policy" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "profiles_delete_policy" ON public.profiles FOR DELETE USING (true);

-- CẤP QUYỀN CHO BẢNG CLASSES
CREATE POLICY "classes_select_policy" ON public.classes FOR SELECT USING (true);
CREATE POLICY "classes_insert_policy" ON public.classes FOR INSERT WITH CHECK (true);
CREATE POLICY "classes_update_policy" ON public.classes FOR UPDATE USING (true);
CREATE POLICY "classes_delete_policy" ON public.classes FOR DELETE USING (true);

-- CẤP QUYỀN CHO BẢNG CLASS_MEMBERS
CREATE POLICY "class_members_select_policy" ON public.class_members FOR SELECT USING (true);
CREATE POLICY "class_members_insert_policy" ON public.class_members FOR INSERT WITH CHECK (true);
CREATE POLICY "class_members_delete_policy" ON public.class_members FOR DELETE USING (true);

-- CẤP QUYỀN CHO BẢNG MATERIALS
CREATE POLICY "materials_select_policy" ON public.materials FOR SELECT USING (true);
CREATE POLICY "materials_insert_policy" ON public.materials FOR INSERT WITH CHECK (true);
CREATE POLICY "materials_update_policy" ON public.materials FOR UPDATE USING (true);
CREATE POLICY "materials_delete_policy" ON public.materials FOR DELETE USING (true);

-- CẤP QUYỀN CHO BẢNG ASSIGNMENTS
CREATE POLICY "assignments_select_policy" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "assignments_insert_policy" ON public.assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "assignments_delete_policy" ON public.assignments FOR DELETE USING (true);

-- CẤP QUYỀN CHO BẢNG STUDENT_PROGRESS
CREATE POLICY "student_progress_select_policy" ON public.student_progress FOR SELECT USING (true);
CREATE POLICY "student_progress_insert_policy" ON public.student_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "student_progress_update_policy" ON public.student_progress FOR UPDATE USING (true);

-- ====================================================================
-- 11. CẤU HÌNH SUPABASE STORAGE BUCKET
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_materials" ON storage.objects;
DROP POLICY IF EXISTS "public_insert_materials" ON storage.objects;

CREATE POLICY "public_read_materials" ON storage.objects FOR SELECT USING (bucket_id = 'materials');
CREATE POLICY "public_insert_materials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'materials');

-- ====================================================================
-- 12. NẠP DỮ LIỆU BAN ĐẦU SẴN SÀNG CHẠY NGAY (SEED DATA VỚI HEX UUID CHUẨN)
-- ====================================================================

-- 1. Tài khoản mẫu Giáo viên & Học sinh (Hex UUID chuẩn 0-9a-f)
INSERT INTO public.profiles (id, email, username, full_name, role, grade_level, class_name)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'ngangiang@phubinh.edu.vn', 'ngangiang', 'Cô Huỳnh Ngân Giang', 'teacher', 7, '7A1'),
    ('22222222-2222-2222-2222-222222222222', 'admin@phubinh.edu.vn', 'admin', 'Quản Trị Viên THCS Phú Bình', 'admin', 9, 'Admin'),
    ('33333333-3333-3333-3333-333333333333', 'nam_8a2@phubinh.edu.vn', 'nam_8a2', 'Lê Hoàng Nam', 'student', 8, '8A2'),
    ('44444444-4444-4444-4444-444444444444', 'an_7a1@phubinh.edu.vn', 'an_7a1', 'Nguyễn Văn An', 'student', 7, '7A1')
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- 2. Lớp học mẫu với mã Join Code sẵn sàng (PB-7A1 và PB-8A2)
INSERT INTO public.classes (id, name, description, code, teacher_id)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ngữ Văn 7A1 - Phú Bình', 'Lớp học số hóa Ngữ văn 7 tích hợp AI và Game tương tác', 'PB-7A1', '11111111-1111-1111-1111-111111111111'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ngữ Văn 8A2 - Phú Bình', 'Lớp bồi dưỡng kỹ năng nghị luận và đọc hiểu văn bản số', 'PB-8A2', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- 3. Gán học sinh vào lớp học
INSERT INTO public.class_members (class_id, student_id)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- 4. Học liệu & Trò chơi Wordwall mẫu
INSERT INTO public.materials (id, title, description, file_url, type, author_id, is_public, grade_level, subject)
VALUES
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Game Vòng Quay Tri Thức: 8 Biện Pháp Tu Từ', 'Trò chơi tương tác giúp học sinh nhận diện nhanh so sánh, ẩn dụ, hoán dụ.', 'https://wordwall.net/embed/4f6d4d5e2a3b4c5d6e7f', 'game_iframe', '11111111-1111-1111-1111-111111111111', true, 7, 'Ngữ văn'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Bài giảng PPTX: Cội nguồn yêu thương - Bài 3', 'Giáo án điện tử số hóa tích hợp video tư liệu.', 'https://dcmlhyzjkuagjafbvspj.supabase.co/storage/v1/object/public/materials/coi-nguon-yeu-thuong.pptx', 'document', '11111111-1111-1111-1111-111111111111', true, 7, 'Ngữ văn')
ON CONFLICT (id) DO NOTHING;

-- 5. Giao bài tập cho lớp
INSERT INTO public.assignments (id, material_id, class_id, due_date)
VALUES
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', now() + interval '7 days')
ON CONFLICT (id) DO NOTHING;
