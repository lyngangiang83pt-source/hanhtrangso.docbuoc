/* ====================================================================
   LOGIC TƯƠNG TÁC TOÀN DIỆN - HÀNH TRÌNH SỐ THCS PHÚ BÌNH (app.js)
   Tích hợp đầy đủ 11 Client Nodes & Sơ đồ kiến trúc 4 Tầng
   ==================================================================== */

// DỮ LIỆU BÀI GIẢNG KHỐI 6, 7, 8, 9
const lecturesData = [
    {
        id: 1,
        grade: 6,
        title: "Bài 1: Lắng nghe lịch sử nước mình - Thánh Gióng",
        desc: "Bài giảng PPTX tích hợp AI tóm tắt nghệ thuật xây dựng hình tượng người anh hùng.",
        type: "PPTX",
        author: "Cô Huỳnh Ngân Giang",
        downloads: 342,
        thumbClass: "thumb-g6"
    },
    {
        id: 2,
        grade: 6,
        title: "Bài 2: Miền cổ tích - Thạch Sanh và bức thông điệp nhân văn",
        desc: "Bộ giáo án DOCX số hóa kết hợp video tư liệu hoạt họa.",
        type: "DOCX",
        author: "Tổ Ngữ Văn Phú Bình",
        downloads: 289,
        thumbClass: "thumb-g6"
    },
    {
        id: 3,
        grade: 7,
        title: "Bài 3: Cội nguồn yêu thương - Vừa nhắm mắt vừa mở cửa sổ",
        desc: "Khám phá thế giới tâm hồn trong trẻo qua bài giảng tương tác e-learning.",
        type: "PPTX",
        author: "Cô Huỳnh Ngân Giang",
        downloads: 512,
        thumbClass: "thumb-g7"
    },
    {
        id: 4,
        grade: 7,
        title: "Bài 4: Giai điệu đất nước - Mùa xuân nho nhỏ",
        desc: "Phân tích thể thơ năm chữ và ước nguyện cống hiến chân thành.",
        type: "PPTX",
        author: "Cô Huỳnh Ngân Giang",
        downloads: 470,
        thumbClass: "thumb-g7"
    },
    {
        id: 5,
        grade: 8,
        title: "Bài 5: Những gương mặt thân yêu - Chiếc lá cuối cùng",
        desc: "Phân tích đức hi sinh nghệ thuật vì sự sống của con người (O. Henry).",
        type: "DOCX",
        author: "Tổ Ngữ Văn Phú Bình",
        downloads: 415,
        thumbClass: "thumb-g8"
    },
    {
        id: 6,
        grade: 9,
        title: "Bài 6: Khát vọng hoà bình - Ánh trăng (Nguyễn Duy)",
        desc: "Chuyên đề ôn thi vào lớp 10: Biểu tượng ánh trăng và bài học đạo lý thủy chung.",
        type: "PPTX",
        author: "Cô Huỳnh Ngân Giang",
        downloads: 680,
        thumbClass: "thumb-g9"
    }
];

// DỮ LIỆU PODCAST AUDIO
const podcastsData = [
    { title: "Tập 12: Phân tích vẻ đẹp nhân vật Lão Hạc - Nam Cao", dur: "04:35", author: "Cô Huỳnh Ngân Giang" },
    { title: "Tập 13: Chiếc lược ngà - Tình phụ tử thiêng liêng nơi chiến trường", dur: "05:12", author: "Cô Huỳnh Ngân Giang" },
    { title: "Tập 14: Mùa xuân nho nhỏ - Khát vọng cống hiến mùa xuân cho đời", dur: "03:48", author: "Cô Huỳnh Ngân Giang" }
];

