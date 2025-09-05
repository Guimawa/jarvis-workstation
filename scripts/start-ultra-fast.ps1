# 🚀 SCRIPT DE LANCEMENT ULTRA RAPIDE
# Version optimisée pour démarrage en moins de 10 secondes

Write-Host "🚀 JARVIS ULTRA INSTINCT - LANCEMENT RAPIDE" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Vérifications rapides
$startTime = Get-Date

# Vérifier Node.js
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js $nodeVersion détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js requis" -ForegroundColor Red
    exit 1
}

# Aller dans le répertoire du projet
Set-Location $PSScriptRoot\..

# Vérifier les dépendances
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances essentielles..." -ForegroundColor Yellow
    npm install --production --silent
}

# Nettoyer le cache Next.js pour un démarrage propre
if (Test-Path ".next") {
    Write-Host "🧹 Nettoyage du cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}

# Lancer avec optimisations maximales
Write-Host "🚀 Démarrage du serveur optimisé..." -ForegroundColor Green
Write-Host "📱 Interface: http://localhost:3000" -ForegroundColor Blue
Write-Host "⚡ Mode Turbo activé" -ForegroundColor Magenta
Write-Host ""

$endTime = Get-Date
$duration = ($endTime - $startTime).TotalSeconds
Write-Host "⏱️  Temps d'initialisation: $([math]::Round($duration, 2))s" -ForegroundColor Gray
Write-Host ""

# Lancer Next.js avec toutes les optimisations
npm run dev -- --turbo --port 3000
