@echo off
title JARVIS - Ultra Simple
color 0B

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        JARVIS ULTRA INSTINCT         ║
echo  ║           Version Simple             ║
echo  ╚══════════════════════════════════════╝
echo.

:: Vérifier Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js requis: https://nodejs.org/
    pause
    exit
)

:: Installer si nécessaire
if not exist "node_modules" (
    echo 📦 Installation automatique...
    npm install
)

:: Lancer directement
echo 🚀 Lancement de Jarvis...
echo 🌐 http://localhost:3000
echo.
start http://localhost:3000
npm run dev
