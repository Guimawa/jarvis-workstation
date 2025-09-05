@echo off
echo ========================================
echo    DASHBOARD GUIMAWA IA - START !
echo ========================================
echo.

echo [1/6] Verification de l'environnement...
if not exist "package.json" (
    echo ❌ ERREUR: package.json non trouve
    pause
    exit /b 1
)

echo [2/6] Installation des dependances...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERREUR: Echec de l'installation des dependances
    pause
    exit /b 1
)

echo [3/6] Verification des composants...
if not exist "app\dashboard\page.tsx" (
    echo ❌ ERREUR: Page dashboard manquante
    pause
    exit /b 1
)

if not exist "components\ui\button.tsx" (
    echo ❌ ERREUR: Composants UI manquants
    pause
    exit /b 1
)

echo [4/6] Verification de la configuration...
if not exist "tailwind.config.js" (
    echo ❌ ERREUR: Configuration Tailwind manquante
    pause
    exit /b 1
)

echo [5/6] Build du projet...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERREUR: Echec du build
    pause
    exit /b 1
)

echo [6/6] Lancement du serveur...
echo.
echo ========================================
echo   DASHBOARD GUIMAWA IA - ACTIF !
echo ========================================
echo.
echo 🎉 FELICITATIONS ! Votre dashboard ultra moderne est pret !
echo.
echo ========================================
echo   FONCTIONNALITES DISPONIBLES:
echo ========================================
echo.
echo 🎯 INTERFACE HANDSHAKE ULTRA MODERNE
echo    ✅ Design elegant et professionnel
echo    ✅ Tous les boutons fonctionnels
echo    ✅ Animations fluides
echo    ✅ Mode sombre/clair
echo    ✅ Design responsive
echo.
echo 📊 GESTION DE PROJETS COMPLETE
echo    ✅ Vue d'ensemble avec statistiques
echo    ✅ Filtres avances (statut, priorite, client)
echo    ✅ Recherche intelligente
echo    ✅ Actions rapides (editer, supprimer, voir)
echo    ✅ Vues multiples (grille, liste)
echo    ✅ Donnees d'exemple (5 projets)
echo.
echo 🤖 OUTILS IA INTEGRES
echo    ✅ Assistant IA avec chat interactif
echo    ✅ Générateur de code automatique
echo    ✅ Analyse de securite
echo    ✅ Demonstration interactive
echo    ✅ Prédictions et recommandations
echo.
echo 📈 SUIVI DES PERFORMANCES
echo    ✅ Métriques en temps reel
echo    ✅ Graphiques interactifs
echo    ✅ Statistiques et KPIs
echo    ✅ Rapports automatiques
echo.
echo 🔒 SECURITE
echo    ✅ Coffre-fort securise
echo    ✅ Chiffrement AES-256
echo    ✅ Authentification
echo    ✅ Audit trail
echo.
echo ========================================
echo   ACCES AU DASHBOARD:
echo ========================================
echo.
echo 🌐 Dashboard principal:
echo    http://localhost:3000/dashboard
echo.
echo 🌐 Dashboard alternatif:
echo    http://localhost:3000/dashboard-guimawa
echo.
echo ========================================
echo   NAVIGATION:
echo ========================================
echo.
echo 📊 Vue d'ensemble - Statistiques et projets recents
echo 🎯 Projets - Gestion complete des projets
echo 🤖 Outils IA - Fonctionnalites d'intelligence artificielle
echo 📈 Performances - Métriques et graphiques
echo 🔒 Coffre-fort - Donnees sensibles securisees
echo ⚙️ Parametres - Configuration de l'application
echo.
echo ========================================
echo   COMMANDES UTILES:
echo ========================================
echo.
echo # Verification complete
echo VERIFY_FINAL.bat
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
echo   PERSONNALISATION:
echo ========================================
echo.
echo 🎨 Couleurs: Modifiez styles/design-tokens.css
echo 📊 Donnees: Adaptez data/sample-dashboard.json
echo 🔧 Composants: Personnalisez components/ui/
echo ⚙️ Configuration: Copiez env.example vers .env.local
echo.
echo ========================================
echo   DEPLOIEMENT:
echo ========================================
echo.
echo 🚀 Vercel (Recommandé):
echo    npm i -g vercel
echo    vercel
echo.
echo 🌐 Netlify:
echo    npm run build
echo    Deployer le dossier .next
echo.
echo 🐳 Docker:
echo    docker build -t dashboard-guimawa .
echo    docker run -p 3000:3000 dashboard-guimawa
echo.
echo ========================================
echo   DASHBOARD EN COURS D'EXECUTION...
echo ========================================
echo.
echo 🎉 Votre dashboard ultra moderne est maintenant actif !
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

call npm run dev