// DỮ LIỆU ĐẤU TRƯỜNG TRI THỨC GAME
const gameQuestions = [
    {
        q: "Tác giả của bài thơ 'Đồng chí' trong chương trình Ngữ văn là ai?",
        options: ["A. Chính Hữu", "B. Phạm Tiến Duật", "C. Bằng Việt", "D. Huy Cận"],
        correct: 0,
        exp: "Chính xác! Bài thơ 'Đồng chí' được nhà thơ Chính Hữu sáng tác năm 1948."
    },
    {
        q: "Biện pháp nghệ thuật chủ đạo trong câu: 'Mặt trời của bắp thì nằm trên đồi / Mặt trời của mẹ, em nằm trên lưng' là gì?",
        options: ["A. So sánh", "B. Ẩn dụ", "C. Hoán dụ", "D. Nhân hóa"],
        correct: 1,
        exp: "Xuất sắc! Từ 'Mặt trời của mẹ' là hình ảnh ẩn dụ ca ngợi tình mẫu tử thiêng liêng."
    },
    {
        q: "Tác phẩm 'Lặng lẽ Sa Pa' của nhà văn Nguyễn Thành Long thuộc thể loại nào?",
        options: ["A. Ký sự", "B. Truyện ngắn", "C. Tiểu thuyết", "D. Tùy bút"],
        correct: 1,
        exp: "Tuyệt vời! 'Lặng lẽ Sa Pa' là một truyện ngắn đặc sắc ca ngợi những con người lao động thầm lặng."
    }
];

