@echo off
title JARVIS ULTRA INSTINCT
color 0A

echo.
echo  ██████╗  █████╗ ██████╗ ██╗   ██╗██╗███████╗
echo ██╔════╝ ██╔══██╗██╔══██╗██║   ██║██║██╔════╝
echo ██║  ███╗███████║██████╔╝██║   ██║██║███████╗
echo ██║   ██║██╔══██║██╔══██╗╚██╗ ██╔╝██║╚════██║
echo ╚██████╔╝██║  ██║██║  ██║ ╚████╔╝ ██║███████║
echo  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝
echo.
echo           ULTRA INSTINCT DASHBOARD
echo ================================================
echo.

:: Vérifier Node.js
echo [1/4] Vérification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé!
    echo.
    echo 📥 Téléchargez Node.js depuis: https://nodejs.org/
    echo ⏳ Puis relancez ce fichier.
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=1" %%i in ('node --version') do echo ✅ Node.js %%i détecté
)

:: Installer les dépendances si nécessaire
echo.
echo [2/4] Vérification des dépendances...
if not exist "node_modules" (
    echo 📦 Installation des dépendances (première fois)...
    call npm install --silent
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation
        pause
        exit /b 1
    )
    echo ✅ Dépendances installées
) else (
    echo ✅ Dépendances déjà installées
)

:: Créer le fichier .env si nécessaire
echo.
echo [3/4] Configuration...
if not exist ".env" (
    echo # Configuration Jarvis Ultra Instinct > .env
    echo GROQ_API_KEY=your_groq_api_key_here >> .env
    echo PORT=3000 >> .env
    echo NODE_ENV=development >> .env
    echo ✅ Fichier de configuration créé
) else (
    echo ✅ Configuration trouvée
)

:: Lancer le dashboard
echo.
echo [4/4] Lancement du dashboard...
echo.
echo 🖥️  Dashboard: http://localhost:3000
echo 🌐 Ouverture automatique dans le navigateur...
echo.
echo 💡 Pour arrêter: Ctrl+C dans cette fenêtre
echo.

:: Ouvrir le navigateur
start http://localhost:3000

:: Lancer le serveur
call npm run dev

echo.
echo 👋 Jarvis Ultra Instinct fermé.
pause
