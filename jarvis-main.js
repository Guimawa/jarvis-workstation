#!/usr/bin/env node

// ==============================================
// 🧠 JARVIS ULTRA INSTINCT - Point d'entrée principal
// ==============================================
// Version: 2.0.0
// Auteur: Jarvis Expert
// Description: Point d'entrée principal pour l'application .EXE
// ==============================================

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║        ██████╗  █████╗ ██████╗ ██╗   ██╗██╗███████╗                        ║
║       ██╔════╝ ██╔══██╗██╔══██╗██║   ██║██║██╔════╝                        ║
║       ██║  ███╗███████║██████╔╝██║   ██║██║███████╗                        ║
║       ██║   ██║██╔══██║██╔══██╗╚██╗ ██╔╝██║╚════██║                        ║
║       ╚██████╔╝██║  ██║██║  ██║ ╚████╔╝ ██║███████║                        ║
║        ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝                        ║
║                                                                              ║
║                    ULTRA INSTINCT DASHBOARD                                  ║
║                      Version 2.0 - EXE                                      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

console.log('🚀 JARVIS ULTRA INSTINCT - Démarrage...');
console.log('==========================================');

// Vérifier si nous sommes dans un environnement .exe
const isExe = process.pkg !== undefined;

if (isExe) {
  console.log('✅ Mode EXE détecté');
  console.log('📁 Répertoire de travail:', __dirname);
  
  // Lancer le serveur Next.js
  console.log('🔄 Lancement du serveur Next.js...');
  console.log('🌐 Interface: http://localhost:3000');
  console.log('💡 Pour arrêter: Ctrl+C');
  console.log('');
  
  // Ouvrir le navigateur
  setTimeout(() => {
    const { exec } = require('child_process');
    exec('start http://localhost:3000');
  }, 2000);
  
  // Lancer npm run dev
  const child = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });
  
  child.on('close', (code) => {
    console.log(`\n👋 Jarvis fermé avec le code: ${code}`);
  });
  
  child.on('error', (error) => {
    console.error('❌ Erreur:', error);
  });
  
} else {
  console.log('⚠️  Ce fichier doit être compilé avec pkg pour fonctionner');
  console.log('📋 Utilisez: npx pkg jarvis-main.js --targets node16-win');
  process.exit(1);
}