// DỮ LIỆU CHI TIẾT 18 NODES KIẾN TRÚC HỆ THỐNG
const archNodesInfo = {
    'ui-trangchu': {
        title: '🌐 ui-trangchu - Cổng Hành Trình Số',
        type: 'CLIENT NODE (FRONTEND)',
        desc: 'Giao diện chính (hanhtrinhso.docbuoc.vn) do Huỳnh Ngân Giang sáng lập, là điểm chạm đầu tiên của học sinh THCS Phú Bình.',
        source: 'Trình duyệt Học sinh / Giáo viên',
        target: 'API Gateway & CDN',
        protocol: 'HTTPS / HTTP2',
        sec: 'Cloudflare SSL / CSRF Token'
    },
    'ui-dangnhap': {
        title: '🔐 ui-dangnhap - Đăng nhập Google SSO',
        type: 'CLIENT NODE (FRONTEND)',
        desc: 'Cửa ngõ xác thực bắt buộc trước khi vào hệ thống bằng tài khoản Google, tự động phân quyền theo khối lớp 6-9.',
        source: 'Google OAuth 2.0 Client',
        target: 'mid-api-gateway -> ctrl-auth',
        protocol: 'OAuth2 / OpenID Connect',
        sec: 'JWT Signature / State CSRF'
    },
    'ui-baigiang': {
        title: '📽️ ui-baigiang - Bài giảng & E-learning',
        type: 'CLIENT NODE (FRONTEND)',
        desc: 'Không gian lưu trữ bài giảng PPTX, DOCX số hóa tích hợp AI tóm tắt nội dung theo khối 6, 7, 8, 9.',
        source: 'Frontend SPA View',
        target: 'mid-api-gateway -> ctrl-learning',
        protocol: 'RESTful API / JSON',
        sec: 'Signed URL / Presigned S3'
    },
    'ui-hoclieu': {
        title: '📚 ui-hoclieu - Học liệu Số Đa phương tiện',
        type: 'CLIENT NODE (FRONTEND)',
        desc: 'Cung cấp phim giáo dục số, sổ tay tri thức tương tác và podcast phát thanh học đường.',
        source: 'HTML5 Media Player',
        target: 'Cloud Storage & CDN Cache',
        protocol: 'HLS / Range Request Streaming',
        sec: 'CDN Token Authentication'
    },
    'ui-nopbai': {
        title: '📤 ui-nopbai - Cổng nộp Sản phẩm',
        type: 'CLIENT NODE (FRONTEND)',
        desc: 'Hỗ trợ học sinh nộp bài linh hoạt qua mã QR, link Padlet, Google Drive hoặc nhóm Zalo.',
        source: 'Học sinh Upload Form',
        target: 'S3 Storage Direct + Webhook Ingestion',
        protocol: 'Multipart S3 Presigned URL',
        sec: 'MIME Type Filter / Antivirus Check'
    },
    'ui-hoidap': {
        title: '🤖 ui-hoidap - Trợ lý AI Hỏi-Đáp 24/7',
        type: 'CLIENT NODE (FRONTEND)',
        desc: 'Chatbot AI thông minh hỗ trợ giải đáp thắc mắc phương pháp làm bài và kiến thức Ngữ văn trực tuyến.',
        source: 'Chat UI WebSocket / SSE',
        target: 'mid-api-gateway -> ctrl-interactive',
        protocol: 'Server-Sent Events (SSE)',
        sec: 'Redis Rate Limiter (Token Bucket)'
    },
    'ui-khovip': {
        title: '💎 ui-khovip - Kho Tài liệu VIP',
        type: 'CLIENT NODE (FRONTEND)',
        desc: 'Khu vực tải tài liệu bồi dưỡng HSG giới hạn bằng mã Voucher và mở khóa trợ lý AI Pro.',
        source: 'VIP Member View',
        target: 'mid-api-gateway -> ctrl-auth & storage',
        protocol: 'HTTPS REST API',
        sec: 'Vip Key Validation / Time Expire'
    },
    'mid-api-gateway': {
        title: '🚦 mid-api-gateway - API Gateway & Routing',
        type: 'MIDDLEWARE & GATEWAY LAYER',
        desc: 'Cổng giao tiếp trung tâm định tuyến toàn bộ luồng dữ liệu từ giao diện Frontend xuống các Backend microservices.',
        source: '11 Client Nodes',
        target: 'mid-security -> Backend Controllers',
        protocol: 'Reverse Proxy / Reverse Routing',
        sec: 'WAF / TLS 1.3 / DDOS Shield'
    },
    'mid-security': {
        title: '🛡️ mid-security - WAF & Auth Guard',
        type: 'SECURITY MIDDLEWARE',
        desc: 'Lớp bảo vệ hệ thống, kiểm tra quyền truy cập JWT, phân loại quyền học sinh/giáo viên và giới hạn lưu lượng.',
        source: 'mid-api-gateway',
        target: 'ctrl-auth, ctrl-learning, ctrl-interactive',
        protocol: 'Internal Service Call',
        sec: 'JWT Verification / Role Based RBAC'
    },
    'mid-cdn': {
        title: '⚡ CDN & Edge Cache',
        type: 'CACHING & EDGE LAYER',
        desc: 'Mạng phân phối nội dung toàn cầu giúp tải file video bài giảng, podcast với độ trễ thấp.',
        source: 'S3 Cloud Storage',
        target: 'End User Browsers',
        protocol: 'HTTP/3 Edge Delivery',
        sec: 'Signed Cookie Protection'
    },
    'mid-queue': {
        title: '📨 Message Queue (RabbitMQ / Redis Queue)',
        type: 'ASYNCHRONOUS WORKER QUEUE',
        desc: 'Hàng đợi xử lý bất đồng bộ các tác vụ nộp bài từ webhook Zalo/Padlet và xử lý nén file.',
        source: 'Webhook Ingestion',
        target: 'Background Workers',
        protocol: 'AMQP / Redis PubSub',
        sec: 'Persistent Message Store'
    },
    'ctrl-auth': {
        title: '⚙️ ctrl-auth - Auth & Profile Service',
        type: 'BACKEND SERVICE (API CONTROLLER)',
        desc: 'Xử lý logic xác thực Google SSO, quản lý thông tin học sinh và đối soát mã VIP.',
        source: 'mid-security',
        target: 'db-main (PostgreSQL)',
        protocol: 'Node.js / Express / Prisma',
        sec: 'Bcrypt Hash / Token Rotation'
    },
    'ctrl-learning': {
        title: '⚙️ ctrl-learning - Learning & Content Service',
        type: 'BACKEND SERVICE (API CONTROLLER)',
        desc: 'Quản lý luồng phân phối bài giảng PPTX/DOCX, học liệu số, tin tức bảng tin và phiếu bài tập theo khối.',
        source: 'mid-security',
        target: 'db-main, db-content, db-storage',
        protocol: 'RESTful JSON API',
        sec: 'Resource Ownership Check'
    },
    'ctrl-interactive': {
        title: '⚙️ ctrl-interactive - Interactive & AI Service',
        type: 'BACKEND SERVICE (API CONTROLLER)',
        desc: 'Vận hành Gamification Engine, xử lý webhook từ Padlet/Zalo và tích hợp API Chatbot 24/7.',
        source: 'mid-security',
        target: 'db-main, db-content, db-storage',
        protocol: 'LLM Stream Adapter / REST',
        sec: 'API Key Masking / Prompt Guard'
    },
    'db-main': {
        title: '🗄️ db-main - PostgreSQL (Main DB)',
        type: 'RELATIONAL DATABASE (RDBMS)',
        desc: 'Lưu trữ dữ liệu có cấu trúc: Thông tin người dùng, điểm số, phiếu bài tập và lịch sử kích hoạt VIP.',
        source: 'ctrl-auth, ctrl-learning, ctrl-interactive',
        target: 'SSD Persistent Storage',
        protocol: 'PostgreSQL TCP Port 5432',
        sec: 'Row-Level Security (RLS) / SSL'
    },
    'db-content': {
        title: '🗂️ db-content - MongoDB (Content DB)',
        type: 'NOSQL DOCUMENT DATABASE',
        desc: 'Lưu trữ dữ liệu phi cấu trúc: Nội dung câu hỏi trắc nghiệm, bài viết bảng tin và lịch sử hội thoại AI.',
        source: 'ctrl-learning, ctrl-interactive',
        target: 'MongoDB Atlas / Local Cluster',
        protocol: 'Mongo Wire Protocol (27017)',
        sec: 'Role Authentication / Data Encryption'
    },
    'db-storage': {
        title: '☁️ db-storage - S3 Cloud Storage',
        type: 'OBJECT STORAGE (FILE REPOSITORY)',
        desc: 'Kho lưu trữ file vật lý: File PPTX, DOCX, Video phim giáo dục, Podcast audio và bài tập học sinh nộp.',
        source: 'ctrl-learning, Direct Upload Form',
        target: 'AWS S3 / Cloudflare R2 Bucket',
        protocol: 'S3 REST API / HTTPS',
        sec: 'Presigned Signature / Bucket Policy'
    }
};

