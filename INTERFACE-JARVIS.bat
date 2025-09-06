@echo off
title JARVIS ULTRA INSTINCT - Interface Graphique
color 0A

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║        ██████╗  █████╗ ██████╗ ██╗   ██╗██╗███████╗     ║
echo  ║       ██╔════╝ ██╔══██╗██╔══██╗██║   ██║██║██╔════╝     ║
echo  ║       ██║  ███╗███████║██████╔╝██║   ██║██║███████╗     ║
echo  ║       ██║   ██║██╔══██║██╔══██╗╚██╗ ██╔╝██║╚════██║     ║
echo  ║       ╚██████╔╝██║  ██║██║  ██║ ╚████╔╝ ██║███████║     ║
echo  ║        ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝     ║
echo  ║                                                          ║
echo  ║              ULTRA INSTINCT DASHBOARD                    ║
echo  ║                  Interface Graphique                     ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

:: Vérifier Node.js
echo [1/4] 🔍 Vérification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Node.js n'est pas installé!
    echo.
    echo 📥 Téléchargez Node.js depuis: https://nodejs.org/
    echo    (Version LTS recommandée)
    echo.
    echo ⏳ Après installation, relancez ce fichier.
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=1" %%i in ('node --version') do echo ✅ Node.js %%i détecté
)

:: Installer les dépendances si nécessaire
echo.
echo [2/4] 📦 Vérification des dépendances...
if not exist "node_modules" (
    echo 📥 Installation des dépendances (première fois)...
    echo    Cela peut prendre quelques minutes...
    echo.
    call npm install --silent
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Erreur lors de l'installation des dépendances
        echo 💡 Essayez de relancer en tant qu'administrateur
        echo.
        pause
        exit /b 1
    )
    echo ✅ Dépendances installées avec succès
) else (
    echo ✅ Dépendances déjà installées
)

:: Créer le fichier .env si nécessaire
echo.
echo [3/4] ⚙️  Configuration...
if not exist ".env" (
    echo # Configuration Jarvis Ultra Instinct > .env
    echo GROQ_API_KEY=your_groq_api_key_here >> .env
    echo PORT=3000 >> .env
    echo NODE_ENV=development >> .env
    echo NEXT_PUBLIC_APP_URL=http://localhost:3000 >> .env
    echo ✅ Fichier de configuration créé
    echo.
    echo 💡 Configurez votre clé API Groq dans le fichier .env
) else (
    echo ✅ Configuration trouvée
)

:: Lancer l'interface
echo.
echo [4/4] 🚀 Lancement de l'interface graphique...
echo.
echo 🖥️  Interface: http://localhost:3000
echo 🌐 Ouverture automatique dans le navigateur...
echo.
echo 📋 Fonctionnalités disponibles:
echo    • Analyse Microscopique
echo    • Évolution Projet Maître  
echo    • Validation Post-Build
echo    • Rapports d'Analyse
echo    • Métriques et Statistiques
echo    • Outils Avancés
echo.
echo 💡 Pour arrêter: Fermez cette fenêtre ou Ctrl+C
echo.

:: Attendre un peu puis ouvrir le navigateur
timeout /t 2 /nobreak >nul
start http://localhost:3000

:: Lancer le serveur Next.js
echo 🔄 Démarrage du serveur...
call npm run dev

echo.
echo 👋 Interface Jarvis fermée.
echo.
pause
