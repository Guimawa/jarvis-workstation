const { contextBridge, ipcRenderer } = require('electron');

// Interface sécurisée pour le processus de rendu
contextBridge.exposeInMainWorld('electronAPI', {
  // Informations sur l'application
  getVersion: () => ipcRenderer.invoke('app-version'),
  
  // Gestion des boîtes de dialogue
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  
  // Notifications système
  showNotification: (options) => ipcRenderer.invoke('show-notification', options),
  
  // Navigation
  onNavigate: (callback) => {
    ipcRenderer.on('navigate-to', (event, path) => callback(path));
  },
  
  // Informations système
  platform: process.platform,
  isElectron: true,
  
  // Gestion des thèmes
  toggleTheme: () => ipcRenderer.invoke('toggle-theme'),
  getTheme: () => ipcRenderer.invoke('get-theme'),
  onThemeChanged: (callback) => {
    ipcRenderer.on('theme-changed', (event, theme) => callback(theme));
  },
  
  // Utilitaires
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Gestion des fichiers (sécurisée)
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
  
  // Communication avec le processus principal
  send: (channel, data) => {
    // Whitelist des channels autorisés
    const validChannels = [
      'request-update',
      'app-close',
      'minimize-window',
      'maximize-window',
      'toggle-fullscreen'
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // Écoute des événements du processus principal
  on: (channel, callback) => {
    const validChannels = [
      'update-available',
      'update-downloaded',
      'theme-changed',
      'navigate-to'
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  
  // Nettoyage des listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Interface spécifique pour JARVIS
contextBridge.exposeInMainWorld('jarvisAPI', {
  // Informations sur l'environnement
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Configuration JARVIS
  getConfig: () => ipcRenderer.invoke('jarvis-get-config'),
  setConfig: (config) => ipcRenderer.invoke('jarvis-set-config', config),
  
  // Logs système
  log: {
    info: (message) => ipcRenderer.invoke('jarvis-log', 'info', message),
    warn: (message) => ipcRenderer.invoke('jarvis-log', 'warn', message),
    error: (message) => ipcRenderer.invoke('jarvis-log', 'error', message)
  },
  
  // Métriques et monitoring
  sendMetric: (metric, value) => ipcRenderer.invoke('jarvis-send-metric', metric, value),
  
  // Gestion des projets
  createProject: (projectData) => ipcRenderer.invoke('jarvis-create-project', projectData),
  loadProject: (projectPath) => ipcRenderer.invoke('jarvis-load-project', projectPath),
  saveProject: (projectData) => ipcRenderer.invoke('jarvis-save-project', projectData),
  
  // Analyse et génération de code
  analyzeCode: (code, options) => ipcRenderer.invoke('jarvis-analyze-code', code, options),
  generateCode: (prompt, options) => ipcRenderer.invoke('jarvis-generate-code', prompt, options),
  
  // Gestion des templates
  getTemplates: () => ipcRenderer.invoke('jarvis-get-templates'),
  saveTemplate: (template) => ipcRenderer.invoke('jarvis-save-template', template)
});

// Exposition des constantes utiles
contextBridge.exposeInMainWorld('CONSTANTS', {
  JARVIS_VERSION: '2.0.0',
  ELECTRON_VERSION: process.versions.electron,
  NODE_VERSION: process.versions.node,
  CHROME_VERSION: process.versions.chrome,
  PLATFORM: process.platform,
  ARCH: process.arch
});

console.log('🔧 JARVIS Preload - Interface sécurisée initialisée');
console.log('🔧 JARVIS Preload - Interface sécurisée initialisée');
