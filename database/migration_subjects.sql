-- ====================================================================
-- HÀNH TRÌNH SỐ - THCS PHÚ BÌNH (hanhtrinhso.docbuoc.vn)
-- MIGRATION: BỔ SUNG BẢNG QUẢN LÝ MÔN HỌC (SUBJECTS) ĐỒNG BỘ 100% SUPABASE
-- Dự án Supabase ID: dcmlhyzjkuagjafbvspj
-- ====================================================================

-- 1. TẠO BẢNG QUẢN LÝ MÔN HỌC (SUBJECTS)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    grade_level INT DEFAULT 7 CHECK (grade_level BETWEEN 6 AND 9),
    description TEXT,
    icon TEXT DEFAULT 'BookOpen',
    color TEXT DEFAULT 'emerald',
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TẠO CHỈ MỤC TĂNG TỐC ĐỘ TRUY VẤN MÔN HỌC
CREATE INDEX IF NOT EXISTS idx_subjects_teacher ON public.subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_subjects_grade ON public.subjects(grade_level);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON public.subjects(code);

-- 3. BẬT ROW LEVEL SECURITY (RLS) VÀ CẤP QUYỀN TOÀN DIỆN CHO MÔN HỌC
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subjects_select_policy" ON public.subjects;
DROP POLICY IF EXISTS "subjects_insert_policy" ON public.subjects;
DROP POLICY IF EXISTS "subjects_update_policy" ON public.subjects;
DROP POLICY IF EXISTS "subjects_delete_policy" ON public.subjects;

CREATE POLICY "subjects_select_policy" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "subjects_insert_policy" ON public.subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "subjects_update_policy" ON public.subjects FOR UPDATE USING (true);
CREATE POLICY "subjects_delete_policy" ON public.subjects FOR DELETE USING (true);

-- 4. NẠP DỮ LIỆU MẪU MÔN HỌC BAN ĐẦU CHO GIÁO VIÊN
INSERT INTO public.subjects (id, name, code, grade_level, description, icon, color, teacher_id)
VALUES
    ('s0000000-0000-0000-0000-000000000001', 'Ngữ Văn 7 - Kết Nối Tri Thức', 'VAN7', 7, 'Chương trình số hóa môn Ngữ văn 7 tích hợp AI và Game tương tác', 'BookOpen', 'emerald', '11111111-1111-1111-1111-111111111111'),
    ('s0000000-0000-0000-0000-000000000002', 'Ngữ Văn 8 - Bồi Dưỡng Nghị Luận', 'VAN8', 8, 'Học phần văn học trung đại và rèn luyện kỹ năng phân tích văn bản số', 'BookOpen', 'blue', '11111111-1111-1111-1111-111111111111'),
    ('s0000000-0000-0000-0000-000000000003', 'Lịch Sử & Địa Lí 7', 'LSDL7', 7, 'Số hóa tư liệu lịch sử địa phương và bản đồ số tương tác', 'Globe', 'amber', '11111111-1111-1111-1111-111111111111'),
    ('s0000000-0000-0000-0000-000000000004', 'Khoa Học Tự Nhiên 7', 'KHTN7', 7, 'Mô phỏng thí nghiệm ảo và bài tập trắc nghiệm tương tác', 'Atom', 'purple', '11111111-1111-1111-1111-111111111111'),
    ('s0000000-0000-0000-0000-000000000005', 'Tin Học & Kỹ Năng Số 7', 'TINHOC7', 7, 'Lập trình tư duy, an toàn không gian mạng và ứng dụng AI', 'Cpu', 'teal', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (code) DO NOTHING;
