#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 JARVIS Ultra Instinct - Nettoyage Complet');
console.log('============================================');

// Dossiers à nettoyer
const FOLDERS_TO_CLEAN = [
  'node_modules',      // Modules NPM (sera réinstallé)
  '.next',            // Build Next.js
  'out',              // Export Next.js
  'dist-electron',    // Build Electron
  '.nyc_output',      // Coverage tests
  'coverage',         // Coverage reports
  'logs',             // Fichiers de log
  'tmp',              // Fichiers temporaires
  'temp',             // Fichiers temporaires
  '.electron-builder-cache', // Cache electron-builder
];

// Fichiers à nettoyer
const FILES_TO_CLEAN = [
  'package-lock.json',     // Lock NPM (sera regénéré)
  'yarn.lock',            // Lock Yarn
  '.DS_Store',            // Fichiers macOS
  'Thumbs.db',            // Fichiers Windows
  'desktop.ini',          // Fichiers Windows
  '*.log',                // Logs génériques
  'npm-debug.log*',       // Logs NPM debug
  'yarn-debug.log*',      // Logs Yarn debug
  'yarn-error.log*',      // Logs Yarn error
  'tsconfig.tsbuildinfo', // Cache TypeScript
  '.env.local',           // Variables locales (si existantes)
  '.env.development.local',
  '.env.production.local',
];

// Extensions de fichiers à nettoyer
const EXTENSIONS_TO_CLEAN = [
  '.tmp',
  '.temp',
  '.cache',
  '.pid',
  '.seed',
  '.coverage',
  '.nyc_output',
];

let totalCleaned = 0;
let totalSize = 0;

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getDirectorySize(dirPath) {
  let totalSize = 0;
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      files.forEach(file => {
        const filePath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
          totalSize += getDirectorySize(filePath);
        } else {
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
        }
      });
    }
  } catch (error) {
    // Ignorer les erreurs d'accès
  }
  return totalSize;
}

function removeDirRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    const size = getDirectorySize(dirPath);
    fs.rmSync(dirPath, { recursive: true, force: true });
    totalCleaned++;
    totalSize += size;
    console.log(`  ✅ Supprimé: ${dirPath} (${formatBytes(size)})`);
  }
}

function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const size = stats.size;
    fs.unlinkSync(filePath);
    totalCleaned++;
    totalSize += size;
    console.log(`  ✅ Supprimé: ${filePath} (${formatBytes(size)})`);
  }
}

function findAndRemoveByPattern(pattern) {
  try {
    const { execSync } = require('child_process');
    const files = execSync(`find . -name "${pattern}" -type f 2>/dev/null || true`, { encoding: 'utf8' });
    files.split('\n').filter(f => f.trim()).forEach(file => {
      removeFile(file.trim());
    });
  } catch (error) {
    // Platform non-Unix, ignorer
  }
}

console.log('\n🔍 Analyse des dossiers à nettoyer...');

// Analyser la taille avant nettoyage
let sizeBeforeCleaning = 0;
FOLDERS_TO_CLEAN.forEach(folder => {
  if (fs.existsSync(folder)) {
    const size = getDirectorySize(folder);
    sizeBeforeCleaning += size;
    console.log(`  📁 ${folder}: ${formatBytes(size)}`);
  }
});

console.log(`\n📊 Taille totale à libérer: ${formatBytes(sizeBeforeCleaning)}`);

if (sizeBeforeCleaning === 0) {
  console.log('✨ Le projet est déjà propre ! Rien à nettoyer.');
  process.exit(0);
}

// Demander confirmation
console.log('\n⚠️  Voulez-vous continuer le nettoyage ?');
console.log('   Ceci va supprimer tous les fichiers de build et cache.');

// En mode automatique (pour script), continuer directement
const autoMode = process.argv.includes('--auto') || process.argv.includes('-y');

if (!autoMode) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Continuer ? (y/n): ', (answer) => {
    rl.close();
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      performCleaning();
    } else {
      console.log('❌ Nettoyage annulé.');
      process.exit(0);
    }
  });
} else {
  performCleaning();
}

function performCleaning() {
  console.log('\n🧹 Démarrage du nettoyage...');

  // Nettoyer les dossiers
  console.log('\n📁 Nettoyage des dossiers...');
  FOLDERS_TO_CLEAN.forEach(folder => {
    removeDirRecursive(folder);
  });

  // Nettoyer les fichiers spécifiques
  console.log('\n📄 Nettoyage des fichiers...');
  FILES_TO_CLEAN.forEach(file => {
    if (file.includes('*')) {
      findAndRemoveByPattern(file);
    } else {
      removeFile(file);
    }
  });

  // Nettoyer par extensions
  console.log('\n🔧 Nettoyage par extensions...');
  EXTENSIONS_TO_CLEAN.forEach(ext => {
    findAndRemoveByPattern(`*${ext}`);
  });

  // Nettoyage spécifique plateforme
  if (process.platform === 'win32') {
    console.log('\n🪟 Nettoyage spécifique Windows...');
    findAndRemoveByPattern('Thumbs.db');
    findAndRemoveByPattern('desktop.ini');
  }

  if (process.platform === 'darwin') {
    console.log('\n🍎 Nettoyage spécifique macOS...');
    findAndRemoveByPattern('.DS_Store');
    findAndRemoveByPattern('._*');
  }

  // Résumé final
  console.log('\n🎉 NETTOYAGE TERMINÉ !');
  console.log('====================');
  console.log(`📊 ${totalCleaned} éléments supprimés`);
  console.log(`💾 Espace libéré: ${formatBytes(totalSize)}`);
  console.log('');
  console.log('📝 Prochaines étapes recommandées:');
  console.log('   1. npm install          # Réinstaller les dépendances');
  console.log('   2. npm run electron     # Tester en développement');
  console.log('   3. npm run build-win    # Créer l\'exécutable');
  console.log('');
  console.log('✨ Votre projet est maintenant propre et optimisé !');
}