@echo off
echo.
echo ========================================
echo    🧠 JARVIS ULTRA INSTINCT v2.0.0
echo ========================================
echo.
echo [1] Dashboard Handshake Avancé
echo [2] CLI Jarvis Ultra Instinct
echo [3] Dashboard de Monitoring
echo [4] Mode Apprentissage
echo [5] Quitter
echo.
set /p choice="Choisissez une option (1-5): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Lancement du Dashboard Handshake Avancé...
    echo Accédez à: http://localhost:3000/handshake-advanced
    echo.
    npm run dev
) else if "%choice%"=="2" (
    echo.
    echo 🧠 Lancement du CLI Jarvis Ultra Instinct...
    echo.
    npm run jarvis
) else if "%choice%"=="3" (
    echo.
    echo 📊 Lancement du Dashboard de Monitoring...
    echo Accédez à: http://localhost:3001
    echo.
    npm run dashboard
) else if "%choice%"=="4" (
    echo.
    echo 🎓 Lancement du Mode Apprentissage...
    echo.
    npm run jarvis learn --advanced
) else if "%choice%"=="5" (
    echo.
    echo 👋 Au revoir !
    exit
) else (
    echo.
    echo ❌ Option invalide. Veuillez choisir entre 1 et 5.
    pause
    goto :eof
)

pause
