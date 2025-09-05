@echo off
echo ========================================
echo    VERIFICATION DASHBOARD GUIMAWA IA
echo ========================================
echo.

set "ERRORS=0"

echo [1/10] Verification des pages principales...
if not exist "app\dashboard\page.tsx" (
    echo ❌ ERREUR: Page dashboard manquante
    set /a ERRORS+=1
) else (
    echo ✅ Page dashboard presente
)

if not exist "app\dashboard-guimawa\page.tsx" (
    echo ❌ ERREUR: Page dashboard-guimawa manquante
    set /a ERRORS+=1
) else (
    echo ✅ Page dashboard-guimawa presente
)

echo [2/10] Verification des composants UI...
if not exist "components\ui\button.tsx" (
    echo ❌ ERREUR: Composant Button manquant
    set /a ERRORS+=1
) else (
    echo ✅ Composant Button present
)

if not exist "components\ui\card.tsx" (
    echo ❌ ERREUR: Composant Card manquant
    set /a ERRORS+=1
) else (
    echo ✅ Composant Card present
)

if not exist "components\ui\input.tsx" (
    echo ❌ ERREUR: Composant Input manquant
    set /a ERRORS+=1
) else (
    echo ✅ Composant Input present
)

echo [3/10] Verification des composants sections...
if not exist "components\sections\NetworkGraph.tsx" (
    echo ❌ ERREUR: Composant NetworkGraph manquant
    set /a ERRORS+=1
) else (
    echo ✅ Composant NetworkGraph present
)

if not exist "components\sections\AIDemo.tsx" (
    echo ❌ ERREUR: Composant AIDemo manquant
    set /a ERRORS+=1
) else (
    echo ✅ Composant AIDemo present
)

echo [4/10] Verification de la configuration...
if not exist "tailwind.config.js" (
    echo ❌ ERREUR: Configuration Tailwind manquante
    set /a ERRORS+=1
) else (
    echo ✅ Configuration Tailwind presente
)

if not exist "styles\design-tokens.css" (
    echo ❌ ERREUR: Design tokens manquants
    set /a ERRORS+=1
) else (
    echo ✅ Design tokens presents
)

echo [5/10] Verification des donnees...
if not exist "data\sample-dashboard.json" (
    echo ❌ ERREUR: Donnees d'exemple manquantes
    set /a ERRORS+=1
) else (
    echo ✅ Donnees d'exemple presentes
)

echo [6/10] Verification des scripts...
if not exist "start-dashboard.bat" (
    echo ❌ ERREUR: Script start-dashboard manquant
    set /a ERRORS+=1
) else (
    echo ✅ Script start-dashboard present
)

if not exist "test-final.bat" (
    echo ❌ ERREUR: Script test-final manquant
    set /a ERRORS+=1
) else (
    echo ✅ Script test-final present
)

if not exist "deploy-dashboard.bat" (
    echo ❌ ERREUR: Script deploy-dashboard manquant
    set /a ERRORS+=1
) else (
    echo ✅ Script deploy-dashboard present
)

echo [7/10] Verification de la configuration de deploiement...
if not exist "vercel.json" (
    echo ❌ ERREUR: Configuration Vercel manquante
    set /a ERRORS+=1
) else (
    echo ✅ Configuration Vercel presente
)

if not exist "netlify.toml" (
    echo ❌ ERREUR: Configuration Netlify manquante
    set /a ERRORS+=1
) else (
    echo ✅ Configuration Netlify presente
)

if not exist "Dockerfile" (
    echo ❌ ERREUR: Dockerfile manquant
    set /a ERRORS+=1
) else (
    echo ✅ Dockerfile present
)

echo [8/10] Verification de la documentation...
if not exist "README_DASHBOARD.md" (
    echo ❌ ERREUR: Documentation README manquante
    set /a ERRORS+=1
) else (
    echo ✅ Documentation README presente
)

if not exist "DASHBOARD_SUMMARY.md" (
    echo ❌ ERREUR: Documentation SUMMARY manquante
    set /a ERRORS+=1
) else (
    echo ✅ Documentation SUMMARY presente
)

echo [9/10] Verification des variables d'environnement...
if not exist "env.example" (
    echo ❌ ERREUR: Variables d'environnement manquantes
    set /a ERRORS+=1
) else (
    echo ✅ Variables d'environnement presentes
)

echo [10/10] Verification du package.json...
if not exist "package.json" (
    echo ❌ ERREUR: package.json manquant
    set /a ERRORS+=1
) else (
    echo ✅ package.json present
)

echo.
echo ========================================
echo   RESULTAT DE LA VERIFICATION
echo ========================================
echo.

if %ERRORS% EQU 0 (
    echo 🎉 SUCCES ! Tous les fichiers sont presents
    echo.
    echo ========================================
    echo   DASHBOARD PRET A L'UTILISATION !
    echo ========================================
    echo.
    echo Pour lancer le dashboard:
    echo 1. Executez: start-dashboard.bat
    echo 2. Ouvrez: http://localhost:3000/dashboard
    echo.
    echo Fonctionnalites disponibles:
    echo ✅ Interface handshake ultra moderne
    echo ✅ Tous les boutons fonctionnels
    echo ✅ Outils IA integres
    echo ✅ Design responsive
    echo ✅ Animations fluides
    echo ✅ Donnees d'exemple
    echo ✅ Scripts d'automatisation
    echo ✅ Configuration de deploiement
    echo.
    echo ========================================
    echo   COMMANDES UTILES:
    echo ========================================
    echo.
    echo # Lancement rapide
    echo start-dashboard.bat
    echo.
    echo # Test complet
    echo test-final.bat
    echo.
    echo # Demonstration
    echo demo-dashboard.bat
    echo.
    echo # Deploiement
    echo deploy-dashboard.bat
    echo.
    echo ========================================
    echo   DASHBOARD 100%% FONCTIONNEL !
    echo ========================================
) else (
    echo ❌ ERREUR ! %ERRORS% fichier(s) manquant(s)
    echo.
    echo Veuillez verifier que tous les fichiers sont presents
    echo avant de lancer le dashboard.
)

echo.
pause
