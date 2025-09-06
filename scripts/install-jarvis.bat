@echo off
echo ================================================
echo 🚀 JARVIS ULTRA INSTINCT - Installation
echo ================================================
echo.

:: Vérifier si Node.js est installé
echo [1/5] Vérification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé!
    echo 📥 Téléchargement de Node.js...
    start https://nodejs.org/
    echo ⏳ Veuillez installer Node.js et relancer ce script.
    pause
    exit /b 1
) else (
    echo ✅ Node.js détecté
)

:: Vérifier la version de Node.js
for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo 📋 Version Node.js: %NODE_VERSION%

:: Créer le répertoire d'installation
echo.
echo [2/5] Création du répertoire d'installation...
set INSTALL_DIR=%USERPROFILE%\JarvisUltraInstinct
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
echo ✅ Répertoire créé: %INSTALL_DIR%

:: Copier les fichiers du projet
echo.
echo [3/5] Copie des fichiers...
xcopy /E /I /Y "%~dp0.." "%INSTALL_DIR%"
echo ✅ Fichiers copiés

:: Installer les dépendances
echo.
echo [4/5] Installation des dépendances...
cd /d "%INSTALL_DIR%"
call npm install --silent
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)
echo ✅ Dépendances installées

:: Créer les raccourcis
echo.
echo [5/5] Création des raccourcis...

:: Raccourci pour le dashboard
echo [DesktopShortcut] > "%TEMP%\jarvis-dashboard.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") >> "%TEMP%\jarvis-dashboard.vbs"
echo sLinkFile = "%USERPROFILE%\Desktop\Jarvis Dashboard.lnk" >> "%TEMP%\jarvis-dashboard.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\jarvis-dashboard.vbs"
echo oLink.TargetPath = "cmd.exe" >> "%TEMP%\jarvis-dashboard.vbs"
echo oLink.Arguments = "/k cd /d ""%INSTALL_DIR%"" && npm run dev" >> "%TEMP%\jarvis-dashboard.vbs"
echo oLink.Description = "Jarvis Ultra Instinct Dashboard" >> "%TEMP%\jarvis-dashboard.vbs"
echo oLink.Save >> "%TEMP%\jarvis-dashboard.vbs"
cscript //nologo "%TEMP%\jarvis-dashboard.vbs"

:: Raccourci pour le CLI
echo [DesktopShortcut] > "%TEMP%\jarvis-cli.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") >> "%TEMP%\jarvis-cli.vbs"
echo sLinkFile = "%USERPROFILE%\Desktop\Jarvis CLI.lnk" >> "%TEMP%\jarvis-cli.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\jarvis-cli.vbs"
echo oLink.TargetPath = "cmd.exe" >> "%TEMP%\jarvis-cli.vbs"
echo oLink.Arguments = "/k cd /d ""%INSTALL_DIR%"" && node scripts/jarvis-cli-main.js" >> "%TEMP%\jarvis-cli.vbs"
echo oLink.Description = "Jarvis Ultra Instinct CLI" >> "%TEMP%\jarvis-cli.vbs"
echo oLink.Save >> "%TEMP%\jarvis-cli.vbs"
cscript //nologo "%TEMP%\jarvis-cli.vbs"

:: Nettoyer les fichiers temporaires
del "%TEMP%\jarvis-dashboard.vbs"
del "%TEMP%\jarvis-cli.vbs"

echo ✅ Raccourcis créés sur le bureau

:: Créer un fichier de configuration
echo.
echo [Configuration] Création du fichier de configuration...
echo # Configuration Jarvis Ultra Instinct > "%INSTALL_DIR%\.env"
echo GROQ_API_KEY=your_groq_api_key_here >> "%INSTALL_DIR%\.env"
echo PORT=3000 >> "%INSTALL_DIR%\.env"
echo NODE_ENV=production >> "%INSTALL_DIR%\.env"

echo.
echo ================================================
echo ✅ INSTALLATION TERMINÉE AVEC SUCCÈS!
echo ================================================
echo.
echo 📁 Installation dans: %INSTALL_DIR%
echo 🖥️  Dashboard: http://localhost:3000
echo 🖱️  Raccourcis créés sur le bureau
echo.
echo 🚀 Pour démarrer Jarvis:
echo   1. Double-cliquez sur "Jarvis Dashboard" sur le bureau
echo   2. Ou ouvrez un terminal et tapez: cd "%INSTALL_DIR%" && npm run dev
echo.
echo ⚙️  N'oubliez pas de configurer votre clé API Groq dans:
echo    %INSTALL_DIR%\.env
echo.
pause
