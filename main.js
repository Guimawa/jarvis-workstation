const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  // Créer la fenêtre du navigateur
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'public', 'favicon.ico'), // Icône de l'application
    title: 'Jarvis Ultra Instinct Dashboard',
    show: false // Ne pas afficher immédiatement
  });

  // Charger l'application
  if (isDev) {
    // En mode développement, charger depuis le serveur de développement Next.js
    win.loadURL('http://localhost:3000');
    // Ouvrir les outils de développement
    win.webContents.openDevTools();
  } else {
    // En mode production, charger depuis les fichiers buildés
    win.loadFile(path.join(__dirname, 'out', 'index.html'));
  }

  // Afficher la fenêtre quand elle est prête
  win.once('ready-to-show', () => {
    win.show();
  });

  // Gérer la fermeture de la fenêtre
  win.on('closed', () => {
    // Déréférencer l'objet fenêtre
    win = null;
  });

  return win;
}

// Cette méthode sera appelée quand Electron aura fini de s'initialiser
// et sera prêt à créer des fenêtres de navigateur
app.whenReady().then(() => {
  createWindow();

  // Sur macOS, il est courant de recréer une fenêtre dans l'app quand
  // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres ouvertes
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  // Sur macOS, il est courant pour les applications et leur barre de menu
  // de rester actives jusqu'à ce que l'utilisateur quitte explicitement avec Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Dans ce fichier, vous pouvez inclure le reste du code spécifique
// du processus principal de votre application. Vous pouvez aussi le mettre dans des
// fichiers séparés et les importer ici.
