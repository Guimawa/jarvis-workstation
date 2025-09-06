// electron-preload.js - Script de preload pour la sécurité et l'API

const { contextBridge, ipcRenderer } = require('electron');

// Expose des API sécurisées au processus de rendu
contextBridge.exposeInMainWorld('electronAPI', {
  // Informations sur l'application
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Dialogues système
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  
  // Communication avec le processus principal
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-project', callback);
    ipcRenderer.on('menu-open-project', callback);
  },
  
  // Nettoyage des listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Vérifier si nous sommes dans Electron
  isElectron: true,
  
  // Platform information
  platform: process.platform,
  
  // Versions
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});

// Ajouter des informations de debugging en mode développement
if (process.env.NODE_ENV === 'development') {
  contextBridge.exposeInMainWorld('electronDebug', {
    log: (message) => console.log('[Electron Preload]:', message),
    error: (error) => console.error('[Electron Preload Error]:', error)
  });
}

console.log('🔧 Electron Preload Script chargé');