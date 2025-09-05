# 🧬 SCRIPT DE LANCEMENT - ANALYSE MICROSCOPIQUE 2025
# Version 2.0 - Avec gestion des doutes

Write-Host "🧬 LANCEMENT DE L'ANALYSE MICROSCOPIQUE 2025" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 NOUVELLE DIRECTIVE : En cas de doute, on note et on continue" -ForegroundColor Yellow
Write-Host "📊 Rapport détaillé à la fin avec tous les doutes" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Démarrage de l'analyse..." -ForegroundColor Green
Write-Host ""

# Changer vers le répertoire du script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

try {
    # Lancer l'analyse
    node analyse-microscopique-2025.js
    
    Write-Host ""
    Write-Host "✅ Analyse terminée avec succès !" -ForegroundColor Green
    Write-Host "📁 Consultez le dossier ARCHIVE_2025 pour les résultats" -ForegroundColor Blue
    Write-Host "📊 Rapports détaillés dans RAPPORTS_ANALYSE" -ForegroundColor Blue
    Write-Host ""
    
    # Ouvrir le dossier des rapports
    $reportsPath = Join-Path (Get-Location) "..\ARCHIVE_2025\RAPPORTS_ANALYSE"
    if (Test-Path $reportsPath) {
        Write-Host "🔍 Ouverture du dossier des rapports..." -ForegroundColor Cyan
        Start-Process explorer.exe -ArgumentList $reportsPath
    }
    
} catch {
    Write-Host "❌ Erreur lors de l'analyse : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "📝 Consultez les logs pour plus de détails" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
