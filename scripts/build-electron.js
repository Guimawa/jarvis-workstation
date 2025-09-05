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

// Build Electron
console.log('\n⚡ Build Electron...');
try {
  execSync('electron-builder --publish=never', { stdio: 'inherit' });
  console.log('✅ Build Electron terminé');
} catch (error) {
  console.error('❌ Erreur lors du build Electron:', error.message);
  process.exit(1);
}

// Afficher les résultats
console.log('\n🎉 BUILD TERMINÉ AVEC SUCCÈS !');
console.log('=====================================');

const distDir = path.join(process.cwd(), 'dist-electron');
if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);
  console.log('\n📁 Fichiers générés:');
  files.forEach(file => {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`   ${file} (${size} MB)`);
  });
} else {
  console.warn('⚠️ Dossier dist-electron non trouvé');
}

console.log('\n📝 Instructions:');
console.log('   • Fichier .exe dans dist-electron/');
console.log('   • Test en dev: npm run electron');
console.log('   • Build uniquement Windows: npm run build-win');
console.log('\n🎯 Application prête pour distribution !');