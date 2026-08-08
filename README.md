# 🌐 HÀNH TRÌNH SỐ - THCS PHÚ BÌNH

> **Hệ sinh thái chuyển đổi số giáo dục & nền tảng học tập trực tuyến thông minh**  
> *Điểm chạm số hóa đầu tiên của học sinh trường THCS Phú Bình.*  
> **Sáng lập & Điều hành:** Huỳnh Ngân Giang  
> **Tên miền dự án:** `hanhtrinhso.docbuoc.vn`

---

## 📖 Giới Thiệu Dự Án

**Hành Trình Số** là nền tảng giáo dục tích hợp đa phương tiện kết hợp trí tuệ nhân tạo (AI) nhằm hỗ trợ toàn diện việc dạy và học cho học sinh các khối 6, 7, 8, 9 tại trường THCS Phú Bình.

### 🌟 Các Tính Năng Nổi Bật (11 Cổng Trải Nghiệm)

1. **🌐 Cổng Hành Trình Số (`ui-trangchu`):** Giao diện hiện đại, tối ưu trải nghiệm người dùng với phong cách *Cyber-Education*.
2. **🔐 Đăng nhập Google SSO (`ui-dangnhap`):** Cửa ngõ xác thực bảo mật và phân luồng quyền học sinh / giáo viên.
3. **📽️ Bài giảng & E-learning (`ui-baigiang`):** Kho bài giảng PPTX, DOCX số hóa tích hợp tóm tắt AI theo từng khối 6, 7, 8, 9.
4. **📚 Học liệu Số & Podcast (`ui-hoclieu`):** Phim ngắn giáo dục, sổ tay tri thức số và chuỗi phát thanh Podcast học đường.
5. **📝 Phiếu Bài tập Tương tác (`ui-baitap`):** Hệ thống trắc nghiệm tự động chấm điểm tức thì và giải thích chi tiết.
6. **📤 Cổng Nộp Sản phẩm (`ui-nopbai`):** Hỗ trợ nộp bài đa kênh qua S3 Presigned URL, quét mã QR, Padlet, Google Drive và Zalo OA.
7. **🎮 Game Giáo dục (`ui-game`):** Đấu trường tri thức, tích lũy điểm kinh nghiệm (XP), chuỗi thắng và bảng vinh danh tuần.
8. **🤖 Trợ lý AI Hỏi-Đáp 24/7 (`ui-hoidap`):** Chatbot thông minh hỗ trợ giải đáp phương pháp làm bài và kiến thức văn học.
9. **💎 Kho Tài liệu VIP (`ui-khovip`):** Khu vực tài liệu nâng cao bồi dưỡng HSG mở khóa bằng mã Voucher.
10. **📰 Bảng tin & Hướng nghiệp (`ui-bangtin`):** Cập nhật tin tức nhà trường và cẩm nang chọn trường THPT cho học sinh lớp 9.
11. **🔔 Thông báo Real-time (`ui-thongbao`):** Cập nhật tin tức và thông báo nhanh chóng.

---

## 🏛️ Kiến Trúc Hệ Thống 4 Tầng (4-Tier Architecture)

* **Tầng 1 - Giao diện & Điểm chạm (Frontend):** HTML5, CSS3 Glassmorphism, JavaScript ES6+.
* **Tầng 2 - Bảo mật & Middleware:** API Gateway, WAF Rate Limiter, Message Queue (RabbitMQ / Redis), CDN Cache.
* **Tầng 3 - Tầng Nghiệp vụ (Backend API):** Auth Service, Learning & Content Service, Interactive & AI Engine.
* **Tầng 4 - Cơ sở Dữ liệu & Lưu trữ (Data Layer):** PostgreSQL (Main DB), MongoDB (Content DB), S3 Cloud Storage.

---

## 🚀 Hướng Dẫn Chạy Thử Trên Máy Cá Nhân (Localhost)

1. Mở PowerShell tại thư mục dự án.
2. Chạy lệnh:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
3. Mở trình duyệt và truy cập: **[http://localhost:3000](http://localhost:3000)**

---
*© 2026 Hành Trình Số - THCS Phú Bình. All rights reserved.*
