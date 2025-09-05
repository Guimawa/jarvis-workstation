// ==============================================
// 📝 LOGGER - Système de Logging Ultra Instinct
// ==============================================
// Version: 2.0.0 Ultra Instinct
// Auteur: Jarvis Expert
// Description: Système de logging avancé avec niveaux, rotation et métadonnées
// ==============================================

import fs from 'fs/promises';
import path from 'path';

/**
 * Système de logging avancé pour Jarvis Ultra Instinct
 */
export default class Logger {
  constructor(module = 'Jarvis', config = {}) {
    this.module = module;
    this.config = {
      level: process.env.LOG_LEVEL || 'info',
      format: 'json',
      outputs: ['console'],
      directory: './logs',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      enableColors: true,
      enableTimestamp: true,
      enableContext: true,
      enableMetadata: true,
      ...config
    };
    
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    
    this.colors = {
      error: '\x1b[31m', // Rouge
      warn: '\x1b[33m',  // Jaune
      info: '\x1b[36m',  // Cyan
      debug: '\x1b[90m', // Gris
      reset: '\x1b[0m'
    };
    
    this.ensureLogDirectory();
  }
  
  /**
   * Assurance de l'existence du répertoire de logs
   */
  async ensureLogDirectory() {
    try {
      await fs.mkdir(this.config.directory, { recursive: true });
    } catch (error) {
      // Le répertoire existe déjà ou erreur de permissions
    }
  }
  
  /**
   * Log principal
   */
  log(level, message, metadata = {}) {
    if (this.levels[level] > this.levels[this.config.level]) {
      return;
    }
    
    const logEntry = this.createLogEntry(level, message, metadata);
    
    // Console output
    if (this.config.outputs.includes('console')) {
      this.logToConsole(logEntry);
    }
    
    // File output
    if (this.config.outputs.includes('file')) {
      this.logToFile(logEntry);
    }
  }
  
  /**
   * Création d'une entrée de log
   */
  createLogEntry(level, message, metadata) {
    const timestamp = new Date().toISOString();
    
    const entry = {
      timestamp,
      level,
      module: this.module,
      message,
      ...metadata
    };
    
    if (this.config.enableContext) {
      entry.context = this.getContext();
    }
    
    if (this.config.enableMetadata) {
      entry.metadata = {
        pid: process.pid,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        ...metadata
      };
    }
    
    return entry;
  }
  
  /**
   * Obtention du contexte d'exécution
   */
  getContext() {
    const stack = new Error().stack;
    const lines = stack.split('\n');
    
    // Trouver la première ligne qui n'est pas dans ce fichier
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.includes('logger.js') && !line.includes('node_modules')) {
        return {
          file: line.split('(')[1]?.split(')')[0] || 'unknown',
          line: line.split(':')[1] || 'unknown'
        };
      }
    }
    
    return { file: 'unknown', line: 'unknown' };
  }
  
  /**
   * Log vers la console
   */
  logToConsole(entry) {
    const color = this.colors[entry.level] || this.colors.reset;
    const reset = this.colors.reset;
    
    let output = '';
    
    if (this.config.enableTimestamp) {
      output += `[${entry.timestamp}] `;
    }
    
    output += `${color}[${entry.level.toUpperCase()}]${reset} `;
    output += `${color}[${entry.module}]${reset} `;
    output += entry.message;
    
    if (Object.keys(entry.metadata || {}).length > 0) {
      output += ` ${JSON.stringify(entry.metadata)}`;
    }
    
    console.log(output);
  }
  
  /**
   * Log vers fichier
   */
  async logToFile(entry) {
    try {
      const logFile = path.join(this.config.directory, `${this.module}.log`);
      const logLine = JSON.stringify(entry) + '\n';
      
      await fs.appendFile(logFile, logLine);
      
      // Rotation des logs si nécessaire
      await this.rotateLogIfNeeded(logFile);
      
    } catch (error) {
      console.error('Erreur écriture log:', error);
    }
  }
  
  /**
   * Rotation des logs
   */
  async rotateLogIfNeeded(logFile) {
    try {
      const stats = await fs.stat(logFile);
      
      if (stats.size > this.config.maxFileSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedFile = `${logFile}.${timestamp}`;
        
        await fs.rename(logFile, rotatedFile);
        
        // Supprimer les anciens fichiers
        await this.cleanupOldLogs();
      }
    } catch (error) {
      // Fichier n'existe pas encore
    }
  }
  
  /**
   * Nettoyage des anciens logs
   */
  async cleanupOldLogs() {
    try {
      const files = await fs.readdir(this.config.directory);
      const logFiles = files
        .filter(file => file.startsWith(`${this.module}.log.`))
        .map(file => ({
          name: file,
          path: path.join(this.config.directory, file),
          time: fs.stat(path.join(this.config.directory, file)).then(stats => stats.mtime)
        }));
      
      // Trier par date de modification
      const sortedFiles = await Promise.all(
        logFiles.map(async file => ({
          ...file,
          time: await file.time
        }))
      );
      
      sortedFiles.sort((a, b) => b.time - a.time);
      
      // Supprimer les fichiers en excès
      if (sortedFiles.length > this.config.maxFiles) {
        const filesToDelete = sortedFiles.slice(this.config.maxFiles);
        
        for (const file of filesToDelete) {
          await fs.unlink(file.path);
        }
      }
    } catch (error) {
      // Erreur de nettoyage, pas critique
    }
  }
  
  /**
   * Méthodes de logging
   */
  error(message, metadata = {}) {
    this.log('error', message, metadata);
  }
  
  warn(message, metadata = {}) {
    this.log('warn', message, metadata);
  }
  
  info(message, metadata = {}) {
    this.log('info', message, metadata);
  }
  
  debug(message, metadata = {}) {
    this.log('debug', message, metadata);
  }
  
  /**
   * Log avec métriques de performance
   */
  performance(operation, duration, metadata = {}) {
    this.info(`Performance: ${operation}`, {
      ...metadata,
      duration: `${duration}ms`,
      type: 'performance'
    });
  }
  
  /**
   * Log d'audit
   */
  audit(action, user, metadata = {}) {
    this.info(`Audit: ${action}`, {
      ...metadata,
      user,
      action,
      type: 'audit'
    });
  }
  
  /**
   * Log de sécurité
   */
  security(event, metadata = {}) {
    this.warn(`Security: ${event}`, {
      ...metadata,
      type: 'security',
      severity: 'high'
    });
  }
}
