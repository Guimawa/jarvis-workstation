// electron-main.js - Configuration principale d'Electron pour Jarvis Ultra Instinct

const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Vérification si nous sommes en mode développement
const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_IS_DEV;

// Variables globales
let mainWindow = null;
let nextServer = null;

// Configuration de sécurité
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

/**
 * Démarre le serveur Next.js en mode développement
 */
async function startNextServer() {
  if (isDev) {
    console.log('🚀 Démarrage du serveur Next.js en mode développement...');
    
    nextServer = spawn('npm', ['run', 'dev'], {
      shell: true,
      stdio: 'inherit',
      cwd: __dirname
    });
    
    nextServer.on('error', (error) => {
      console.error('❌ Erreur lors du démarrage du serveur Next.js:', error);
    });
    
    // Attendre que le serveur soit prêt
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

/**
 * Crée la fenêtre principale de l'application
 */
function createMainWindow() {
  // Configuration de la fenêtre principale
  const windowOptions = {
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'electron-preload.js'),
      webSecurity: true
    },
    icon: path.join(__dirname, 'public', 'jarvis-icon.png'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false, // Ne pas afficher immédiatement
    frame: true,
    titleBarOverlay: {
      color: '#0f172a',
      symbolColor: '#ffffff'
    }
  };

  mainWindow = new BrowserWindow(windowOptions);

  // URL du serveur selon l'environnement
  const serverUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, 'out/index.html')}`;

  // Charger l'application
  mainWindow.loadURL(serverUrl);

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Ouvrir les DevTools en mode développement
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
    
    console.log('✅ Fenêtre principale chargée');
  });

  // Gérer la fermeture de la fenêtre
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Empêcher la navigation vers des sites externes
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== serverUrl) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });

  // Gérer les nouvelles fenêtres
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return mainWindow;
}

/**
 * Configuration du menu de l'application
 */
function createApplicationMenu() {
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Nouveau Projet',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('menu-new-project');
          }
        },
        {
          label: 'Ouvrir Projet',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openDirectory'],
              title: 'Sélectionner un projet'
            });
            
            if (!result.canceled) {
              mainWindow?.webContents.send('menu-open-project', result.filePaths[0]);
            }
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
      label: 'Edition',
      submenu: [
        { role: 'undo', label: 'Annuler' },
        { role: 'redo', label: 'Refaire' },
        { type: 'separator' },
        { role: 'cut', label: 'Couper' },
        { role: 'copy', label: 'Copier' },
        { role: 'paste', label: 'Coller' }
      ]
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload', label: 'Recharger' },
        { role: 'forceReload', label: 'Forcer le rechargement' },
        { role: 'toggleDevTools', label: 'Outils de développement' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom par défaut' },
        { role: 'zoomIn', label: 'Zoomer' },
        { role: 'zoomOut', label: 'Dézoomer' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Plein écran' }
      ]
    },
    {
      label: 'Fenêtre',
      submenu: [
        { role: 'minimize', label: 'Réduire' },
        { role: 'close', label: 'Fermer' }
      ]
    },
    {
      label: 'Aide',
      submenu: [
        {
          label: 'À propos de Jarvis Ultra Instinct',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'À propos',
              message: 'Jarvis Ultra Instinct',
              detail: 'Dashboard IA complet avec génération de code\nVersion 2.0.0\nPar Guima'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * Gestionnaires IPC pour la communication avec le renderer
 */
function setupIpcHandlers() {
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  ipcMain.handle('show-message-box', async (event, options) => {
    const result = await dialog.showMessageBox(mainWindow, options);
    return result;
  });

  ipcMain.handle('show-open-dialog', async (event, options) => {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
  });

  ipcMain.handle('show-save-dialog', async (event, options) => {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
  });
}

/**
 * Gestionnaire pour quand l'application est prête
 */
app.whenReady().then(async () => {
  console.log('🔥 Jarvis Ultra Instinct - Démarrage de l\'application...');
  
  try {
    // Démarrer le serveur Next.js si en développement
    await startNextServer();
    
    // Créer la fenêtre principale
    createMainWindow();
    
    // Configurer le menu
    createApplicationMenu();
    
    // Configurer les gestionnaires IPC
    setupIpcHandlers();
    
    console.log('✅ Application initialisée avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    app.quit();
  }
});

/**
 * Gestionnaire pour la fermeture de toutes les fenêtres
 */
app.on('window-all-closed', () => {
  // Arrêter le serveur Next.js
  if (nextServer) {
    nextServer.kill();
  }
  
  // Quitter l'application (sauf sur macOS)
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Gestionnaire pour l'activation de l'application (macOS)
 */
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

/**
 * Gestionnaire pour avant la fermeture de l'application
 */
app.on('before-quit', (event) => {
  console.log('🔄 Fermeture de l\'application...');
  
  // Nettoyer les ressources
  if (nextServer) {
    nextServer.kill();
  }
});

// Empêcher le zoom avec la molette de la souris
app.on('ready', () => {
  if (mainWindow) {
    mainWindow.webContents.on('zoom-changed', (event) => {
      event.preventDefault();
    });
  }
});

console.log('🚀 Jarvis Ultra Instinct - Configuration Electron chargée');