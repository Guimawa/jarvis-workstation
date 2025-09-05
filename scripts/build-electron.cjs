#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 JARVIS Ultra Instinct - Build Electron');
console.log('==========================================');

// Vérifier les dépendances critiques
const criticalDeps = ['electron', 'electron-builder', 'next'];
console.log('📋 Vérification des dépendances...');

criticalDeps.forEach(dep => {
  try {
    require.resolve(dep);
    console.log(`✅ ${dep} - OK`);
  } catch (e) {
    console.error(`❌ ${dep} - MANQUANT`);
    console.log(`   Installez avec: npm install ${dep}`);
    process.exit(1);
  }
});

// Nettoyer les builds précédents
console.log('\n🧹 Nettoyage des builds précédents...');
try {
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }
  if (fs.existsSync('dist-electron')) {
    fs.rmSync('dist-electron', { recursive: true, force: true });
  }
  console.log('✅ Nettoyage terminé');
} catch (error) {
  console.warn('⚠️ Erreur lors du nettoyage:', error.message);
}

// Build Next.js
console.log('\n📦 Build Next.js...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build Next.js terminé');
} catch (error) {
  console.error('❌ Erreur lors du build Next.js:', error.message);
  process.exit(1);
}

// Export statique
console.log('\n📤 Export statique...');
try {
  execSync('npm run export', { stdio: 'inherit' });
  console.log('✅ Export terminé');
} catch (error) {
  console.error('❌ Erreur lors de l\'export:', error.message);
  process.exit(1);
}

// Vérifier la structure du build
console.log('\n🔍 Vérification du build...');
const outDir = path.join(process.cwd(), 'out');
if (!fs.existsSync(outDir)) {
  console.error('❌ Dossier out/ non trouvé');
  process.exit(1);
}

const indexFile = path.join(outDir, 'index.html');
if (!fs.existsSync(indexFile)) {
  console.error('❌ index.html non trouvé dans out/');
  process.exit(1);
}

console.log('✅ Structure du build validée');

// Build Electron avec gestion des arguments
const args = process.argv.slice(2);
const platform = args.find(arg => arg.startsWith('--platform='))?.split('=')[1] || 'win32';
const arch = args.find(arg => arg.startsWith('--arch='))?.split('=')[1] || 'all';

console.log('\n⚡ Build Electron...');
console.log(`   🎯 Plateforme: ${platform}`);
console.log(`   🏗️  Architecture: ${arch}`);

let buildCommand = 'electron-builder --publish=never';

if (platform === 'win32') {
  buildCommand += ' --win';
  if (arch !== 'all') {
    buildCommand += ` --${arch}`;
  }
} else if (platform === 'darwin') {
  buildCommand += ' --mac';
} else if (platform === 'linux') {
  buildCommand += ' --linux';
}

try {
  execSync(buildCommand, { stdio: 'inherit' });
  console.log('✅ Build Electron terminé');
} catch (error) {
  console.error('❌ Erreur lors du build Electron:', error.message);
  process.exit(1);
}

// Afficher les résultats détaillés
console.log('\n🎉 BUILD TERMINÉ AVEC SUCCÈS !');
console.log('=====================================');

const distDir = path.join(process.cwd(), 'dist-electron');
if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);
  console.log('\n📁 Fichiers générés:');
  
  // Séparer les fichiers par type
  const installers = files.filter(f => f.includes('Setup') || f.endsWith('.exe'));
  const portables = files.filter(f => f.includes('portable') || f.endsWith('.zip'));
  const others = files.filter(f => !installers.includes(f) && !portables.includes(f));
  
  if (installers.length > 0) {
    console.log('\n  🎯 INSTALLATEURS:');
    installers.forEach(file => {
      const filePath = path.join(distDir, file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024 / 1024).toFixed(2);
      const arch = file.includes('x64') ? '64-bit' : file.includes('ia32') ? '32-bit' : 'Multi-arch';
      console.log(`     ✅ ${file} (${size} MB) - Windows ${arch}`);
    });
  }
  
  if (portables.length > 0) {
    console.log('\n  📦 VERSIONS PORTABLES:');
    portables.forEach(file => {
      const filePath = path.join(distDir, file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`     📂 ${file} (${size} MB)`);
    });
  }
  
  if (others.length > 0) {
    console.log('\n  📋 AUTRES FICHIERS:');
    others.forEach(file => {
      const filePath = path.join(distDir, file);
      const stats = fs.statSync(filePath);
      const isDir = stats.isDirectory();
      const size = isDir ? '[Dossier]' : `${(stats.size / 1024 / 1024).toFixed(2)} MB`;
      console.log(`     ${isDir ? '📁' : '📄'} ${file} ${size}`);
    });
  }
} else {
  console.warn('⚠️ Dossier dist-electron non trouvé');
}

console.log('\n📝 Instructions de distribution:');
if (platform === 'win32') {
  console.log('   🎯 WINDOWS:');
  console.log('     • Fichiers .exe = Installateurs (recommandé pour distribution)');
  console.log('     • Fichiers portable = Versions sans installation');
  console.log('     • 32-bit = Compatible Windows anciennes versions');
  console.log('     • 64-bit = Recommandé pour Windows modernes');
} else if (platform === 'darwin') {
  console.log('   🍎 MACOS:');
  console.log('     • Fichier .dmg = Image disque pour installation');
} else if (platform === 'linux') {
  console.log('   🐧 LINUX:');
  console.log('     • Fichier .AppImage = Application portable');
}

console.log('\n🔧 Commandes utiles:');
console.log('   • Test en dev: npm run electron');
console.log('   • Windows 64-bit: npm run build-win64');
console.log('   • Windows 32-bit: npm run build-win32');
console.log('   • Nettoyer projet: npm run clean');
console.log('\n🎯 Application prête pour distribution !');