// TRẠNG THÁI ỨNG DỤNG (APPLICATION STATE)
let currentTab = 'trangchu';
let currentPodcastIndex = 0;
let isAudioPlaying = false;
let audioTimer = null;
let currentProgress = 25;
let currentGameIndex = 0;
let gameXP = 100;
let gameStreak = 2;
let isVipUnlocked = false;

let currentUser = {
    isLoggedIn: false,
    name: 'Khách',
    email: '',
    role: 'Học sinh',
    grade: 7
};

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    renderLectures('all');
    startQuizTimer();
});

// ==================== TAB SWITCHING ====================
function switchTab(tabId) {
    currentTab = tabId;
    
    // Update nav buttons
    document.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === `pane-${tabId}`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== LECTURES FILTER ====================
function renderLectures(gradeFilter) {
    const container = document.getElementById('lectureGrid');
    if (!container) return;

    const filtered = gradeFilter === 'all' 
        ? lecturesData 
        : lecturesData.filter(l => l.grade === Number(gradeFilter));

    container.innerHTML = filtered.map(item => `
        <div class="lecture-card">
            <div class="lecture-thumb ${item.thumbClass}">
                <span class="grade-badge-tag">Khối ${item.grade}</span>
                <i class="fa-solid ${item.type === 'PPTX' ? 'fa-file-powerpoint' : 'fa-file-word'}"></i>
            </div>
            <div class="lecture-body">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
                <div>
                    <div class="lecture-meta">
                        <span><i class="fa-solid fa-chalkboard-user"></i> ${item.author}</span>
                        <span><i class="fa-solid fa-download"></i> ${item.downloads} lượt tải</span>
                    </div>
                    <button class="btn-open-doc" onclick="downloadLecture('${item.title}', '${item.type}')">
                        <i class="fa-solid fa-cloud-arrow-down"></i> Tải bài giảng (${item.type})
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterLectures(grade) {
    document.querySelectorAll('.pill-btn').forEach(btn => {
        if (grade === 'all' && btn.innerText.includes('Tất cả')) {
            btn.classList.add('active');
        } else if (btn.innerText.includes(`Khối ${grade}`)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderLectures(grade);
}

function downloadLecture(title, type) {
    alert(`🎉 Đang tải tệp [${type}]: ${title}\n(Tệp được cấp trực tiếp qua S3 Presigned URL an toàn)`);
}

// ==================== PODCAST PLAYER ====================
function selectPodcast(index) {
    currentPodcastIndex = index;
    const pod = podcastsData[index];
    document.getElementById('currentPodTitle').innerText = pod.title;
    document.getElementById('durTime').innerText = pod.dur;
    
    document.querySelectorAll('.playlist-item').forEach((item, idx) => {
        if (idx === index) item.classList.add('active');
        else item.classList.remove('active');
    });

    currentProgress = 0;
    document.getElementById('audioProgress').style.width = '0%';
    document.getElementById('currTime').innerText = '00:00';
    
    if (!isAudioPlaying) {
        togglePlay();
    }
}

function togglePlay() {
    const btn = document.getElementById('btnPlayPause');
    if (!isAudioPlaying) {
        isAudioPlaying = true;
        btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        audioTimer = setInterval(() => {
            if (currentProgress < 100) {
                currentProgress += 1;
                document.getElementById('audioProgress').style.width = `${currentProgress}%`;
                const seconds = Math.floor((currentProgress / 100) * 275);
                const m = String(Math.floor(seconds / 60)).padStart(2, '0');
                const s = String(seconds % 60).padStart(2, '0');
                document.getElementById('currTime').innerText = `${m}:${s}`;
            } else {
                nextTrack();
            }
        }, 300);
    } else {
        isAudioPlaying = false;
        btn.innerHTML = '<i class="fa-solid fa-play"></i>';
        clearInterval(audioTimer);
    }
}

function nextTrack() {
    currentPodcastIndex = (currentPodcastIndex + 1) % podcastsData.length;
    selectPodcast(currentPodcastIndex);
}

function prevTrack() {
    currentPodcastIndex = (currentPodcastIndex - 1 + podcastsData.length) % podcastsData.length;
    selectPodcast(currentPodcastIndex);
}

function seekAudio(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    currentProgress = Math.floor((clickX / rect.width) * 100);
    document.getElementById('audioProgress').style.width = `${currentProgress}%`;
}

// ==================== HANDBOOK MODAL ====================
function viewHandbookModal(type) {
    const modal = document.getElementById('handbookModal');
    const title = document.getElementById('hbModalTitle');
    const body = document.getElementById('hbModalBody');

    if (type === 'tututu') {
        title.innerText = '📖 Sơ Đồ 8 Biện Pháp Tu Từ Tiếng Việt';
        body.innerHTML = `
            <div style="background:#f8fafc; padding:1.25rem; border-radius:12px; margin-bottom:1rem; border:1px solid #e2e8f0;">
                <h4 style="color:#0284c7; margin-bottom:0.5rem;"><i class="fa-solid fa-star"></i> 1. So Sánh & Ẩn Dụ:</h4>
                <p><strong>So sánh:</strong> Đối chiếu sự vật này với sự vật khác có nét tương đồng (Từ khóa: như, là, tựa như...).</p>
                <p><strong>Ẩn dụ:</strong> So sánh ngầm dựa trên nét tương đồng (Chuyển đổi cảm giác, phẩm chất, hình thức).</p>
            </div>
            <div style="background:#f8fafc; padding:1.25rem; border-radius:12px; border:1px solid #e2e8f0;">
                <h4 style="color:#059669; margin-bottom:0.5rem;"><i class="fa-solid fa-star"></i> 2. Hoán Dụ & Điệp Ngữ:</h4>
                <p><strong>Hoán dụ:</strong> Gọi tên sự vật hiện tượng này bằng tên sự vật khác có quan hệ gần gũi (Đi kèm).</p>
                <p><strong>Điệp ngữ:</strong> Lặp lại từ ngữ để nhấn mạnh cảm xúc hoặc tạo nhịp điệu dồn dập.</p>
            </div>
        `;
    } else if (type === 'nghiluan') {
        title.innerText = '✍️ Công Thức Nghị Luận Xã Hội 200 Chữ (Chuẩn CT 2018)';
        body.innerHTML = `
            <ol style="padding-left:1.5rem; line-height:1.8;">
                <li><strong>Mở đoạn (1-2 câu):</strong> Dẫn dắt vấn đề tư tưởng đạo lý hoặc hiện tượng đời sống.</li>
                <li><strong>Giải thích (2-3 câu):</strong> Nêu ngắn gọn ý nghĩa trọng tâm của từ khóa.</li>
                <li><strong>Bàn luận & Chứng minh (4-6 câu):</strong> Đưa ra dẫn chứng thực tế (người thật, việc thật).</li>
                <li><strong>Phản biện mở rộng (2 câu):</strong> Đặt góc nhìn ngược lại để lập luận vững chắc.</li>
                <li><strong>Bài học & Hành động (2 câu):</strong> Liên hệ bản thân học sinh trường THCS Phú Bình.</li>
            </ol>
        `;
    } else {
        title.innerText = '📽️ Phim Hoạt Họa Tư Liệu Văn Học';
        body.innerHTML = `
            <div style="text-align:center; padding:2rem; background:#0f172a; color:#fff; border-radius:12px;">
                <i class="fa-solid fa-clapperboard" style="font-size:3rem; color:#38bdf8; margin-bottom:1rem;"></i>
                <h3>Tư liệu: "Bức tranh làng quê Việt Nam qua đôi mắt Thạch Lam"</h3>
                <p style="color:#94a3b8; font-size:0.85rem; margin-top:0.5rem;">Thời lượng: 08 phút 30 giây • Đang phát trực tiếp từ S3 Media</p>
            </div>
        `;
    }

    modal.classList.remove('hidden');
}

function closeHandbookModal() {
    document.getElementById('handbookModal').classList.add('hidden');
}

// ==================== QUIZ SYSTEM ====================
let quizSeconds = 890;
function startQuizTimer() {
    const timerElem = document.getElementById('quizTimer');
    setInterval(() => {
        if (quizSeconds > 0) {
            quizSeconds--;
            const m = String(Math.floor(quizSeconds / 60)).padStart(2, '0');
            const s = String(quizSeconds % 60).padStart(2, '0');
            if (timerElem) timerElem.innerText = `${m}:${s}`;
        }
    }, 1000);
}

function submitQuiz() {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    const resultBox = document.getElementById('quizResultBox');

    if (!q1 || !q2) {
        alert('⚠️ Em vui lòng trả lời đầy đủ tất cả các câu hỏi trước khi nộp nhé!');
        return;
    }

    let score = 0;
    if (q1.value === 'A') score += 5;
    if (q2.value === 'B') score += 5;

    resultBox.classList.remove('hidden');
    if (score === 10) {
        resultBox.className = 'quiz-result-box pass';
        resultBox.innerHTML = `🎉 <strong>XUẤT SẮC: ${score}/10 ĐIỂM!</strong><br/>Em đã trả lời chính xác cả 2 câu hỏi. Điểm số đã được tự động lưu vào PostgreSQL DB!`;
    } else {
        resultBox.className = 'quiz-result-box fail';
        resultBox.innerHTML = `📝 <strong>KẾT QUẢ: ${score}/10 ĐIỂM!</strong><br/>Câu 1 đáp án đúng là A (Hoán dụ - bàn tay mẹ). Câu 2 đáp án đúng là B (Thuyết phục tư tưởng). Hãy cố gắng hơn nhé!`;
    }
}

// ==================== NỘP BÀI S3 DIRECT UPLOAD ====================
function onFileSelected(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        document.getElementById('dropText').innerText = `📄 Đã chọn: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    }
}

function handleDirectUpload(e) {
    e.preventDefault();
    const name = document.getElementById('subName').value;
    const grade = document.getElementById('subGrade').value;
    const className = document.getElementById('subClass').value;
    const msg = document.getElementById('uploadStatusMsg');

    msg.classList.remove('hidden');
    msg.className = 'upload-msg success';
    msg.innerHTML = `
        <i class="fa-solid fa-circle-check"></i> <strong>NỘP BÀI THÀNH CÔNG!</strong><br/>
        Học sinh: <strong>${name}</strong> (Lớp ${className} - Khối ${grade})<br/>
        Tệp đã tải lên <strong>S3 Cloud Storage</strong> an toàn. Mã xác nhận: <code>#SUB-${Math.floor(100000 + Math.random() * 900000)}</code>
    `;
}

// ==================== GAME ĐẤU TRƯỜNG TRI THỨC ====================
function checkGameAnswer(selectedIndex) {
    const currentQ = gameQuestions[currentGameIndex];
    const btns = document.querySelectorAll('.game-btn');
    const feedback = document.getElementById('gameFeedback');

    btns.forEach((btn, idx) => {
        if (idx === currentQ.correct) {
            btn.classList.add('correct');
        } else if (idx === selectedIndex) {
            btn.classList.add('wrong');
        }
    });

    feedback.classList.remove('hidden');
    if (selectedIndex === currentQ.correct) {
        gameXP += 50;
        gameStreak += 1;
        document.getElementById('gameScore').innerText = gameXP;
        document.getElementById('gameStreak').innerText = gameStreak;
        feedback.style.color = '#15803d';
        feedback.innerHTML = `🎉 ${currentQ.exp} (+50 XP)`;
    } else {
        gameStreak = 0;
        document.getElementById('gameStreak').innerText = gameStreak;
        feedback.style.color = '#b91c1c';
        feedback.innerHTML = `❌ Chưa chính xác! Đáp án đúng là <strong>${currentQ.options[currentQ.correct]}</strong>.`;
    }

    setTimeout(() => {
        currentGameIndex = (currentGameIndex + 1) % gameQuestions.length;
        loadNextGameQuestion();
    }, 2800);
}

function loadNextGameQuestion() {
    const currentQ = gameQuestions[currentGameIndex];
    document.getElementById('gameRoundTag').innerText = `Thử thách ${currentGameIndex + 1} / ${gameQuestions.length}`;
    document.getElementById('gameQuestionText').innerText = currentQ.q;
    document.getElementById('gameFeedback').classList.add('hidden');

    const container = document.getElementById('gameOptionsContainer');
    container.innerHTML = currentQ.options.map((opt, idx) => `
        <button class="game-btn" onclick="checkGameAnswer(${idx})">${opt}</button>
    `).join('');
}

// ==================== TRỢ LÝ AI CHATBOT ====================
function askAiPrompt(promptText) {
    document.getElementById('chatInput').value = promptText;
    handleSendChat(new Event('submit'));
}

function handleSendChat(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById('chatInput');
    const question = input.value.trim();
    if (!question) return;

    const messages = document.getElementById('chatMessages');

    // User Message
    messages.innerHTML += `
        <div class="chat-bubble user-bubble">
            <div class="avatar-user"><i class="fa-solid fa-user"></i></div>
            <div class="bubble-content">
                <p>${question}</p>
            </div>
        </div>
    `;

    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // AI Stream response simulation
    setTimeout(() => {
        let aiAnswer = generateAiAnswer(question);
        
        const aiBubble = document.createElement('div');
        aiBubble.className = 'chat-bubble ai-bubble';
        aiBubble.innerHTML = `
            <div class="avatar-ai"><i class="fa-solid fa-robot"></i></div>
            <div class="bubble-content">
                <div class="bubble-sender">Trợ Lý AI Phú Bình</div>
                <p id="streamingText"></p>
            </div>
        `;
        messages.appendChild(aiBubble);
        messages.scrollTop = messages.scrollHeight;

        const targetP = aiBubble.querySelector('#streamingText');
        let charIndex = 0;
        const streamInterval = setInterval(() => {
            if (charIndex < aiAnswer.length) {
                targetP.innerHTML += aiAnswer.charAt(charIndex);
                charIndex++;
                messages.scrollTop = messages.scrollHeight;
            } else {
                clearInterval(streamInterval);
            }
        }, 15);
    }, 400);
}

function generateAiAnswer(q) {
    const lower = q.toLowerCase();
    if (lower.includes('dàn ý') || lower.includes('nhân vật')) {
        return "Để lập dàn ý phân tích nhân vật văn học khối 7, em có thể làm theo 3 bước chuẩn:\n1. Mở bài: Giới thiệu tác giả, tác phẩm và ấn tượng khái quát về nhân vật.\n2. Thân bài: Phân tích hoàn cảnh xuất thân, ngoại hình, hành động, ngôn ngữ, nội tâm và phẩm chất cao đẹp.\n3. Kết bài: Đánh giá nghệ thuật xây dựng nhân vật và bài học rút ra cho bản thân.";
    } else if (lower.includes('câu đơn') || lower.includes('câu ghép')) {
        return "Phân biệt cực nhanh:\n- Câu đơn: Chỉ gồm một cụm Chủ ngữ - Vị ngữ nòng cốt (Ví dụ: 'Gió mùa thu xào xạc.').\n- Câu ghép: Do từ hai cụm C-V trở lên tạo thành, các vế câu có quan hệ ý nghĩa chặt chẽ và không bao chứa nhau (Ví dụ: 'Mưa càng to, nước sông càng dâng cao.').";
    } else if (lower.includes('đồng chí') || lower.includes('nhan đề')) {
        return "Ý nghĩa nhan đề 'Đồng chí': Nhan đề chỉ một từ thiêng liêng biểu tượng cho tình giai cấp, cùng chung lý tưởng chiến đấu của những người lính nông dân trong thời kỳ kháng chiến chống Pháp gian khổ.";
    } else {
        return `Chào em! Với câu hỏi "${q}", em nên bám sát văn bản ngữ liệu bài học, kết hợp vận dụng các thao tác lập luận so sánh, chứng minh để bài làm thêm sinh động và đạt điểm cao nhé!`;
    }
}

// ==================== KHO VIP VAULT ====================
function unlockVipVault() {
    const code = document.getElementById('vipCodeInput').value.trim().toUpperCase();
    const status = document.getElementById('vipStatusMsg');

    if (code === 'PHUBINH2026' || code === 'VIP2026' || code === 'GIANG2026') {
        isVipUnlocked = true;
        status.style.color = '#fde047';
        status.innerHTML = '<i class="fa-solid fa-circle-check"></i> Kích hoạt VIP thành công! Toàn bộ kho tài liệu đã được mở khóa.';
        
        document.querySelectorAll('.vip-card').forEach(card => {
            card.classList.remove('locked');
            const overlay = card.querySelector('.lock-overlay');
            if (overlay) overlay.style.display = 'none';
        });
    } else {
        status.style.color = '#fda4af';
        status.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Mã kích hoạt không hợp lệ. (Gợi ý: Hãy nhập thử mã <strong>PHUBINH2026</strong>)';
    }
}

function downloadVipDoc(fileName) {
    if (!isVipUnlocked) {
        alert('🔒 Em cần nhập mã kích hoạt VIP để tải tài liệu này nhé!');
        return;
    }
    alert(`💎 Đang tải tài liệu VIP đặc quyền: ${fileName}\nCảm ơn em đã tham gia Hành Trình Số!`);
}

// ==================== SƠ ĐỒ KIẾN TRÚC 4 TẦNG INSPECTOR ====================
function inspectNode(nodeId) {
    const info = archNodesInfo[nodeId];
    if (!info) return;

    document.querySelectorAll('.node-card').forEach(c => c.classList.remove('active-node'));
    event.currentTarget.classList.add('active-node');

    document.getElementById('detailNodeTitle').innerHTML = `<i class="fa-solid fa-circle-info"></i> ${info.title}`;
    document.getElementById('detailNodeType').innerText = info.type;
    document.getElementById('detailNodeDesc').innerText = info.desc;
    document.getElementById('detailNodeSource').innerText = info.source;
    document.getElementById('detailNodeTarget').innerText = info.target;
    document.getElementById('detailNodeProtocol').innerText = info.protocol;
    document.getElementById('detailNodeSec').innerText = info.sec;
}

// ==================== NOTIFICATION PANEL ====================
function toggleNotificationPanel() {
    const dropdown = document.getElementById('notifDropdown');
    dropdown.classList.toggle('show');
}

function clearNotifications() {
    document.getElementById('notifBadge').innerText = '0';
    document.querySelectorAll('.notif-item').forEach(i => i.classList.remove('unread'));
}

// ==================== GOOGLE SSO LOGIN MODAL ====================
function openLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
}

function onRoleChange(role) {
    const gradeGroup = document.getElementById('gradeSelectGroup');
    if (role === 'Học sinh') {
        gradeGroup.style.display = 'block';
    } else {
        gradeGroup.style.display = 'none';
    }
}

function handleGoogleLogin(e) {
    e.preventDefault();
    const name = document.getElementById('loginFullName').value;
    const email = document.getElementById('loginEmail').value;
    const role = document.getElementById('loginRole').value;
    const grade = document.getElementById('loginGrade').value;

    currentUser = {
        isLoggedIn: true,
        name,
        email,
        role,
        grade
    };

    // Update Top Slot
    const slot = document.getElementById('userAuthSlot');
    slot.innerHTML = `
        <div class="user-profile-badge">
            <div class="user-avatar-sm">${name.charAt(0)}</div>
            <div style="font-size:0.8rem; font-weight:700; color:#0369a1;">
                ${name} (${role === 'Học sinh' ? `Lớp Khối ${grade}` : role})
            </div>
        </div>
    `;

    closeLoginModal();
    alert(`🎉 Chào mừng ${name} (${role}) đã đăng nhập thành công vào Hành Trình Số!`);
}
