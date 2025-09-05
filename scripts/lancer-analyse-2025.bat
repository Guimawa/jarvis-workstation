@echo off
echo 🧬 LANCEMENT DE L'ANALYSE MICROSCOPIQUE 2025
echo ================================================
echo.
echo 📝 NOUVELLE DIRECTIVE : En cas de doute, on note et on continue
echo 📊 Rapport détaillé à la fin avec tous les doutes
echo.
echo 🚀 Démarrage de l'analyse...
echo.

cd /d "%~dp0"
node analyse-microscopique-2025.js

echo.
echo ✅ Analyse terminée !
echo 📁 Consultez le dossier ARCHIVE_2025 pour les résultats
echo 📊 Rapports détaillés dans RAPPORTS_ANALYSE
echo.
pause
