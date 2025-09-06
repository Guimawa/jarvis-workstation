@echo off
node --version >nul 2>&1 || (echo Installez Node.js: https://nodejs.org/ & pause & exit)
if not exist "node_modules" npm install
start http://localhost:3000
npm run dev
