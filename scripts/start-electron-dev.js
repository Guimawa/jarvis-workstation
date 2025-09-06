#!/usr/bin/env node

const { spawn } = require('child_process');
const { createServer } = require('http');
const net = require('net');

console.log('🚀 JARVIS Ultra Instinct - Démarrage Développement');
console.log('==================================================');

// Fonction pour vérifier si un port est libre
function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
}

// Fonction pour attendre qu'un serveur soit prêt
function waitForServer(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    function check() {
      createServer()
        .on('error', () => {
          if (Date.now() - startTime < timeout) {
            setTimeout(check, 1000);
          } else {
            reject(new Error(`Timeout: ${url} non accessible après ${timeout}ms`));
          }
        })
        .listen(3000, () => {
          resolve();
        })
        .close();
    }
    
    // Première vérification
    const testServer = net.createConnection(3000, 'localhost');
    testServer.on('connect', () => {
      testServer.destroy();
      resolve();
    });
    testServer.on('error', () => {
      setTimeout(check, 1000);
    });
  });
}

async function startDevelopment() {
  try {
    console.log('🔍 Vérification du port 3000...');
    const portFree = await isPortFree(3000);
    
    if (!portFree) {
      console.log('⚠️ Port 3000 déjà utilisé');
      console.log('   Arrêtez le processus existant ou utilisez un autre port');
    }

    console.log('🌐 Démarrage du serveur Next.js...');
    const nextProcess = spawn('npm', ['run', 'dev'], {
      stdio: ['inherit', 'inherit', 'inherit'],
      shell: true
    });

    // Gestion d'erreur pour Next.js
    nextProcess.on('error', (error) => {
      console.error('❌ Erreur Next.js:', error.message);
      process.exit(1);
    });

    console.log('⏳ Attente de la disponibilité du serveur...');
    
    // Attendre que Next.js soit prêt
    setTimeout(async () => {
      try {
        console.log('🎯 Lancement d\'Electron...');
        const electronProcess = spawn('electron', ['.'], {
          stdio: ['inherit', 'inherit', 'inherit'],
          shell: true
        });

        // Gestion d'erreur pour Electron
        electronProcess.on('error', (error) => {
          console.error('❌ Erreur Electron:', error.message);
          console.log('   Vérifiez que Electron est installé: npm install electron');
        });

        // Quand Electron se ferme, arrêter Next.js
        electronProcess.on('close', (code) => {
          console.log('🔄 Fermeture d\'Electron...');
          nextProcess.kill();
          process.exit(code);
        });

      } catch (error) {
        console.error('❌ Erreur lors du lancement d\'Electron:', error.message);
        nextProcess.kill();
        process.exit(1);
      }
    }, 5000); // Attendre 5 secondes pour que Next.js démarre

    // Gérer les signaux de fermeture
    process.on('SIGINT', () => {
      console.log('\n🛑 Arrêt en cours...');
      nextProcess.kill();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Arrêt forcé...');
      nextProcess.kill();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    process.exit(1);
  }
}

// Afficher les informations de debug
console.log('🔧 Configuration:');
console.log(`   Node.js: ${process.version}`);
console.log(`   Plateforme: ${process.platform}`);
console.log(`   Architecture: ${process.arch}`);
console.log(`   Répertoire: ${process.cwd()}`);
console.log('');

startDevelopment();
