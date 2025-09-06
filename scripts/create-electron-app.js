#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 JARVIS ULTRA INSTINCT - Création de l\'application Electron');
console.log('============================================================');

// 1. Créer le package.json pour Electron
const electronPackageJson = {
  "name": "jarvis-ultra-instinct-desktop",
  "version": "2.0.0",
  "description": "Jarvis Ultra Instinct - Application Desktop",
  "main": "electron-main.js",
  "scripts": {
    "electron": "electron .",
    "electron-dev": "electron . --dev",
    "build": "next build && electron-builder",
    "dist": "npm run build && electron-builder --publish=never"
  },
  "build": {
    "appId": "com.jarvis.ultra-instinct",
    "productName": "Jarvis Ultra Instinct",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!node_modules",
      "!.next",
      "!dist"
    ],
    "win": {
      "target": "nsis",
      "icon": "public/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "public/icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "public/icon.png"
    }
  },
  "dependencies": {
    "electron": "^27.0.0",
    "electron-builder": "^24.6.4"
  }
};

// 2. Créer le fichier principal Electron
const electronMain = `const { app, BrowserWindow, Menu, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let nextProcess;

function createWindow() {
  // Créer la fenêtre du navigateur
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'public/icon.png'),
    title: 'Jarvis Ultra Instinct',
    show: false
  });

  // Charger l'application Next.js
  mainWindow.loadURL('http://localhost:3000');

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Ouvrir les liens externes dans le navigateur par défaut
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startNextServer() {
  console.log('🚀 Démarrage du serveur Next.js...');
  
  nextProcess = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'pipe'
  });

  nextProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  nextProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  nextProcess.on('close', (code) => {
    console.log(\`Serveur Next.js fermé avec le code \${code}\`);
  });
}

// Cette méthode sera appelée quand Electron aura fini de s'initialiser
app.whenReady().then(() => {
  startNextServer();
  
  // Attendre que le serveur Next.js soit prêt
  setTimeout(() => {
    createWindow();
  }, 5000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (nextProcess) {
      nextProcess.kill();
    }
    app.quit();
  }
});

// Gérer la fermeture de l'application
app.on('before-quit', () => {
  if (nextProcess) {
    nextProcess.kill();
  }
});

// Créer le menu de l'application
const template = [
  {
    label: 'Fichier',
    submenu: [
      {
        label: 'Nouveau Projet',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          // Ouvrir le CLI pour créer un nouveau projet
          const { spawn } = require('child_process');
          spawn('node', ['scripts/jarvis-cli-main.js', 'init'], {
            cwd: __dirname,
            stdio: 'inherit'
          });
        }
      },
      { type: 'separator' },
      {
        label: 'Quitter',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Édition',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'Vue',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Jarvis',
    submenu: [
      {
        label: 'Dashboard',
        click: () => {
          mainWindow.loadURL('http://localhost:3000');
        }
      },
      {
        label: 'Générer un Composant',
        click: () => {
          const { spawn } = require('child_process');
          spawn('node', ['scripts/jarvis-cli-main.js', 'generate', 'component'], {
            cwd: __dirname,
            stdio: 'inherit'
          });
        }
      },
      {
        label: 'Mode Apprentissage',
        click: () => {
          const { spawn } = require('child_process');
          spawn('node', ['scripts/jarvis-cli-main.js', 'learn'], {
            cwd: __dirname,
            stdio: 'inherit'
          });
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
`;

// 3. Créer le script de build
const buildScript = `#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 JARVIS ULTRA INSTINCT - Build Electron');
console.log('==========================================');

// 1. Installer les dépendances Electron
console.log('📦 Installation des dépendances Electron...');
try {
  execSync('npm install electron electron-builder --save-dev', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Erreur lors de l\'installation des dépendances:', error.message);
  process.exit(1);
}

// 2. Créer les fichiers de configuration
console.log('⚙️  Création des fichiers de configuration...');

// Créer le package.json pour Electron
const electronPackagePath = path.join(__dirname, '..', 'electron-package.json');
fs.writeFileSync(electronPackagePath, JSON.stringify(electronPackageJson, null, 2));

// Créer le fichier principal Electron
const electronMainPath = path.join(__dirname, '..', 'electron-main.js');
fs.writeFileSync(electronMainPath, electronMain);

// 3. Build de l'application Next.js
console.log('🏗️  Build de l\'application Next.js...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Erreur lors du build Next.js:', error.message);
  process.exit(1);
}

// 4. Build de l'application Electron
console.log('📱 Build de l\'application Electron...');
try {
  execSync('npx electron-builder --publish=never', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Erreur lors du build Electron:', error.message);
  process.exit(1);
}

console.log('✅ Build terminé avec succès!');
console.log('📁 L\'application se trouve dans le dossier dist/');
`;

// Écrire les fichiers
const scriptsDir = path.join(__dirname, '..', 'scripts');

// Écrire le package.json pour Electron
fs.writeFileSync(
  path.join(scriptsDir, 'electron-package.json'),
  JSON.stringify(electronPackageJson, null, 2)
);

// Écrire le fichier principal Electron
fs.writeFileSync(
  path.join(scriptsDir, 'electron-main.js'),
  electronMain
);

// Écrire le script de build
fs.writeFileSync(
  path.join(scriptsDir, 'build-electron.js'),
  buildScript
);

console.log('✅ Fichiers Electron créés:');
console.log('   - electron-package.json (configuration)');
console.log('   - electron-main.js (fichier principal)');
console.log('   - build-electron.js (script de build)');
console.log('');
console.log('🚀 Pour créer l\'application desktop:');
console.log('   node scripts/build-electron.js');
