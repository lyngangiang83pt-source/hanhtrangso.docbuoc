-- ====================================================================
-- HÀNH TRÌNH SỐ - THCS PHÚ BÌNH (hanhtrinhso.docbuoc.vn)
-- KỊCH BẢN TỔNG THỂ KHỞI TẠO CƠ SỞ DỮ LIỆU SUPABASE (MASTER SETUP)
-- Sáng lập viên: Huỳnh Ngân Giang
-- ====================================================================

-- 0. KÍCH HOẠT TIỆN ÍCH TẠO MÃ ĐỊNH DANH TOÀN CẦU (UUID EXTENSION)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. BẢNG HỒ SƠ NGƯỜI DÙNG LIÊN KẾT VỚI SUPABASE AUTH (PROFILES)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN', 'VIP_MEMBER')),
    grade_level INT CHECK (grade_level BETWEEN 6 AND 9),
    class_name VARCHAR(50),
    is_vip BOOLEAN DEFAULT FALSE,
    vip_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BẢNG MÃ KÍCH HOẠT KHO VIP (VIP VOUCHERS)
CREATE TABLE IF NOT EXISTS public.vip_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    duration_days INT NOT NULL DEFAULT 30,
    is_used BOOLEAN DEFAULT FALSE,
    used_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BẢNG BÀI GIẢNG VÀ HỌC LIỆU SỐ (LEARNING MATERIALS)
CREATE TABLE IF NOT EXISTS public.learning_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 6 AND 9),
    subject VARCHAR(100) DEFAULT 'NGU_VAN',
    material_type VARCHAR(50) NOT NULL CHECK (material_type IN ('DOCX', 'PPTX', 'VIDEO', 'PODCAST', 'ELEARNING')),
    file_url TEXT NOT NULL,
    author_name TEXT DEFAULT 'Cô Huỳnh Ngân Giang',
    is_vip_only BOOLEAN DEFAULT FALSE,
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BẢNG PODCAST PHÁT THANH HỌC ĐƯỜNG (PODCASTS)
CREATE TABLE IF NOT EXISTS public.podcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    episode_number INT,
    duration VARCHAR(20) DEFAULT '04:30',
    audio_url TEXT,
    author_name TEXT DEFAULT 'Cô Huỳnh Ngân Giang',
    listen_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BẢNG BẢNG TIN VÀ TƯ VẤN HƯỚNG NGHIỆP (NEWS ARTICLES)
CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Tin nhà trường',
    summary TEXT,
    content TEXT,
    image_bg_class VARCHAR(50) DEFAULT 'news-bg-1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BẢNG BÀI TẬP VÀ PHIẾU HỌC TẬP (ASSIGNMENTS)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    instructions TEXT,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 6 AND 9),
    deadline TIMESTAMP WITH TIME ZONE,
    qr_code_url TEXT,
    padlet_board_url TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. BẢNG NỘP BÀI HỌC SINH (SUBMISSIONS)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
    student_name TEXT NOT NULL,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 6 AND 9),
    class_name VARCHAR(50) NOT NULL,
    submission_channel VARCHAR(50) NOT NULL CHECK (submission_channel IN ('DIRECT_UPLOAD', 'PADLET', 'GOOGLE_DRIVE', 'ZALO_WEBHOOK')),
    file_url TEXT,
    external_link TEXT,
    score NUMERIC(4, 2) CHECK (score >= 0 AND score <= 10),
    teacher_feedback TEXT,
    status VARCHAR(50) DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'GRADED', 'LATE')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. BẢNG ĐIỂM THƯỞNG VÀ GAME GIÁO DỤC (GAMIFICATION RECORDS)
CREATE TABLE IF NOT EXISTS public.gamification_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    total_xp INT DEFAULT 100,
    streak_count INT DEFAULT 1,
    badges JSONB DEFAULT '["HOC_SINH_TIEN_PHONG"]'::jsonb,
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. BẢNG KẾT QUẢ TRẮC NGHIỆM TỨC THÌ (QUIZ RESULTS)
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    grade_level INT NOT NULL,
    score INT NOT NULL,
    max_score INT NOT NULL DEFAULT 10,
    answers_data JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. BẢNG NHẬT KÝ HỎI ĐÁP AI 24/7 (AI CHAT LOGS)
