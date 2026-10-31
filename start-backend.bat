@echo off
title Findora Backend Server
echo ==============================================
echo   Findora Backend Server (MongoDB Atlas)
echo ==============================================
echo.
cd /d "%~dp0backend"
node app.js
pause
