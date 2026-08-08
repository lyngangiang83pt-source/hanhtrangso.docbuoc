# ====================================================================
# TỰ ĐỘNG ĐẨY MÃ NGUỒN LÊN GITHUB (push_to_github.ps1)
# ====================================================================

param (
    [string]$RepoUrl = ""
)

if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host "🚀 HỆ THỐNG ĐẨY MÃ NGUỒN TỰ ĐỘNG LÊN GITHUB" -ForegroundColor Yellow
    Write-Host "====================================================================" -ForegroundColor Cyan
    $RepoUrl = Read-Host "👉 Xin vui lòng dán đường link GitHub Repository của thầy/cô vào đây"
}

if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
    Write-Host "❌ Bạn chưa nhập đường link GitHub. Vui lòng thử lại!" -ForegroundColor Red
    exit 1
}

Write-Host "1️⃣ Đang thiết lập liên kết Remote Origin: $RepoUrl" -ForegroundColor Cyan
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin $RepoUrl

Write-Host "2️⃣ Đang cấu hình nhánh chính: main" -ForegroundColor Cyan
git branch -M main

Write-Host "3️⃣ Đang tiến hành đẩy toàn bộ mã nguồn lên GitHub..." -ForegroundColor Green
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "====================================================================" -ForegroundColor Green
    Write-Host "🎉 CHÚC MỪNG THẦY/CÔ! ĐÃ ĐẨY TOÀN BỘ MÃ NGUỒN LÊN GITHUB THÀNH CÔNG!" -ForegroundColor Green
    Write-Host "🔗 Truy cập kho lưu trữ tại: $RepoUrl" -ForegroundColor Yellow
    Write-Host "====================================================================" -ForegroundColor Green
} else {
    Write-Host "⚠️ Đẩy mã nguồn gặp sự cố xác thực tài khoản GitHub." -ForegroundColor Yellow
    Write-Host "👉 Thầy/cô vui lòng kiểm tra quyền đăng nhập GitHub hoặc dùng Personal Access Token (PAT) nhé!" -ForegroundColor Gray
}