CREATE TABLE IF NOT EXISTS public.ai_chat_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_prompt TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. BẢNG THÔNG BÁO TỨC THỜI REAL-TIME (NOTIFICATIONS)
CREATE TABLE IF NOT EXISTS public.realtime_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    badge_type VARCHAR(50) DEFAULT 'bg-blue',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- THIẾT LẬP CHÍNH SÁCH BẢO MẬT CẤP HÀNG (ROW LEVEL SECURITY - RLS)
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_notifications ENABLE ROW LEVEL SECURITY;

-- CẤP QUYỀN ĐỌC GHI CÔNG KHAI HỢP LỆ VỚI SUPABASE ANON KEY
CREATE POLICY "Public Read Learning Materials" ON public.learning_materials FOR SELECT USING (true);
CREATE POLICY "Public Read Podcasts" ON public.podcasts FOR SELECT USING (true);
CREATE POLICY "Public Read News" ON public.news_articles FOR SELECT USING (true);
CREATE POLICY "Public Read Leaderboards" ON public.gamification_records FOR SELECT USING (true);
CREATE POLICY "Public Read Notifications" ON public.realtime_notifications FOR SELECT USING (true);
CREATE POLICY "Public Read VIP Codes" ON public.vip_vouchers FOR SELECT USING (true);

CREATE POLICY "Public Insert Submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Quiz Results" ON public.quiz_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert AI Logs" ON public.ai_chat_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- ====================================================================
-- NẠP DỮ LIỆU MẪU BAN ĐẦU (SEED DATA SẴN SÀNG SỬ DỤNG)
-- ====================================================================

-- 1. Mã VIP kích hoạt sẵn
INSERT INTO public.vip_vouchers (code, duration_days) 
VALUES 
    ('PHUBINH2026', 365),
    ('VIP2026', 90),
    ('GIANG2026', 180)
ON CONFLICT (code) DO NOTHING;

-- 2. Bài giảng mẫu khối 6, 7, 8, 9
INSERT INTO public.learning_materials (title, description, grade_level, material_type, file_url, author_name, downloads_count)
VALUES 
    ('Bài 1: Lắng nghe lịch sử nước mình - Thánh Gióng', 'Bài giảng PPTX tích hợp AI tóm tắt nghệ thuật xây dựng hình tượng người anh hùng.', 6, 'PPTX', 'https://dcmlhyzjkuagjafbvspj.supabase.co/storage/v1/object/public/materials/thanh-giong.pptx', 'Cô Huỳnh Ngân Giang', 342),
    ('Bài 2: Miền cổ tích - Thạch Sanh và bức thông điệp nhân văn', 'Bộ giáo án DOCX số hóa kết hợp video tư liệu hoạt họa sinh động.', 6, 'DOCX', 'https://dcmlhyzjkuagjafbvspj.supabase.co/storage/v1/object/public/materials/thach-sanh.docx', 'Tổ Ngữ Văn Phú Bình', 289),
    ('Bài 3: Cội nguồn yêu thương - Vừa nhắm mắt vừa mở cửa sổ', 'Khám phá thế giới tâm hồn trong trẻo qua bài giảng tương tác e-learning.', 7, 'PPTX', 'https://dcmlhyzjkuagjafbvspj.supabase.co/storage/v1/object/public/materials/vua-nham-mat.pptx', 'Cô Huỳnh Ngân Giang', 512),
    ('Bài 4: Giai điệu đất nước - Mùa xuân nho nhỏ', 'Phân tích thể thơ năm chữ và ước nguyện cống hiến chân thành cho quê hương.', 7, 'PPTX', 'https://dcmlhyzjkuagjafbvspj.supabase.co/storage/v1/object/public/materials/mua-xuan-nho-nho.pptx', 'Cô Huỳnh Ngân Giang', 470),
    ('Bài 5: Những gương mặt thân yêu - Chiếc lá cuối cùng', 'Phân tích đức hi sinh nghệ thuật vì sự sống của con người (O. Henry).', 8, 'DOCX', 'https://dcmlhyzjkuagjafbvspj.supabase.co/storage/v1/object/public/materials/chiec-la-cuoi-cung.docx', 'Tổ Ngữ Văn Phú Bình', 415),
    ('Bài 6: Khát vọng hoà bình - Ánh trăng (Nguyễn Duy)', 'Chuyên đề ôn thi vào lớp 10: Biểu tượng ánh trăng và bài học đạo lý thủy chung.', 9, 'PPTX', 'https://dcmlhyzjkuagjafbvspj.supabase.co/storage/v1/object/public/materials/anh-trang.pptx', 'Cô Huỳnh Ngân Giang', 680)
