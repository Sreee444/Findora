@echo off
title Findora - Lost and Found System
echo ==============================================
echo   Starting Findora System
echo ==============================================
echo.
echo 1. Starting Backend API Server (Port 5000)...
start "Findora Backend" cmd /k "cd /d %~dp0backend && node app.js"

echo 2. Opening Findora Website in your browser...
timeout /t 2 /nobreak >nul
start "" "%~dp0index.html"

echo.
echo Findora is now running! Keep the backend terminal open.
