#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 JARVIS LIGHT - Create Executable');
console.log('====================================');

// 1. Créer un fichier exécutable simple
const executableContent = `#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 JARVIS ULTRA INSTINCT - Version Allégée');
console.log('============================================');

const options = process.argv.slice(2);
const command = options[0] || 'dev';

console.log(\`Lancement de: npm run \${command}\`);

const child = spawn('npm', ['run', command], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

child.on('close', (code) => {
  console.log(\`Processus terminé avec le code: \${code}\`);
});

child.on('error', (error) => {
  console.error('Erreur:', error);
});
`;

const executablePath = path.join(__dirname, '..', 'jarvis-light.exe.js');
fs.writeFileSync(executablePath, executableContent);

// 2. Créer un fichier batch pour Windows
const batchContent = `@echo off
echo 🚀 JARVIS ULTRA INSTINCT - Version Allégée
echo ============================================
node jarvis-light.exe.js %*
pause
`;

const batchPath = path.join(__dirname, '..', 'jarvis-light.bat');
fs.writeFileSync(batchPath, batchContent);

// 3. Créer un script PowerShell
const psContent = `# JARVIS ULTRA INSTINCT - Version Allégée
Write-Host "🚀 JARVIS ULTRA INSTINCT - Version Allégée" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

$command = $args[0]
if (-not $command) { $command = "dev" }

Write-Host "Lancement de: npm run $command" -ForegroundColor Yellow

try {
    Set-Location $PSScriptRoot
    npm run $command
} catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
}
`;

const psPath = path.join(__dirname, '..', 'jarvis-light.ps1');
fs.writeFileSync(psPath, psContent);

console.log('✅ Fichiers exécutables créés:');
console.log('   - jarvis-light.exe.js (Node.js)');
console.log('   - jarvis-light.bat (Windows Batch)');
console.log('   - jarvis-light.ps1 (PowerShell)');
console.log('');
console.log('Usage:');
console.log('   node jarvis-light.exe.js dev    # Mode développement');
console.log('   node jarvis-light.exe.js build  # Build');
console.log('   node jarvis-light.exe.js start  # Production');
console.log('   .\\jarvis-light.bat dev          # Windows');
console.log('   .\\jarvis-light.ps1 dev          # PowerShell');
