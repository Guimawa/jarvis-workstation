@echo off
title Construction de l'Installateur Jarvis Ultra Instinct
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║        ██████╗  █████╗ ██████╗ ██╗   ██╗██╗███████╗        ║
echo ║       ██╔════╝ ██╔══██╗██╔══██╗██║   ██║██║██╔════╝        ║
echo ║       ██║  ███╗███████║██████╔╝██║   ██║██║███████╗        ║
echo ║       ██║   ██║██╔══██║██╔══██╗╚██╗ ██╔╝██║╚════██║        ║
echo ║       ╚██████╔╝██║  ██║██║  ██║ ╚████╔╝ ██║███████║        ║
echo ║        ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝        ║
echo ║                                                              ║
echo ║              CONSTRUCTION DE L'INSTALLATEUR                 ║
echo ║                      Version 2.0.0                          ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Vérifier NSIS
echo [1/5] 🔍 Vérification de NSIS...
makensis /VERSION >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ NSIS n'est pas installé!
    echo.
    echo 📥 Téléchargez NSIS depuis: https://nsis.sourceforge.io/
    echo    (Version 3.0+ recommandée)
    echo.
    echo ⏳ Après installation, relancez ce script.
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=1" %%i in ('makensis /VERSION') do echo ✅ NSIS %%i détecté
)

:: Créer le dossier de sortie
echo.
echo [2/5] 📁 Préparation des dossiers...
if not exist "dist" mkdir dist
if not exist "dist\installer" mkdir dist\installer
echo ✅ Dossiers créés

:: Copier les fichiers nécessaires
echo.
echo [3/5] 📦 Copie des fichiers...
xcopy /E /I /Y "..\app" "dist\installer\app"
xcopy /E /I /Y "..\components" "dist\installer\components"
xcopy /E /I /Y "..\lib" "dist\installer\lib"
xcopy /E /I /Y "..\config" "dist\installer\config"
xcopy /E /I /Y "..\public" "dist\installer\public"
xcopy /E /I /Y "..\styles" "dist\installer\styles"
xcopy /E /I /Y "..\scripts" "dist\installer\scripts"

:: Copier les fichiers de configuration
copy "..\package.json" "dist\installer\"
copy "..\next.config.js" "dist\installer\"
copy "..\tailwind.config.js" "dist\installer\"
copy "..\tsconfig.json" "dist\installer\"
copy "..\postcss.config.js" "dist\installer\"
copy "..\eslint.config.js" "dist\installer\"
copy "..\jest.config.js" "dist\installer\"
copy "..\jest.setup.js" "dist\installer\"
copy "..\next-env.d.ts" "dist\installer\"
copy "..\Dockerfile" "dist\installer\"
copy "..\docker-compose.yml" "dist\installer\"
copy "..\env.example" "dist\installer\"

:: Copier les scripts
copy "..\JARVIS.bat" "dist\installer\"
copy "..\JARVIS-ULTRA-INSTINCT.exe.bat" "dist\installer\"
copy "..\INTERFACE-JARVIS.bat" "dist\installer\"
copy "..\LANCER-JARVIS.bat" "dist\installer\"
copy "..\START.bat" "dist\installer\"
copy "..\start-light-complete.bat" "dist\installer\"
copy "..\start-light-complete.sh" "dist\installer\"

:: Créer le fichier LICENSE
echo MIT License - Jarvis Ultra Instinct > "dist\installer\LICENSE.txt"
echo. >> "dist\installer\LICENSE.txt"
echo Copyright (c) 2025 Jarvis Expert >> "dist\installer\LICENSE.txt"
echo. >> "dist\installer\LICENSE.txt"
echo Permission is hereby granted, free of charge, to any person obtaining a copy >> "dist\installer\LICENSE.txt"
echo of this software and associated documentation files (the "Software"), to deal >> "dist\installer\LICENSE.txt"
echo in the Software without restriction, including without limitation the rights >> "dist\installer\LICENSE.txt"
echo to use, copy, modify, merge, publish, distribute, sublicense, and/or sell >> "dist\installer\LICENSE.txt"
echo copies of the Software, and to permit persons to whom the Software is >> "dist\installer\LICENSE.txt"
echo furnished to do so, subject to the following conditions: >> "dist\installer\LICENSE.txt"
echo. >> "dist\installer\LICENSE.txt"
echo The above copyright notice and this permission notice shall be included in all >> "dist\installer\LICENSE.txt"
echo copies or substantial portions of the Software. >> "dist\installer\LICENSE.txt"

:: Créer l'icône (fichier ICO simple)
echo Création de l'icône...
:: Note: En production, utiliser un vrai fichier ICO

echo ✅ Fichiers copiés

:: Construire l'installateur
echo.
echo [4/5] 🔨 Construction de l'installateur...
cd dist\installer
makensis install.nsi
if %errorlevel% neq 0 (
    echo.
    echo ❌ Erreur lors de la construction de l'installateur
    echo.
    pause
    exit /b 1
)
cd ..\..

:: Déplacer l'installateur
echo.
echo [5/5] 📦 Finalisation...
if exist "dist\installer\install.exe" (
    move "dist\installer\install.exe" "dist\"
    echo ✅ Installateur créé: dist\install.exe
) else (
    echo ❌ Installateur non trouvé
    pause
    exit /b 1
)

:: Nettoyer les fichiers temporaires
rmdir /s /q "dist\installer"

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║  🎉 INSTALLATEUR CRÉÉ AVEC SUCCÈS ! 🎉                     ║
echo ║                                                              ║
echo ║  Fichier: dist\install.exe                                  ║
echo ║  Taille: [Vérifiez la taille du fichier]                    ║
echo ║                                                              ║
echo ║  Pour installer: Double-cliquez sur install.exe             ║
echo ║  Pour tester: Exécutez install.exe                         ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Afficher les informations sur l'installateur
if exist "dist\install.exe" (
    echo 📊 Informations sur l'installateur:
    echo    Fichier: %CD%\dist\install.exe
    echo    Taille: 
    dir "dist\install.exe" | find "install.exe"
    echo.
    echo 🚀 Prêt à installer Jarvis Ultra Instinct !
    echo.
    echo 💡 Double-cliquez sur dist\install.exe pour installer
    echo.
) else (
    echo ❌ Erreur: Installateur non trouvé
)

echo.
echo 👋 Construction terminée.
pause
