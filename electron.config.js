// electron.config.js - Configuration simplifiée pour le développement Electron

const path = require('path');

module.exports = {
  // Configuration pour le mode développement
  development: {
    main: './electron-main.js',
    preload: './electron-preload.js',
    nextUrl: 'http://localhost:3000'
  },
  
  // Configuration pour la production
  production: {
    main: './electron-main.js',
    preload: './electron-preload.js',
    buildDir: './out'
  },
  
  // Configuration de la fenêtre
  window: {
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800
  }
};