const electronMod = require('electron');
const { app, BrowserWindow, Menu, ipcMain, dialog, shell, Notification } = electronMod || {};
const path = require('path');
const fs = require('fs');
// Consider app.isPackaged to detect dev reliably
const isDev = process.env.NODE_ENV === 'development' || !(electronMod && electronMod.app && electronMod.app.isPackaged);

if (!electronMod || !app) {
  try {
    console.error('Electron module not available or app is undefined. Ensure this file runs in Electron main process.');
    console.error('electron module typeof:', typeof electronMod);
    if (electronMod) {
      console.error('electron module keys:', Object.keys(electronMod));
    }
    console.error('ELECTRON_RUN_AS_NODE:', process.env.ELECTRON_RUN_AS_NODE);
    console.error('process.versions.electron:', process.versions && process.versions.electron);
  } catch {}
}

// Configuration de sécurité
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Répertoires d'exécution (cache / données) pour éviter les erreurs d'accès refusé
try {
  const runtimeDataDir = path.join(process.cwd(), 'user_data');
  const runtimeCacheDir = path.join(process.cwd(), 'cache');
  fs.mkdirSync(runtimeDataDir, { recursive: true });
  fs.mkdirSync(runtimeCacheDir, { recursive: true });
  if (app) {
    app.setPath('userData', runtimeDataDir);
    app.setPath('cache', runtimeCacheDir);
    app.commandLine.appendSwitch('disk-cache-dir', runtimeCacheDir);
    app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
  }
} catch (e) {
  console.warn('Impossible de configurer les répertoires cache/userData:', e && e.message);
}

class JarvisElectronApp {
  constructor() {
    this.mainWindow = null;
    this.splashWindow = null;
  }

  createSplashWindow() {
    this.splashWindow = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false,
      alwaysOnTop: true,
      transparent: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    this.splashWindow.loadFile(path.join(__dirname, 'splash.html'));

    this.splashWindow.on('closed', () => {
      this.splashWindow = null;
    });
  }

  createMainWindow() {
    // Configuration de la fenêtre principale
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 800,
      minHeight: 600,
      show: false,
      icon: path.join(__dirname, '..', 'public', 'favicon.ico'),
      titleBarStyle: 'default',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.cjs'),
        webSecurity: true,
        allowRunningInsecureContent: false
      }
    });

    // Chargement de l'application
    const startUrl = isDev
      ? (process.env.ELECTRON_START_URL || process.env.JARVIS_DEV_URL || 'http://localhost:3000')
      : `file://${path.join(__dirname, '..', 'out', 'index.html')}`;

    this.mainWindow.loadURL(startUrl);

    // Gestion des événements de la fenêtre
    this.mainWindow.once('ready-to-show', () => {
      if (this.splashWindow) {
        this.splashWindow.close();
      }
      this.mainWindow.show();
      
      // Ouvrir DevTools en développement
      if (isDev) {
        this.mainWindow.webContents.openDevTools();
      }
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Gestion des liens externes
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });

    // Prévention de la navigation vers des domaines externes
    this.mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      
      if (parsedUrl.origin !== 'http://localhost:3000' && !navigationUrl.startsWith('file://')) {
        event.preventDefault();
        shell.openExternal(navigationUrl);
      }
    });
  }

  createMenu() {
    const template = [
      {
        label: 'JARVIS',
        submenu: [
          {
            label: 'À propos de JARVIS Ultra Instinct',
            click: () => {
              dialog.showMessageBox(this.mainWindow, {
                type: 'info',
                title: 'À propos de JARVIS Ultra Instinct',
                message: 'JARVIS Ultra Instinct v2.0.0',
                detail: 'Dashboard IA complet avec génération de code\nDéveloppé par Guima\n\nVersion Electron pour une expérience native optimisée.',
                icon: path.join(__dirname, '..', 'public', 'favicon.ico')
              });
            }
          },
          { type: 'separator' },
          { role: 'quit', label: 'Quitter' }
        ]
      },
      {
        label: 'Édition',
        submenu: [
          { role: 'undo', label: 'Annuler' },
          { role: 'redo', label: 'Rétablir' },
          { type: 'separator' },
          { role: 'cut', label: 'Couper' },
          { role: 'copy', label: 'Copier' },
          { role: 'paste', label: 'Coller' },
          { role: 'selectall', label: 'Tout sélectionner' }
        ]
      },
      {
        label: 'Affichage',
        submenu: [
          { role: 'reload', label: 'Actualiser' },
          { role: 'forceReload', label: 'Actualiser (forcé)' },
          { role: 'toggleDevTools', label: 'Outils de développement' },
          { type: 'separator' },
          { role: 'resetZoom', label: 'Zoom normal' },
          { role: 'zoomIn', label: 'Zoom avant' },
          { role: 'zoomOut', label: 'Zoom arrière' },
          { type: 'separator' },
          { role: 'togglefullscreen', label: 'Plein écran' }
        ]
      },
      {
        label: 'Outils',
        submenu: [
          {
            label: 'Analyse Microscopique',
            click: () => {
              this.mainWindow.webContents.send('navigate-to', '/outils-analyse');
            }
          },
          {
            label: 'Dashboard',
            click: () => {
              this.mainWindow.webContents.send('navigate-to', '/dashboard');
            }
          },
          {
            label: 'Métriques',
            click: () => {
              this.mainWindow.webContents.send('navigate-to', '/metriques');
            }
          },
          { type: 'separator' },
          {
            label: 'Configuration',
            click: () => {
              this.mainWindow.webContents.send('navigate-to', '/configuration');
            }
          }
        ]
      },
      {
        label: 'Fenêtre',
        submenu: [
          { role: 'minimize', label: 'Réduire' },
          { role: 'close', label: 'Fermer' },
          { type: 'separator' },
          { role: 'front', label: 'Tout ramener au premier plan' }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  setupIPC() {
    // Communication avec le processus de rendu
    ipcMain.handle('app-version', () => {
      return app.getVersion();
    });

    ipcMain.handle('show-message-box', async (event, options) => {
      const result = await dialog.showMessageBox(this.mainWindow, options);
      return result;
    });

    ipcMain.handle('show-open-dialog', async (event, options) => {
      const result = await dialog.showOpenDialog(this.mainWindow, options);
      return result;
    });

    ipcMain.handle('show-save-dialog', async (event, options) => {
      const result = await dialog.showSaveDialog(this.mainWindow, options);
      return result;
    });

    // Gestion des notifications système
    ipcMain.handle('show-notification', (event, { title, body }) => {
      if (Notification.isSupported()) {
        new Notification({ title, body }).show();
      }
    });
  }

  initialize() {
    // Gestion de l'événement ready
    app.whenReady().then(() => {
      console.log('🚀 JARVIS Ultra Instinct - Initialisation...');
      
      this.createSplashWindow();
      this.createMainWindow();
      this.createMenu();
      this.setupIPC();

      // Gestion macOS
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    // Gestion de la fermeture de l'application
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Gestion de sécurité
    app.on('web-contents-created', (event, contents) => {
      contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        shell.openExternal(navigationUrl);
      });
    });

    // Désactiver la navigation via fichiers
    app.on('web-contents-created', (event, contents) => {
      contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        
        if (parsedUrl.origin !== 'http://localhost:3000' && !navigationUrl.startsWith('file://')) {
          event.preventDefault();
        }
      });
    });
  }
}

// Initialisation de l'application
const jarvisApp = new JarvisElectronApp();
jarvisApp.initialize();

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('Erreur non capturée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
});
