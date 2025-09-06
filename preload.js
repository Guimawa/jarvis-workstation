const { contextBridge, ipcRenderer } = require('electron');

// Exposer des APIs sécurisées au processus de rendu
contextBridge.exposeInMainWorld('electronAPI', {
  // Ici vous pouvez ajouter des APIs spécifiques si nécessaire
  // Par exemple pour la communication entre le processus principal et le rendu
  platform: process.platform,
  versions: process.versions
});
