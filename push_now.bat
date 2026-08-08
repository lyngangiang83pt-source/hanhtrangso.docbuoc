@echo off
chcp 65001 > nul
echo ====================================================================
echo 🚀 HÀNH TRÌNH SỐ - THCS PHÚ BÌNH (hanhtrinhso.docbuoc.vn)
echo 📦 Đang tiến hành đẩy toàn bộ mã nguồn lên GitHub...
echo 🔗 Kho lưu trữ: https://github.com/lyngangiang83pt-source/hanhtrangso.docbuoc.git
echo ====================================================================

git remote remove origin > nul 2>&1
git remote add origin https://github.com/lyngangiang83pt-source/hanhtrangso.docbuoc.git
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================================
    echo 🎉 XIN CHÚC MỪNG THẦY/CÔ! ĐÃ ĐẨY MÃ NGUỒN LÊN GITHUB THÀNH CÔNG!
    echo 🌐 Truy cập: https://github.com/lyngangiang83pt-source/hanhtrangso.docbuoc
    echo ====================================================================
) else (
    echo.
    echo ⚠️ Lưu ý: Nếu GitHub hiện cửa sổ yêu cầu đăng nhập, thầy/cô chỉ cần bấm
    echo "Sign in with your browser" hoặc nhập Personal Access Token (PAT) nhé!
)

echo.
pause
