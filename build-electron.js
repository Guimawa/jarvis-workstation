#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage du build Electron...');

try {
  // Sauvegarde de la configuration actuelle
  console.log('📦 Sauvegarde de la configuration Next.js...');
  if (fs.existsSync('next.config.js')) {
    fs.copyFileSync('next.config.js', 'next.config.backup.js');
  }

  // Copie de la configuration Electron
  console.log('⚙️  Application de la configuration Electron...');
  fs.copyFileSync('next.config.electron.js', 'next.config.js');

  // Build Next.js avec export statique
  console.log('🔨 Build Next.js en cours...');
  execSync('next build', { stdio: 'inherit' });

  // Copie d'electron.js dans le dossier de distribution
  console.log('📋 Copie des fichiers Electron...');
  if (!fs.existsSync('out')) {
    throw new Error('Le dossier out n\'a pas été créé par Next.js build');
  }
  // Utiliser le fichier electron.js de production
  fs.copyFileSync('public/electron.js', 'out/electron.js');

  // Restauration de la configuration originale
  console.log('🔄 Restauration de la configuration Next.js...');
  if (fs.existsSync('next.config.backup.js')) {
    fs.copyFileSync('next.config.backup.js', 'next.config.js');
    fs.unlinkSync('next.config.backup.js');
  } else if (fs.existsSync('next.config.original.js')) {
    fs.copyFileSync('next.config.original.js', 'next.config.js');
  }

  console.log('✅ Build Electron terminé avec succès!');
  console.log('📁 Les fichiers sont dans le dossier: out/');

} catch (error) {
  console.error('❌ Erreur lors du build:', error.message);
  
  // Restauration d'urgence
  if (fs.existsSync('next.config.backup.js')) {
    fs.copyFileSync('next.config.backup.js', 'next.config.js');
    fs.unlinkSync('next.config.backup.js');
  }
  
  process.exit(1);
}