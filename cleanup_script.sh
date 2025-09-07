#!/bin/bash

echo "🧹 Nettoyage Jarvis - Suppression version localhost..."

# 1. SAUVEGARDER AVANT SUPPRESSION
echo "📦 Création backup de sécurité..."
git branch backup-localhost-$(date +%Y%m%d)
git add -A
git commit -m "Backup avant suppression localhost"

# 2. SUPPRIMER FICHIERS OBSOLÈTES
echo "🗑️ Suppression fichiers obsolètes..."

# Anciens fichiers serveur
[ -f "jarvis-dashboard.js" ] && rm jarvis-dashboard.js && echo "✅ jarvis-dashboard.js supprimé"
[ -f "jarvis-cli.js" ] && rm jarvis-cli.js && echo "✅ jarvis-cli.js supprimé"
[ -f "server.js" ] && rm server.js && echo "✅ server.js supprimé"

# Anciens routes/middleware Express
[ -d "routes/" ] && rm -rf routes/ && echo "✅ Dossier routes/ supprimé"
[ -d "middleware/" ] && rm -rf middleware/ && echo "✅ Dossier middleware/ supprimé"

# Fichiers config serveur
[ -f ".env.server" ] && rm .env.server && echo "✅ .env.server supprimé"
[ -f "nodemon.json" ] && rm nodemon.json && echo "✅ nodemon.json supprimé"

# 3. NETTOYER PACKAGE.JSON
echo "📝 Nettoyage package.json..."

# Créer version clean du package.json (supprime dépendances Express)
cat package.json | \
sed '/express"/d' | \
sed '/cors"/d' | \
sed '/body-parser"/d' | \
sed '/nodemon"/d' | \
sed '/"start".*localhost/d' | \
sed '/"dev".*express/d' > package.json.tmp && \
mv package.json.tmp package.json

echo "✅ Dependencies Express supprimées"

# 4. NETTOYER SCRIPTS OBSOLÈTES
echo "🔧 Suppression scripts obsolètes..."
[ -f "start-server.bat" ] && rm start-server.bat && echo "✅ start-server.bat supprimé"
[ -f "run-dashboard.sh" ] && rm run-dashboard.sh && echo "✅ run-dashboard.sh supprimé"

# 5. NETTOYER LOGS ET TEMP
echo "🧽 Nettoyage fichiers temporaires..."
[ -d "logs/" ] && rm -rf logs/ && echo "✅ Dossier logs/ supprimé"
[ -d "tmp/" ] && rm -rf tmp/ && echo "✅ Dossier tmp/ supprimé"
[ -d ".next/" ] && rm -rf .next/ && echo "✅ Cache .next/ supprimé"

# 6. RÉINSTALLER DÉPENDANCES CLEAN
echo "📦 Réinstallation dépendances clean..."
rm -rf node_modules/
rm package-lock.json
npm install

echo ""
echo "🎉 NETTOYAGE TERMINÉ !"
echo ""
echo "✅ Version localhost supprimée"
echo "✅ Seule la version Electron desktop reste"
echo "✅ Dependencies optimisées"
echo ""
echo "🚀 Pour lancer votre app desktop :"
echo "   npm run electron"
echo ""
echo "📦 Pour créer l'installeur Windows :"
echo "   npm run build-win64"