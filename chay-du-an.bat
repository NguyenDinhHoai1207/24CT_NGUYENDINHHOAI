@echo off
title 24CT_NguyenDinhHoai - Khoi Dong Web App Pizza
color 0A
echo =======================================================
echo   DANG KHOI DONG DU AN PIZZA MERN STACK (24CT_NguyenDinhHoai)
echo =======================================================
echo.

echo [1/2] Dang khoi dong Backend Server (Port 5000)...
start "24CT Pizza - Backend Server (Port 5000)" cmd /k "cd /d "%~dp0server" && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/2] Dang khoi dong Frontend Client (Port 5173)...
start "24CT Pizza - Frontend Client (Port 5173)" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo =======================================================
echo   KHOI DONG HOAN TAT! DANG MO TRINH DUYET...
echo =======================================================
timeout /t 3 /nobreak >nul
start http://localhost:5173
