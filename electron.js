const { app, BrowserWindow, Menu } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Garde une référence globale de la fenêtre, sinon elle sera fermée automatiquement
let mainWindow;
let nextProcess;

function createWindow() {
  // Créer la fenêtre du navigateur
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    icon: path.join(__dirname, 'public', 'icon.ico'), // Ajoutez votre icône
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    titleBarStyle: 'default',
    show: false, // Ne pas afficher jusqu'à ce que ready-to-show
    backgroundColor: '#0f172a' // Couleur de fond correspondant à votre thème
  });

  // Configuration du menu
  if (!isDev) {
    Menu.setApplicationMenu(null); // Supprimer le menu en production
  }

  // URL à charger
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../out/index.html')}`;

  if (isDev) {
    // En mode développement, attendre que le serveur Next.js soit prêt
    const waitOn = require('wait-on');
    waitOn({
      resources: ['http://localhost:3000'],
      delay: 1000,
      interval: 100,
      timeout: 30000
    }, (err) => {
      if (err) {
        console.error('Erreur lors de l\'attente du serveur Next.js:', err);
        return;
      }
      mainWindow.loadURL(startUrl);
      mainWindow.webContents.openDevTools(); // Ouvrir les outils de développement
    });
  } else {
    mainWindow.loadURL(startUrl);
  }

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Émis quand la fenêtre est fermée
  mainWindow.on('closed', () => {
    mainWindow = null;
    // Tuer le processus Next.js si il existe
    if (nextProcess) {
      nextProcess.kill();
    }
  });

  // Gérer les liens externes
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Démarrer le serveur Next.js en mode développement
function startNextServer() {
  if (isDev) {
    nextProcess = spawn('npm', ['run', 'dev'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });

    nextProcess.on('error', (err) => {
      console.error('Erreur lors du démarrage du serveur Next.js:', err);
    });
  }
}

// Cette méthode sera appelée quand Electron aura terminé son initialisation
app.whenReady().then(() => {
  startNextServer();
  createWindow();

  app.on('activate', () => {
    // Sur macOS, recréer une fenêtre quand l'icône du dock est cliquée
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  // Sur macOS, garder l'app et la barre de menu actives
  if (process.platform !== 'darwin') {
    if (nextProcess) {
      nextProcess.kill();
    }
    app.quit();
  }
});

// Sécurité : empêcher la création de nouvelles fenêtres
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationUrl) => {
    navigationEvent.preventDefault();
    require('electron').shell.openExternal(navigationUrl);
  });
});