ON CONFLICT DO NOTHING;

-- 3. Danh sách Podcast học đường
INSERT INTO public.podcasts (title, episode_number, duration, author_name)
VALUES
    ('Tập 12: Phân tích vẻ đẹp nhân vật Lão Hạc - Nam Cao', 12, '04:35', 'Cô Huỳnh Ngân Giang'),
    ('Tập 13: Chiếc lược ngà - Tình phụ tử thiêng liêng nơi chiến trường', 13, '05:12', 'Cô Huỳnh Ngân Giang'),
    ('Tập 14: Mùa xuân nho nhỏ - Khát vọng cống hiến mùa xuân cho đời', 14, '03:48', 'Cô Huỳnh Ngân Giang')
ON CONFLICT DO NOTHING;

-- 4. Bảng tin nhà trường & Hướng nghiệp
INSERT INTO public.news_articles (title, category, summary, image_bg_class)
VALUES
    ('Phát động phong trào Hành Trình Số nâng cao năng lực công nghệ cho học sinh', 'Tin nhà trường', 'Trường THCS Phú Bình chính thức đưa nền tảng số vào hỗ trợ việc dạy và học sáng tạo.', 'news-bg-1'),
    ('Định hướng chọn trường THPT và nghề nghiệp tương lai cho học sinh Khối 9', 'Góc Hướng Nghiệp', 'Chia sẻ cẩm nang các tiêu chí chọn trường phù hợp với năng lực và đam mê của bản thân.', 'news-bg-2'),
    ('Vinh danh các tập thể lớp đạt thành tích cao trong tuần học tập số', 'Khen thưởng', 'Chúc mừng các chi đội 7A1, 8A2 và 9B1 đã tích cực hoàn thành 100% phiếu học tập.', 'news-bg-3')
ON CONFLICT DO NOTHING;

-- 5. Bảng vàng thi đua game giáo dục
INSERT INTO public.gamification_records (student_name, class_name, total_xp, streak_count)
VALUES 
    ('Trần Bảo Ngọc', '8A1', 4850, 8),
    ('Lê Hoàng Nam', '7A3', 4320, 5),
    ('Nguyễn Minh Quân', '9B2', 3980, 4)
ON CONFLICT DO NOTHING;

-- 6. Thông báo tức thời
INSERT INTO public.realtime_notifications (title, content, badge_type)
VALUES
    ('Bài giảng Khối 7 mới:', 'Tri thức ngữ văn bài 3 - Cội nguồn yêu thương vừa được tải lên.', 'bg-blue'),
    ('Bảng xếp hạng Game tuần:', 'Học sinh lớp 8A1 vừa đạt Top 1 tuần với 4,850 điểm!', 'bg-emerald'),
    ('Thông báo THCS Phú Bình:', 'Lịch nộp sản phẩm sáng tạo số hạn cuối vào Chủ Nhật tuần này.', 'bg-amber')
ON CONFLICT DO NOTHING;
