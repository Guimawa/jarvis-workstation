@echo off
echo ========================================
echo    TEST DASHBOARD GUIMAWA IA
echo ========================================
echo.

echo [1/4] Verification des fichiers...
if not exist "app\dashboard\page.tsx" (
    echo ERREUR: Page dashboard non trouvee
    pause
    exit /b 1
)

if not exist "components\ui\button.tsx" (
    echo ERREUR: Composant Button non trouve
    pause
    exit /b 1
)

if not exist "components\ui\card.tsx" (
    echo ERREUR: Composant Card non trouve
    pause
    exit /b 1
)

if not exist "components\ui\input.tsx" (
    echo ERREUR: Composant Input non trouve
    pause
    exit /b 1
)

if not exist "styles\design-tokens.css" (
    echo ERREUR: Design tokens non trouves
    pause
    exit /b 1
)

echo [2/4] Verification de la configuration...
if not exist "tailwind.config.js" (
    echo ERREUR: Configuration Tailwind manquante
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ERREUR: package.json non trouve
    pause
    exit /b 1
)

echo [3/4] Installation des dependances...
call npm install

echo [4/4] Verification de la syntaxe...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Erreur de compilation
    pause
    exit /b 1
)

echo.
echo ========================================
echo   DASHBOARD PRET A L'UTILISATION !
echo ========================================
echo.
echo Pour lancer le dashboard:
echo 1. Executez: launch-dashboard.bat
echo 2. Ouvrez: http://localhost:3000/dashboard
echo.
echo Fonctionnalites disponibles:
echo - Vue d'ensemble des projets
echo - Gestion des projets avec filtres
echo - Outils IA integres
echo - Suivi des performances
echo - Coffre-fort securise
echo - Notifications en temps reel
echo.
pause
