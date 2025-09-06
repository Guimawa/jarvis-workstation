@echo off
echo ================================================
echo 🚀 JARVIS ULTRA INSTINCT - Création EXE Simple
echo ================================================

:: 1. Créer un fichier batch qui fait tout
echo [1/3] Création du launcher principal...

echo @echo off > jarvis-launcher.bat
echo echo 🚀 JARVIS ULTRA INSTINCT - Démarrage... >> jarvis-launcher.bat
echo echo ========================================== >> jarvis-launcher.bat
echo echo. >> jarvis-launcher.bat
echo. >> jarvis-launcher.bat
echo :: Vérifier Node.js >> jarvis-launcher.bat
echo node --version ^>nul 2^>^&1 >> jarvis-launcher.bat
echo if %%errorlevel%% neq 0 ^( >> jarvis-launcher.bat
echo     echo ❌ Node.js requis! Téléchargez depuis https://nodejs.org/ >> jarvis-launcher.bat
echo     pause >> jarvis-launcher.bat
echo     exit /b 1 >> jarvis-launcher.bat
echo ^) >> jarvis-launcher.bat
echo. >> jarvis-launcher.bat
echo :: Installer les dépendances si nécessaire >> jarvis-launcher.bat
echo if not exist "node_modules" ^( >> jarvis-launcher.bat
echo     echo 📦 Installation des dépendances... >> jarvis-launcher.bat
echo     call npm install >> jarvis-launcher.bat
echo ^) >> jarvis-launcher.bat
echo. >> jarvis-launcher.bat
echo :: Lancer le dashboard >> jarvis-launcher.bat
echo echo 🖥️  Lancement du dashboard... >> jarvis-launcher.bat
echo echo 🌐 Ouvrez http://localhost:3000 dans votre navigateur >> jarvis-launcher.bat
echo echo. >> jarvis-launcher.bat
echo start http://localhost:3000 >> jarvis-launcher.bat
echo call npm run dev >> jarvis-launcher.bat

:: 2. Créer un fichier PowerShell plus avancé
echo [2/3] Création du launcher PowerShell...

echo # JARVIS ULTRA INSTINCT - Launcher PowerShell > jarvis-launcher.ps1
echo Write-Host "🚀 JARVIS ULTRA INSTINCT - Démarrage..." -ForegroundColor Green >> jarvis-launcher.ps1
echo Write-Host "==========================================" -ForegroundColor Green >> jarvis-launcher.ps1
echo. >> jarvis-launcher.ps1
echo # Vérifier Node.js >> jarvis-launcher.ps1
echo try { >> jarvis-launcher.ps1
echo     $nodeVersion = node --version >> jarvis-launcher.ps1
echo     Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green >> jarvis-launcher.ps1
echo } catch { >> jarvis-launcher.ps1
echo     Write-Host "❌ Node.js requis! Téléchargez depuis https://nodejs.org/" -ForegroundColor Red >> jarvis-launcher.ps1
echo     Read-Host "Appuyez sur Entrée pour continuer" >> jarvis-launcher.ps1
echo     exit 1 >> jarvis-launcher.ps1
echo } >> jarvis-launcher.ps1
echo. >> jarvis-launcher.ps1
echo # Installer les dépendances si nécessaire >> jarvis-launcher.ps1
echo if (-not (Test-Path "node_modules")) { >> jarvis-launcher.ps1
echo     Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow >> jarvis-launcher.ps1
echo     npm install >> jarvis-launcher.ps1
echo } >> jarvis-launcher.ps1
echo. >> jarvis-launcher.ps1
echo # Lancer le dashboard >> jarvis-launcher.ps1
echo Write-Host "🖥️  Lancement du dashboard..." -ForegroundColor Cyan >> jarvis-launcher.ps1
echo Write-Host "🌐 Ouvrez http://localhost:3000 dans votre navigateur" -ForegroundColor Cyan >> jarvis-launcher.ps1
echo Start-Process "http://localhost:3000" >> jarvis-launcher.ps1
echo npm run dev >> jarvis-launcher.ps1

:: 3. Créer un fichier VBS pour double-clic
echo [3/3] Création du launcher VBS...

echo Set WshShell = CreateObject("WScript.Shell") > jarvis-launcher.vbs
echo WshShell.Run "cmd /c jarvis-launcher.bat", 0, False >> jarvis-launcher.vbs

echo.
echo ================================================
echo ✅ LAUNCHERS CRÉÉS AVEC SUCCÈS!
echo ================================================
echo.
echo 📁 Fichiers créés:
echo    - jarvis-launcher.bat    (Double-clic pour lancer)
echo    - jarvis-launcher.ps1    (PowerShell avancé)
echo    - jarvis-launcher.vbs    (Silencieux)
echo.
echo 🚀 UTILISATION:
echo    1. Double-cliquez sur jarvis-launcher.bat
echo    2. Ou double-cliquez sur jarvis-launcher.vbs (silencieux)
echo    3. Ou lancez jarvis-launcher.ps1 dans PowerShell
echo.
echo 💡 Le dashboard s'ouvrira automatiquement dans votre navigateur!
echo.
pause
