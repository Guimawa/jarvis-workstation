#!/usr/bin/env node

const { spawn } = require('child_process');
const net = require('net');
const electronBinary = require('electron');

console.log('🚀 JARVIS Ultra Instinct - Démarrage Développement');
console.log('==================================================');

function isPortFree(port, timeout = 500) {
  return new Promise((resolve) => {
    const socket = net.createConnection(port, '127.0.0.1');
    let done = false;
    const finish = (free) => { if (!done) { done = true; resolve(free); } };
    socket.once('connect', () => { socket.destroy(); finish(false); });
    socket.once('error', () => { finish(true); });
    setTimeout(() => finish(true), timeout);
  });
}

function waitForPort(port, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tryConnect = () => {
      const socket = net.createConnection(port, '127.0.0.1');
      socket.on('connect', () => { socket.destroy(); resolve(); });
      socket.on('error', () => {
        if (Date.now() - start > timeout) return reject(new Error(`Timeout waiting port ${port}`));
        setTimeout(tryConnect, 500);
      });
    };
    tryConnect();
  });
}

async function findFreePort(start = 3000, end = 3010) {
  for (let p = start; p <= end; p++) {
    const free = await isPortFree(p);
    if (free) return p;
  }
  throw new Error('No free port found in range 3000-3010');
}

async function startDevelopment() {
  console.log('🔧 Configuration:');
  console.log(`   Node.js: ${process.version}`);
  console.log(`   Plateforme: ${process.platform}`);
  console.log(`   Architecture: ${process.arch}`);
  console.log(`   Répertoire: ${process.cwd()}`);
  console.log('');

  let nextProcess = null;
  try {
    console.log('🔎 Scan des ports 3000-3010...');
    // Toujours démarrer un Next.js propre sur un port libre (pour éviter les conflits et s'assurer des deps à jour)
    const port = await findFreePort(3000, 3010);
    console.log(`🌐 Démarrage du serveur Next.js sur ${port}...`);
    nextProcess = spawn('npm', ['run', 'dev', '--', '--port', String(port)], {
      stdio: ['inherit', 'inherit', 'inherit'],
      shell: true
    });
    nextProcess.on('error', (error) => {
      console.error('❌ Erreur Next.js:', error.message);
      process.exit(1);
    });
    await waitForPort(port, 30000);

    setTimeout(() => {
      try {
        console.log('🎯 Lancement d\'Electron...');
        const url = `http://localhost:${port}`;
        const env = { ...process.env, NODE_ENV: 'development', ELECTRON_START_URL: url, JARVIS_DEV_URL: url };
        delete env.ELECTRON_RUN_AS_NODE;
        const electronProcess = spawn(electronBinary, ['.'], {
          stdio: ['inherit', 'inherit', 'inherit'],
          shell: false,
          env
        });

        electronProcess.on('error', (error) => {
          console.error('❌ Erreur Electron:', error.message);
          console.log('   Vérifiez que Electron est installé: npm install electron');
        });

        electronProcess.on('close', (code) => {
          console.log("🔒 Fermeture d'Electron...");
          if (nextProcess) nextProcess.kill();
          process.exit(code);
        });
      } catch (error) {
        console.error("❌ Erreur lors du lancement d'Electron:", error.message);
        if (nextProcess) nextProcess.kill();
        process.exit(1);
      }
    }, 1000);

    process.on('SIGINT', () => {
      console.log('\n🛑 Arrêt en cours...');
      if (nextProcess) nextProcess.kill();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Arrêt forcé...');
      if (nextProcess) nextProcess.kill();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    if (nextProcess) nextProcess.kill();
    process.exit(1);
  }
}

startDevelopment();
