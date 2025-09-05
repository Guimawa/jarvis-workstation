@echo off
echo ========================================
echo    DASHBOARD GUIMAWA IA - LANCEMENT
echo ========================================
echo.

echo [1/4] Verification de l'environnement...
if not exist "package.json" (
    echo ERREUR: package.json non trouve
    echo Veuillez executer ce script depuis le dossier jarvis-workstation
    pause
    exit /b 1
)

echo [2/4] Installation des dependances...
call npm install

echo [3/4] Verification de la configuration...
if not exist "tailwind.config.js" (
    echo ERREUR: Configuration Tailwind manquante
    pause
    exit /b 1
)

if not exist "app\dashboard-guimawa\page.tsx" (
    echo ERREUR: Page dashboard non trouvee
    pause
    exit /b 1
)

echo [4/4] Lancement du serveur de developpement...
echo.
echo ========================================
echo   DASHBOARD DISPONIBLE SUR:
echo   http://localhost:3000/dashboard-guimawa
echo ========================================
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

call npm run dev
