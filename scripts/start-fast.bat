@echo off
echo 🚀 LANCEMENT RAPIDE JARVIS ULTRA INSTINCT
echo ==========================================
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé
    pause
    exit /b 1
)

echo ✅ Node.js détecté
echo.

REM Aller dans le répertoire du projet
cd /d "%~dp0.."

REM Vérifier si node_modules existe
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    npm install --production
)

echo 🚀 Lancement du serveur de développement...
echo 📱 Interface disponible sur: http://localhost:3000
echo.

REM Lancer avec Turbo pour plus de rapidité
npm run dev -- --turbo

pause
