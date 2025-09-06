#!/usr/bin/env node

/**
 * Script de debugging pour JARVIS ULTRA INSTINCT 3D
 * Vérifie la configuration 3D et lance les outils de debug
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔬 JARVIS ULTRA INSTINCT 3D - DEBUG SCRIPT');
console.log('==========================================\n');

// Vérification des dépendances 3D
console.log('📦 Vérification des dépendances 3D...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = packageJson.dependencies;
  
  const required3D = [
    '@react-three/fiber',
    '@react-three/drei', 
    'three',
    'react-force-graph-3d'
  ];
  
  let allPresent = true;
  required3D.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep}: ${dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep}: MANQUANT`);
      allPresent = false;
    }
  });
  
  if (allPresent) {
    console.log('\n🎉 Toutes les dépendances 3D sont présentes !');
  } else {
    console.log('\n⚠️  Certaines dépendances 3D sont manquantes');
  }
} catch (error) {
  console.error('❌ Erreur lors de la vérification des dépendances:', error.message);
}

// Vérification des fichiers 3D
console.log('\n📁 Vérification des fichiers 3D...');
const files3D = [
  'components/sections/NetworkGraph3D.tsx',
  'app/dashboard-3d/page.tsx',
  'app/handshake-3d/page.tsx',
  'app/page-3d.tsx'
];

files3D.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}: MANQUANT`);
  }
});

// Vérification de la configuration Next.js
console.log('\n⚙️  Vérification de la configuration Next.js...');
try {
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  if (nextConfig.includes('ignore-loader')) {
    console.log('✅ Configuration ignore-loader présente');
  } else {
    console.log('⚠️  Configuration ignore-loader manquante');
  }
} catch (error) {
  console.error('❌ Erreur lors de la vérification de next.config.js:', error.message);
}

// Vérification de la configuration ESLint
console.log('\n🔍 Vérification de la configuration ESLint...');
try {
  const eslintConfig = JSON.parse(fs.readFileSync('.eslintrc.json', 'utf8'));
  if (eslintConfig.ignorePatterns && eslintConfig.ignorePatterns.includes('src/**/*')) {
    console.log('✅ Configuration ESLint optimisée');
  } else {
    console.log('⚠️  Configuration ESLint non optimisée');
  }
} catch (error) {
  console.error('❌ Erreur lors de la vérification de .eslintrc.json:', error.message);
}

// Instructions de debugging
console.log('\n🛠️  INSTRUCTIONS DE DEBUGGING 3D:');
console.log('================================');
console.log('1. Ouvrez VS Code avec les extensions suivantes :');
console.log('   - React Developer Tools');
console.log('   - Three.js Inspector');
console.log('   - Chrome Debugger');
console.log('');
console.log('2. Lancez le serveur de développement :');
console.log('   npm run dev');
console.log('');
console.log('3. Ouvrez Chrome DevTools (F12) :');
console.log('   - Performance tab pour analyser les performances 3D');
console.log('   - Memory tab pour détecter les fuites mémoire');
console.log('   - Console pour les erreurs Three.js');
console.log('');
console.log('4. URLs de test 3D :');
console.log('   - http://localhost:3000/page-3d (Page d\'accueil 3D)');
console.log('   - http://localhost:3000/dashboard-3d (Dashboard 3D)');
console.log('   - http://localhost:3000/handshake-3d (Handshake 3D)');
console.log('');
console.log('5. Contrôles 3D :');
console.log('   - Clic gauche: Sélectionner');
console.log('   - Clic droit: Rotation');
console.log('   - Molette: Zoom');
console.log('   - R: Réinitialiser vue');
console.log('   - Espace: Play/Pause animation');
console.log('');
console.log('6. Debugging avancé :');
console.log('   - Utilisez Three.js Inspector dans Chrome');
console.log('   - Surveillez les performances avec React DevTools');
console.log('   - Vérifiez les logs dans la console');

console.log('\n🚀 JARVIS ULTRA INSTINCT 3D - PRÊT POUR LE DEBUGGING !');
